document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('task-input');
    const addTaskBtn = document.getElementById('add-task-btn');
    const taskList = document.getElementById('task-list');

    addTaskBtn.addEventListener('click', addTask);
    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTask();
        }
    });

    async function addTask() {
        try {
            const taskText = taskInput.value.trim();
            if (taskText === '') return;
    
            const { data, error } = await supabase
                .from('tasks')
                .insert([
                    { nome: taskText, concluida: false },
                ])
                .select()
    
            console.log(data)    
            console.log(error)
    
            const taskItem = document.createElement('li');
            taskItem.textContent = taskText;
    
            const removeBtn = document.createElement('button');
            removeBtn.textContent = 'Remover';
            removeBtn.addEventListener('click', () => {
                taskList.removeChild(taskItem);
            });
    
            taskItem.appendChild(removeBtn);
            taskItem.addEventListener('click', () => {
                taskItem.classList.toggle('completed');
            });
    
            taskList.appendChild(taskItem);
            taskInput.value = '';
            taskInput.focus();
        } catch (err) {
            console.log(err)
        }
    }
});
