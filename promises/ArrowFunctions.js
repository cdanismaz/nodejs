function regularFunction() {
    console.log("regular function");
}
//regularFunction();

var anony = function() {
    console.log("anonymous function");
}

var anony2 = x => console.log("arrow function " + x);

var f3 = (x,y,z) => console.log(x+y+z);

f3(1,2,3);

var f4 = () => console.log("parametresiz");

//anonymous();

anony2(5);

// setTimeout(function() {
//     console.log("test")
// }, 3000);

// setTimeout(anonymous,2000);


