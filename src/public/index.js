

  // Código a ejecutar en la página 1
  console.log("pagina 1")
  const socket = io();
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
 
let cartId = null;

  async function addProducttoCart(id){
    try{
       let requestOptions = {
        method: 'POST',
        redirect: 'follow'
      };
      if(cartId === null){
        let response = await fetch("http://localhost:8080/api/carts/", requestOptions)
        let respJson = await response.json()
        cartId = respJson.data._id
        addProduct(id,cartId)
        alert("Producto Agregado con exito")
      }else{
        addProduct(id,cartId)
        alert("Producto Agregado con exito")

      }
         
    }
    catch(e){
        console.log(e)
    }

  }
  viewCart = document.getElementById("view-cart")
  viewCart.addEventListener("click", function(event) { 
    event.preventDefault();
    if(cartId){
          alert(cartId)
          let urlCart= '/cart/'+cartId;
          window.open(urlCart, '_blank');

    }else{
      alert("No tiene productos agregados al carrito")
    }
  })

   function addProduct(idProduct,idCart){
    var raw = "";
    let requestOptions = {
    method: 'POST',
    body: raw,
    redirect: 'follow'
  };
  fetch('http://localhost:8080/api/carts/'+idCart+'/product/'+idProduct, requestOptions)
  .then(response => response.text())
  .then(result => console.log(result))
  .catch(error => console.log('error', error));
  } 
    // Código a ejecutar en la página 2
    
  async function deletProductToCart(idCartid,idProduct){
      let requestOptions = {
        method: 'DELETE',
        redirect: 'follow'
      };
    let deletProduct = await  fetch('http://localhost:8080/api/carts/'+idCartid+'/product/'+idProduct, requestOptions)
    alert("producto eliminado")
      location.reload();

      } 
  
  

  


  //FORMULARIO AGREGAR PRODUCTOS 
// let formularioAdd = document.getElementById('add-product');
// if(formularioAdd){
//   formularioAdd.addEventListener('submit',(e)=>{
//   e.preventDefault();
//   const newProduct = {
//       title: title.value,
//       description: description.value,
//       price: +(price.value),
//       code: code.value,
//       stock: stock.value,
//       category: category.value,
//       thumbnail: thumbnail.value,
  
//   };
//   socket.emit("new-product", newProduct);

// })
// }

//ELIMAR PRODUCTO CON SOCKET
// let formularioDelet = document.getElementById('delet-product')
// formularioDelet.addEventListener('submit',(e)=>{
//   e.preventDefault();
//   const deletProduct = id.value;
//   socket.emit("delet-product", deletProduct);

// })


//RENDERIZAR PRODUCTOS
// function agregarElementos(products){
//   var text = "";
//         for (var i = 0; i < products.length; i++) {
//             text += '<li class="card">';

//             text += '<h3>' +products[i].title + "</h3>";
//             text += '<p class="card-dsc">' +products[i].description+'</p> ';
//             text += '<p class="card-id">' +products[i].id+'</p>  '+'</li>';
//               }
//      document.getElementById("products-life").innerHTML = text;   
// }

// GUARDAR PRODUCTOS EN VIVO
// socket.on('products',products=>{
//     agregarElementos(products);

//   })