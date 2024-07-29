// Configure a URL e a chave pública do seu projeto Supabase
const SUPABASE_URL = 'https://oswsnqvlvarjvjencjaq.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9zd3NucXZsdmFyanZqZW5jamFxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjIxODIxMTMsImV4cCI6MjAzNzc1ODExM30.-eL24UL848MsZ8qNbh4yEzvgfIPhwJ0ZB0IjNGFqBos';

// Inicialize o cliente Supabase
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('task-input');
    const addTaskBtn = document.getElementById('add-task-btn');
    const taskList = document.getElementById('task-list');

    // Carregar tarefas do Supabase
    loadTasks();

    addTaskBtn.addEventListener('click', addTask);
    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTask();
        }
    });

    async function loadTasks() {
        const { data, error } = await supabase
            .from('tasks')
            .select('*');
        if (error) {
            console.error('Erro ao carregar tarefas:', error);
            return;
        }
        taskList.innerHTML = '';
        data.forEach(task => {
            addTaskToDOM(task.id, task.nome, task.concluida);
        });
    }

    async function addTask() {
        const taskText = taskInput.value.trim();
        if (taskText === '') return;

        const { data, error } = await supabase
            .from('tasks')
            .insert([{ nome: taskText, concluida: false }])
            .single();
        if (error) {
            console.error('Erro ao adicionar tarefa:', error);
            return;
        }

        addTaskToDOM(data.id, data.nome, data.concluida);
        taskInput.value = '';
        taskInput.focus();
    }

    function addTaskToDOM(id, nome, concluida) {
        const taskItem = document.createElement('li');
        taskItem.textContent = nome;
        taskItem.dataset.id = id;

        if (concluida) {
            taskItem.classList.add('completed');
        }

        const removeBtn = document.createElement('button');
        removeBtn.textContent = 'Remover';
        removeBtn.addEventListener('click', async () => {
            const { error } = await supabase
                .from('tasks')
                .delete()
                .eq('id', id);
            if (error) {
                console.error('Erro ao remover tarefa:', error);
                return;
            }
            taskList.removeChild(taskItem);
        });

        taskItem.appendChild(removeBtn);
        taskItem.addEventListener('click', async () => {
            const newStatus = !taskItem.classList.contains('completed');
            const { error } = await supabase
                .from('tasks')
                .update({ concluida: newStatus })
                .eq('id', id);
            if (error) {
                console.error('Erro ao atualizar tarefa:', error);
                return;
            }
            taskItem.classList.toggle('completed');
        });

        taskList.appendChild(taskItem);
    }
});
