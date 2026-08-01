import fs from 'fs';
import { LOGS_FOLDER,PROJECT_ROOT } from '../fileConfig.js';
class Logs {
    constructor(mode = 'health',folder_name,file_name){
        this.mode = mode;
        this.date = new Date();
        this.log_folder_name = folder_name || `Date_${this.date.getFullYear()}/${this.date.getMonth() + 1}/${this.date.getDate()}`;
        this.log_file_name = file_name || `${this.date.getHours()}-${this.date.getMinutes()}-${this.date.getSeconds()}.log`;
    }
    init(){
        if(!fs.existsSync(LOGS_FOLDER)){
            fs.mkdir(LOGS_FOLDER, { recursive: true }, (err) => {
                if(err) throw err;
            })
        }
        if(!fs.existsSync(`${LOGS_FOLDER}/${this.mode}/${this.log_folder_name}`)){
            fs.mkdir(`${LOGS_FOLDER}/${this.mode}/${this.log_folder_name}`, { recursive: true }, (err) => {
                if(err) throw err;
            })
        }
    }
    getLogs(mode = this.mode){

    }
    getLogFilePath(){
        return `${LOGS_FOLDER}/${this.mode}/${this.log_folder_name}`;
    }
}

