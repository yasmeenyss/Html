//  for loops = repeat some code a limited amount of times 

for(let i = 10; i > 0; i--){
    console.log(i); // reverse

}

console.log("HPPY NEW YEAR");

for(let i = 1; i < 10; i++) {
    console.log(i);
}

for(let i = 0; i <= 10; i+=2){
    console.log(i);
}

for(let i = 1; i <=20; i++){
    if(i == 13){ // will skip 13
        continue; // infact break; is used here it works as till the value is 
        //is assigned as i==13
    }
    else{
        console.log(i);
    }
}

