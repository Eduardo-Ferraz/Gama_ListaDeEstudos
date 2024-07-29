document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('task-input');
    const addTaskBtn = document.getElementById('add-task-btn');
    const taskList = document.getElementById('task-list');
    const showCompletedCheckbox = document.getElementById('show-completed');

    // Carregar tarefas e estado do checkbox do localStorage
    loadTasks();
    loadCheckboxState();

    addTaskBtn.addEventListener('click', addTask);
    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTask();
        }
    });

    showCompletedCheckbox.addEventListener('change', () => {
        saveCheckboxState();
        filterTasks();
    });

    function loadTasks() {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.forEach(task => {
            addTaskToDOM(task.id, task.name, task.completed);
        });
    }

    function saveTasks() {
        const tasks = [];
        taskList.querySelectorAll('.task-item').forEach(taskItem => {
            tasks.push({
                id: taskItem.dataset.id,
                name: taskItem.querySelector('.task-name').textContent,
                completed: taskItem.classList.contains('completed')
            });
        });
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function loadCheckboxState() {
        const showCompleted = JSON.parse(localStorage.getItem('showCompleted')) || false;
        showCompletedCheckbox.checked = showCompleted;
        filterTasks();
    }

    function saveCheckboxState() {
        localStorage.setItem('showCompleted', JSON.stringify(showCompletedCheckbox.checked));
    }

    function addTask() {
        const taskText = taskInput.value.trim();
        if (taskText === '') return;

        const taskId = Date.now().toString(); // Gerar um ID único para cada tarefa
        addTaskToDOM(taskId, taskText, false);

        saveTasks();
        taskInput.value = '';
        taskInput.focus();
    }

    function addTaskToDOM(id, name, completed) {
        const taskItem = document.createElement('li');
        taskItem.classList.add('task-item');
        taskItem.dataset.id = id;

        const taskName = document.createElement('span');
        taskName.classList.add('task-name');
        taskName.textContent = name;

        if (completed) {
            taskItem.classList.add('completed');
        }

        const moveUpBtn = document.createElement('button');
        moveUpBtn.classList.add('move-button');
        moveUpBtn.textContent = '↑';
        moveUpBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            moveTask(taskItem, -1);
        });

        const moveDownBtn = document.createElement('button');
        moveDownBtn.classList.add('move-button');
        moveDownBtn.textContent = '↓';
        moveDownBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            moveTask(taskItem, 1);
        });

        const removeBtn = document.createElement('button');
        removeBtn.classList.add('remove-button');
        removeBtn.textContent = 'Remover';
        removeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            taskList.removeChild(taskItem);
            saveTasks();
        });

        taskItem.appendChild(taskName);
        taskItem.appendChild(moveUpBtn);
        taskItem.appendChild(moveDownBtn);
        taskItem.appendChild(removeBtn);
        taskItem.addEventListener('click', () => {
            taskItem.classList.toggle('completed');
            saveTasks();
            filterTasks();
        });

        taskList.appendChild(taskItem);
        filterTasks();
    }

    function moveTask(taskItem, direction) {
        const currentPos = [...taskList.children].indexOf(taskItem);
        const newPos = currentPos + direction;

        if (newPos < 0 || newPos >= taskList.children.length) {
            return;
        }

        if (direction === -1) {
            taskList.insertBefore(taskItem, taskList.children[newPos]);
        } else {
            taskList.insertBefore(taskList.children[newPos], taskItem);
        }

        saveTasks();
    }

    function filterTasks() {
        const showCompleted = showCompletedCheckbox.checked;
        taskList.querySelectorAll('.task-item').forEach(taskItem => {
            const isCompleted = taskItem.classList.contains('completed');
            if (isCompleted && !showCompleted) {
                taskItem.style.display = 'none';
            } else {
                taskItem.style.display = 'flex';
            }
        });
    }
});
