//In JavaScript, a string is a sequence of characters used to represent text.

// const str1 = "yasmeen";// connot produce multiple lines 
// const str2 = 'yasmeen';
// const day = 26;
// const str3 = 'Strike is coming on ${day} ';// can produce multiple lines 

// console.log(str3);

// const str = 'hello yasmeen';
// console.log(str.length)// prints length of the character 

// console.log(str[0]); // prints single letters 

// //upper case 
// console.log(str.toUpperCase()) // prints capital letters 

// lower case 
// const a =str.toUpperCase();
// const b = str.toLowerCase();
// console.log(a);


// const str = 'Hello yasmeen Hello yasmeen ';
// console.log(str.indexOf('lo'));
// console.log(str.lastIndexOf('lo')); // prints from last
// console.log(str.includes('hello')); // prints wheather the statement is present or not 


// slice 
// console.log(str.slice(2,7)); // cuts 
// console.log(str.slice(-4)); // last negative index 
// console.log(str.slice(5,-4)); // last negative index 

// const str = 'hello yasmeen';
// console.log(str.substring(2,5));

// const a = "yasmeen";
// const b = "had breakfst";
// const c = " and got late  ";
// const d = a+" "+b+" "+c;
// console.log(d); // attaches both strings and creates one 

// replacing string 

// const str = 'hello yasmeen';

// console.log(str.replace("llo", 'iam')); // replcing \
// console.log(str.replaceAll("llo", 'iam')); // replcing 

// const user = " yasmeen ";
// console.log(user.trim()); // trims the space starting and ending 

// const names = "Yasmeen, Nikita ,Priyanka, Anjali";
// console.log(names.split(", ")) // splits the values 
// console.log(names.split("  ")) // splits the values 

// DATE

// const now = new Date();

// console.log(now);
// console.log(now.toString()); // displays time 
// console.log(now.toLocaleString()); // displays time 

//local time 
// console.log(now.getDay());
// console.log(now.getDate());
// console.log(now.getFullYear());
// console.log(now.getMonth());
// console.log(now.getHours());
// console.log(now.getseconds());

//creating day 

// year month date hour minute second millisecond 
// const now = new Date(2026,2,13,14,5,125);

// console.log(now.toString());

// const now = Date.now(); 

// console.log(now); // millisecond it can be converted into time 

// const dates = new Date(1773399515461);

// console.log (dates.toString());

// Time stamp 

const now = Date.now();
const dates = new Date(now);
// console.log(dates.tostring());

console.log(dates);

// console.log(now);








