//In JavaScript, all numeric values — whether integers or floating-point — are represented using the double-precision 64-bit binary format defined by the IEEE 754 standard.
//This means there is only one  number type in JavaScript (no separate int, float, etc.).

// let a = 10;
// let b = 345.6821;
// // console.log(b.toFixed(2)); // till 2 digit the number will be displayed
// let c = b.toFixed(1);
// console.log(typeof c); // it returns to string 
// console.log(b.toPrecision(4));
// console.log(b.toString()); // displays whole string 


// let a = new Number(20);
// let b = new Number(30);

// console.log(a==b);
// console.log(typeof b);  // defines which type of 

// let a = new Number(20);
// let b = a;

// console.log(a==b);

// non premitive : reference bases pe compare 
// premitive :copy by value

// MATH :JavaScript, Math is a built-in object that provides a collection of mathematical constants and functions
//  for performing calculations

// console.log(Math.abs(-4));
// console.log(Math.PI); // represent pie value
// console.log(Math.LN10); //represent log 10 value
// console.log(Math.SQRT1_2); // represent sqaureroot of 2
// console.log(Math.ceil(6.3));  // upper value 
// console.log(Math.floor(6.3));  // lower  value 
// console.log(Math.max(20,40,60,80)); 
// console.log(Math.random()); // generates random values 


// dice game :(0-9)

// console.log(Math.floor(Math.random()*10));
// console.log(Math.floor(Math.random()*10));
// console.log(Math.floor(Math.random()*10));
// console.log(Math.floor(Math.random()*10));
// console.log(Math.floor(Math.random()*10));

// (1-10)
// console.log(Math.floor(Math.random()*10)+1);

// console.log(Math.floor(Math.random()*6)+1);


// 15-25

// console.log(Math.floor(Math.random()*11)+15)
// Math.floor(Math.random()*(max-min+1))+min
// console.log(Math.floor(Math.random()*(25-15+1))+15)
// console.log(Math.floor(Math.random()*(25-15+1))+15)
// console.log(Math.floor(Math.random()*(25-15+1))+15)
// console.log(Math.floor(Math.random()*(25-15+1))+15)
// console.log(Math.floor(Math.random()*(25-15+1))+15)
// console.log(Math.floor(Math.random()*(25-15+1))+15)
// console.log(Math.floor(Math.random()*(25-15+1))+15)
// console.log(Math.floor(Math.random()*(25-15+1))+15)
// console.log(Math.floor(Math.random()*(25-15+1))+15)
// console.log(Math.floor(Math.random()*(25-15+1))+15)

// otp generate 4 digit : 1000-9999

console.log(Math.floor(Math.random()*(9999-1000+1))+1000);
console.log(Math.floor(Math.random()*(9999-1000+1))+1000);
console.log(Math.floor(Math.random()*(9999-1000+1))+1000);
console.log(Math.floor(Math.random()*(9999-1000+1))+1000);
console.log(Math.floor(Math.random()*(9999-1000+1))+1000);
