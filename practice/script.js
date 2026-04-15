let btn = document.getElementById("btn");

btn.addEventListener("click", () => {
  console.log("Button clicked");
});


// submit 

let form = document.getElementById("my form");
let name = document.getElementById("name");

form.addEventListener("submit" , (f) => {
    f.preventDefault();
    console.log("Name:", name.value);
});