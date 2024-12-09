import { check, validationResult } from "express-validator";
import xss from "xss";

export function validateQueryParameters(req, res, next) {
    try{
        
            if (req.query.page) {
                const page = req.query.page;
                const parsedValue = parseInt(page, 10);
                if (isNaN(parsedValue) || page !== parsedValue.toString()) {
                  return res.status(400).json({ error: 'page debe ser un número entero.' });
                }
                req.query.page = xss(page);
              }
            if (req.query.limit) {
                const limit = req.query.limit;
                const parsedValue = parseInt(limit, 10);
                if (isNaN(parsedValue) || limit !== parsedValue.toString()) {
                  return res.status(400).json({ error: 'limit debe ser un número entero.' });
                }
                req.query.limit = xss(limit);
              }
            if (req.query.maxPrice) {
                const maxPrice = req.query.maxPrice;
                const parsedValue = parseInt(maxPrice, 10);
                if (isNaN(parsedValue) || maxPrice !== parsedValue.toString()) {
                  return res.status(400).json({ error: 'maxPrice debe ser un número entero.' });
                }
                req.query.maxPrice = xss(maxPrice);
              }
      
              if (req.query.order) {
                if (req.query.order !== 'asc' && req.query.order !== 'desc') {
                    return res.status(400).json({ error: 'El valor de "order" debe ser "asc" o "desc".' });
                  }        
              }
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            throw "Error " 
        }
        next();
    }catch(e){
        return res.status(500).render("error",{error:e})
    }
  
  
  }