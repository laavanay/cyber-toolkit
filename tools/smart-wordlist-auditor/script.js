function generate(){

let name=document.getElementById("name").value;
let username=document.getElementById("username").value;
let dob=document.getElementById("dob").value;
let pet=document.getElementById("pet").value;
let relative=document.getElementById("relative").value;

let words=[name,username,dob,pet,relative];

let symbols=["123","1234","@123","!","@","007"];

let result=[];

words.forEach(word=>{

if(word=="") return;

result.push(word);

symbols.forEach(sym=>{

result.push(word+sym);
result.push(sym+word);

});

words.forEach(word2=>{

if(word2!="")
result.push(word+word2);

});

});

document.getElementById("output").value=result.join("\n");

}


function download(){

let text=document.getElementById("output").value;

let blob=new Blob([text],{type:"text/plain"});

let link=document.createElement("a");

link.href=URL.createObjectURL(blob);

link.download="wordlist.txt";

link.click();

}