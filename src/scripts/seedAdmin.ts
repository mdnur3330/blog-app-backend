import { UserRole } from "../middleware/auth";
import { prisma } from "../lib/prisma";

async function seedAdmin(){
    console.log("this is farst");
    try{
        const adminData = {
            name:"Admin Saheb",
            email:"admin@gmail.com",
            role: UserRole.ADMIN,
            password: "admin12345"
        }
        //check user exist on db or not
        const existingUser = await prisma.user.findUnique({
            where:{
                email:adminData.email
            }
        });
        console.log("thsis is seconst");
        if(existingUser){
            throw new Error("User already exists!!")
        }

        const signUpAdmin = await fetch("http://localhost:3000/api/auth/sign-up/email",{
            method:"POST",
            headers:{
                "content-type":"application/json"
            },
            body:JSON.stringify(adminData)
        })
        console.log("thsis is tree");
        console.log(signUpAdmin);
    }catch(err){
        console.error(err);
    }
}
seedAdmin()