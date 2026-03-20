
//  DOM is document  object model

let elementt = document.getElementById("title");
console.log(elementt);

// changing the text 

let element = document.getElementById("title");

element.innerText = "Hello yasmeen";

// ELEMENTS BY CLASS NAME 

let elements = document.getElementsByClassName("title");

console.log(elements);

let elements = document.getElementsByClassName("title");
elements[1].innerText = "yasmeen";

loop use karna 

let elements = document.getElementsByClassName("title");

for(let i = 0; i < elements.length; i ++) {
    elements[i].innerText = "Hello jass";
}


queryselector 
getElementById("id")	sirf ID ke liye
querySelector()	ID + Class + Tag sab ke liye

document.querySelector("selector")

ID = #box → mujhe box do

Class = .text → mujhe text wala element do

h1 → mujhe h1 do

example(ID)

let x = document.querySelector("#title");
console.log(x);

// Example 2 (class)

let y = document.querySelector(".text");
console.log(y);

// EXAMPLE 3 (TAG)

let v = document.querySelector("h1");
console.log(v);