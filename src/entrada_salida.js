import {
  getOneEmployee,
  getRecordForUserAndDate,
  createRecord,
  updateRecord,
  getRecordForUserDateAndE_D,
} from "./crud.js";
// Inicializar matriz
// grabando

async function EmployeeData() {
  const params = new URLSearchParams(window.location.search);
  const p_id = params.get("id"); // Obtener ID de empleado de la URL
  document.getElementById("entrada-btn").disabled = false;
  document.getElementById("salida-btn").disabled = true;

  if (!p_id) {
    alert("No se encontró un ID de empleado en la URL.");
    return;
  }

  try {
    const employee = await getOneEmployee(p_id);
    console.log(employee.photo);
    document.getElementById("employee-photo").src = employee.photo;
    document.getElementById("employee-name").textContent = employee.name;
    const entradaBtn = document.getElementById("entrada-btn");
    const salidaBtn = document.getElementById("salida-btn");

    let fecha = new Date();
    let fechaFormato = `${fecha.getFullYear()}-${String(
      fecha.getMonth() + 1
    ).padStart(2, "0")}-${String(fecha.getDate()).padStart(2, "0")}`;

    const partes = await getRecordForUserAndDate(p_id, fechaFormato);

    if (
      partes.length === 0 ||
      (partes[0].e_d === false && partes.length === 0)
    ) {
      entradaBtn.disabled = false;
      salidaBtn.disabled = true;
    } else if (
      (partes.length === 2 && partes[1].e_d === true) ||
      (partes.length === 1 && partes[0].e_d === true)
    ) {
      entradaBtn.disabled = true;
      salidaBtn.disabled = false;
      // alert("entra el else if primero")
    } else if (partes.length === 2 && partes[1].e_d === false) {
      entradaBtn.disabled = true;
      salidaBtn.disabled = true;
    }

    entradaBtn.addEventListener("click", () =>
      registrarEntrada(p_id, fechaFormato)
    );
    // aqui estuve dos dias con un fallo (partes[0].e_d,) siempre enviaba los datos del primer parte, por eso funcionaba bien la primera vez y no la segunda
    salidaBtn.addEventListener("click", () =>
      registrarSalida(
        p_id,
        fechaFormato,
        partes[partes.length - 1].e_d,
        partes[partes.length - 1].entry_Time,
        partes[partes.length - 1].id
      )
    );

    const parteGuardado = sessionStorage.getItem("parteActivo");
    if (parteGuardado) {
      mostrarParte(JSON.parse(parteGuardado));
    }
  } catch (error) {
    console.error("Error al cargar la ficha del empleado: ", error);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  EmployeeData();

  const cerrarBtn = document.getElementById("cerrar-btn");
  if (cerrarBtn) {
    cerrarBtn.addEventListener("click", () => {
      sessionStorage.clear();
      document.getElementById("parte-info").innerHTML = "";
      document.getElementById("parte-info").style.display = "none";
      window.location.href = "index.html";
    });
  }
});

async function registrarEntrada(employee_id, fechaFormato) {
  try {
    let horaFichar = obtenerHoraActual();
    const registroData = {
      employee_id,
      date: fechaFormato,
      e_d: true,
      entry_Time: horaFichar,
      departure_Time: "",
      worked_Hours: 0,
      id: employee_id + "-" + (Math.floor(Math.random() * 1000) + 1),
    };
    // guardo el id del parte
    // agregarElemento(registroData.employee_id, registroData.id);

    await createRecord(
      registroData.employee_id,
      registroData.date,
      registroData.e_d,
      registroData.entry_Time,
      registroData.departure_Time,
      registroData.worked_Hours,
      registroData.id
    );

    mostrarParte(registroData);
    document.getElementById("entrada-btn").disabled = true;
    document.getElementById("salida-btn").disabled = false;
  } catch (error) {
    console.error("Error al registrar la entrada:", error);
  }
}

async function registrarSalida(employee_id, fechaFormato, e_d, entry_Time, id) {
  try {
    let horaSalida = obtenerHoraActual();
    let tiempo = calcularTiempo(entry_Time, horaSalida);
    //buscar el parte para fichar la salida
    // alert(`valores de busqueda ${employee_id}, la fecha ${fechaFormato} `);

    const partes = await getRecordForUserDateAndE_D(
      employee_id,
      fechaFormato,
      true
    );

    if (!partes || partes.length === 0) {
      alert("No se encontró el registro de entrada.");
      return;
    }
    // alert(`e_d entrada salida ${e_d} el record_id es ${id}`);
    // alert(`e_d entrada salida registro_data ${registroData.e_d}`);

    const registroData = {
      employee_id,
      date: fechaFormato,
      e_d: false,
      entry_Time: entry_Time,
      departure_Time: horaSalida,
      worked_Hours: tiempo,
      id: id,
    };
    await updateRecord(
      registroData.employee_id,
      registroData.date,
      registroData.e_d,
      registroData.entry_Time,
      registroData.departure_Time,
      registroData.worked_Hours,
      id
    );

    document.getElementById("entrada-btn").disabled = false;
    document.getElementById("salida-btn").disabled = true;

    mostrarParte(registroData);
  } catch (error) {
    console.error("Error al registrar la salida:", error);
  }
}

function calcularTiempo(horaInicio, horaFin) {
  let [hInicio, mInicio] = horaInicio.split(":").map(Number);
  let [hFin, mFin] = horaFin.split(":").map(Number);

  let minutosTrabajados = hFin * 60 + mFin - (hInicio * 60 + mInicio);
  if (minutosTrabajados < 0) minutosTrabajados += 24 * 60;

  let horas = String(Math.floor(minutosTrabajados / 60)).padStart(2, "0");
  let minutos = String(minutosTrabajados % 60).padStart(2, "0");

  return `${horas}:${minutos}`;
}

function obtenerHoraActual() {
  let fecha = new Date();
  return `${fecha.getHours()}:${String(fecha.getMinutes()).padStart(2, "0")}`;
}

function mostrarParte(parte) {
  let parteInfo = document.getElementById("parte-info");
  parteInfo.style.display = "block";
  // let horaActual = obtenerHoraActual();
  // let tiempoTranscurrido ;
  let estado;

  if (parte.e_d === false) {
    estado = "cerrado";
  } else {
    estado = "abierto";
  }

  // if (parte.departure_Time) {
  //     tiempoTranscurrido = calcularTiempo(parte.entry_Time, parte.departure_Time);
  // } else {
  //     tiempoTranscurrido = "0:0";
  // }

  parteInfo.innerHTML = `
    <form class="parte-form">
        <div class="form-group">
            <label>id Empleado:</label>
            <input type="text" value="${parte.employee_id}" readonly>
        </div>
        <div class="form-group">
            <label>id parte:</label>
            <input type="text" value="${parte.id}" readonly>
        </div>
        <div class="form-group">
            <label>Fecha:</label>
            <input type="text" value="${parte.date}" readonly>
        </div>
        <div class="form-group">
            <label>Estado:</label>
            <input type="text" value="${estado}" readonly>
        </div>
        <div class="form-group">
            <label>Hora de entrada:</label>
            <input type="text" value="${parte.entry_Time}" readonly>
        </div>
        <div class="form-group">
            <label>Hora salida:</label>
            <input type="text" value="${parte.departure_Time}" readonly class="readonly-input">
        </div>
        <div class="form-group">
            <label> trabajado:</label>
            <input type="text" value="${parte.worked_Hours}" readonly>
        </div>
    </form>
`;

  sessionStorage.setItem("parteActivo", JSON.stringify(parte));
}
