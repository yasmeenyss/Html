//Functions are reusable code blocks designed for particular tasks
//Functions are executed when they are called or invoked
//Functions are fundamental in all programming languages


// function greeting(){
//     console.log("Hello my name is yasmeen ");

// }
//  greeting(); // this is calling function 


//  function addNumber(num1,num2){ // this is passing  the parameter 
//     const sum = num1+num2;
//     console.log(sum);
 
//  }
 
//  addNumber(3,4);
//  addNumber(6,7); // passing the argument 

//  //rest operator 
//  function addNumber(...num){ // converts into array form
//     console.log(num);

//  }
//  addNumber(6,7);
//  addNumber(6,7,8);
//  addNumber(6,7,8,9);
//  addNumber(7,8,12,11,12,41,12) // spread operator and rest op is impt

// // applying for loop on an array

// function addNumber(...num){
    
//     let sum=0;
//     for(let n of num){
//         sum+=n;
//     }
//     console.log(num);

//  }
//  addNumber(6,7);
//  addNumber(6,7,8);
//  addNumber(6,7,8,9);
//  addNumber(7,8,12,11,12,41,12)

// spread operator 
// removes the array and makes the line of numbers plain


// const arr = [10,20,30,40,50];
// const arr2 = [30,70,80,90,10]

// const ans = [...arr,...arr2]; // this dots must and should be used to represent spread

// console.log(ans);


// arrow function 
// ()=>{
//     }


// const addNumber =()=>{
//  console.log("Hello");

// }
//  addNumber();

//  if we want to pass an argument betwn this 
  
//  const addNumber  =(num1,num2)=>{

//     return num1+num2;

//  }
//     console.log(addNumber(3,4));

//     this is also used for sorting 

//     let arr = [20,100,50,80,];

//     arr.sort((a,b)=>a-b);
//     console.log(arr);
    

//     call back function in javascript is function passed as an argument to another function 
//     this allows the receiving function often called a higher order function to execute 
//     passing argument into an arugument 

    function greet(){
        console.log("Hello how r uh ")
    }

    greet();
//     function dance(){
//         console.log("I am dancing ");
//     }
 
//     function meet(callback){
//         console.log("am yasmeen");
//         callback();
//         console.log("i have finished meeting");

//     }

//      meet(greet);
//      meet(dance);

    

// zomato
// function zomatoOrderplaced(){
//     console.log("we have started preparing your food");

// }
// function payment(amount){
//     console.log('${amount}) payment has initialized')
//     console.log("payment is received ");
//     zomatoOrderplaced()
// }
// payment(500);

//blink it

// function blinkitOrderplaced(){
//     console.log("we are packing  your order");

// }
//  function orderplaced(){
//     console.log("we have started preparing your food");

//  }

//  function payment(amount,callback){
//  console.log('${amount }payment has initialisd ')
//  console.log("payment is received ");
//  callback();
//  }

// payment(300,blinkitOrderplaced);

const  a  = 30;
 console.log(a);

 const b = "yasmeen";
 console.log(b);


console.log(typeof(b));
console.log(typeof(a));


 let array  = [10,20,40,60];
 console.log(array);

 for(let i = 0; i < array.length; i++){
    console.log(array[i]);
 }

