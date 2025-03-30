import {z} from "zod";

export const signupSchema = z.object({
    username: z.string().min(2,"username must conatin 2 letters")
                        .max(20,"username must be no more 20 letters")
                         .regex(/^[a-zA-Z0-9_]+$/,"username should not have special characters"),

   email: z.string().email({message:'Invalid email'}),
    password: z.string().min(6,{message:"password must be of minimum 6 characters"})     
                        .max(12,{message:"password must be of minimum 6 characters"}),                            
})

export const usernameScheam  = z.object({
    username: z.string().min(2,"username must conatin 2 letters")
    .max(20,"username must be no more 10 letters")
    .regex(/^[a-zA-Z0-9_]+$/," *username should not have special characters")
})

export const verifySchema = z.object({
    username: z.string(),
    verifyCode:z.string().length(6,{message:"verification code must be 6 digit"}).optional()
})


const emailSchema = z.string()
    .regex(/^[\w-]+(?:\.[\w-]+)*@(?:[\w-]+\.)+[a-zA-Z]{2,7}$/, { message: "Invalid email format" });


export const loginSchema = z.object({
        identifier: usernameScheam.or(emailSchema), // Ensuring either username or email is provided
        password: z.string()
            .min(6, { message: "Password must be at least 6 characters long" })
            .max(12, { message: "Password must be at most 12 characters long" }),
});




