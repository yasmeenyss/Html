//arrays are collection of items which can hold more den one value

let marks_class_12 =[91, 82, 63 , 84 ,90,89 ,false, "Not present"]
console.log(marks_class_12)

console.log(marks_class_12[0])
console.log(marks_class_12[1])
console.log(marks_class_12[2])
console.log(marks_class_12[3])
console.log(marks_class_12[4])
console.log(marks_class_12[5])
console.log(marks_class_12[6])
console.log(marks_class_12[7])
console.log(marks_class_12[8])// undefined 
console.log("the length of marks_class_12 is",marks_class_12.length)
marks_class_12[8] = 56 // adding a new value to array
marks_class_12[0] = 96 // changing the vlaue of an array
console.log(marks_class_12)
console.log(typeof marks_class_12)// shows object


let arr = [100 ,30 , "yasmeen", true];
// console.log(arr[2]);
arr.push(90);
arr.push("strike");
console.log(arr);// push helps to insert elemnts

//pop operation : delete element from end

arr.pop();
console.log(arr);

// add elements in starting or delete the element from first

arr.unshift(10);
console.log(arr);
//delete 
arr.shift()
console.log(arr);

printing array using forlooop

let arr = [10, 30 , 50,90,11];

// for(let i=0;i<arr.length;i++){
//     console.log(arr[i]);
// }

for(let num of arr) {
    console.log(num);
}

const arr = [10, 30 , 50, 90 ,11];
console.log(arr.slice(2,4));

spread operator 

const arr = [10,30,50,90,11];
const arr2 = ["Rohit" , 11 , true];
const arr4 = [90,4, false];

const arr3 = [...arr,...arr2,...arr4];
console.log(arr3);