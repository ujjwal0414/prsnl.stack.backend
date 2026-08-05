import {z} from "zod";

const userZodSchema = z.object({
    userEmail:z.email(),
    password:z.string().min(6,"Min length of password should be 6").max(8,"Max length of passowrd should be 8"),
    role:z.literal(["admin","client","vendor"]),
    phone:z.string()
})
const userLoginZodSchema = z.object({
    userEmail:z.email(),
    password:z.string().min(6,"Min length of password should be 6").max(8,"Max length of passowrd should be 8")
})
export {userZodSchema,userLoginZodSchema}