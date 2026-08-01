import express from "express"
const app = express();
app.use(express.json());
app.get("/",(req,resp)=>{
    resp.send("running")
})
export {app}