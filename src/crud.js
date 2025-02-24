const URLEMPLOYEES = 'http://localhost:3000/employees/';
const URLRECORDS = 'http://localhost:3000/departments/';
const FILTEREMPLOYEEID = '?employee_id=';
const URLAND = '&';
const FILTERDATE = '?date=';

//Operaciones CRUD para employees

async function getAllEmployees() {
    try {
    const response = await fetch(URLEMPLOYEES);
    const employees = await response.json();
    return employees;
    }
    catch (error){
        console.error("Error: " + error);
    }
}

async function getOneEmployee(employeeID) {
    try {
    const response = await fetch(URLEMPLOYEES + employeeID);
    const employee = await response.json();
    return employee;
    }
    catch (error){
        console.error("Error: " + error);
    }
    
}

async function createEmployee(name, surname, username, password, admin, photo) {
    try {
        const employee = await fetch(URLEMPLOYEES, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({name, surname, username, password, admin, photo})
        });
        alert('Empleado creado correctamente.');
    } catch (error) {
        console.error("Error: " + error);
    }
}

async function updateEmployee(id, name, surname, username, password, admin, photo) {
    try {
        const employee = await fetch(URLEMPLOYEES + id, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({name, surname, username, password, admin, photo})
        });
        alert('Datos actualizados correctamente.');

    } catch (error) {
        console.error("Error: " + error);
    }
}

async function deleteEmployee(id) {
    try {
        const response = await fetch(URLEMPLOYEES + id, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        alert('Empleado eliminado correctamente.');
    } catch (error) {
        console.error("Error: " + error);
    }
}



//Operaciones CRUD para record
 async function getAllRecords() {
    try {
    const response = await fetch(URLRECORDS);
    const records = await response.json();
    return records;
    }
    catch (error){
        console.error("Error: " + error);
    }

}

async function getRecordForUser(employeeId) {
    try {
        const response = await fetch(URLRECORDS + FILTEREMPLOYEEID + employeeId);
        const recordsUser = await response.json();
        return recordsUser;
    } catch (error) {
        console.error("Error: " + error);
    }
}

async function getRecordForDate(date) {
    try {
        const response = await fetch(URLRECORDS + FILTERDATE + date);
        const recordsDate = await response.json();
        return recordsDate;
    } catch (error) {
        console.error("Error: " + error);
    }
}
async function getRecordForUserAndDate(employeeId, date) {
    try {
        const response = await fetch(URLRECORDS + FILTEREMPLOYEEID + employeeId + URLAND + FILTERDATE + date);
        const recordsUserDate = await response.json();
        return recordsUserDate;
    } catch (error) {
        console.error("Error: " + error);
    }
    
}
async function createRecord(employeeId, date, e_d, entry_Time, departure_Time, worked_Hours, id) {
    try {
        const record = await fetch(URLRECORDS, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({employeeId, date, e_d, entry_Time, departure_Time, worked_Hours, id})
        });
        alert('Registro creado correctamente.');
    } catch (error) {
        console.error("Error: " + error);
    }
}

async function updateRecord(id, date, e_d, entry_Time, departure_Time, worked_Hours) {
    try {
        const record = await fetch(URLRECORDS + id, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({date, e_d, entry_Time, departure_Time, worked_Hours})
        });
        alert('Datos actualizados correctamente.');

    } catch (error) {
        console.error("Error: " + error);
    }
}

async function deleteRecord(id) {
    try {
        const record = await fetch(URLRECORDS + id, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        alert('Registro eliminado correctamente.');

    } catch (error) {
        console.error("Error: " + error);
        
    }
}
//Exportacion de metodos
export {getAllEmployees, getOneEmployee, createEmployee, updateEmployee, deleteEmployee};
export {getAllRecords, getRecordForUser, getRecordForDate, getRecordForUserAndDate, createRecord, updateRecord, deleteRecord};