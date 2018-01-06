//Just to show promises

var promise = new Promise(function  (resolve, reject){
    if (1===2) {
        resolve("Stuff worked!");
    }
    else{
        reject("you fucked up");
    }
});


promise.then(function (result) {
    console.log(result);
},function (reason) {
    console.log(reason);
});

