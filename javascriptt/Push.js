array ke end mai item add karna 
push

let arr = [1,2];

arr.push(3);
console.log(arr);

important 

let arr = [1,2];
let x =arr.push(3);
console.log(x);

pop array ke last element ko remove karna 

let arr = [1,2,3];
arr .pop();
console.log(arr);

shift : starting se remove karna 

let arr = [1,2,3];

arr.shift();
console.log(arr);

important 
let arr = [1, 2, 3];

let x = arr.shift();

console.log(x);

UNSHIFT : STARTING MAI ADD KARNA 

let arr = [2,3];

arr.unshift(1);
console.log(arr);


MAP : MODIFIES THE ELEMENT AND RETURNS  NEW ARRAY 

let nums = [1,2,3,4];

let result = nums.map((num)  => {
    return num * 2;
});

console.log(result);

// another trick 

let num = [1,2,3,];
let results = num.map(num => num +1);
console.log(result);

// //map original array ko change nahi karta 

// let yas =[1,2,3];
// yas.map(yas => yas *2);
// console.log(yas);

// FOR EACH :YE BHI ARRAY KA METHOD HAI HAR ELEMENT PE LOOP CHALTA HAI LEKIN KUCH NAHI RETURN KARTA

let jass =[1, 2, 3];

jass.forEach((jass) => {
    console.log(jass  * 2);

});

let users =["Ali " , "Ahmed", "Zaid"];

users.forEach((user) => {
    console.log("Hello " + user);

})

FILTER : condition check karta hai sirf true waale elements ko new array me rakhta hai


let nums = [1, 2, 3, 4, 5];

let result = nums.filter((num) => {
   return num % 2 === 0;
});

console.log(result);

let nums = [1, 2, 3, 4];

let result = nums.filter(num => num >= 2);

console.log(result);

let users =[
    {name : "Ali ", age: 18},
    {name: "Ahmed", age:25},
    {name: "Zaid", age: 16},
];
let adults = users.filter(user => user.age > 18);

console.log(adults);