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
        taskList.querySelectorAll('li').forEach(taskItem => {
            tasks.push({
                id: taskItem.dataset.id,
                name: taskItem.textContent.replace('Remover', '').trim(),
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
        taskItem.textContent = name;
        taskItem.dataset.id = id;

        if (completed) {
            taskItem.classList.add('completed');
        }

        const removeBtn = document.createElement('button');
        removeBtn.textContent = 'Remover';
        removeBtn.addEventListener('click', () => {
            taskList.removeChild(taskItem);
            saveTasks();
        });

        taskItem.appendChild(removeBtn);
        taskItem.addEventListener('click', () => {
            taskItem.classList.toggle('completed');
            saveTasks();
            filterTasks();
        });

        taskList.appendChild(taskItem);
        filterTasks();
    }

    function filterTasks() {
        const showCompleted = showCompletedCheckbox.checked;
        taskList.querySelectorAll('li').forEach(taskItem => {
            const isCompleted = taskItem.classList.contains('completed');
            if (isCompleted && !showCompleted) {
                taskItem.style.display = 'none';
            } else {
                taskItem.style.display = 'flex';
            }
        });
    }
});
