class TaskManager {
    constructor() {
        this.history = JSON.parse(localStorage.getItem('history')) || [];
        this.loadEventListeners();
        this.applySavedTheme();
    }

    loadEventListeners() {
        document.getElementById('add-task-btn').addEventListener('click', () => this.addTask());
        document.getElementById('filter-category').addEventListener('change', () => this.displayHistory());
        document.getElementById('search-history').addEventListener('input', () => this.displayHistory());
        document.getElementById('theme-toggle').addEventListener('click', () => this.toggleTheme());
    }

    addTask() {
        const title = document.getElementById('task-title').value.trim();
        const description = document.getElementById('task-desc').value.trim();
        const priority = document.getElementById('task-priority').value;
        const category = document.getElementById('task-category').value;
        const date = document.getElementById('task-date').value;

        if (!title || !description || !date) {
            document.getElementById('validation-message').textContent = "All fields are required.";
            return;
        }
        document.getElementById('validation-message').textContent = "";

        const id = Date.now();
        const task = { id, title, description, priority, category, date, completed: false };
        this.history.push(task);
        this.saveData();
        this.displayHistory();

        if (priority === 'High') {
            this.showNotification("High priority task added: " + title);
        }
    }

    modifyTask(id) {
        const task = this.history.find(task => task.id === id);
        if (task) {
            task.title = prompt("Modify title:", task.title) || task.title;
            task.description = prompt("Modify description:", task.description) || task.description;
            this.saveData();
            this.displayHistory();
        }
    }

    deleteTask(id) {
        this.history = this.history.filter(task => task.id !== id);
        this.saveData();
        this.displayHistory();
    }

    toggleComplete(id) {
        const task = this.history.find(task => task.id === id);
        if (task) {
            task.completed = !task.completed;
            this.saveData();
            this.displayHistory();
        }
    }

    saveData() {
        localStorage.setItem('history', JSON.stringify(this.history));
    }

    displayHistory() {
        const list = document.getElementById('history-list');
        const filterCategory = document.getElementById('filter-category').value;
        const searchQuery = document.getElementById('search-history').value.toLowerCase();

        list.innerHTML = "";
        this.history
            .filter(task => (filterCategory === "All" || task.category === filterCategory))
            .filter(task => task.title.toLowerCase().includes(searchQuery) || task.description.toLowerCase().includes(searchQuery))
            .forEach(task => {
                const li = document.createElement('li');
                li.innerHTML = `
                    <span class="${task.completed ? 'completed' : ''}">${task.title} - ${task.category} (${task.priority}) - ${task.date}</span>
                    <button class="complete-btn" onclick="taskManager.toggleComplete(${task.id})">${task.completed ? 'Undo' : 'Complete'}</button>
                    <button class="modify-btn" onclick="taskManager.modifyTask(${task.id})">Modify</button>
                    <button class="delete-btn" onclick="taskManager.deleteTask(${task.id})">Delete</button>
                `;
                list.appendChild(li);
            });
    }

    showNotification(message) {
        const notification = document.getElementById('notification');
        notification.textContent = message;
        notification.style.display = 'block';
        setTimeout(() => {
            notification.style.display = 'none';
        }, 3000);
    }

    toggleTheme() {
        document.body.classList.toggle('dark-mode');
        const isDarkMode = document.body.classList.contains('dark-mode');
        document.getElementById('theme-text').textContent = isDarkMode ? "Light Mode" : "Dark Mode";
        document.getElementById('theme-icon').textContent = isDarkMode ? "☀️" : "🌙";
        localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    }

    applySavedTheme() {
        if (localStorage.getItem('theme') === 'dark') {
            document.body.classList.add('dark-mode');
            document.getElementById('theme-text').textContent = "Light Mode";
            document.getElementById('theme-icon').textContent = "☀️";
        } else {
            document.getElementById('theme-text').textContent = "Dark Mode";
            document.getElementById('theme-icon').textContent = "🌙";
        }
    }
}

const taskManager = new TaskManager();
taskManager.displayHistory();
