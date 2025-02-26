import {
  getOneEmployee,
  getEmployeeByNameSurname,
  getAllRecords,
  getRecordForUser,
  getRecordForDate,
  getRecordForUserAndDate,
  deleteRecord,
  updateRecord,
  getAllEmployees,
  createEmployee,
  deleteEmployee,
  updateEmployee,
} from "./crud.js";

document.addEventListener("DOMContentLoaded", () => {
  const employeeFullNameInput = document.getElementById("employeeFullName");
  const dateInput = document.getElementById("date");
  const searchButton = document.getElementById("searchButton");
  const recordsTableBody = document.getElementById("recordsTableBody");
  const employeesTableBody = document.querySelector("#employeesTableBody");
  const addEmployeeForm = document.getElementById("addEmployeeForm");

  addEmployeeForm.addEventListener("submit", async (event) => {
    event.preventDefault(); // Evita el envío por defecto del formulario

    const name = document.getElementById("name").value.trim();
    const surname = document.getElementById("surname").value.trim();
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();
    const admin = document.getElementById("admin").checked;
    const photo = document.getElementById("photo").value.trim();

    if (!name || !surname || !username || !password) {
      alert("Por favor, completa todos los campos obligatorios.");
      return;
    }

    try {
      await createEmployee(name, surname, username, password, admin, photo);
      alert("Empleado añadido correctamente.");
      addEmployeeForm.reset(); // Limpia el formulario
      fetchEmployees(); // Refresca la tabla de empleados
    } catch (error) {
      console.error("Error al añadir empleado:", error);
      alert("Hubo un error al añadir el empleado.");
    }
  });

  async function fetchRecords() {
    const records = await getAllRecords();
    displayRecords(records);
  }

  async function fetchEmployees() {
    const employees = await getAllEmployees();
    displayEmployees(employees);
  }

  async function displayEmployees(employees) {
    employeesTableBody.innerHTML = "";

    if (!employees || !employees.length) {
      employeesTableBody.innerHTML =
        "<tr><td colspan='6'>No se encontraron empleados</td></tr>";
      return;
    }

    for (const employee of employees) {
      const row = document.createElement("tr");
      row.dataset.employeeId = employee.id;
      row.innerHTML = `
   <td>${employee.id}</td>
    <td><input type="text" class="edit-name" value="${employee.name}"></td>
    <td><input type="text" class="edit-surname" value="${
      employee.surname
    }"></td>
    <td><input type="text" class="edit-username" value="${
      employee.username
    }"></td>
    <td><input type="password" class="edit-password" value="${
      employee.password
    }"></td>
    <td>
        <input type="checkbox" class="edit-admin" ${
          employee.admin ? "checked" : ""
        }>
    </td>
    <td><input type="text" class="edit-photo" value="${
      employee.photo
    }" placeholder="URL de la foto"></td>
    <td>
        <button class="save-employee-btn" data-id="${
          employee.id
        }">Guardar</button>
        <button class="delete-employee-btn" data-id="${
          employee.id
        }">Eliminar</button>
    </td>
            `;

      employeesTableBody.appendChild(row);
    }

    // Guardar cambios
    document.querySelectorAll(".save-employee-btn").forEach((button) => {
      button.addEventListener("click", async (event) => {
        const row = event.target.closest("tr");
        const employeeId = event.target.getAttribute("data-id");

        if (!employeeId) {
          console.error("Error: employeeId es undefined");
          return;
        }

        const newName = row.querySelector(".edit-name").value;
        const newSurname = row.querySelector(".edit-surname").value;
        const newUsername = row.querySelector(".edit-username").value;
        const newPassword = row.querySelector(".edit-password").value;
        const newAdmin = row.querySelector(".edit-admin").checked;
        const newPhotoUrl = row.querySelector(".edit-photo").value;

        await updateEmployee(
          employeeId,
          newName,
          newSurname,
          newUsername,
          newPassword,
          newAdmin,
          newPhotoUrl
        );
        fetchEmployees();
      });
    });

    // Eliminar empleados
    document.querySelectorAll(".delete-employee-btn").forEach((button) => {
      button.addEventListener("click", async (event) => {
        const employeeId = event.target.dataset.id;
        if (confirm("¿Seguro que deseas eliminar este empleado?")) {
          await deleteEmployee(employeeId);
          fetchEmployees();
        }
      });
    });
  }

  async function handleSearch() {
    let records = [];

    const employeeFullName = employeeFullNameInput.value.trim();
    const date = dateInput.value.trim();

    if (!employeeFullName && !date) {
      records = await getAllRecords();
    } else if (employeeFullName && date) {
      const arrayFullName = employeeFullName.split(" ", 2);
      const name = arrayFullName[0];
      const surname = arrayFullName[1] || "";
      const employeeData = await getEmployeeByNameSurname(name, surname);
      const employee = employeeData ? employeeData[0] : null;
      if (employee) {
        records = await getRecordForUserAndDate(employee.id, date);
      }
    } else if (employeeFullName) {
      const arrayFullName = employeeFullName.split(" ", 2);
      const name = arrayFullName[0];
      const surname = arrayFullName[1] || "";
      const employeeData = await getEmployeeByNameSurname(name, surname);
      const employee = employeeData ? employeeData[0] : null;
      if (employee) {
        records = await getRecordForUser(employee.id);
      }
    } else if (date) {
      records = await getRecordForDate(date);
    }

    displayRecords(records);
  }

  async function displayRecords(records) {
    recordsTableBody.innerHTML = "";

    if (!records || !records.length) {
      recordsTableBody.innerHTML =
        "<tr><td colspan='8'>No se encontraron registros</td></tr>";
      return;
    }

    for (const record of records) {
      let employeeName = "N/A";
      if (record.employee_id) {
        const employee = await getOneEmployee(record.employee_id);
        employeeName = employee
          ? `${employee.name} ${employee.surname}`
          : "N/A";
      }

      const row = document.createElement("tr");
      row.dataset.recordId = record.id;
      row.innerHTML = `
            <td class="record-id">${record.id}</td>
            <td>${employeeName}</td>
            <td><input type="date" value="${
              record.date
            }" class="edit-date"></td>
            <td><input type="time" value="${
              record.entry_Time
            }" class="edit-entry"></td>
            <td><input type="time" value="${
              record.departure_Time
            }" class="edit-departure"></td>
            <td class="worked-hours">${
              record.worked_Hours
            }</td> <!-- Se actualizará dinámicamente -->
            <td>${record.e_d ? "Sí" : "No"}</td>
            <td>
                <button class="save-btn" data-id="${record.id}">Guardar</button>
                <button class="delete-btn" data-id="${
                  record.id
                }">Eliminar</button>
            </td>
        `;

      recordsTableBody.appendChild(row);

      const entryInput = row.querySelector(".edit-entry");
      const departureInput = row.querySelector(".edit-departure");
      const workedHoursCell = row.querySelector(".worked-hours");

      // Función para calcular horas trabajadas y formatearlas en "HH:MM"
      function calculateWorkedHours() {
        const entryTime = entryInput.value;
        const departureTime = departureInput.value;

        if (entryTime && departureTime) {
          const entryDate = new Date(`1970-01-01T${entryTime}:00`);
          const departureDate = new Date(`1970-01-01T${departureTime}:00`);
          const diffMs = departureDate - entryDate;

          if (diffMs > 0) {
            const totalMinutes = Math.floor(diffMs / (1000 * 60));
            const hours = Math.floor(totalMinutes / 60);
            const minutes = totalMinutes % 60;
            const formattedHours = `${String(hours).padStart(2, "0")}:${String(
              minutes
            ).padStart(2, "0")}`;

            workedHoursCell.textContent = formattedHours; // Mostrar el formato correcto
          } else {
            workedHoursCell.textContent = "00:00";
          }
        }
      }

      // Escuchar cambios en las horas de entrada y salida
      entryInput.addEventListener("input", calculateWorkedHours);
      departureInput.addEventListener("input", calculateWorkedHours);
    }

    // Guardar los cambios
    document.querySelectorAll(".save-btn").forEach((button) => {
      button.addEventListener("click", async (event) => {
        const row = event.target.closest("tr");
        const recordId = event.target.getAttribute("data-id");

        if (!recordId) {
          console.error("Error: recordId es undefined");
          return;
        }

        const dateValue = row.querySelector(".edit-date").value;
        const employeeName = row.cells[1].textContent.trim(); // Nombre del empleado

        if (!dateValue || !employeeName) {
          console.error("Error: Falta la fecha o el nombre del empleado.");
          return;
        }

        // Obtener el empleado por nombre
        const [name, surname = ""] = employeeName.split(" ", 2);
        const employeeData = await getEmployeeByNameSurname(name, surname);
        const employee = employeeData ? employeeData[0] : null;

        if (!employee) {
          console.error("Error: No se encontró el empleado.");
          return;
        }

        const employeeId = employee.id;
        const oldRecordArray = await getRecordForUserAndDate(
          employeeId,
          dateValue
        );

        if (!oldRecordArray || oldRecordArray.length === 0) {
          console.error("No se encontró el registro.");
          return;
        }

        const oldRecord = oldRecordArray[0]; // Extraer el registro

        // Obtener valores o mantener los anteriores si no se modificaron
        const newDate = row.querySelector(".edit-date").value || oldRecord.date;
        const newEntryTime =
          row.querySelector(".edit-entry").value || oldRecord.entry_Time;
        const newDepartureTime =
          row.querySelector(".edit-departure").value ||
          oldRecord.departure_Time;
        const newWorkedHours =
          row.querySelector(".worked-hours").textContent ||
          oldRecord.worked_Hours;

        // Si se introduce una hora de salida, e_d se pone en false
        const newED = newDepartureTime ? false : oldRecord.e_d;

        await updateRecord(
          employeeId,
          newDate,
          newED,
          newEntryTime,
          newDepartureTime,
          newWorkedHours,
          recordId
        );
        fetchRecords();
      });
    });

    // Eliminar registros
    document.querySelectorAll(".delete-btn").forEach((button) => {
      button.addEventListener("click", async (event) => {
        const recordId = event.target.dataset.id;
        if (confirm("¿Seguro que deseas eliminar este registro?")) {
          await deleteRecord(recordId);
          fetchRecords();
        }
      });
    });
  }

  searchButton.addEventListener("click", handleSearch);
  fetchRecords();
  fetchEmployees();
});
