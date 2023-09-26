import { __dirname, transport } from "../utils/utils.js";


class MailController{
    async sendEmail (req, res)  {
       try{
         let result = await transport.sendMail({
            from:'Prueba desde Back End',
            to:'francohugoamador@hotmail.com ',
            subject:'Correo Prueba',
            html:`
            <div>
                <h1>¡Ésto es un test ! </h1>
                <img src="cid:bici.jpg" />
            </div>
            `,
            attachments:[{
                filename:"bici.jpg",
                path: __dirname + "/public/img/bici.jpg",
                cid:"bici.jpg",
            }]
         }) 
         return res.status(201).json({
          message:"Email enviado ",
          data: ''}); 
            }catch(e){
                console.log(e)
           res.status(500).json({
             status: "error",
             msg: "something went wrong :(",
             data: {},
           });
         }
       }
    
}

export const mailController = new MailController();