let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

const taskList = document.getElementById("taskList");

function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function showToast(msg) {
    const toast = document.getElementById("toast");
    toast.innerText = msg;
    toast.style.opacity = 1;

    setTimeout(() => {
        toast.style.opacity = 0;
    }, 2500);
}

function updateStats() {

    let completed = tasks.filter(t => t.completed).length;

    document.getElementById("totalTasks").innerText = tasks.length;

    document.getElementById("completedTasks").innerText = completed;

    document.getElementById("pendingTasks").innerText =
        tasks.length - completed;

    let percent =
        tasks.length
            ? Math.round((completed / tasks.length) * 100)
            : 0;

    document.getElementById("productivityScore").innerText =
        percent + "%";

    document.getElementById("progress").style.width =
        percent + "%";

    updateChart();
}

function renderTasks() {

    taskList.innerHTML = "";

    let filter =
        document.getElementById("filterTask").value;

    let search =
        document.getElementById("searchTask")
            .value
            .toLowerCase();

    tasks.forEach((task, index) => {

        if (
            search &&
            !task.text.toLowerCase().includes(search)
        )
            return;

        if (
            filter === "completed" &&
            !task.completed
        )
            return;

        if (
            filter === "pending" &&
            task.completed
        )
            return;

        const li =
            document.createElement("li");

        li.className =
            `task ${task.completed ? "completed" : ""}`;

        li.innerHTML = `
        <div>
            <h3>${task.text}</h3>
            <p>
                Priority: ${task.priority}
                <br>
                Due: ${task.date || "Not Set"}
            </p>
        </div>

        <div>
            <button onclick="toggleTask(${index})">
                <i class="fa-solid fa-check"></i>
            </button>

            <button onclick="editTask(${index})">
                <i class="fa-solid fa-pen"></i>
            </button>

            <button onclick="deleteTask(${index})">
                <i class="fa-solid fa-trash"></i>
            </button>
        </div>
        `;

        taskList.appendChild(li);

    });

    saveTasks();
    updateStats();
}

function addTask() {

    const text =
        document
            .getElementById("taskInput")
            .value
            .trim();

    if (!text) {
        showToast("Enter a task");
        return;
    }

    tasks.push({
        text: text,
        priority:
            document.getElementById("priority").value,
        date:
            document.getElementById("dueDate").value,
        completed: false
    });

    document.getElementById("taskInput").value = "";

    renderTasks();

    showToast("Task Added");
}

function deleteTask(i) {

    tasks.splice(i, 1);

    renderTasks();

    showToast("Task Deleted");
}

function toggleTask(i) {

    tasks[i].completed =
        !tasks[i].completed;

    renderTasks();

    showToast("Task Updated");
}

function editTask(i) {

    let text =
        prompt(
            "Edit Task",
            tasks[i].text
        );

    if (text) {

        tasks[i].text = text;

        renderTasks();

        showToast("Task Edited");
    }
}

document
    .getElementById("addTask")
    .addEventListener(
        "click",
        addTask
    );

document
    .getElementById("searchTask")
    .addEventListener(
        "input",
        renderTasks
    );

document
    .getElementById("filterTask")
    .addEventListener(
        "change",
        renderTasks
    );

document.addEventListener(
    "keydown",
    e => {

        if (e.key === "Enter") {
            addTask();
        }

        if (
            e.ctrlKey &&
            e.key === "d"
        ) {
            e.preventDefault();
            toggleTheme();
        }

    }
);

function toggleTheme() {

    document.body.classList.toggle("light");

    localStorage.setItem(
        "theme",
        document.body.classList.contains("light")
            ? "light"
            : "dark"
    );
}

document
    .getElementById("themeBtn")
    .addEventListener(
        "click",
        toggleTheme
    );

if (
    localStorage.getItem("theme")
    === "light"
) {
    document.body.classList.add("light");
}

let currentDate = new Date();

function renderCalendar() {

    const monthYear =
        document.getElementById("monthYear");

    const grid =
        document.getElementById("calendarGrid");

    if (!grid) return;

    grid.innerHTML = "";

    const month =
        currentDate.getMonth();

    const year =
        currentDate.getFullYear();

    monthYear.innerText =
        currentDate.toLocaleString(
            "default",
            {
                month: "long",
                year: "numeric"
            }
        );

    const days =
        new Date(
            year,
            month + 1,
            0
        ).getDate();

    for (let i = 1; i <= days; i++) {

        let div =
            document.createElement("div");

        div.innerText = i;

        grid.appendChild(div);
    }
}

document
    .getElementById("prevMonth")
    ?.addEventListener(
        "click",
        () => {
            currentDate.setMonth(
                currentDate.getMonth() - 1
            );
            renderCalendar();
        }
    );

document
    .getElementById("nextMonth")
    ?.addEventListener(
        "click",
        () => {
            currentDate.setMonth(
                currentDate.getMonth() + 1
            );
            renderCalendar();
        }
    );

renderCalendar();

let timer;
let totalSeconds = 1500;

let sessions =
    Number(
        localStorage.getItem("sessions")
    ) || 0;

document.getElementById("sessionCount").innerText =
    sessions;

function updateTimer() {

    let mins =
        Math.floor(totalSeconds / 60);

    let secs =
        totalSeconds % 60;

    document.getElementById("timerDisplay").innerText =
        `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

function startTimer() {
    if (timer) return;

    timer = setInterval(() => {

        if (totalSeconds > 0) {

            totalSeconds--;

            updateTimer();

        } else {

            clearInterval(timer);
            timer = null;

            sessions++;

            localStorage.setItem(
                "sessions",
                sessions
            );

            document.getElementById(
                "sessionCount"
            ).innerText = sessions;

            showToast(
                "Pomodoro Session Complete"
            );
        }

    }, 1000);
}

function pauseTimer() {
    clearInterval(timer);
    timer = null;
}

function resetTimer() {
    clearInterval(timer);
    timer = null;
    totalSeconds = 1500;
    updateTimer();
}

document.getElementById("startTimer")
    ?.addEventListener(
        "click",
        startTimer
    );

document.getElementById("pauseTimer")
    ?.addEventListener(
        "click",
        pauseTimer
    );

document.getElementById("resetTimer")
    ?.addEventListener(
        "click",
        resetTimer
    );

updateTimer();