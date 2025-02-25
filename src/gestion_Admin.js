import { getOneEmployee, getEmployeeByNameSurname, getAllRecords, getRecordForUser, getRecordForDate, getRecordForUserAndDate, deleteRecord } from "./crud.js";

document.addEventListener("DOMContentLoaded", () => {
    const employeeFullNameInput = document.getElementById("employeeFullName");
    const dateInput = document.getElementById("date");
    const searchButton = document.getElementById("searchButton");
    const recordsTableBody = document.getElementById("recordsTableBody");

    async function fetchRecords() {
        const records = await getAllRecords();
        displayRecords(records);
    }

    async function handleSearch() {
        let records = [];
        
        const employeeFullName = employeeFullNameInput.value.trim();
        const date = dateInput.value.trim();

        // Dividir el campo nombre del empleado para sacar por separado nombre y apellido
        const arrayFullName = employeeFullName.split(" ",2);
        const name = arrayFullName[0];
        const surname = arrayFullName[1];

        alert(name + "-" + surname);
        
        //Conseguir id del empleado por nombre y apellido
        const employeeData = await getEmployeeByNameSurname(name, surname);
        const employee = employeeData[0];

        if (!employee) {
            recordsTableBody.innerHTML = "<tr><td colspan='7'>No se encontraron registros para este empleado</td></tr>";
            return;
        }
        
        const employeeId = employee.id;

        if (employeeId && date) {
            records = await getRecordForUserAndDate(employeeId, date);
            // alert("Entrando por empleado y fecha")
        } else if (employeeId) {
            records = await getRecordForUser(employeeId);
            // alert("Entrando por empleado")
        } else if (date) {
            records = await getRecordForDate(date);
            // alert("Entrando por fecha")
        } else {
            records = await getAllRecords();
            // alert("Entrando por todos los registros")
        }

        displayRecords(records);
    }

    function dateFormat(date) {
        const [year, month, day] = date.split("-");
        return `${day}-${month}-${year}`;
    }

    async function displayRecords(records) {
        recordsTableBody.innerHTML = "";

        if (!records || !records.length) {
            recordsTableBody.innerHTML = "<tr><td colspan='7'>No se encontraron registros</td></tr>";
            return;
        }

        for (const record of records) {
            const row = document.createElement("tr");
            const employee = await getOneEmployee(record.employee_id);

            row.innerHTML = `
              <td>${record.id}</td>
              <td>${employee?.name ?? "N/A"} ${employee?.surname ?? ""}</td>
              <td>${dateFormat(record.date)}</td>
              <td>${record.entry_Time}</td>
              <td>${record.departure_Time}</td>
              <td>${record.worked_Hours}</td>
              <td><button class="delete-btn" data-id="${record.id}">Eliminar</button></td>
            `;

            recordsTableBody.appendChild(row);
        }

        document.querySelectorAll(".delete-btn").forEach(button => {
            button.addEventListener("click", async (event) => {
                const id = event.target.dataset.id;
                await deleteRecord(id);
                handleSearch(); // Volver a buscar en vez de recargar todo
            });
        });
    }

    searchButton.addEventListener("click", handleSearch);
    fetchRecords();
});