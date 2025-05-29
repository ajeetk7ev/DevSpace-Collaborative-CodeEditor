"use server";


import { prisma } from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";



export const saveUser = async () => {
     try {
        const clerkUser = await currentUser();
        //console.log("clerkUser is info ", clerkUser);
        if (!clerkUser) {
            return;
        }
        const userId = clerkUser.id;
        const email = clerkUser.emailAddresses[0]?.emailAddress;
        const firstName = clerkUser.firstName ?? "";
        const lastName = clerkUser.lastName ?? "";
        const imageUrl = clerkUser.imageUrl ?? "";
        

        const user = await prisma.user.findUnique({
             where:{
                clerkId:userId
             }
        })

        if (!user) {
            await prisma.user.create({
                data: {
                    clerkId: userId,
                    email: email,
                    fullname:firstName+lastName,
                    imageUrl:imageUrl
                }
            });
        } else {
            console.log("User already exists");
        }
       
      
     } catch (error) {
        console.log("Error while saving user ",error);
     }
}