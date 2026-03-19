
 DOM is document  object model

let element = document.getElementById("title");
console.log(element);

changing the text 

let element = document.getElementById("title");

element.innerText = "Hello yasmeen";

ELEMENTS BY CLASS NAME 

let elements = document.getElementsByClassName("title");

console.log(elements);

let elements = document.getElementsByClassName("title");
elements[1].innerText = "yasmeen";

loop use karna 

let elements = document.getElementsByClassName("title");

for(let i = 0; i < elements.length; i ++) {
    elements[i].innerText = "Hello jass";
}
