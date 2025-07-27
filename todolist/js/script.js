document.addEventListener('DOMContentLoaded', function () {
    // DOM
    const taskInput = document.getElementById('Task-input');
    const dateInput = document.getElementById('due-date-input');
    const addBtn = document.querySelector('button[onclick="addTask"]');
    const taskList = document.getElementById('task-list');
    const completeBtn = document.querySelector('.complete');
    const filterBtn = document.querySelector('.filter');
    const deleteBtn = document.querySelector('.delete');

    // State
    let tasks = [], showCompletedOnly = false, nextId = 1, validationMsg = null;

    // Show validation message below the form
    function showValidation(msg) {
        if (!validationMsg) {
            validationMsg = document.createElement('div');
            validationMsg.className = 'text-red-600 text-sm mt-2';
            taskInput.parentElement.parentElement.appendChild(validationMsg);
        }
        validationMsg.textContent = msg;
    }

    // Clear validation message
    function clearValidation() {
        if (validationMsg) validationMsg.textContent = '';
    }

    // Render the list of tasks to the page
    function render() {
        taskList.innerHTML = '';
        const visible = showCompletedOnly ? tasks.filter(t => t.completed) : tasks;
        if (!visible.length) return taskList.innerHTML = '<p>Task is Empty!</p>';
        const ul = document.createElement('ul');
        ul.className = 'w-full space-y-2';
        visible.forEach(task => {
            const li = document.createElement('li');
            li.className = `flex items-start justify-between bg-white rounded-lg shadow p-3 ${task.completed ? 'opacity-60 line-through' : ''}`;
            li.innerHTML = `
                <div class="flex-1 break-words">
                    <span class="font-medium break-words whitespace-pre-line">${task.text}</span>
                    <span class="ml-2 text-xs text-gray-500">${task.date ? '(' + task.date + ')' : ''}</span>
                </div>
                <div class="flex gap-2 items-center flex-shrink-0">
                    <button class="complete-task bg-green-500 hover:bg-green-700 text-white px-2 py-1 rounded text-xs">✓</button>
                    <button class="delete-task bg-red-500 hover:bg-red-700 text-white px-2 py-1 rounded text-xs">🗑️</button>
                </div>
            `;
            li.querySelector('.complete-task').onclick = () => toggleComplete(task.id);
            li.querySelector('.delete-task').onclick = () => removeTask(task.id);
            ul.appendChild(li);
        });
        taskList.appendChild(ul);
    }

    // Add a new task to the list
    function addTask() {
        const text = taskInput.value.trim(), date = dateInput.value;
        if (!text || !date) return showValidation('Task and date are required!');
        clearValidation();
        tasks.push({ id: nextId++, text, date, completed: false });
        taskInput.value = '';
        dateInput.value = '';
        render();
    }

    // Toggle the completed status of a single task
    function toggleComplete(id) {
        const t = tasks.find(x => x.id === id);
        if (t) t.completed = !t.completed;
        render();
    }

    // Remove a single task from the list
    function removeTask(id) {
        tasks = tasks.filter(x => x.id !== id);
        render();
    }

    // Mark all tasks as completed
    function completeAll() {
        tasks.forEach(t => t.completed = true);
        render();
    }

    // Toggle between showing all tasks and only completed tasks
    function toggleFilter() {
        showCompletedOnly = !showCompletedOnly;
        filterBtn.textContent = showCompletedOnly ? 'SHOW ALL' : 'FILTER';
        render();
    }

    // Delete all tasks from the list
    function deleteAll() {
        tasks = [];
        render();
    }

    // Set up button actions
    addBtn.onclick = addTask;
    window.addTask = addTask;
    completeBtn.onclick = completeAll;
    filterBtn.onclick = toggleFilter;
    deleteBtn.onclick = deleteAll;
    render();
});
