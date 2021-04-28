async function testis() {
    var database2 
    async function test() {
        console.log("John");
    }
    async function test2() {
        console.log("Doe");
    }
    async function test3() {
        console.log(database2);
    }
    database2=['3']
    await Promise.all([test(), test2(), test3()]);
}

testis();
