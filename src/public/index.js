
const socket = io();
//FORMULARIO AGREGAR PRODUCTOS 
let formularioAdd = document.getElementById('add-product')
formularioAdd.addEventListener('submit',(e)=>{
  e.preventDefault();
  const newProduct = {
      title: title.value,
      description: description.value,
      price: +(price.value),
      code: code.value,
      stock: stock.value,
      category: category.value,
      thumbnail: thumbnail.value,
  
  };
  socket.emit("new-product", newProduct);

})

let formularioDelet = document.getElementById('delet-product')
formularioDelet.addEventListener('submit',(e)=>{
  e.preventDefault();
  const deletProduct = id.value;
  socket.emit("delet-product", deletProduct);

})


//RENDERIZAR PRODUCTOS
function agregarElementos(products){
  var text = "";
        for (var i = 0; i < products.length; i++) {
            text += '<li class="card">'+'<h3>' +products[i].title + "</h3> "+'<p class="card-dsc">' +products[i].description+'</p> '+'<p class="card-id">' +products[i].id+'</p>  '+'</li>';
          }
     document.getElementById("products-life").innerHTML = text;   
}
socket.on('products',products=>{
    agregarElementos(products);

  })
  let chatBtn = document.getElementById('btn-enviar')
  let saveBtn = document.getElementById('btn-guardar')
  let usuario = "";
  let emailUser ="";
  saveBtn.addEventListener("click", function(event) {
    event.preventDefault();
    usuario = user.value;
    emailUser = email.value;
    document.getElementById('data-user').className = "div_hide";
    document.getElementById('chat-soc').className = "div_show";
    return  usuario;
   });

//RENDERIZAR CHAT
socket.on('all-msg',chats=>{
  let msgFormateados = "";

  chats.forEach(msg => {
    if(usuario === msg.user ){
          msgFormateados += `<div class="my-msg msgChat">`;
    }else{
          msgFormateados += `<div class="otros-msg msgChat">`;

    }
    msgFormateados += `<div ">`;

    msgFormateados += '<p class="user">'+ msg.user+ "</p>";
    msgFormateados += '<p class="email">'+ msg.email+ '</p>';
    msgFormateados += '<h3 class="mensaje">'+ msg.message+ '</h3>';
    msgFormateados += `</div ">`;

    msgFormateados += '</div>';

  });
  divMsgs = document.getElementById("div-msgs")
  divMsgs.innerHTML = msgFormateados;
  })
  //CHAT
 
  chatBtn.addEventListener("click", function(event) {
      event.preventDefault();
      let mensaje = msg.value;
      socket.emit("send-msg", {
        msg:mensaje,
        user:usuario,
        email:emailUser
         });
      msg.value = ""


  });