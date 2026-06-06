/* script.js - Simulador de Compras Familiares */

const contenedorMeses = document.getElementById('contenedorMeses');
const btnAgregarMes = document.getElementById('btnAgregarMes');
const btnLimpiarTodo = document.getElementById('btnLimpiarTodo');
const btnCalcular = document.getElementById('btnCalcular');
const btnCargarEjemplo = document.getElementById('btnCargarEjemplo');
const ingresoFamiliarInput = document.getElementById('ingresoFamiliar');
const mesNombreInput = document.getElementById('mesNombre');
const resultadoGeneral = document.getElementById('resultadoGeneral');
const tablaComparativa = document.getElementById('tablaComparativa');
const casosDePrueba = document.getElementById('casosDePrueba');
const productoGraficoSelect = document.getElementById('productoGrafico');
const graficoGastoCanvas = document.getElementById('graficoGasto');
const graficoPreciosCanvas = document.getElementById('graficoPrecios');

let mesIdSecuencial = 0;
let chartGasto = null;
let chartPrecios = null;

/* Corrección 2: variables para mantener el último resultado y ingreso */
let ultimoResultado = null;
let ultimoIngreso = 0;

function generarIdMes() {
  mesIdSecuencial += 1;
  return `mes-${mesIdSecuencial}`;
}

function crearTarjetaMes(nombreMes = '') {
  const idMes = generarIdMes();

  const article = document.createElement('article');
  article.className = 'card month-card';
  article.dataset.mesId = idMes;

  article.innerHTML = `
    <div class="month-card__header">
      <div class="field">
        <label>Nombre del mes</label>
        <input type="text" class="mes-nombre" value="${nombreMes}" placeholder="Ej. Enero" />
      </div>
      <button type="button" class="button--danger btn-eliminar-mes">Eliminar mes</button>
    </div>

    <div class="table-wrap">
      <table class="month-table">
        <thead>
          <tr>
            <th>Producto</th>
            <th>Precio (Bs)</th>
            <th>Cantidad</th>
            <th>Subtotal</th>
            <th>Acción</th>
          </tr>
        </thead>
        <tbody class="productos-body"></tbody>
      </table>
    </div>

    <div class="actions">
      <button type="button" class="btn-agregar-producto">Agregar producto</button>
    </div>

    <div class="month-summary" aria-live="polite"></div>
  `;

  const tbody = article.querySelector('.productos-body');
  const btnAgregarProducto = article.querySelector('.btn-agregar-producto');
  const btnEliminarMes = article.querySelector('.btn-eliminar-mes');

  btnAgregarProducto.addEventListener('click', () => {
    agregarFilaProducto(tbody);
  });

  /* Corrección 6: no vaciar el selector al eliminar un mes */
  btnEliminarMes.addEventListener('click', () => {
    article.remove();
    actualizarCasosDePrueba();
  });

  agregarFilaProducto(tbody);
  return article;
}

function agregarFilaProducto(tbody, datos = {}) {
  const tr = document.createElement('tr');
  tr.className = 'product-row';

  tr.innerHTML = `
    <td><input type="text" class="producto-nombre" placeholder="Ej. Arroz" value="${datos.nombre || ''}" /></td>
    <td><input type="number" class="producto-precio" min="0" step="0.01" placeholder="0.00" value="${datos.precio ?? ''}" /></td>
    <td><input type="number" class="producto-cantidad" min="0" step="1" placeholder="0" value="${datos.cantidad ?? ''}" /></td>
    <td class="producto-subtotal">0.00</td>
    <td><button type="button" class="button--danger btn-eliminar-producto">Quitar</button></td>
  `;

  const inputPrecio = tr.querySelector('.producto-precio');
  const inputCantidad = tr.querySelector('.producto-cantidad');
  const subtotalCell = tr.querySelector('.producto-subtotal');
  const btnEliminarProducto = tr.querySelector('.btn-eliminar-producto');

  const calcularSubtotal = () => {
    const precio = Number(inputPrecio.value) || 0;
    const cantidad = Number(inputCantidad.value) || 0;
    subtotalCell.textContent = (precio * cantidad).toFixed(2);
  };

  inputPrecio.addEventListener('input', calcularSubtotal);
  inputCantidad.addEventListener('input', calcularSubtotal);

  btnEliminarProducto.addEventListener('click', () => {
    const tbodyLocal = tr.parentElement;
    tr.remove();
    if (tbodyLocal && tbodyLocal.querySelectorAll('.product-row').length === 0) {
      agregarFilaProducto(tbodyLocal);
    }
  });

  tbody.appendChild(tr);
  calcularSubtotal();
}

function obtenerDatosMeses() {
  const ingresoFamiliar = Number(ingresoFamiliarInput.value);
  const tarjetasMes = [...contenedorMeses.querySelectorAll('.month-card')];

  const meses = tarjetasMes.map((card) => {
    const nombreMes = card.querySelector('.mes-nombre').value.trim();
    const productos = [...card.querySelectorAll('.product-row')].map((row) => {
      const nombre = row.querySelector('.producto-nombre').value.trim();
      const precio = Number(row.querySelector('.producto-precio').value);
      const cantidad = Number(row.querySelector('.producto-cantidad').value);
      return { nombre, precio, cantidad };
    });

    return { nombreMes, productos };
  });

  return { ingresoFamiliar, meses };
}

function validarDatos(ingresoFamiliar, meses) {
  if (!Number.isFinite(ingresoFamiliar) || ingresoFamiliar <= 0) {
    return 'Debes ingresar un ingreso familiar válido mayor que 0.';
  }

  if (meses.length === 0) {
    return 'Debes agregar al menos un mes.';
  }

  for (const mes of meses) {
    if (!mes.nombreMes) {
      return 'Todos los meses deben tener un nombre.';
    }

    if (mes.productos.length === 0) {
      return `El mes ${mes.nombreMes} debe tener al menos un producto.`;
    }

    for (const producto of mes.productos) {
      if (!producto.nombre) {
        return `En el mes ${mes.nombreMes} hay un producto sin nombre.`;
      }
      if (!Number.isFinite(producto.precio) || producto.precio < 0) {
        return `En el mes ${mes.nombreMes}, el producto ${producto.nombre} tiene un precio inválido.`;
      }
      if (!Number.isFinite(producto.cantidad) || producto.cantidad < 0) {
        return `En el mes ${mes.nombreMes}, el producto ${producto.nombre} tiene una cantidad inválida.`;
      }
    }
  }

  return '';
}

function clasificarGasto(porcentaje) {
  if (porcentaje <= 50) return { texto: 'Bajo', clase: 'status--bajo' };
  if (porcentaje <= 80) return { texto: 'Medio', clase: 'status--medio' };
  if (porcentaje <= 100) return { texto: 'Alto', clase: 'status--alto' };
  return { texto: 'Crítico', clase: 'status--critico' };
}

function calcularMeses(ingresoFamiliar, meses) {
  const resultados = [];

  meses.forEach((mes, index) => {
    const gastoTotal = mes.productos.reduce((acum, producto) => acum + producto.precio * producto.cantidad, 0);
    const saldo = ingresoFamiliar - gastoTotal;
    const porcentajeIngreso = (gastoTotal / ingresoFamiliar) * 100;
    const clasificacion = clasificarGasto(porcentajeIngreso);

    const productosConSubtotal = mes.productos.map((producto) => ({
      ...producto,
      subtotal: producto.precio * producto.cantidad,
    }));

    const comparacionConMesAnterior = [];
    if (index > 0) {
      const mesAnterior = meses[index - 1];
      mes.productos.forEach((productoActual) => {
        const productoAnterior = mesAnterior.productos.find(
          (p) => p.nombre.toLowerCase() === productoActual.nombre.toLowerCase()
        );

        if (productoAnterior && productoAnterior.precio > 0) {
          const aumento = ((productoActual.precio - productoAnterior.precio) / productoAnterior.precio) * 100;
          comparacionConMesAnterior.push({
            nombre: productoActual.nombre,
            precioAnterior: productoAnterior.precio,
            precioActual: productoActual.precio,
            aumento,
          });
        }
      });
    }

    resultados.push({
      nombreMes: mes.nombreMes,
      gastoTotal,
      saldo,
      porcentajeIngreso,
      clasificacion,
      productosConSubtotal,
      comparacionConMesAnterior,
    });
  });

  return resultados;
}

function crearTarjetaResultado(resultado) {
  const article = document.createElement('article');
  article.className = `card result-card ${resultado.clasificacion.clase}`;

  article.innerHTML = `
    <h3>${resultado.nombreMes}</h3>
    <p><strong>Gasto total:</strong> Bs ${resultado.gastoTotal.toFixed(2)}</p>
    <p><strong>Saldo restante:</strong> Bs ${resultado.saldo.toFixed(2)}</p>
    <p><strong>Uso del ingreso:</strong> ${resultado.porcentajeIngreso.toFixed(2)}%</p>
    <p><strong>Clasificación:</strong> ${resultado.clasificacion.texto}</p>
  `;

  return article;
}

function crearTablaComparativa(resultados) {
  if (resultados.length === 0) {
    tablaComparativa.innerHTML = '';
    return;
  }

  let html = '<h3>Comparación de precios entre meses</h3>';
  let hayDatos = false;

  resultados.forEach((resultado) => {
    if (resultado.comparacionConMesAnterior.length > 0) {
      hayDatos = true;
      html += `<h4>${resultado.nombreMes}</h4>`;
      html += `
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Producto</th>
                <th>Precio anterior</th>
                <th>Precio actual</th>
                <th>Aumento %</th>
              </tr>
            </thead>
            <tbody>
      `;

      resultado.comparacionConMesAnterior.forEach((item) => {
        const claseAumento = item.aumento >= 0 ? 'positive' : 'negative';
        html += `
          <tr>
            <td>${item.nombre}</td>
            <td>Bs ${item.precioAnterior.toFixed(2)}</td>
            <td>Bs ${item.precioActual.toFixed(2)}</td>
            <td class="${claseAumento}">${item.aumento.toFixed(2)}%</td>
          </tr>
        `;
      });

      html += `
            </tbody>
          </table>
        </div>
      `;
    }
  });

  if (!hayDatos) {
    html = '<p class="note">Agrega al menos dos meses con productos iguales para ver la comparación de precios.</p>';
  }

  tablaComparativa.innerHTML = html;
}

function actualizarSelectorProductos(resultados) {
  const productosUnicos = new Set();

  resultados.forEach((resultado) => {
    resultado.productosConSubtotal.forEach((producto) => {
      productosUnicos.add(producto.nombre);
    });
  });

  const productos = [...productosUnicos].sort((a, b) => a.localeCompare(b, 'es'));
  const productoActual = productoGraficoSelect.value;

  productoGraficoSelect.innerHTML = '<option value="">Selecciona un producto</option>';

  productos.forEach((producto) => {
    const option = document.createElement('option');
    option.value = producto;
    option.textContent = producto;
    productoGraficoSelect.appendChild(option);
  });

  if (productos.includes(productoActual)) {
    productoGraficoSelect.value = productoActual;
  } else if (productos.length > 0) {
    productoGraficoSelect.value = productos[0];
  }
}

function destruirGraficos() {
  if (chartGasto) {
    chartGasto.destroy();
    chartGasto = null;
  }
  if (chartPrecios) {
    chartPrecios.destroy();
    chartPrecios = null;
  }
}

function dibujarGraficos(resultados, ingresoFamiliar) {
  destruirGraficos();

  if (!resultados.length) return;

  const etiquetasMeses = resultados.map((r) => r.nombreMes);
  const gastos = resultados.map((r) => Number(r.gastoTotal.toFixed(2)));
  const ingresos = resultados.map(() => Number(ingresoFamiliar.toFixed(2)));

  chartGasto = new Chart(graficoGastoCanvas, {
    type: 'line',
    data: {
      labels: etiquetasMeses,
      datasets: [
        {
          label: 'Gasto total',
          data: gastos,
          borderWidth: 2,
          tension: 0.3,
        },
        {
          label: 'Ingreso familiar',
          data: ingresos,
          borderWidth: 2,
          tension: 0.3,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'bottom' },
      },
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Bs',
          },
        },
      },
    },
  });

  /* Corrección 7: no dibujar si no hay producto seleccionado */
  const productoSeleccionado = productoGraficoSelect.value;
  if (!productoSeleccionado) {
    return;
  }

  const resultadosConProducto = resultados.map((resultado) => {
    const producto = resultado.productosConSubtotal.find(
      (p) => p.nombre.toLowerCase() === productoSeleccionado.toLowerCase()
    );
    return producto || null;
  });

  const precios = resultadosConProducto.map((p) => (p ? Number(p.precio.toFixed(2)) : null));
  const poderAdquisitivo = resultadosConProducto.map((p) => (p && p.precio > 0 ? Number((ingresoFamiliar / p.precio).toFixed(2)) : null));

  chartPrecios = new Chart(graficoPreciosCanvas, {
    type: 'line',
    data: {
      labels: etiquetasMeses,
      datasets: [
        {
          label: productoSeleccionado ? `Precio del producto: ${productoSeleccionado}` : 'Precio del producto',
          data: precios,
          borderWidth: 2,
          tension: 0.3,
        },
        {
          label: 'Poder adquisitivo (unidades comprables)',
          data: poderAdquisitivo,
          borderWidth: 2,
          tension: 0.3,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'bottom' },
      },
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });
}

/* Corrección 4: función para actualizar solo el gráfico del producto */
function actualizarGraficoProducto() {
  if (!ultimoResultado) return;
  dibujarGraficos(ultimoResultado, ultimoIngreso);
}

function mostrarResultados() {
  const { ingresoFamiliar, meses } = obtenerDatosMeses();
  const error = validarDatos(ingresoFamiliar, meses);

  if (error) {
    resultadoGeneral.innerHTML = `
      <article class="card status--critico">
        <h3>Revisión necesaria</h3>
        <p>${error}</p>
      </article>
    `;
    tablaComparativa.innerHTML = '';
    destruirGraficos();
    return;
  }

  const resultados = calcularMeses(ingresoFamiliar, meses);

  resultadoGeneral.innerHTML = '';
  resultados.forEach((resultado) => {
    resultadoGeneral.appendChild(crearTarjetaResultado(resultado));
  });

  crearTablaComparativa(resultados);
  actualizarSelectorProductos(resultados);

  /* Corrección 3: guardar último resultado e ingreso antes de dibujar */
  ultimoResultado = resultados;
  ultimoIngreso = ingresoFamiliar;

  dibujarGraficos(resultados, ingresoFamiliar);
}

function limpiarTodo() {
  ingresoFamiliarInput.value = '';
  mesNombreInput.value = '';
  contenedorMeses.innerHTML = '';
  resultadoGeneral.innerHTML = '';
  tablaComparativa.innerHTML = '';
  casosDePrueba.innerHTML = '';
  productoGraficoSelect.innerHTML = '<option value="">Selecciona un producto</option>';
  destruirGraficos();
}

function cargarCasoDeEstudio() {
  limpiarTodo();
  ingresoFamiliarInput.value = '500';

  const mes1 = crearTarjetaMes('Enero');
  contenedorMeses.appendChild(mes1);
  const tbody1 = mes1.querySelector('.productos-body');
  tbody1.innerHTML = '';
  agregarFilaProducto(tbody1, { nombre: 'Arroz', precio: 8, cantidad: 10 });
  agregarFilaProducto(tbody1, { nombre: 'Aceite', precio: 12, cantidad: 4 });
  agregarFilaProducto(tbody1, { nombre: 'Papa', precio: 7, cantidad: 8 });

  const mes2 = crearTarjetaMes('Febrero');
  contenedorMeses.appendChild(mes2);
  const tbody2 = mes2.querySelector('.productos-body');
  tbody2.innerHTML = '';
  agregarFilaProducto(tbody2, { nombre: 'Arroz', precio: 11, cantidad: 10 });
  agregarFilaProducto(tbody2, { nombre: 'Aceite', precio: 18, cantidad: 4 });
  agregarFilaProducto(tbody2, { nombre: 'Papa', precio: 10, cantidad: 8 });

  const mes3 = crearTarjetaMes('Marzo');
  contenedorMeses.appendChild(mes3);
  const tbody3 = mes3.querySelector('.productos-body');
  tbody3.innerHTML = '';
  agregarFilaProducto(tbody3, { nombre: 'Arroz', precio: 13, cantidad: 10 });
  agregarFilaProducto(tbody3, { nombre: 'Aceite', precio: 20, cantidad: 4 });
  agregarFilaProducto(tbody3, { nombre: 'Papa', precio: 12, cantidad: 8 });

  mostrarResultados();
}

function actualizarCasosDePrueba() {
  casosDePrueba.innerHTML = `
    <div class="case-item">
      <strong>Ejemplo:</strong> Ingreso de 500 Bs, meses Enero y Febrero, comparar aumento de arroz, aceite y papa.
    </div>
  `;
}

btnAgregarMes.addEventListener('click', () => {
  const nombreMes = mesNombreInput.value.trim();
  const nuevaTarjeta = crearTarjetaMes(nombreMes);
  contenedorMeses.appendChild(nuevaTarjeta);
  mesNombreInput.value = '';
  actualizarCasosDePrueba();
});

btnLimpiarTodo.addEventListener('click', limpiarTodo);
btnCalcular.addEventListener('click', mostrarResultados);
btnCargarEjemplo.addEventListener('click', cargarCasoDeEstudio);

/* Corrección 5: listener del selector ahora solo actualiza el gráfico */
productoGraficoSelect.addEventListener('change', () => {
  actualizarGraficoProducto();
});

document.addEventListener('DOMContentLoaded', () => {
  actualizarCasosDePrueba();
});


