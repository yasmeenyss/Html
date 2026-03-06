//objects are collection of related properties that represent real world objects methods  (people, products ,place)

//object ={key:value}
// function()

const person1 = {
    firstName: "Spongebob",
    lastName: "Squarepants",
    age:30,
    isEmployed:true,
    sayHello:function(){console.log("Hi I am spongebob!")},
}

const person2 = {
    firstName: "patrick",
    lastName: "Star",
    age:42,
    isEmployed:false,
    sayHello:function(){console.log("Hi I am patrick!")},

} 
 console.log(person1.firstName);
 console.log(person1.lastName);
 console.log(person1.age);
 console.log(person1.isEmployed);

 console.log(person2.firstName);
 console.log(person2.lastName);
 console.log(person2.age);
 console.log(person2.isEmployed);

 person1.sayHello();
 person2.sayHello();


 let alien = {
    name: 'Naveen',
    tech: 'Js',
    'work exp': 4

 }

 console.log(alien.name);
 console.log(alien.tech);
 console.log(alien['work exp']); // we use this bracket becoz of the key value

let input = 'tech'
let alien = {
    name: 'yasmeen',
    tech: 'Js',
    'work exp' :4,

}
console.log(alien[input]);


 