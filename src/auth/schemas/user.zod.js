import {z} from "zod";

const userZodSchema = z.object({
    userEmail:z.email(),
    password:z.string().min(6,"Min length of password should be 6").max(12,"Max length of passowrd should be 10")
})
export {userZodSchema}