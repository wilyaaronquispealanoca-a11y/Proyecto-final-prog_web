# Simulador de Compras Familiares

## Descripción

El presente proyecto consiste en una aplicación web interactiva desarrollada para analizar el impacto del aumento de precios en el presupuesto de una familia.

La aplicación permite registrar productos de consumo familiar durante diferentes meses, calcular los gastos totales, comparar la variación de precios entre períodos y visualizar mediante gráficos cómo disminuye el poder adquisitivo cuando los precios aumentan mientras el ingreso familiar permanece constante.

Todos los resultados se generan dinámicamente utilizando JavaScript y manipulación del DOM, mostrando tablas y gráficos en una única página web.

---

## Objetivos

### Objetivo General

Desarrollar una aplicación web interactiva que permita analizar la evolución de los gastos familiares y el efecto de la inflación sobre el poder adquisitivo.

### Objetivos Específicos

* Registrar productos, precios y cantidades de consumo familiar.
* Comparar precios entre diferentes meses.
* Calcular el gasto total mensual.
* Determinar el porcentaje del ingreso destinado a compras.
* Mostrar el saldo restante después de las compras.
* Visualizar gráficamente la evolución de los precios.
* Analizar la disminución del poder adquisitivo mediante gráficos comparativos.
* Aplicar manipulación del DOM para actualizar la información sin recargar la página.

---

## Tecnologías Utilizadas

* HTML5
* CSS3
* JavaScript (ES6)
* DOM (Document Object Model)
* Chart.js
* Git
* GitHub
* GitHub Pages

---

## Estructura del Proyecto

Proyecto-final-prog_web/

├── index.html

├── css/

│ └── estilos.css

├── js/

│ └── script.js

└── README.md

---

## Funcionalidades

### Gestión de Meses

* Agregar meses de análisis.
* Eliminar meses registrados.
* Registrar una cantidad ilimitada de meses.

### Gestión de Productos

* Agregar productos ilimitados por mes.
* Registrar:

  * Nombre del producto.
  * Precio.
  * Cantidad.
* Eliminar productos individualmente.

### Cálculos Automáticos

* Gasto total mensual.
* Saldo disponible.
* Porcentaje del ingreso utilizado.
* Clasificación del nivel de gasto:

  * Bajo
  * Medio
  * Alto
  * Crítico

### Comparación de Precios

La aplicación compara automáticamente los precios de un mismo producto entre meses consecutivos y calcula:

* Precio anterior.
* Precio actual.
* Porcentaje de aumento o disminución.

### Visualización Gráfica

#### Evolución del Gasto Mensual

Muestra la relación entre:

* Ingreso familiar.
* Gasto total por mes.

#### Poder Adquisitivo

Permite seleccionar un producto específico y observar:

* Variación del precio.
* Cantidad de unidades que pueden comprarse con el mismo ingreso.

---

## Caso de Estudio

La aplicación incluye un caso de prueba con datos precargados para verificar el correcto funcionamiento de los cálculos y gráficos.

Ejemplo:

Ingreso Familiar: 500 Bs

Meses:

* Enero
* Febrero
* Marzo

Productos:

* Arroz
* Aceite
* Papa

Este caso permite observar el incremento de precios y la reducción del poder adquisitivo.

---

## Cómo Ejecutar el Proyecto

1. Descargar o clonar el repositorio.

2. Abrir la carpeta del proyecto.

3. Ejecutar el archivo:

index.html

en cualquier navegador moderno.

No requiere instalación adicional ni servidor externo.

---

## Acceso Web

La aplicación se encuentra publicada mediante GitHub Pages.

(Agregar aquí el enlace generado por GitHub Pages).

---

## Autor

Wily Aaron Quispe Alanoca

Universidad Mayor de San Andres

Facultad de Ciencias Puras y Naturales

Carrera: Informatica

Materia: Programación Web I

La Paz – Bolivia

2026
