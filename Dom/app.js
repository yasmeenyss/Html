// let heading = document.getElementById("title");
// console.log(heading);

// let heading = document.getElementById("title");

// heading.innerText = "welcome yasmeen";

// let para = document.getElementById("text");
// para.style.color = "red";

// let data = document.getElementsByClassName("text");
// data[1].innerText = "First line changed";
// // console.log(data);

// let data = document.getElementsByClassName("text");
// data[1].innerText = "First line changed";
// for( let i = 0; i < data.length; i++){
//    data[i].style .color = "blue";
// }

// let data = document.querySelector("#title");
// data.innerText = "welcome";

// let data = document.querySelector(".text");
// data.style.color = "red";

// let data = document.querySelector("h1");
// data.style.color = "blue";

// let input = document.getElementById("inputBox");
// let btn = document.getElementById("addBtn");
// let container = document.getElementById("container");

// function addTask() {
//     let task = input.value;

//     if (task === "") {
//         alert("Please enter a task");
//         return;
//     }

//     // create task element
//     let taskDiv = document.createElement("div");

//     let taskText = document.createElement("span");
//     taskText.innerText = task;

//     // complete button
//     let doneBtn = document.createElement("button");
//     doneBtn.innerText = "Done";

//     // delete button
//     let delBtn = document.createElement("button");
//     delBtn.innerText = "Delete";

//     // Done functionality
//     doneBtn.addEventListener("click", function () {
//         taskText.style.textDecoration = "line-through";
//     });

//     // Delete functionality
//     delBtn.addEventListener("click", function () {
//         taskDiv.remove();
//     });

//     taskDiv.appendChild(taskText);
//     taskDiv.appendChild(doneBtn);
//     taskDiv.appendChild(delBtn);

//     container.appendChild(taskDiv);

//     input.value = "";
// }

// // button click
// btn.addEventListener("click", addTask);

// // enter key support
// input.addEventListener("keypress", function (e) {
//     if (e.key === "Enter") {
//         addTask();
//     }
// });


// let input = document.getElementById("inputBox");
// let btn = document.getElementById("addBtn");
// let container = document.getElementById("container");

// let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// // load saved tasks on refresh 

// function loadTasks() {
//     container.innerHTML = "";

//     tasks.forEach(function(tasks, index) {

//         let taskDiv = document.createElement("div");
//         let taskText = document.createElement("span");
//         taskText.innerText = task;

//         let delBtn = document.createElement("button");
//         delBtn.innerText = "delete";

//         delBtn.addEventListener("click", function () {
//             task.splice(index, 1);
//             localStorage.setItem("tasks", JSON.stringify(tasks));
//             loadTasks();
//         });

//         taskDiv.appendChild(taskText);
//         taskDiv.appendChild(delBtn);

//         container.appendChild(taskDiv);
//     });

// }

// // Add new task 
// function addTask() {
//     let task = input.ariaValueMax;

//     if (task.trim() === "") {
//         alert("please enter a task");
//         return;
//     }

//     task.push(task);
//     localStorage.setItem("tasks", JSON.stringify(tasks));

//     input.value = "";
//     loadTasks();
// }

// // Events

// btn.addEventListener("click", addTask);

// input.addEventListener("keydown", function (e) {
//     if (e .key === "Enter") {
//         addTask();
//     }

// });

// //Initial load 
//  loadTasks();

// let input = document.getElementById("inputBox");
// let btn = document.getElementById("addBtn");
// let container = document.getElementById("container");

// let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// // Load saved tasks on refresh
// function loadTasks() {
//     container.innerHTML = "";

//     tasks.forEach(function(task, index) {

//         let taskDiv = document.createElement("div");

//         let taskText = document.createElement("span");
//         taskText.innerText = task;

//         let delBtn = document.createElement("button");
//         delBtn.innerText = "Delete";

//         delBtn.addEventListener("click", function () {
//             tasks.splice(index, 1);
//             localStorage.setItem("tasks", JSON.stringify(tasks));
//             loadTasks();
//         });

//         taskDiv.appendChild(taskText);
//         taskDiv.appendChild(delBtn);

//         container.appendChild(taskDiv);
//     });
// }

// // Add new task
// function addTask() {
//     let task = input.value;

//     if (task.trim() === "") {
//         alert("Please enter a task");
//         return;
//     }

//     tasks.push(task);
//     localStorage.setItem("tasks", JSON.stringify(tasks));

//     input.value = "";
//     loadTasks();
// }

// // Events
// btn.addEventListener("click", addTask);

// input.addEventListener("keydown", function (e) {
//     if (e.key === "Enter") {
//         addTask();
//     }
// });

// // Initial load
// loadTasks();

// upgrade todo app

let input = document.getElementById("inputBox");
let btn = document.getElementById("addBtn");
let container = document.getElementById("container");

// अब task object me save karenge
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// Load tasks
function loadTasks() {
    container.innerHTML = "";

    tasks.forEach(function(taskObj, index) {

        let taskDiv = document.createElement("div");

        let taskText = document.createElement("span");
        taskText.innerText = taskObj.text;

        // अगर completed hai
        if (taskObj.completed) {
            taskText.style.textDecoration = "line-through";
        }

        // ✅ Done button
        let doneBtn = document.createElement("button");
        doneBtn.innerText = "Done";

        doneBtn.addEventListener("click", function () {
            tasks[index].completed = !tasks[index].completed;
            localStorage.setItem("tasks", JSON.stringify(tasks));
            loadTasks();
        });

        // ✏️ Edit button
        let editBtn = document.createElement("button");
        editBtn.innerText = "Edit";

        editBtn.addEventListener("click", function () {
            let newText = prompt("Edit task:", taskObj.text);
            if (newText !== null && newText.trim() !== "") {
                tasks[index].text = newText;
                localStorage.setItem("tasks", JSON.stringify(tasks));
                loadTasks();
            }
        });

        // 🗑 Delete button
        let delBtn = document.createElement("button");
        delBtn.innerText = "Delete";

        delBtn.addEventListener("click", function () {
            tasks.splice(index, 1);
            localStorage.setItem("tasks", JSON.stringify(tasks));
            loadTasks();
        });

        taskDiv.appendChild(taskText);
        taskDiv.appendChild(doneBtn);
        taskDiv.appendChild(editBtn);
        taskDiv.appendChild(delBtn);

        container.appendChild(taskDiv);
    });
}

// Add task
function addTask() {
    let task = input.value;

    if (task.trim() === "") {
        alert("Enter task");
        return;
    }

    tasks.push({
        text: task,
        completed: false
    });

    localStorage.setItem("tasks", JSON.stringify(tasks));

    input.value = "";
    loadTasks();
}

// Events
btn.addEventListener("click", addTask);

input.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
        addTask();
    }
});

loadTasks();


