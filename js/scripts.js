//Variables a utilizar 
// el query selector busca el id o la clase que se le haya asignado al elemento del html
const carrito = document.querySelector('#carrito');
const listaPrenda = document.querySelector('#lista');
const contenedorCarrito = document.querySelector('#lista-carrito tbody');
const vaciarCarrito = document.querySelector('#vaciar-carrito');
const confirmarCompra = document.querySelector('#compra');
const precioTotalElement = document.getElementById('precioTotalCarrito');
//variables para mostrar el precio total de pago y los articulos que van a haber en el carrito 
let precioTotalCarrito = 0;
let articulosPrenda = [];
//carga cuando la paginicia
cargarEvenetListener();
function cargarEvenetListener() {
  //agregar el curso al carrito
  listaPrenda.addEventListener('click', agregarCarrito);

  //eliminar curso del carritoHTML
  carrito.addEventListener('click', eliminarPrenda);

  //confirmar compra
  confirmarCompra.addEventListener('click', () => {
    Swal.fire({
      title: 'Deseas confirmar la compra?',
      text: "Estaras comprando los elementos del carrito",
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, comprar!',
      cancelButtonText: 'Cancelar',

    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire(
          'Comprado!',
          'La compra ha sido realizada.',
          'success'
        );
        articulosPrenda = [],
          limpiar();
        precioTotalElement.textContent = `$0.00`;
      } else if (
        /* Read more about handling dismissals below */
        result.dismiss === Swal.DismissReason.cancel
      ) {
        Swal.fire(
          'Cancelado',
          'Tus productos se mantienen :)',
          'success'
        )
      }
    })
  });


  //vaciar Carrito
  vaciarCarrito.addEventListener('click', () => {
    Swal.fire({
      title: 'Estas seguro?',
      text: "Elimanaras los productos del carrito!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminar!',
      cancelButtonText: 'Cancelar!'
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire(
          'Eliminado!',
          'Los articulos del carrito han sido eliminados.',
          'success'
        );
        articulosPrenda = [];
        limpiar();
        precioTotalElement.textContent = `$0.00`;
      } else if (
        /* Read more about handling dismissals below */
        result.dismiss === Swal.DismissReason.cancel
      ) {
        Swal.fire(
          'Cancelado',
          'Tus productos se mantienen :)',
          'success'
        )
      }
    })
  });
}

//funcion para agregar al carrito
function agregarCarrito(e) {
  //e.preventDefault hace que la pagina no se recarge
  e.preventDefault();
  if (e.target.classList.contains('add')) { //busca la clase add 
    //console.log(e.target.classList);
    const prendaSeleccionada = e.target.parentElement.parentElement.parentElement; // localiza cada elemento que hace parte del producto
    //console.log(e.target.parentElement.parentElement.parentElement);
    leerDatos(prendaSeleccionada);
    //mensaje que se muestra al agregar la prenda
    Swal.fire(
      'Tu prenda ha sido agregada!',
      'Excelente!',
      'success'
    );
  }

}

//funcion para leer los datos de la prenda seleccionada
function leerDatos(prenda) {
  //console.log(prenda)
  const sizes = prenda.querySelector("ul.tallas")
  let size = "talla única"
  if (sizes) {
    size = sizes.querySelector("button.active").textContent
  }
  console.log("size:", size)
  const infoprenda = {
    id: prenda.querySelector('a').getAttribute('data-id'),
    img: prenda.querySelector('img').src,
    //talla: prenda.querySelector('id').textContent,
    talla: size,
    nombre: prenda.querySelector('h5').textContent,
    precio: parseFloat(prenda.querySelector('.precio').textContent.replace('$', '')),
    cantidad: 1,
  }
  console.log(infoprenda.talla);
  //validando si la prenda existe
  const existe = articulosPrenda.some(prenda => prenda.id === infoprenda.id); // el some es una operacion que se hace en el vector para encontrar algun elemento parecido
  if (existe  ) {
    //modificacamos la cantidad && infoprenda.talla !== infoprenda.talla
    const cantidadPrenda = articulosPrenda.map(prenda => { // el map recorre el vector es como un for pero mas sofisticado
      if (prenda.id === infoprenda.id) {
        prenda.cantidad++;
        return prenda;
      } else {
        return prenda;
      }
    });
    articulosPrenda = [...cantidadPrenda]; //agrega la prenda al carrito
  } else {
    articulosPrenda = [...articulosPrenda, infoprenda]; //dejamos el carrito igual antes de agregar la prenda
  }
  mostrarDatos();
}
//funcion para mostrar los datos en el carrito
function mostrarDatos() {
  //Limpiamos el contenido de la tabla
  limpiar();
  articulosPrenda.map(prenda => {
    const { img, nombre, precio, cantidad, id, talla } = prenda;
    const precioTotal = (precio * cantidad);
    const row = document.createElement('tr'); //crea un elemento html con javascript, el codigo siguiente agrega las columnas y filas de una tabla con javascript
    row.innerHTML = `
        <td>
          <img src="${img}" width="100">
        </td>
        <td>
          ${nombre}
        </td>
        <td>
          ${talla}
        </td> 
        <td>
         $ ${precioTotal}
        </td>
        <td>
          <div class="d-flex  justify-content-between">
          <a href="#" data-id="${id}"> <i class="bi bi-dash-circle-fill borrar-prenda"></i></a>
          ${cantidad}
          <a href="#" data-id="${id}"> <i class="bi bi-plus-circle-fill agregar-prenda"></i></a>
          </div>
        </td>
        <td>
          <a href="#" data-id="${id}"> <i class="bi bi-x-circle-fill borrar-prenda2" ></i> </a>
        </td>`;
    contenedorCarrito.appendChild(row); // agrega todos los datos de la prenda en la tabla
    // Calcular el precio total
    precioTotalCarrito = articulosPrenda.reduce((total, prenda) => total + (prenda.precio * prenda.cantidad), 0);

    // Calcular la cantidad total de prendas
    let cantidadTotalPrendas = articulosPrenda.reduce((total, prenda) => total + prenda.cantidad, 0);

    // Calcular el descuento
    let descuento = Math.floor(cantidadTotalPrendas / 10) * 5;
    if (descuento > 40) {
      descuento = 40;
    }

    // Aplicar el descuento
    precioTotalCarrito = precioTotalCarrito * ((100 - descuento) / 100);

    // Mostrar el precio total
    precioTotalElement.textContent = `$ ${precioTotalCarrito.toFixed(2)}`;


    // Actualizar el número en el span o el numero que esta en el carrito
    const cantidadCarritoSpan = document.getElementById('cantidadCarrito');
    cantidadCarritoSpan.textContent = articulosPrenda.length;
  });

}

//Funcion para limpiar datos de la tabla
function limpiar() {
  while (contenedorCarrito.firstChild) {
    contenedorCarrito.removeChild(contenedorCarrito.firstChild);
  }
}

//funcion para eliminar la prenda seleccionada
function eliminarPrenda(e) {
  e.preventDefault();
  const prendaId = e.target.parentElement.getAttribute('data-id');
  const existe2 = articulosPrenda.some(prenda => prenda.id === prendaId);
  if (e.target.classList.contains('borrar-prenda2')) {

    //console.log(e.target.classList);
    //obtenemos el id que deseamos eliminar
    articulosPrenda = articulosPrenda.filter(prenda => prenda.id !== prendaId);
  }
  else if (e.target.classList.contains('borrar-prenda')) {

    if (existe2) {
      articulosPrenda.some(prenda => {
        if (prenda.id === prendaId) {
          prenda.cantidad--;
          if (prenda.cantidad === 0) {
            articulosPrenda = articulosPrenda.filter(prenda => prenda.id !== prendaId);
            return prenda;
          }
        }
      });
    }
    precioTotalElement.textContent = `$0.00`;

  } else if (e.target.classList.contains('agregar-prenda')) {
    const prendaId = e.target.parentElement.getAttribute('data-id');
    const existe = articulosPrenda.some(prenda => prenda.id === prendaId);
    if (existe) {
      //modificacamos la cantidad
      const cantidadPrenda = articulosPrenda.map(prenda => {
        if (prenda.id === prendaId) {
          prenda.cantidad++;
          return prenda;
        } else {
          return prenda;
        }
      });
      articulosPrenda = [...cantidadPrenda];
    } else {
      articulosPrenda = [...articulosPrenda, prendaId];
    }
  }
  function openFloatWindow() {
    document.getElementById("float-window").style.display = "block";
  }

  function closeFloatWindow() {

    document.getElementById("float-window").style.display = "none";
  }
  mostrarDatos();
}