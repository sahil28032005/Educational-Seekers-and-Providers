const prisma = require('../config/prismaClient');

async function checkConnection(){
    try{
        const users=await prisma.User.findMany();
        console.log("database connection is successful. users: ",users);
    } 
    catch(e){
        console.error(e.message);
    }
}
// checkConnection(); //sucecess

//for searching users

