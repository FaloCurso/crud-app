import {getOneEmployee, getRecordForUserAndDate} from "./crud.js"

async function EmployeeData(employee) {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");  // Obtener id de la URL

    if (!id) {
        alert("No se encontró un ID de empleado en la URL.");
        return;
    }
    try{
        const employee = await getOneEmployee(id);
        console.log(employee);
         if (!employee) {
            alert("Empleado no encontrado.");
            return;
        }
        //mostrar datos del empleado
        document.getElementById('employee-photo').src = employee.photo;
        document.getElementById('employee-name').textContent = employee.name;
        // prepar una variable con el formatode fecha deseado
        let fecha = new Date();
        let yyyy = fecha.getFullYear();
        let mm = String(fecha.getMonth() + 1).padStart(2, "0");
        let dd = String(fecha.getDate()).padStart(2, "0");
        let fechaFormato = `${dd}/${mm}/${yyyy}`;

        alert(fechaFormato);
        
        // mirar si el empleado tiene partes de trabajo
        


        const partes = await getRecordForUserAndDate(employee.id, fechaFormato);
        console.log(partes);
        



    }catch (error){
        alert(`El empleado no se pudo  cargar en el formulario: ${error.message}`);
        console.error('Error al cargar la ficha del empleado:', error);
    }


}
//se ejecute automáticamente cuando el documento HTML ha terminado de cargarse completamente
document.addEventListener("DOMContentLoaded", EmployeeData); 
