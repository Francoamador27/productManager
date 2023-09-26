import EErrors from "../errors/enums.js";

export default (error,req,res,next)=>{

switch (error.code){
case EErrors.INVALID_TYPES_ERROR:
    res
    .status(400)
    .send({
        status:"error",
        error: error.name,
        cause: error.cause,
})
break;
case EErrors.DATABASE_ERROR:
    res
    .status(400)
    .send({
        status:"error",
        error: error.name,
        cause: error.cause,
})
break;case EErrors.PRODUCTS_NO_FIND:
res
.status(400)
.send({
    status:"error",
    error: error.name,
    cause: error.cause,
})
break;

default:
    res.send({status:"error",error:"Unhandled erro"})
break;
}
}