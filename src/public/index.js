

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
        alert("Producto Agregado con exito")
    }
    catch(e){
      alert(e)
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
  console.log("cartId",cartId);
  let response = await fetch('http://localhost:8080/api/carts/'+ cartId, requestOptions)
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
      
      fetch(`http://localhost:8080/api/carts/${idCart}/purchase/`, requestOptions2)
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
    let response = await fetch('http://localhost:8080/api/carts/'+idCart+'/product/'+idProduct, requestOptions)
   console.log(response);
   if (!response.ok) {
    throw new Error("No se pudo agregar");
  }
  return response;
    }catch(e){
      throw new Error ("No se puedo agregar")
    }

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


 