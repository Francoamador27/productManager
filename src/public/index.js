

  // Código a ejecutar en la página 1
  const socket = io();



  let chatBtn = document.getElementById('btn-enviar')
  let saveBtn = document.getElementById('btn-guardar')
  let usuario = "";
  let emailUser ="";
  
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
    const messageInput = document.getElementById('msg');

    const username = saveBtn;
    const message = messageInput.value;

    // Enviar el mensaje y el nombre de usuario al servidor
    socket.emit('send-msg', { username, message });

    messageInput.value = '';
  })




 //LOCAL STORAGE
 if (typeof(Storage) !== "undefined") {
  // Obtener el carrito guardado en localStorage, si existe
  let cartId = localStorage.getItem("cartId");

  // Verificar si el carrito existe en localStorage
  if (cartId) {
    // Convertir el carrito de texto JSON a objeto JavaScript
    cartId = JSON.parse(cartId);
  } else {
    // Si no hay carrito en localStorage, crear uno vacío
    cartId = null;
  }

  // Obtener el carrito guardado en localStorage
  async function obtenerCarrito() {
    return cartId;
  }
function limpiarCarrito() {
    cartId = null;
    // Eliminar el carrito de localStorage
    localStorage.removeItem("cartId");
  }
}  else {
  // El navegador no admite localStorage
  console.log("LocalStorage no es compatible en este navegador.");
}
  async function addProducttoCart(id,cartId){
    try{
        localStorage.setItem("cartId", JSON.stringify(cartId));
        await addProduct(id,cartId)
        await  getCart(cartId);
        alert("Producto Agregado con exito")
    }
    catch(e){
      alert("Debes Iniciar Sesion")
    }
  }

async function viewCart(idCart){
  if(idCart){
    let urlCart= '/cart/'+idCart;
    window.open(urlCart, '_blank');

}else{
alert("No tiene productos agregados al carrito")
}
}
  
async function getCart(cartId){
  let requestOptions = {
    method: 'GET',
    redirect: 'follow'
  };
  
  let response = await fetch('http://localhost:8080/api/carts/'+ cartId, requestOptions)
  let respJson = await response.json()
  let cart = respJson.data
    var cantidad = cart.length;
    console.log(cart);
    var carritoCantidadElemento = document.getElementById("carritoCantidad"); // Obtén el elemento HTML del número de carrito
    carritoCantidadElemento.textContent = cantidad;
}
async function purchase(idCart){

  const requestOptions = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json', 
    },
  };
  
  // Realizar la solicitud POST al servidor
  fetch(`http://localhost:8080/api/carts/${idCart}/purchase`, requestOptions)
    .then(response => {
      if (!response.ok) {
        // Si la respuesta del servidor no es exitosa, lanzamos un error para ser capturado por el catch
        alert("PRIMERA Respuesta del servidor:",data)

        throw new Error('Error en la solicitud');
      }
      // Si la respuesta es exitosa, devolvemos la respuesta en formato JSON
      return response.json();
    })
    .then(data => {
      // Aquí puedes trabajar con la respuesta del servidor (data) cuando sea exitosa
      alert("Respuesta del servidor:",data)
      console.log('Respuesta del servidor:', data);
    })
    .catch(error => {
      // Si ocurre algún error en la solicitud, lo capturamos aquí
      alert('Error en la solicitud:', error)
      console.error('Error en la solicitud:', error);
    });


}
  async function addProduct(idProduct,idCart){
    var raw = "";
    let requestOptions = {
    method: 'POST',
    body: raw,
    redirect: 'follow'
  };
  fetch('http://localhost:8080/api/carts/'+idCart+'/product/'+idProduct, requestOptions)
  .then(response => response.text())
  .then(result => cart = result)
  .catch(error => console.log('error', alert(error) ));

  await getCart();
  } 
    // Código a ejecutar en la página 2
    
  async function deletProductToCart(idCartid,idProduct){
      let requestOptions = {
        method: 'DELETE',
        redirect: 'follow',
      };
    let deletProduct = await  fetch('http://localhost:8080/api/carts/'+idCartid+'/product/'+idProduct, requestOptions)
    alert("producto eliminado")
      location.reload();

      } 
  
  
      const inputPrice = document.getElementById('pricefilter');

      inputPrice.addEventListener('keyup', function(event) {
      if (event.keyCode === 13) {
          const value = event.target.value; // Obtener el valor del input
          const urlParams = new URLSearchParams(window.location.search); // Obtener los parámetros de la URL actual
          urlParams.set('maxPrice', value); // Añadir el nuevo parámetro con su valor
      const newUrl = window.location.origin + window.location.pathname + '?' + urlParams.toString(); // Construir la nueva URL
      window.location.href = newUrl; // Redirigir a la nueva URL con el parámetro añadido
        }
      });
  
  const orderSelector = document.getElementById("orderSelector");

  // Leer el valor almacenado en localStorage y establecerlo como opción seleccionada
  const lastSelectedOrder = localStorage.getItem("lastSelectedOrder");
  if (lastSelectedOrder) {
    orderSelector.value = lastSelectedOrder;
  }

  orderSelector.addEventListener("change", function() {
    // Obtener el valor seleccionado del selector (asc o desc)
    const selectedOrder = orderSelector.value;

    // Guardar el valor seleccionado en localStorage
    localStorage.setItem("lastSelectedOrder", selectedOrder);

    // Obtener la URL actual y sus parámetros
    const url = new URL(window.location.href);
    const params = new URLSearchParams(url.search);

    // Verificar si el parámetro "order" ya existe en la URL
    if (params.has("order")) {
      // Si existe, cambiar su valor según la opción seleccionada
      params.set("order", selectedOrder);
    } else {
      // Si no existe, agregar el parámetro "order" con el valor seleccionado
      params.append("order", selectedOrder);
    }

    // Actualizar la URL con los nuevos parámetros
    url.search = params.toString();
    window.location.href = url.toString();
  });


 