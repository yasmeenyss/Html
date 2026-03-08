//objects are collection of related properties that represent real world objects methods  (people, products ,place)

// const { useEffect } = require("react");

// object ={key:value}
// function()

// const person1 = {
//     firstName: "Spongebob",
//     lastName: "Squarepants",
//     age:30,
//     isEmployed:true,
//     sayHello:function(){console.log("Hi I am spongebob!")},
// }

// const person2 = {
//     firstName: "patrick",
//     lastName: "Star",
//     age:42,
//     isEmployed:false,
//     sayHello:function(){console.log("Hi I am patrick!")},

// }
//  console.log(person1.firstName);
//  console.log(person1.lastName);
//  console.log(person1.age);
//  console.log(person1.isEmployed);

//  console.log(person2.firstName);
//  console.log(person2.lastName);
//  console.log(person2.age);
//  console.log(person2.isEmployed);

//  person1.sayHello();
//  person2.sayHello();

//  let alien = {
//     name: 'Naveen',
//     tech: 'Js',
//     'work exp': 4

//  }

//  console.log(alien.name);
//  console.log(alien.tech);
//  console.log(alien['work exp']); // we use this bracket becoz of the key value

// let input = 'tech'
// let alien = {
//     name: 'yasmeen',
//     tech: 'Js',
//     'work exp' :4,

// }
// console.log(alien[input]);

// const user = {
//   name: "Rohit",
//   age: 20,
//   emailId: "yasmeen@gmail.com",
//   amount: 2400,
// }
//  console.log(user);
// console.log(user.age);
// // CRUD operation :create read update delete
// user.aadhar = 1234; // creating
// user.amount = 5000; // updating
// console.log(user);

// //deleting
// delete user.emailId;
// console.log(user);

// IMPORTANT
// console.log(Object.keys(user)); // creates an arrays
// console.log(Object.values(user));
// console.log(Object.entries(user)); // represents key value

// const user = {
//   name: "Rohit",
//   age: 20,
//   emailId: "yasmeen@gmail.com",
//   amount: 2400,
// }

// const name = user.name;
// const age = user.age;

// for loop array
// const temnparr = Object.keys(user);
// console.log(temnparr)
// for(let keys of Object.keys(user)){
//     console.log(keys);
// }

// destructuring object
// const {name,age, amount} = user;
// console.log(name,age , amount);

// const arr = [10, 20, 40 ,90, 11];
// const[first,second]= arr;

// console.log(first,second);

// creating methods
// const user = {
//   name: "Rohit",
//   age: 20,
//   emailId: "yasmeen@gmail.com",
//   amount: 2400,
//   greeting:function(){
//     console.log('strike is coming  ${this.name}');
//     return 20;

//   }
// }
// // user.greeting();
// const va = user.greeting();
// console.log(va);

// nested object

// const user = {
//   name: "Rohit",
//   age: 20,
//   emailId: "yasmeen@gmail.com",
//   amount: 2400,
//   address: {
//     city: "Hubli",
//     state: "karnataka",
//   },
// };
// console.log(user.address.city);

// const  user = {
//   name: "yasmeen",
//   age: 21,
//   0: 100,
//   2: "jass"

// }
// console.log(user[0]); // this is printed in array form

const sym = Symbol("id");
const user = {
    name: "yasmeen",
    age: 21,
    0: 100,
    2: "jass",
  [sym]:"Hello"
}
console.log(user[sym]);// key:string || symbol is used 
