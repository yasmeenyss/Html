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

let input = document.getElementById("inputBox");
let btn = document.getElementById("addBtn");
let container = document.getElementById("container");

function addTask() {
    let task = input.value;

    if (task === "") {
        alert("Please enter a task");
        return;
    }

    // create task element
    let taskDiv = document.createElement("div");

    let taskText = document.createElement("span");
    taskText.innerText = task;

    // complete button
    let doneBtn = document.createElement("button");
    doneBtn.innerText = "Done";

    // delete button
    let delBtn = document.createElement("button");
    delBtn.innerText = "Delete";

    // Done functionality
    doneBtn.addEventListener("click", function () {
        taskText.style.textDecoration = "line-through";
    });

    // Delete functionality
    delBtn.addEventListener("click", function () {
        taskDiv.remove();
    });

    taskDiv.appendChild(taskText);
    taskDiv.appendChild(doneBtn);
    taskDiv.appendChild(delBtn);

    container.appendChild(taskDiv);

    input.value = "";
}

// button click
btn.addEventListener("click", addTask);

// enter key support
input.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
        addTask();
    }
});