
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
  console.log(deletProduct)
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
    console.log('products desde server',products)
    agregarElementos(products);

  })
//RENDERIZAR CHAT


socket.on('all-msg',chats=>{
  console.log(chats)
  let msgFormateados = "";
  chats.forEach(msg => {
    msgFormateados += '<h3>'+ msg.msg + '</h3>'
  });
  divMsgs = document.getElementById("div-msgs")
  divMsgs.innerHTML = msgFormateados;
  })

  // socket.on('socket_para_todos_menos_actual',data=>{
  //   console.log(data)
  // })
  // socket.on('todos_conectados',data=>{
  //   const momentoComida = comidas.map(function(comida) {
  //     return comida.momento;
  //     });
  //     document.write(momentoComida);
  //   console.log(data)
  // })





  //CHAT
  let chatBtn = document.getElementById('btn-enviar')
  chatBtn.addEventListener("click", function(event) {
      event.preventDefault();
      let user = "franco"
      let mensaje = msg.value;
      socket.emit("send-msg", {
        msg:mensaje,
        user:user
         });
      msg.value = ""


  });