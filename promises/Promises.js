function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve,ms));
}

async function restCall() {
    await sleep(3000);
    return {
        success: false,
        errorMess: "smt went wrong",
        data: [
            {
                name:"cansu"
            }
        ]
    }
}

async function getUsers() {
    return new Promise((resolve, reject) => {
        restCall().then(response => {
            if(response.success) {
                resolve(response.data);
            }
            else
                reject(response.errorMess);
        });
    });
    
}

getUsers().then(res => console.log(res)).catch(rej => {
    console.log(rej);
});