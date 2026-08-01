import logger from "pino";
const logs = logger({
    transport:{
        target:"pino-pretty",
        options:{
            colorize:true
        }
    }
})

export { logs }