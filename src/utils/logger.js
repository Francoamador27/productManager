import winston from "winston";
import config from "../config/config.js";
const customLevels = {
    debug: 0,
    http: 1,
    info: 2,
    warn: 3,
    error: 4,
    fatal: 5
  };
if(config.loggMode ==="development"){

    var logger = winston.createLogger({
        levels: customLevels,
        transports:[
            new winston.transports.Console({
                level:"fatal",
                format:winston.format.colorize({all:true})
            }),
        
        
        ]
    })
}else{

    var logger = winston.createLogger({
        levels: customLevels,
        transports:[
            new winston.transports.Console({
                level:"info",
                format:winston.format.colorize({all:true})
            }),
            new winston.transports.File({
                filename:"./errors.log",
                level:"fatal",
                format:winston.format.simple()
            }),
        ]
    })
}

export {logger};
