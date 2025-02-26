import { getOneEmployee, getRecordForUserAndDate, createRecord, updateRecord } from "./crud.js";

const partesActivos = []; // Almacena los partes activos de los empleados

async function EmployeeData() {
    const params = new URLSearchParams(window.location.search);
    const p_id = params.get("id"); // Obtener ID de empleado de la URL
    document.getElementById("entrada-btn").disabled = true;
    document.getElementById("salida-btn").disabled = false;

    if (!p_id) {
        alert("No se encontró un ID de empleado en la URL.");
        return;
    }

    try {
        const employee = await getOneEmployee(p_id);
        console.log(employee);
        console.timeLog(partesActivos)
        // Mostrar datos del empleado
        document.getElementById("employee-photo").src = employee.photo;
        document.getElementById("employee-name").textContent = employee.name;

        // Obtener fecha y hora actual
        let fecha = new Date();
        let yyyy = fecha.getFullYear();
        let mm = String(fecha.getMonth() + 1).padStart(2, "0");
        let dd = String(fecha.getDate()).padStart(2, "0");
        let fechaFormato = `${yyyy}/${mm}/${dd}`;

        let horas = fecha.getHours();
        let minutos = fecha.getMinutes();
        minutos = minutos < 10 ? "0" + minutos : minutos;
        let horaFichar = `${horas}:${minutos}`;
        console.log(p_id);
        console.log(fechaFormato);

        // Buscar si el empleado ya tiene un parte activo
        //no hace bien el filtro
        const partes = await getRecordForUserAndDate(p_id, fechaFormato);
        console.log(partes);
        console.log(partes.e_d);
        
        const entradaBtn = document.getElementById("entrada-btn");
        const salidaBtn = document.getElementById("salida-btn");
        const parteInfo = document.getElementById("parte-info");
        if( partes.length === 0){
            entradaBtn.disabled = false;
            salidaBtn.disabled = true;

        }
        else if (partes.employeeId === p_id && partes.date === fechaFormato && partes.e_d === true) {
            // Ya tiene un parte, solo permitir fichar la salida
            entradaBtn.disabled = true;
            salidaBtn.disabled = false;

            let parte = partes[0];
            let horaActual = `${horas}:${minutos}`;
            let tiempoTranscurrido = calcularTiempo(parte.entry_Time, horaActual);
           console.log(parte);
           mostrarParte(parte);
        } else if ((partes.employeeId === p_id && partes.date === fechaFormato && partes.e_d === false)){
            // No tiene parte, permitir fichar la entrada
            entradaBtn.disabled = false;
            salidaBtn.disabled = true;

        }

        entradaBtn.addEventListener("click", () => {
            registrarEntrada(employee.id, fechaFormato, horaFichar);
        });

        salidaBtn.addEventListener("click", () => {
            registrarSalida(employee.id, fechaFormato);
        });

    } catch (error) {
        console.error("Error al cargar la ficha del empleado: " + error);
    }
}

// Se ejecuta automáticamente cuando el documento HTML ha terminado de cargarse completamente
document.addEventListener("DOMContentLoaded", () => {
    EmployeeData();

    // Evento para cerrar sesión
    const cerrarBtn = document.getElementById("cerrar-btn");
    if (cerrarBtn) {
        cerrarBtn.addEventListener("click", () => {
            localStorage.clear();
            sessionStorage.clear();
            document.getElementById("parte-info").innerHTML = ""; // Limpiar formulario
            partesActivos.length = 0; // Limpiar la matriz de partes activos
            window.location.href = "index.html";
        });
    } else {
        console.error("El botón de cerrar sesión no se encontró en el DOM.");
    }
});

// Función para registrar la entrada
async function registrarEntrada(employeeId, fechaFormato, horaEntrada) {
    try {
        // Comprobar si el empleado ya tiene un parte activo
        if (partesActivos.some(p => p.employeeId === employeeId)) {
            alert("Ya tienes una entrada registrada.");
            return;
        }

        const registroData = {
            employeeId,
            date: fechaFormato,
            e_d: true,
            entry_Time: horaEntrada,
            departure_Time: "",
            worked_Hours: 0,
            id: employeeId + "-" + (Math.floor(Math.random() * 1000) + 1)
        };

        
        await createRecord(
            registroData.employeeId,
            registroData.date,
            registroData.e_d,
            registroData.entry_Time,
            registroData.departure_Time,
            registroData.worked_Hours,
            registroData.id
        );
        
        // Agregar a la lista de partes activos
        partesActivos.push(employeeId);

        console.log("Entrada registrada:", registroData);
        alert("Entrada registrada correctamente.");

        // Deshabilitar botón de entrada y habilitar el de salida
        document.getElementById("entrada-btn").disabled = true;
        document.getElementById("salida-btn").disabled = false;


    } catch (error) {
        console.error("Error al registrar la entrada:", error);
    }
}

// Función para registrar la salida
async function registrarSalida(employeeId, fechaFormato) {
    try {
        // Buscar el parte activo del empleado
        

        // Obtener la hora actual para la salida
        let fecha = new Date();
        let horas = fecha.getHours();
        let minutos = fecha.getMinutes();
        minutos = minutos < 10 ? "0" + minutos : minutos;
        let horaSalida = `${horas}:${minutos}`;


        // Buscar el parte del empleado
        const partes = await getRecordForUserAndDate(employeeId, fechaFormato);
        if (!partes || partes.length === 0) {
            alert("No se encontró el registro de entrada.");
            return;
        }

        const parte = partes[0];

        // Calcular horas trabajadas
        const [hEntrada, mEntrada] = parte.entry_Time.split(":").map(Number);
        const [hSalida, mSalida] = horaSalida.split(":").map(Number);
        let workedHours = (hSalida - hEntrada) + ((mSalida - mEntrada) / 60);
        workedHours = workedHours.toFixed(2);

        // Actualizar estado y registrar salida
        await updateRecord(
            employeeId,
            parte.date,
            false, // Cambiar estado a "salida"
            parte.entry_Time,
            horaSalida,
            workedHours,
            parte.id
        );

        // Eliminar de la lista de partes activos
        partesActivos.splice(parteIndex, 1);

        console.log("Salida registrada:", { employeeId, horaSalida, workedHours });
        alert("Salida registrada correctamente.");

        // Habilitar el botón de entrada y deshabilitar el de salida
        document.getElementById("entrada-btn").disabled = false;
        document.getElementById("salida-btn").disabled = true;

    } catch (error) {
        console.error("Error al registrar la salida:", error);
    }
}
function calcularTiempo(horaInicio, horaFin) {
    let [hInicio, mInicio] = horaInicio.split(":").map(Number);
    let [hFin, mFin] = horaFin.split(":").map(Number);
    let minutosTrabajados = (hFin * 60 + mFin) - (hInicio * 60 + mInicio);
    let horas = Math.floor(minutosTrabajados / 60);
    let minutos = minutosTrabajados % 60;
    return `${horas}h ${minutos}m`;
}
function mostrarParte(parte){
     //mostrar parte
     parteInfo.innerHTML = `
     <form style="display: flex; flex-direction: column; gap: 10px; max-width: 300px;">
        <div style="display: flex; justify-content: space-between;">
             <label>id Empleado:</label>
             <input type="text" value="${parte.employee_id}" readonly>
         </div>
         <div style="display: flex; justify-content: space-between;">
             <label>id parte:</label>
             <input type="text" value="${parte.id}" readonly>
         </div>
         <div style="display: flex; justify-content: space-between;">
             <label>Fecha:</label>
             <input type="text" value="${parte.date}" readonly>
         </div>
         <div style="display: flex; justify-content: space-between;">
             <label>Hora de entrada:</label>
             <input type="text" value="${parte.entry_Time}" readonly>
         </div>
         <div style="display: flex; justify-content: space-between;">
             <label>Hora actual:</label>
             <input type="text" value="${horaActual}" readonly>
         </div>
         <div style="display: flex; justify-content: space-between;">
             <label>Tiempo:</label>
             <input type="text" value="${tiempoTranscurrido}" readonly>
         </div>
     </form>
 `;
}