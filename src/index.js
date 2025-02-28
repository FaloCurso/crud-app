import {getAllEmployees, getOneEmployee} from "./crud.js"
let vId ;

document.addEventListener('DOMContentLoaded', () => {
    const loginButton = document.getElementById('loginButton');
    
    loginButton.addEventListener('click', async () => {
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        
        if (!username || !password) {
            alert('Por favor, completa todos los campos');
            return;
        }
        
        const empleados = await getAllEmployees();
        let ventrada = 0;
        empleados.forEach(empleado => {
            if (empleado.username === username && empleado.password === password){
                if (empleado.admin){
                    ventrada = 1;
                }else{
                    ventrada = 2;
                }
            }else if (empleado.username === username && empleado.password !== password){
                console.log("contraseña incorecta");
                // errorBox.innerHTML ="contraseña incorrecta"
                // errorBox.style.display = "block";

            }else if (empleado.username !== username && empleado.password === password) {
                console.log("usuaio no valido incorecta");
            }
            
        });
        if (ventrada===1){
            // administrador
            alert("entrada como administrador");
        }else if  (ventrada ===2) {
            // usuario admitido
            alert("entrada como usuario");
        }
            // console.log(empleados.username + " " + empleados.password);

            
        
    });
    
    
});
