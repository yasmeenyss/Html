//selcting elemetns
let headingele = document.getElementById("headingele");
const username = document.getElementsByClassName("username");
let btn = document.getElementById("btn");

let box = document.getElementById("box");
let demo = document.getElementById("demo").textContent;

let classss = document.querySelector("#headingele");
let tagg = document.querySelector("button");

console.log(headingele);
console.log(username);
console.log(btn);
console.log(classss);
console.log(tagg);
console.log(demo);

//Changing Content
headingele.innerText = "<button>submi</button> welcome";
box.innerHTML = "<button>button created</button> <h1>Login successful</h1> ";


//practice
document.getElementById("title").innerText = "yas";
document.getElementById("msg").innerText = "login successful";
document.getElementById("data").innerHTML = `
   <h2>User Details</h2>
   <p>Name: Mehatab</p>
   <p>Course: JavaScript</p>
`;
document.getElementById("list").innerHTML = "<li>Learn JS</li>";
document.getElementById("list").innerHTML += "<li>Learn DOM</li>";
document.getElementById("card").innerHTML = `
   <div>
      <h2>JavaScript Course</h2>
      <p>Price: 499</p>
      <button>Buy Now</button>
   </div>
`;
// button click pe text change 