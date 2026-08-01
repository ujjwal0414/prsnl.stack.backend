import { configDotenv } from "dotenv";
configDotenv();
import { app } from "./app.js";
import { logs } from "./utils/logger.js";
import { connectDB } from "./config/connectDB.js";
app.get("/api/v1/health", (req, resp) => {
    resp.status(200).send({
        data: {},
        message: "Backend health checked!"
    })
})
connectDB()
    .then(() => {
        logs.info("Initializing App")
        app.listen(process.env.BACKEND_PORT, (err) => {
            if (err) {
                logs.error("Cant connect")
            } else {
                logs.info(`Server connected at port ${process.env.BACKEND_PORT}`)
            }
        })
    })
    .catch((error) => {
        logs.error(`Some error occured ${error}`);
    
    })