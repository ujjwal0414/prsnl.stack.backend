import express from "express"
import cookieParser from "cookie-parser";
import { authRouter } from "./src/auth/routes/auth.route.js";
import cors from 'cors'
import { emailRouter } from "./src/email/routes/email.route.js";
import { adminRouter } from "./src/admin/routes/admin.routes.js";
const app = express();
app.use(cors({
    origin: '*',
}))
app.use(express.json());
app.use(express.urlencoded({limit:"16kb"}))
app.use(cookieParser());

app.use("/api/v1/auth",authRouter);
app.use("/api/v1/email",emailRouter)
app.use("/api/v1/admin",adminRouter)
export {app}