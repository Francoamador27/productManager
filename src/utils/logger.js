import winston from "winston";
import config from "../config/config.js";

if(config.loggMode ==="development"){
        var logger = winston.createLogger({
        transports:[
            new winston.transports.Console({
                level:"debug",
                format:winston.format.colorize({all:true})
            }),
            new winston.transports.Console({
                level:"http",
                format:winston.format.colorize({all:true})
            }),
            new winston.transports.Console({
                level:"info",
                format:winston.format.colorize({all:true})
            }),
            new winston.transports.File({
                filename:"./errors.log",
                level:"warn",
                format:winston.format.simple()
            }),
            new winston.transports.File({
                filename:"./errors.log",
                level:"error",
                format:winston.format.simple()
            }),
            new winston.transports.File({
                filename:"./errors.log",
                level:"fatal",
                format:winston.format.simple()
            }),
        ]
    })
}else{
    var logger = winston.createLogger({
        transports:[
            new winston.transports.Console({
                level:"info",
                format:winston.format.colorize({all:true})
            }),
            new winston.transports.File({
                filename:"./errors.log",
                level:"warn",
                format:winston.format.simple()
            }),
            new winston.transports.File({
                filename:"./errors.log",
                level:"error",
                format:winston.format.simple()
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
