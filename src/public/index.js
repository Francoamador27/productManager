

  // Código a ejecutar en la página 1



  let chatBtn = document.getElementById('btn-enviar')
  let saveBtn = document.getElementById('btn-guardar')
  let usuario = "";
  let emailUser ="";
  

  




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
       let response =  await addProduct(id,cartId)
        await  getCart(cartId);
        Swal.fire({
          title: 'Producto Agregado con Éxito',
          icon: 'success', // Puedes cambiar el icono según tus preferencias (success, error, warning, info, etc.)
          showConfirmButton: false, // Puedes ocultar el botón de confirmación si lo deseas
          timer: 1500 // Controla cuánto tiempo se mostrará el mensaje (en milisegundos)
        });    }
    catch(e){

      Swal.fire({
        title: 'Error',
        text: e.toString(), // Puedes personalizar el mensaje de error aquí
        icon: 'error', // Utiliza el icono de error
        confirmButtonText: 'OK' // Cambia el texto del botón de confirmación si lo deseas
      });    }
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
    let response = await fetch('/api/carts/'+ cartId, requestOptions)
  let respJson = await response.json()
  let cart = respJson.data
    var cantidad = cart.length;
    var carritoCantidadElemento = document.getElementById("carritoCantidad"); // Obtén el elemento HTML del número de carrito
    carritoCantidadElemento.textContent = cantidad;
}
async function purchase(idCart, e){
    try {
            var requestOptions2 = {
        method: 'POST',
        redirect: 'follow'
      };
      
      fetch(`/api/carts/${idCart}/purchase/`, requestOptions2)
        .then(response => response.json())
        .then(result => {
          Swal.fire({
            title: 'Finalizado',
            text: 'La compra se realizó con éxito',
            icon: 'success',
            confirmButtonText: 'Ver Orden',
            showCancelButton: true,
            cancelButtonText: 'Ver Mas Tarde',
          }).then((result) => {
            if (result.isConfirmed) {
              window.location.href = '/orders';
            }else{
            window.location.href = '/products';

          }

        })
      })
        .catch(error => {
          alert('Error: ' + error.message);
          alert('Error: ' + error.stack);
          console.log('Error:', error.message);

        });
}catch(e){
  alert("error catch")
}
}



document.getElementById('finalizar-compra-link').addEventListener('click', function(event) {
  event.preventDefault(); // Evita la recarga de la página
  const idCart = this.getAttribute('data-idcart');
  purchase(idCart);
});
  async function addProduct(idProduct,idCart){
    try{
      var raw = "";
      let requestOptions = {
      method: 'POST',
      body: raw,
      redirect: 'follow'
    };
    let response = await fetch('/api/carts/'+idCart+'/product/'+idProduct, requestOptions)
   console.log(response);
   if (response.status === 403){
    throw "No puedes agregar tu producto a tu carrito";

   }
   if (response.status === 404){
    throw "Debes iniciar Sesion";

   }
  console.log(response)
  return response;
    }catch(e){
      throw e;
    }

} 
  
  async function deletProductToCart(idCartid,idProduct){
      let requestOptions = {
        method: 'DELETE',
        redirect: 'follow',
      };
    let deletProduct = await  fetch('/api/carts/'+idCartid+'/product/'+idProduct, requestOptions)
    alert("producto eliminado")
      location.reload();

      } 
  
  
 
  



 