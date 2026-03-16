// Examples for FOR loop 

// 1. print (1 to 5 numbers )

for(let i = 1; i <= 5; i ++){
    console.log (i);
}

// 2. PRINT EVEN NUMBERS 

for(let i = 0; i<= 10; i++){
    if (i %2 === 0){
        console.log(i);
    }
}

// 3 PRINT ODD  NUMBERS 

for(let i = 0 ; i <= 10; i++){
    if (i %2 !==0){
        console.log(i);
    }

}

//4 . PRINT WITH ARRAY

let nums = [10,20,30,40];
for (let  i = 0; i <nums.length; i++){
    console.log(nums[i]);
}

//5. ARRAY WITH SUM 

let yas =[1,2,3,4];
let sum = 0;
for (let i = 0; i< yas.length; i++){
    sum = sum + yas[i];
}
console.log(sum);

//6 . REVERSE LOOP 

for (let i = 5; i>= 1; i--){
    console.log(i);
}

//7. TABLE PRINT 
for(let i = 1; i<=20; i++){
    console.log("2x" + i + " = " + (2* i));
}

