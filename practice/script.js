// let btn = document.getElementById("btn");

// btn.addEventListener("click", () => {
//   console.log("Button clicked");
// });


// submit 

let form = document.getElementById("my form");
let name = document.getElementById("name");

form.addEventListener("submit" , (f) => {
    f.preventDefault();
    console.log("Name:", name.value);
});

mouseover

  let box = document.getElementById("box");

  box.addEventListener("mouseover", function () {
    box.style.background = "red";
  });

input 

let input = document.getElementById("name");

input.addEventListener("input" , () => {
  console.log(input.value);
});

key down

let input = document.getElementById("inputbox");

  input.addEventListener("keydown", (e) => {
    console.log( e.key);
  });

let form = document.getElementById("my form");
let input = document.getElementById("name");
let btn = document.getElementById("btn");
let output = document.getElementById("output");

// input event (real time typing )

input.addEventListener("input", () => {
  output.textContent = "typing:" + input.Value;

});


// keydown (enter press detect)

input.addEventListener("input", (e) => {
  if (e.key === "Enter") {
    console.log("enter pressed");
  }

});

// mouseover (button hver)
btn.addEventListener("mouseover", () => {
  btn.style.background = "blue";
});

btn.addEventListener("mouseout", () => {
  btn.style.background = "red";
});

// submit event 

form.addEventListener("submit", (e) => {
 e.preventDefault();
 output.textContent = "submitted:" + input.value;
});

call back function

function greet(name, callback) {
  document.getElementById("output").innerText = "Hello" + name;
  callback();
}

function done() {
  console.log("callback executed");

}

function start() {
  greet("yasss", done);
}

call back simple 

function greet(name, callback) {
  console.log("hello" + name);
 callback();
}

function bye() {
  console.log("bye");
}
greet("yass",  bye);

  let promise = new Promise((resolve, reject) => {
  let success = false;

  if (success) {
    resolve("Data has found");
  } else {
    reject("error has occured");
  }
});

promise
  .then((res) => console.log(res))
  .catch((err) => console.log(err));

promise chaining 

let promise = new Promise((resolve, reject) => {
  resolve(60);
});

promise
.then((res) => {
  console.log(res); // 10 
  return res +5;
})
.then((res) => {
  console.log(res); //15
  return res *2
})
.then((res) => {
  console.log(res); //30
})
.catch((err) => {
  console.log(err);
});

Async 


async function getusers() {
  try {
    console.log("fetching data.....");

    let res = await fetch("https://jsonplaceholder.typicode.com/users");
    let data = await res.json();

    console.log("Data has found:");
    console.log(data);

    console.log("First users:");
    console.log(data[0].name);

  } catch (error) {
    console.log("error aaya:", error);
  }
}

 getusers();


async function getUsers() {
  try {
    console.log("1. Start");

    let res = await fetch("https://jsonplaceholder.typicode.com/users");
    console.log("2. Response received", res);

    let data = await res.json();
    console.log("3. Data:", data);

    console.log("4. First user:", data[0].name);

  } catch (error) {
    console.log("Error:", error);
  }
}

getUsers();