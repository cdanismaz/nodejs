console.log("i love you furkan");

var p = new Promise((resolve, reject) => {
    resolve("hello world");
})

p.then(response => {
    console.log(response);
})

var ortak=6;
var p2 = new Promise((resolve,reject) => {
    if(ortak > 5) {
        resolve("basarılı");
    }
    else
        reject("reject ettim");
})

p2.then(response => console.log(response)).catch(err => console.log(err));

console.log("test");