import express from "express"
import cookieParser from "cookie-parser";
import { authRouter } from "./src/auth/routes/auth.route.js";
const app = express();
app.use(cors({
    origin: '*',
}))
app.use(express.json());
app.use(express.urlencoded({limit:"16kb"}))
app.use(cookieParser());

app.use("/api/v1/auth",authRouter);
export {app}