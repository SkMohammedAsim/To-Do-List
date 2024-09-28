document.addEventListener('DOMContentLoaded', () => {
    const registerBtn = document.getElementById('register-btn');
    const loginBtn = document.getElementById('login-btn');
    const addTaskBtn = document.getElementById('add-task-btn');
    const logoutBtn = document.getElementById('logout-btn');
    const taskSection = document.getElementById('task-section');
    const mainMenu = document.getElementById('main-menu');
    const taskList = document.getElementById('task-list');
    const completedTaskList = document.getElementById('completed-task-list');

    let users = JSON.parse(localStorage.getItem('users')) || [];
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    registerBtn.addEventListener('click', registerUser);
    loginBtn.addEventListener('click', loginUser);
    addTaskBtn.addEventListener('click', addTask);
    logoutBtn.addEventListener('click', logoutUser);

    function registerUser() {
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        if (username && password) {
            if (users.find(user => user.username === username)) {
                alert('Username already exists.');
            } else {
                users.push({ username, password });
                localStorage.setItem('users', JSON.stringify(users));
                alert('Account created successfully!');
            }
        } else {
            alert('Please fill in all fields.');
        }
    }

    function loginUser() {
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const user = users.find(user => user.username === username && user.password === password);
        if (user) {
            mainMenu.classList.add('hidden');
            taskSection.classList.remove('hidden');
            renderTasks();
            startNotificationCheck();
        } else {
            alert('Invalid username or password.');
        }
    }

    function addTask() {
        const task = document.getElementById('new-task').value;
        const category = document.getElementById('category').value;
        const dueDate = document.getElementById('due-date').value;
        if (task && category && dueDate) {
            tasks.push({ task, category, dueDate, completed: false });
            localStorage.setItem('tasks', JSON.stringify(tasks));
            renderTasks();
        } else {
            alert('Please fill in all fields.');
        }
    }

    function logoutUser() {
        mainMenu.classList.remove('hidden');
        taskSection.classList.add('hidden');
    }

    function renderTasks() {
        taskList.innerHTML = '';
        completedTaskList.innerHTML = '';
        tasks.forEach((task, index) => {
            const taskItem = document.createElement('li');
            taskItem.classList.add(task.category.toLowerCase());
            taskItem.innerHTML = `<span class="task-icon">📝</span> ${task.task} - ${task.category} - ${task.dueDate}`;
            if (task.completed) {
                completedTaskList.appendChild(taskItem);
            } else {
                const completeBtn = document.createElement('button');
                completeBtn.textContent = 'Complete';
                completeBtn.addEventListener('click', () => {
                    tasks[index].completed = true;
                    localStorage.setItem('tasks', JSON.stringify(tasks));
                    renderTasks();
                });
                taskItem.appendChild(completeBtn);
                taskList.appendChild(taskItem);
                animateTask(taskItem);
            }
        });
    }

    function animateTask(taskItem) {
        taskItem.style.transform = 'translateX(-100%)';
        setTimeout(() => {
            taskItem.style.transition = 'transform 0.5s ease';
            taskItem.style.transform = 'translateX(0)';
        }, 0);
    }

    function startNotificationCheck() {
        setInterval(checkDueDates, 60000); // Check every minute
    }

    function checkDueDates() {
        const now = new Date();
        tasks.forEach(task => {
            const dueDate = new Date(task.dueDate);
            const timeDiff = dueDate - now;
            const oneDay = 24 * 60 * 60 * 1000;
            if (timeDiff <= oneDay && !task.completed) {
                alert(`Task "${task.task}" is due soon!`);
            }
        });
    }
});
