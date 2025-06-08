
const paramInputs = {
  binomial: [
    { id: "n", label: "Número de ensayos (n)", type: "number", value: 10 },
    { id: "p", label: "Probabilidad de éxito (p)", type: "number", value: 0.5 }
  ],
  exponential: [
    { id: "scale", label: "Escala (1/λ)", type: "number", value: 1.0 }
  ],
  poisson: [
    { id: "lam", label: "Lambda (λ)", type: "number", value: 4.0 }
  ],
  bernoulli: [
    { id: "p", label: "Probabilidad de éxito (p)", type: "number", value: 0.5 }
  ],
  multinomial: [
    { id: "n", label: "Número total de ensayos (n)", type: "number", value: 10 },
    { id: "pvals", label: "Probabilidades separadas por coma", type: "text", value: "0.2,0.3,0.5" }
  ],
  geometric: [
    { id: "p", label: "Probabilidad de éxito (p)", type: "number", value: 0.5 }
  ],
  hypergeometric: [
    { id: "ngood", label: "Elementos buenos (ngood)", type: "number", value: 10 },
    { id: "nbad", label: "Elementos malos (nbad)", type: "number", value: 5 },
    { id: "nsample", label: "Tamaño de muestra", type: "number", value: 5 }
  ],
  uniform: [
    { id: "low", label: "Límite inferior", type: "number", value: 0 },
    { id: "high", label: "Límite superior", type: "number", value: 10 }
  ]
};

const distDescriptions = {
  binomial: `🔹 <strong>Distribución Binomial</strong><br>
La distribución binomial modela el número de éxitos que se obtienen al repetir un experimento de tipo sí/no (como lanzar una moneda) un número fijo de veces, donde cada intento tiene la misma probabilidad de éxito. Es adecuada cuando se quiere analizar la cantidad de veces que ocurre un evento dentro de una serie de ensayos independientes, como por ejemplo, cuántas veces se obtiene “cara” al lanzar una moneda 10 veces. Fue desarrollada formalmente por Jacob Bernoulli en el siglo XVII.`,
  exponential: `🔹 <strong>Distribución Exponencial</strong><br>
La distribución exponencial se utiliza para modelar el tiempo entre eventos que ocurren de forma continua e independiente a una tasa constante, como el tiempo que pasa entre llegadas de clientes a un mostrador o entre fallas en una máquina. Su parámetro principal es la tasa de ocurrencia (λ), y es una de las distribuciones más comunes en estudios de procesos estocásticos, confiabilidad y tiempos de espera.`,
  poisson: `🔹 <strong>Distribución de Poisson</strong><br>
La distribución de Poisson describe el número de veces que ocurre un evento en un intervalo fijo de tiempo o espacio, bajo la suposición de que los eventos son raros, independientes y ocurren a una tasa promedio constante. Se utiliza, por ejemplo, para modelar la cantidad de llamadas que recibe una central telefónica en una hora. Fue introducida por el matemático francés Simeon Denis Poisson en 1837.`,
  bernoulli: `🔹 <strong>Distribución de Bernoulli</strong><br>
La distribución de Bernoulli representa el resultado de un experimento que solo puede tener dos posibles salidas: éxito (1) o fracaso (0). Es la base de muchas otras distribuciones y se usa en situaciones simples como evaluar si una bombilla funciona o no. Su único parámetro es la probabilidad de éxito 
p, y fue nombrada en honor a Jacob Bernoulli.`,
  multinomial: `🔹 <strong>Distribución Multinomial</strong><br>
La distribución multinomial es una generalización de la distribución binomial a más de dos posibles resultados por ensayo. Se utiliza para modelar el número de ocurrencias de cada categoría en un conjunto de ensayos independientes, como contar cuántos productos de diferentes tipos se venden en un día. Es útil en problemas de clasificación o conteo con múltiples clases.`,
  geometric: `🔹 <strong>Distribución Geométrica</strong><br>
La distribución geométrica modela el número de intentos necesarios para obtener el primer éxito en una secuencia de ensayos de Bernoulli independientes. Por ejemplo, si estamos lanzando un dado hasta que salga un seis, la distribución geométrica nos da la probabilidad de que esto ocurra en el primer, segundo, tercer intento, etc. Tiene un único parámetro: la probabilidad de éxito 
p.`,
  hypergeometric: `🔹 <strong>Distribución Hipergeométrica</strong><br>
La distribución hipergeométrica describe la probabilidad de obtener cierto número de éxitos al seleccionar una muestra sin reemplazo de una población finita que contiene un número fijo de éxitos y fracasos. A diferencia de la binomial, aquí las probabilidades cambian con cada extracción. Es común en problemas de muestreo, como sacar bolas de una urna sin devolverlas.`,
  uniform: `🔹 <strong>Distribución Uniforme</strong><br>
La distribución uniforme describe una situación en la que todos los valores dentro de un intervalo específico tienen la misma probabilidad de ocurrir. En su versión continua, puede modelar fenómenos como el tiempo de llegada aleatorio de un cliente dentro de un horario; en su versión discreta, puede aplicarse a resultados igualmente probables, como lanzar un dado justo. Es una de las distribuciones más sencillas y fundamentales.`
};

let chart, curveChart;

window.addEventListener("DOMContentLoaded", () => {
  updateParams();
  document.getElementById("modeToggle").addEventListener("click", () => {
    document.getElementById("body").classList.toggle("dark-mode");
  });
  document.getElementById("distribution").addEventListener("change", updateParams);
});

function updateParams() {
  const dist = document.getElementById("distribution").value;
  document.getElementById("description").innerHTML = distDescriptions[dist] || "";
  const paramDiv = document.getElementById("parameters");
  paramDiv.innerHTML = "";
  paramInputs[dist].forEach(input => {
    const wrapper = document.createElement("div");
    wrapper.className = "mb-3";
    const label = document.createElement("label");
    label.className = "form-label";
    label.htmlFor = input.id;
    label.innerText = input.label;
    const field = document.createElement("input");
    field.className = "form-control";
    field.type = input.type;
    field.id = input.id;
    field.value = input.value;
    wrapper.appendChild(label);
    wrapper.appendChild(field);
    paramDiv.appendChild(wrapper);
  });
}

async function generate() {
  const dist = document.getElementById("distribution").value;
  const size = parseInt(document.getElementById("size").value);
  const params = {};
  paramInputs[dist].forEach(input => {
    const value = document.getElementById(input.id).value;
    params[input.id] = (input.id === "pvals")
      ? value.split(',').map(Number)
      : parseFloat(value);
  });

  const response = await fetch("https://backend-simulator-distributions-api.onrender.com", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ type: dist, params, size })
  });

  const data = await response.json();
  const values = data.values.flat();

  const counts = values.reduce((acc, val) => {
    acc[val] = (acc[val] || 0) + 1;
    return acc;
  }, {});

  const labels = Object.keys(counts).sort((a, b) => a - b);
  const freqs = labels.map(l => counts[l]);

  if (chart) chart.destroy();
  const ctx = document.getElementById("chart").getContext("2d");
  chart = new Chart(ctx, {
    type: "bar",
    data: {
      labels,
      datasets: [{
        label: `Frecuencia`,
        data: freqs,
        backgroundColor: "rgba(54, 162, 235, 0.6)"
      }]
    },
    options: {
      responsive: true,
      scales: {
        x: { title: { display: true, text: "Valores" } },
        y: { title: { display: true, text: "Frecuencia" } }
      }
    }
  });

  if (curveChart) curveChart.destroy();
  const allValues = values.map(Number).sort((a, b) => a - b);
  const min = Math.min(...allValues);
  const max = Math.max(...allValues);
  const bins = 50;
  const step = (max - min) / bins;
  const density = [];
  const x_vals = [];

  for (let i = 0; i <= bins; i++) {
    const x = min + i * step;
    x_vals.push(x);
    let sum = 0;
    for (const v of allValues) {
      const u = (x - v) / step;
      sum += Math.exp(-0.5 * u * u);
    }
    density.push(sum / (allValues.length * Math.sqrt(2 * Math.PI)));
  }

  const curveCtx = document.getElementById("curveChart").getContext("2d");
  curveChart = new Chart(curveCtx, {
    type: "line",
    data: {
      labels: x_vals,
      datasets: [{
        label: "Curva suavizada (KDE)",
        data: density,
        borderColor: "black",
        borderWidth: 2,
        fill: false,
        tension: 0.4
      }]
    },
    options: {
      responsive: true,
      scales: {
        x: { title: { display: true, text: "x" } },
        y: { title: { display: true, text: "Densidad" } }
      }
    }
  });
}
