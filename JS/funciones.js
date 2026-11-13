
class ResiduoRPBI {
    constructor(area, tipo, peso) {
        this.area = area;
        this.tipo = tipo;
        this.peso = parseFloat(peso);
    }
}

// 2. Variables globales y conexion con el DOM
const areaHosp = document.getElementById('areaHosp');
const tipoRPBI = document.getElementById('tipoRPBI');
const pesoKg = document.getElementById('pesoKg');
const btnAgregarResiduo = document.getElementById('btnAgregarResiduo');
const listaResiduos = document.getElementById('listaResiduos');
const totPunzo = document.getElementById('totPunzo');
const totPato = document.getElementById('totPato');

// Cargar el historial desde LocalStorage o inicializar un arreglo vacio
let historialResiduos = JSON.parse(localStorage.getItem('rpbiData')) || [];

// 3. Funcion para renderizar la lista y calcular totales
function actualizarInterfaz() {
    // Limpiar la lista actual en el DOM
    listaResiduos.innerHTML = '';
    
    let sumaPunzocortantes = 0;
    let sumaPatologicos = 0;

    // Recorrer el array para inyectar elementos y sumar pesos
    historialResiduos.forEach((residuo) => {
        // Calcular totales independientes
        if (residuo.tipo === 'punzocortante') {
            sumaPunzocortantes += residuo.peso;
        } else if (residuo.tipo === 'patologico') {
            sumaPatologicos += residuo.peso;
        }

        // Crear elemento de la lista (<li>)
        const li = document.createElement('li');
        li.className = 'list-group-item d-flex justify-content-between align-items-center';
        
        // Estilos condicionales segun el tipo
        const badgeClass = residuo.tipo === 'punzocortante' ? 'bg-danger' : 'bg-warning text-dark';
        const tipoTexto = residuo.tipo === 'punzocortante' ? 'Punzocortante (Rojo)' : 'Patologico (Amarillo)';

        li.innerHTML = `
            <div>
                <strong class="text-uppercase">${residuo.area}</strong><br>
                <small class="text-muted">${tipoTexto}</small>
            </div>
            <span class="badge ${badgeClass} rounded-pill fs-6">${residuo.peso.toFixed(2)} kg</span>
        `;
        
        listaResiduos.appendChild(li);
    });

    // Actualizar las insignias (Badges) de resumen en el DOM
    totPunzo.textContent = sumaPunzocortantes.toFixed(2);
    totPato.textContent = sumaPatologicos.toFixed(2);
}

// 4. Evento para registrar un nuevo desecho
btnAgregarResiduo.addEventListener('click', () => {
    const areaVal = areaHosp.value.trim();
    const tipoVal = tipoRPBI.value;
    const pesoVal = pesoKg.value;

    // Validacion basica
    if (areaVal === '' || pesoVal === '' || pesoVal <= 0) {
        alert('Por favor, ingresa un area valida y un peso mayor a 0.');
        return;
    }

    // Instanciar el nuevo residuo
    const nuevoResiduo = new ResiduoRPBI(areaVal, tipoVal, pesoVal);
    
    // Agregar al arreglo
    historialResiduos.push(nuevoResiduo);
    
    // Persistir en LocalStorage
    localStorage.setItem('rpbiData', JSON.stringify(historialResiduos));

    // Actualizar la interfaz en tiempo real
    actualizarInterfaz();

    // Limpiar el formulario para el siguiente registro
    areaHosp.value = '';
    pesoKg.value = '';
    areaHosp.focus();
});

// 5. Renderizado inicial al cargar la pagina
document.addEventListener('DOMContentLoaded', actualizarInterfaz);