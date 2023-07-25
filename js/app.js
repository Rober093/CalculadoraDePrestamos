/* ----- CODIGO REALIZADO POR ROBERTO CORDOVA  ------
  -----  INGRESA A MI WEB WWW.ROBERTOCANJURA.COM
  -----  DONACIONES PARA SEGUIR CON PROYECTOS LIBRES

*/


// Declarar variable global para rastrear si la tabla de amortización ha sido generada
let tablaGenerada = false;

function generarTablaAmortizacion() {
    const montoPrestamo = parseFloat(document.getElementById('montoPrestamo').value);
    const tasaInteres = parseFloat(document.getElementById('tasaInteres').value) / 100;
    const plazoEnAnios = parseFloat(document.getElementById('plazoEnAnios').value);

    const inputs = document.querySelectorAll('.validar-campo');
    let campoVacio = false;

    inputs.forEach((input) => {
        if (input.value.trim() === '') {
            campoVacio = true;
            mostrarMensajeError(input, 'Este campo no puede estar vacío.');
        } else {
            ocultarMensajeError(input);
        }
    });

    if (campoVacio) {
        return;
    }

    const tasaMensual = tasaInteres / 12;
    const numCuotas = plazoEnAnios * 12; // Convertir plazo en años a cuotas mensuales
    const cuotaMensual = montoPrestamo * (tasaMensual) / (1 - Math.pow(1 + tasaMensual, -numCuotas));

    let saldoPendiente = montoPrestamo;
    const tablaAmortizacion = document.getElementById('tablaAmortizacion');
    tablaAmortizacion.innerHTML = `
            <div class="grid grid-cols-6 gap-4 font-semibold">
                <div class="border px-4 py-2">Cuota</div>
                <div class="border px-4 py-2">Saldo Inicial</div>
                <div class="border px-4 py-2">Interés</div>
                <div class="border px-4 py-2">Amortización</div>
                <div class="border px-4 py-2">Cuota Mensual</div>
                <div class="border px-4 py-2">Saldo Restante</div>
            </div>
        `;

    for (let cuota = 1; cuota <= numCuotas; cuota++) {
        const interesMensual = saldoPendiente * tasaMensual;
        const capitalMensual = cuotaMensual - interesMensual;
        const saldoInicialCuota = saldoPendiente; // Almacenar el saldo inicial antes de restar la amortización
        saldoPendiente -= capitalMensual; // Actualizar el saldo pendiente después de cada cuota

        const fila = document.createElement('div');
        fila.classList.add('grid', 'grid-cols-6', 'gap-4');
        fila.innerHTML = `
                <div class="border px-4 py-2">${cuota}</div>
                <div class="border px-4 py-2">${saldoInicialCuota.toFixed(2)}</div>
                <div class="border px-4 py-2">${interesMensual.toFixed(2)}</div>
                <div class="border px-4 py-2">${capitalMensual.toFixed(2)}</div>
                <div class="border px-4 py-2">${cuotaMensual.toFixed(2)}</div>
                <div class="border px-4 py-2">${saldoPendiente >= 0 ? saldoPendiente.toFixed(2) : '0.00'}</div>
            `;

        tablaAmortizacion.appendChild(fila);
    }

    // Establecer tablaGenerada en true después de generar la tabla
    tablaGenerada = true;
}

// Restablecer los valores de los inputs y borrar la tabla de amortización
function borrarDatos() {
    document.getElementById('montoPrestamo').value = '';
    document.getElementById('tasaInteres').value = '';
    document.getElementById('plazoEnAnios').value = '';
    document.getElementById('tablaAmortizacion').innerHTML = '';

    // Ocultar todos los mensajes de error
    const inputs = document.querySelectorAll('.validar-campo');
    inputs.forEach((input) => {
        ocultarMensajeError(input);
    });

    // Establecer tablaGenerada en false después de borrar la tabla
    tablaGenerada = false;
}

// Función para mostrar un mensaje de error debajo del campo de entrada
function mostrarMensajeError(input, mensaje) {
    const errorDiv = document.createElement('div');
    errorDiv.classList.add('text-red-500', 'text-sm', 'mt-1');
    errorDiv.innerText = mensaje;
    input.parentNode.appendChild(errorDiv);
}

// Función para ocultar el mensaje de error debajo del campo de entrada
function ocultarMensajeError(input) {
    const errorDiv = input.parentNode.querySelector('.text-red-500');
    if (errorDiv) {
        errorDiv.remove();
    }
}

// Función para descargar la tabla de amortización en formato PDF
function descargarPDF() {
    if (tablaGenerada) {
        const tablaAmortizacion = document.getElementById('tablaAmortizacion');

        // Configuración para generar el PDF
        const opt = {
            margin: 10,
            filename: 'tabla_amortizacion.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };

        // Generar el PDF a partir del contenido HTML de la tabla de amortización
        html2pdf().from(tablaAmortizacion).set(opt).save();
    } else {
        alert('Primero debes generar datos para la tabla de amortización.');
    }
}