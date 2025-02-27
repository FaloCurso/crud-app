//Variables que contienen la URL del servidor y los filtros para las peticiones
const URLEMPLOYEES = "http://localhost:3000/employees/";
const URLRECORDS = "http://localhost:3000/records/";
const FILTEREMPLOYEEID = "employee_id=";
const URLAND = "&";
const URLFILTER = "?"
const FILTERDATE = "date=";
const FILTERNAME = "name=";
const FILTERSURNAME = "surname=";
const FILTERE_D = "e_d=";

//Operaciones CRUD para employees
async function getAllEmployees() {
  try {
    const response = await fetch(URLEMPLOYEES);

    if (!response.ok) {
      throw new Error(
        `Error ${response.status}: No se pudo obtener los empleados`
      );
    }

    const employees = await response.json();
    return employees;
  } catch (error) {
    console.error("Error: " + error);
    return null;
  }
};

async function getOneEmployee(employeeID) {
  try {
    const response = await fetch(URLEMPLOYEES + employeeID);
    if (!response.ok) {
      throw new Error(
        `Error ${response.status}: No se pudo obtener el empleado`
      );
    }
    const employee = await response.json();
    return employee;
  } catch (error) {
    console.error("Error: " + error);
    return null;
  };
};

async function getEmployeeByNameSurname(name, surname){
  try {
    const response = await fetch(URLEMPLOYEES + URLFILTER + FILTERNAME +  name + URLAND + FILTERSURNAME + surname);
    if (!response.ok) {
      throw new Error(
        `Error ${response.status}: No se pudo obtener el empleado`
      );
    }
    const employee = await response.json();
    return employee;
  } catch (error) {
    console.error("Error: " + error);
  }
}

async function createEmployee(name, surname, username, password, admin, photo) {
  try {
    const employee = await fetch(URLEMPLOYEES, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, surname, username, password, admin, photo }),
    });

    if (!response.ok) {
      throw new Error(
        `Error ${response.status}: No se pudo crear el empleado.`
      );
    };

    alert("Empleado creado correctamente.");
  } catch (error) {
    console.error("Error: " + error);
  }
};

async function updateEmployee(
  id,
  name,
  surname,
  username,
  password,
  admin,
  photo
) {
  try {
    const employee = await fetch(URLEMPLOYEES + id, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, surname, username, password, admin, photo }),
    });
    if (!employee.ok) {
      throw new Error(
        `Error ${response.status}: No se pudo actualizar el empleado.`
      );
    };

    const updatedEmployee = await employee.json();
    alert("Datos actualizados correctamente.");
    return updatedEmployee;
  } catch (error) {
    console.error("Error: " + error);
  };
};

async function deleteEmployee(id) {
  try {
    const response = await fetch(URLEMPLOYEES + id, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error(`Error ${response.status}: No se pudo eliminar el empleado`);
    }
    alert("Empleado eliminado correctamente.");
  } catch (error) {
    console.error("Error: " + error);
  };
};

//Operaciones CRUD para record
async function getAllRecords() {
  try {
    const response = await fetch(URLRECORDS);
    if (!response.ok) {
      throw new Error(
        `Error ${response.status}: No se pudieron obtener los registros`
      );
    };
    const records = await response.json();
    return records;
  } catch (error) {
    console.error("Error: " + error);
    return null;
  };
};

async function getRecord(id) {
  try {
    const response = await fetch(URLRECORDS + id);
    if (!response.ok) {
      throw new Error(
        `Error ${response.status}: No se pudo obterner el registro.`
      );
    };
    const record = await response.json();
    return record;
  } catch (error) {
    console.error("Error: " + error);
    return null;
  };
}

async function getRecordForUser(employeeId) {
  try {
    const response = await fetch(URLRECORDS + URLFILTER + FILTEREMPLOYEEID + employeeId);
    if (!response.ok) {
      throw new Error(
        `Error ${response.status}: No se pudieron obtener los registros por empleado.`
      );
    }
    const recordsUser = await response.json();
    return recordsUser;
  } catch (error) {
    console.error("Error: " + error);
    return null;
  };
};

async function getRecordForDate(date) {
  try {
    const response = await fetch(URLRECORDS + URLFILTER +  FILTERDATE + date);
    if (!response.ok) {
      throw new Error(
        `Error ${response.status}: No se pudo obtener los registros por fecha.`
      );
    };
    const recordsDate = await response.json();
    return recordsDate;
  } catch (error) {
    console.error("Error: " + error);
    return null;
  };
};

async function getRecordForUserAndDate(employeeId, date) {
  try {
    const response = await fetch(
      URLRECORDS + URLFILTER + FILTEREMPLOYEEID + employeeId + URLAND + FILTERDATE + date
    );
    if (!response.ok) {
      throw new Error(
        `Error ${response.status}: No se pudo obtener los registros por empleado y fecha.`
      );
    };
    const recordsUserDate = await response.json();
    return recordsUserDate;
  } catch (error) {
    console.error("Error: " + error);
    return null;
  };
};

async function getRecordForUserDateAndE_D(employeeId, date, E_D) {
  try {
    const response = await fetch(
      URLRECORDS + URLFILTER + FILTEREMPLOYEEID + employeeId + URLAND + FILTERDATE + date + URLAND + FILTERE_D + E_D
    );
    if (!response.ok) {
      throw new Error(
        `Error ${response.status}: No se pudo obtener los registros por empleado y fecha.`
      );
    };
    const recordsUserDate = await response.json();
    return recordsUserDate;
  } catch (error) {
    console.error("Error: " + error);
    return null;
  };
};

async function createRecord(
  employeeId,
  date,
  e_d,
  entry_Time,
  departure_Time,
  worked_Hours,
  id
) {
  try {
    const record = await fetch(URLRECORDS, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        employeeId,
        date,
        e_d,
        entry_Time,
        departure_Time,
        worked_Hours,
        id,
      }),
    });

    if (!record.ok) {
      throw new Error(
        `Error ${response.status}: No se pudo crear el registro.`
      );
    }
    alert("Registro creado correctamente.");
  } catch (error) {
    console.error("Error: " + error);
  };
};

async function updateRecord(
  employee_id,
  date,
  e_d,
  entry_Time,
  departure_Time,
  worked_Hours,
  id,
) {
  try {
    const record = await fetch(URLRECORDS + id, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        employee_id,
        date,
        e_d,
        entry_Time,
        departure_Time,
        worked_Hours,
        id,
      }),
    });
    if (!record.ok) {
      throw new Error(
        `Error ${record.status}: No se pudo actualizar el empleado.`
      );
    }

    const updatedRecord = await record.json();
    alert("Datos actualizados correctamente.");
    return updatedRecord;
  } catch (error) {
    console.error("Error: " + error);
  }
}


async function deleteRecord(id) {
  try {
    const record = await fetch(URLRECORDS + id, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (!record.ok) {
      throw new Error(
        `Error ${response.status}: No se pudo crear el registro.`
      );
    }
    alert("Registro eliminado correctamente.");
  } catch (error) {
    console.error("Error: " + error);
  };
};

//Exportacion de metodos
export {
  getAllEmployees,
  getOneEmployee,
  getEmployeeByNameSurname,
  createEmployee,
  updateEmployee,
  deleteEmployee,
};
export {
  getAllRecords,
  getRecord,
  getRecordForUser,
  getRecordForDate,
  getRecordForUserAndDate,
  getRecordForUserDateAndE_D,
  createRecord,
  updateRecord,
  deleteRecord,
};
