// let btn = document.getElementById("btn");

// btn.addEventListener("click", () => {
//   console.log("Button clicked");
// });


// // submit 

// let form = document.getElementById("my form");
// let name = document.getElementById("name");

// form.addEventListener("submit" , (f) => {
//     f.preventDefault();
//     console.log("Name:", name.value);
// });

// mouseover

  // let box = document.getElementById("box");

  // box.addEventListener("mouseover", function () {
  //   box.style.background = "red";
  // });

// input 

// let input = document.getElementById("name");

// input.addEventListener("input" , () => {
//   console.log(input.value);
// });

// key down

// let input = document.getElementById("inputbox");

//   input.addEventListener("keydown", (e) => {
//     console.log( e.key);
//   });

let form = document.getElementById("my form");
let input = document.getElementById("name");
let btn = document.getElementById("btn");
let output = document.getElementById("output");

// input event (real time typing )

input.addEventListener("input", () => {
  output.textContent = "typing:" + input.ariaValueMax;

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