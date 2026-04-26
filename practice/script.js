// let btn = document.getElementById("btn");

// btn.addEventListener("click", () => {
//   console.log("Button clicked");
// });


// submit 

// let form = document.getElementById("my form");
// let name = document.getElementById("name");

// form.addEventListener("submit" , (f) => {
//     f.preventDefault();
//     console.log("Name:", name.value);
// });

// mouseover

//   let box = document.getElementById("box");

//   box.addEventListener("mouseover", function () {
//     box.style.background = "red";
//   });

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

// let form = document.getElementById("my form");
// let input = document.getElementById("name");
// let btn = document.getElementById("btn");
// let output = document.getElementById("output");

// // input event (real time typing )

// input.addEventListener("input", () => {
//   output.textContent = "typing:" + input.Value;

// });


// // keydown (enter press detect)

// input.addEventListener("input", (e) => {
//   if (e.key === "Enter") {
//     console.log("enter pressed");
//   }

// });

// // mouseover (button hver)
// btn.addEventListener("mouseover", () => {
//   btn.style.background = "blue";
// });

// btn.addEventListener("mouseout", () => {
//   btn.style.background = "red";
// });

// // submit event 

// form.addEventListener("submit", (e) => {
//  e.preventDefault();
//  output.textContent = "submitted:" + input.value;
// });

// call back function

// function greet(name, callback) {
//   document.getElementById("output").innerText = "Hello" + name;
//   callback();
// }

// function done() {
//   console.log("callback executed");

// }

// function start() {
//   greet("yasss", done);
// }

// call back simple 

// function greet(name, callback) {
//   console.log("hello" + name);
//  callback();
// }

// function bye() {
//   console.log("bye");
// }
// greet("yass",  bye);

//   let promise = new Promise((resolve, reject) => {
//   let success = false;

//   if (success) {
//     resolve("Data has found");
//   } else {
//     reject("error has occured");
//   }
// });

// promise
//   .then((res) => console.log(res))
//   .catch((err) => console.log(err));

// promise chaining 

// let promise = new Promise((resolve, reject) => {
//   resolve(60);
// });

// promise
// .then((res) => {
//   console.log(res); // 10 
//   return res +5;
// })
// .then((res) => {
//   console.log(res); //15
//   return res *2
// })
// .then((res) => {
//   console.log(res); //30
// })
// .catch((err) => {
//   console.log(err);
// });

// Async 


// async function getusers() {
//   try {
//     console.log("fetching data.....");

//     let res = await fetch("https://jsonplaceholder.typicode.com/users");
//     let data = await res.json();

//     console.log("Data has found:");
//     console.log(data);

//     console.log("First users:");
//     console.log(data[0].name);

//   } catch (error) {
//     console.log("error aaya:", error);
//   }
// }

//  getusers();


// async function getUsers() {
//   try {
//     console.log("1. Start");

//     let res = await fetch("https://jsonplaceholder.typicode.com/users");
//     console.log("2. Response received", res);

//     let data = await res.json();
//     console.log("3. Data:", data);

//     console.log("4. First user:", data[0].name);

//   } catch (error) {
//     console.log("Error:", error);
//   }
// }

// getUsers();

// try aur catch 


// try {
//   console.log("start");
//   let a = b + 10; 

// } catch (error) {
//   console.log("Error aaya:", error);
// }

// try {
//   let age = 56;

//   if (age < 18) {
//     throw "you are underage";
//   }
//   console.log("Acess granted");
// } catch (error) {
//   console.log("Error:", error);
// }

// fetch()

// fetch("https://jsonplaceholder.typicode.com/users")
// .then((res) => res.json())
// .then((data) => {
//   const userList = document.getElementById("usersList");

//   data.forEach((user) => {
//     const li = document.createElement("li");
//     li.textContent = user.name;
//     userList.appendChild(li);
//   });
// })
// .catch((err) => console.log(err));

// fetch("https://jsonplaceholder.typicode.com/users")
//   .then((res) => res.json())
//   .then((data) => console.log(data))
//   .catch((err) => console.log(err));


// // GET 

// fetch("https://jsonplaceholder.typicode.com/users")
// .then(res => res.json())
// .then(data => console.log(data));

// //post 

// fetch("https://jsonplaceholder.typicode.com/users" , {
//   method: "post",
//   headers: {
//     "content-Type": "application/json"

//   },
//   body: JSON.stringify({
//     name: "yasmeen",
//     age: 22
  
//   })
// })
// .then(res => res.json())
// .then(data => console.log(data))
// .catch(err => console.log("Error:", err));

// // JSON 
// fetch("data.json")
// .then(res => res.json())
// .then(data => console.log(data));

// //JSON STRINGIFY
// let user = {name: "elina"};
// let datajson  = JSON.stringify(user);

// console.log(datajson);

// //JSON PARSE
// let data = '{"name": "elina"}';

// let obj = JSON.parse(data);
// console.log(obj.name);

// fetch("https://jsonplaceholder.typicode.com/users")
//   .then(res => res.json()) // JSON → JS object
//   .then(data => console.log(data));

//   fetch("data.json")
//   .then(res => res.json())
//   .then(data => console.log(data.product));

//   // header 
//   fetch("https://jsonplaceholder.typicode.com/users", {
//      method: "POST",
//      headers: {
//       "content-Type": "application/json"
//      },
//      body: JSON.stringify({
//       name: "yass"
      
//      })
//   })
//   .then(res => res.json())
// .then(data => {
//   console.log("Response:", data);
// })
// .catch(err => console.log("Error:", err));

// // authorization 

// fetch("https://jsonplaceholder.typicode.com/users", {
//   headers: {
//     "Authorization": "Bearer token123"
//   }
// })
// .then(res => res.json())
// .then(data => console.log(data));

// // status code 

// fetch("https://jsonplaceholder.typicode.com/users")
// .then(res => {
//   console.log(res.status);
//   return res.json();

// })
// .then(data => console.log(data));

// // 400 code 
// fetch("https://jsonplaceholder.typicode.com/users/invalid")
//   .then(res => {
//     console.log("Status:", res.status);

//     if (!res.ok) {
//       console.log("Error aaya hai bhai ❌");
//     }

//     return res.json();
//   })
//   .then(data => console.log(data))
//   .catch(err => console.log("Network Error:", err));

//   //201

//   fetch("https://jsonplaceholder.typicode.com/users", {
//   method: "POST",
//   headers: {
//     "Content-Type": "application/json"
//   },
//   body: JSON.stringify({
//     name: "Mehatab"
//   })
// })
// .then(res => {
//   console.log(res.status); // 👈 yaha dekh
//   return res.json();
// })
// .then(data => console.log(data));

// // 401 
// fetch("https://api.com/profile")
//   .then(res => {
//     console.log(res.status); // 401
//     return res.json();
//   })
//   .then(data => console.log(data));

//   // 404

//   fetch("https://jsonplaceholder.typicode.com/unknown")
//   .then(res => {
//     console.log(res.status); // 404
//     return res.json();
//   })
//   .then(data => console.log(data));

//   // 500
//   fetch("https://api.com/users")
//   .then(res => {
//     console.log(res.status); // 500
//     return res.json();
//   })
//   .then(data => console.log(data));


//   // advanced java 
//   closures

//   function outer() {
//     let count = 0;

//     function inner() {
//       count++;
//       console.log(count);
//     }
//     return inner;
//   }

//   const myFunc = outer();
//   myFunc(); //1 
//   myFunc(); //2
//   myFunc(); //3 

//   // DATA HIDING

//   function bankAccount() {
//     let balance = 1000;

//     return {
//       deposit: function(amount) {
//         balance += amount;
//         console.log(balance);

//       },
//       getBalance: function() {
//         console.log(balance);
//       }
//     };
//   }
//   const account = bankAccount();

//   account.deposit(500); // 1500
//   account.getBalance(); //1500

//   // settime out 
//   for (var i = 1; i <= 3; i++) {
//   setTimeout(function() {
//     console.log(i);
//   }, 1000);
// }
// // fix using closure 
// for (var i = 1; i <= 3; i++) {
//   (function(x) {
//     setTimeout(function() {
//       console.log(x);
//     }, 1000);
//   })(i);
// }

//  function Hoisting

// sayHi();

// function sayHi() {
//   console.log("hello yasmeen ");
// }

// // var hoisting
// console.log(x); // undefined
// var x = 5;

// var x;
// console.log(x); // undefined
// x = 5;

// // let and  const 

// // console.log(y); // ❌ ReferenceError
// // let y = 10;

// // scope 
// // global scope 

//  var a = 10;

//  function show() {
//   console.log(a);
//  }
//  show();

//  // function scope

// //  function test() {
// //   var b = 20;
// //   console.log(b);
// //  }

// //  test();
// //  console.log(b);

//  //block scope 

//  if(true) {
//   let x = 5;
//   console.log(x);

//  }
//  console.log(x);

//  // var

//  if (true) {
//   var z = 100;

//  }
//  console.log(z);


// // lexical  scope 

// function outer() {
//   let name = "yasss";

//   function inner() {
//     console.log(name);
//   }

//   inner();
// }
// outer();

// function outer() {
//   let count = 0;

//   return function() {
//     count++;
//     console.log(count);
//   }
// }

// let counter = outer();
// counter(); // 1
// counter(); // 2

// // this keyword
// // inside object

// const user = {
//   name: "yasmeen",
//   greet: function() {
//     console.log(this.name);

//   }
// };
// user.greet();

// const car = {
//   brand: "BMW",
//   showbrand: function() {
//     console.log(this.brand);
//   }
// }
// car.showbrand();

// // global (normal function )

// function show() {
//   console.log(this);

// }
// show();

//inside method vs normal function

// const person = {
//   name: "Ali",
//   greet: function(){
//     console.log(this.name);

//   }
// }
// person.greet();

// const yass = {
//   home: "Ews - 372",
//   jasmeen: function(){
//     console.log(this.home);

//   }
// }
// yass.jasmeen();

// Arrow function

// const user = {
//   yasmeen:"cat",

//   frog: () => {
//     console.log(this.yasmeen);
//   }

// }
// user.frog();

// const user = {
//  name:"Mehatab",

//  greet: () => {
//    console.log(this.name);
//  }
// }

// user.greet();


// CALLBACKS 

// function hello() {
//   console.log("Hello");
// }
// function greet(callback){
//   callback();
// }
// greet(hello);

// function yasmeen() {
//   console.log("My name is yasmeen");

// }
// function smoky(callback){
//   callback();
// }
// smoky(yasmeen);

// function cookfood(callback){
//   console.log("cooking...");
//   callback();

// }
// function eat(){
//   console.log("eating");
// }
// cookfood(eat);

// // set time out

// setTimeout(function(){
//   console.log("4 sec ke baad");
// },4000);


// function cat(callback){
//   console.log("cat is eating..");
//   callback();
// }
// function tiger(){
//   console.log("tiger is dancing..");
// }

// function elephant(){
//   console.log("elephant is running..");
// }

// cat(tiger,elephant);
// cat(elephant);

// synchronous call back
// const user = {
//  name:"Mehatab",

//  greet: () => {
//    console.log(this.name);
//  }
// }

// user.greet();

// login(function(){
//  getProfile(function(){
//    getPosts(function(){
//       console.log("Done");
//    });
//  });
// });

// let a = 10;

// function greet(){
//  let b = 20;
//  console.log("Hello");
// }

// greet();

// DESTRUCTURING old way 

const bnc = {
  name: "sweetie",
  age: 29
};
console.log(bnc.name);
console.log(bnc.age);

// new version og object destructing 

const abc = {
  name: "yass",
  age: 21
};
const {name, age } = abc;
console.log(name);
console.log(age);

// Array destructuring (old version)
const colors = ["red", "green", "blue"];

console.log(colors[0]);
console.log(colors[1]);
console.log(colors[2]);

// Array destructuring ( new version)

const col =["pink", "white", "yellow"];
const [first, second , third] = col;

console.log(first);
console.log(second);
console.log(third);

// skip values 

const numbers = [10 , 20 , 30 ];

const [ a , b ] = numbers;
console.log(a );
console.log(b);

// default values

const jass = {
  nam: "jasmine "

};
 const { nam , afc  = 25} = UserActivation;

 console.log(afc); 

 // real interview  questiion

 const response = {
  data: {
    use: {
      id: 2,
      mi: " smoky"
    }
  }
 };
 const { data: { use: {mi} } } = response;

console.log(mi);

// spread operator 

const heart = [1,4,5];

const nri = [...heart];
console.log(nri);

// merging arrys

const c = [6,7];
const d = [8,9];
const result = [...c, ...d];
console.log(result);

// copy array 

const arr1 =[20,40];
const arr2 = [...arr1];


arr2.push(30);

console.log(arr2);
// [10,20,30] 

// spread in objects

const yx = {
  jk: "kle",
  ge: 23
};
const lk = {...yx};
console.log(lk);

// merging the objects

const bn = {
  nm: "hv"

};
const extra = {
  city: "hubli"

};

const profile = {
  ...bn,
  ...extra
};
console.log(profile);

// update object

const ayra = {
 air:"Meha",
 global:22
};

const updatedayra = {
 ...ayra,
 global:27
};

// function  argument

// const nums = [10,20,30];

// // console.log(...nums);

// Math.max(5,9,2)
// console.log(...max);

const nums = [20,50,10];

console.log(Math.max(...nums));

// update 

const ruby ={
  ysl: "tani",
  brown:24
};
const updated = {
  ...ruby,
  brown:28
}

console.log(updated);

