// Objeto Prestamo
function Prestamo(capital, tasaInteresAnual, años) {
    this.capital = capital;
    this.tasaInteresAnual = tasaInteresAnual;
    this.años = años;
    this.numeroPagos = años * 12;

    // Calcular la tasa de interés mensual a partir de la tasa anual
    this.tasaInteresMensual = this.tasaInteresAnual / 12 / 100;

    this.pagoMensual = 0;
    this.detalleAmortizacion = [];
    this.totalInteres = 0;
    this.totalPago = 0;

    // Calcular la cuota mensual
    this.calcularCuotaMensual = function() {
        const i = this.tasaInteresMensual;
        const n = this.numeroPagos;

        // Fórmula de la cuota mensual
        this.pagoMensual = this.capital * i * Math.pow(1 + i, n) / (Math.pow(1 + i, n) - 1);
    };

    // Generar el detalle de amortización
    this.generarDetalleAmortizacion = function() {
        let saldo = this.capital;
        let totalInteres = 0;
        let totalPago = 0;

        this.detalleAmortizacion = [];

        for (let i = 0; i < this.numeroPagos; i++) {
            const interes = saldo * this.tasaInteresMensual;
            const capital = i === this.numeroPagos - 1 ? saldo : this.pagoMensual - interes;
            saldo -= capital;

            // Asegurar que el saldo no sea negativo
            saldo = saldo < 0 ? 0 : saldo;

            totalInteres += interes;
            totalPago += this.pagoMensual;

            this.detalleAmortizacion.push({
                pagoMensual: this.pagoMensual,
                capital: capital,
                interes: interes,
                saldo: saldo
            });
        }

        this.totalInteres = totalInteres;
        this.totalPago = totalPago;

        // Usar spread para copiar el array de detalleAmortizacion
        const copiaDetalle = [...this.detalleAmortizacion];
        console.log("Copia del detalle de amortización:", copiaDetalle);
    };
}

// Validar entradas del usuario
function validarEntrada(valor, mensaje) {
    if (isNaN(valor) || valor <= 0) {
        alert(mensaje);
        return false;
    }
    return true;
}

// Mostrar resultados en el DOM
function mostrarResultados(prestamo) {
    const { capital, totalInteres, totalPago, detalleAmortizacion } = prestamo;

    document.getElementById('resultados').innerHTML = `
        <h2>Detalle del Préstamo</h2>
        <table>
            <thead>
                <tr>
                    <th>Cuota</th>
                    <th>Pago Mensual</th>
                    <th>Capital</th>
                    <th>Interés</th>
                    <th>Saldo</th>
                </tr>
            </thead>
            <tbody>
                ${detalleAmortizacion.map((pago, indice) => `
                    <tr>
                        <td>${indice + 1}</td>
                        <td>${pago.pagoMensual.toFixed(2)}</td>
                        <td>${pago.capital.toFixed(2)}</td>
                        <td>${pago.interes.toFixed(2)}</td>
                        <td>${pago.saldo.toFixed(2)}</td>
                    </tr>
                `).join('')}
            </tbody>
            <tfoot>
                <tr>
                    <td colspan="4">Total Préstamo sin Interés</td>
                    <td>${capital.toFixed(2)}</td>
                </tr>
                <tr>
                    <td colspan="4">Total Interés</td>
                    <td>${totalInteres.toFixed(2)}</td>
                </tr>
                <tr>
                    <td colspan="4">Total Préstamo con Interés</td>
                    <td>${totalPago.toFixed(2)}</td>
                </tr>
            </tfoot>
        </table>
    `;
    guardarResultados(prestamo);
}

// Guardar resultados en localStorage
function guardarResultados(prestamo) {
    localStorage.setItem('prestamoGuardado', JSON.stringify(prestamo));
}

// Cargar resultados de localStorage
function cargarResultados() {
    const prestamoGuardado = localStorage.getItem('prestamoGuardado');
    if (prestamoGuardado) {
        mostrarResultados(JSON.parse(prestamoGuardado));
    }
}

// Limpiar resultados en el DOM y localStorage
document.getElementById('limpiarResultados').addEventListener('click', function() {
    localStorage.removeItem('prestamoGuardado');
    document.getElementById('resultados').innerHTML = ''; // Limpiar el DOM
});

// Ejecutar el simulador cuando se envíe el formulario
document.getElementById('simuladorForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const capital = parseFloat(document.getElementById('capital').value);
    if (!validarEntrada(capital, "Por favor ingrese un capital válido.")) return;

    const tasaInteresAnual = parseFloat(document.getElementById('tasa').value);
    if (!validarEntrada(tasaInteresAnual, "Por favor ingrese una tasa de interés válida.")) return;

    const años = parseInt(document.getElementById('años').value);
    if (!validarEntrada(años, "Por favor ingrese una duración válida en años.")) return;

    const prestamo = new Prestamo(capital, tasaInteresAnual, años);
    prestamo.calcularCuotaMensual();
    prestamo.generarDetalleAmortizacion();

    mostrarResultados(prestamo);
});

// Cargar resultados al iniciar la página
window.onload = cargarResultados;
