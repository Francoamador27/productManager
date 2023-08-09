export const generateProductsError = (user) =>{
    return
` 
Una o mas Propiedades estan icompletas o invaildaas !!!
Lista de propiedades obigatorias :
*First_name : must be a string(${user.first_name})
*Last_name : must be a string(${user.last_name})
*email: must be a string(${user.email})
`;
}