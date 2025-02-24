import {getAllEmployees} from "./crud.js"

document.addEventListener('DOMContentLoaded', () => {
    const loginButton = document.getElementById('loginButton');
    
    loginButton.addEventListener('click', async () => {
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        
        if (!username || !password) {
            alert('Por favor, completa todos los campos');
            return;
        }
        
        const empleado = await getAllEmployees();
        let ventrada = 0;
        for(let i = 0; i < empleado.length; i++) {
            if (empleado.username[i] === username && empleado.password[i] === password){
                if (empleado.admin[i]){
                    ventrada = 1;
                }else{
                    ventrada = 2;
                }
            }else if(empleado.username[i] === username && empleado.password[i] !== password){
                console.log("contraseña incorecta");
                // errorBox.innerHTML ="contraseña incorrecta"
                // errorBox.style.display = "block";

            }else {(empleado.username[i] !== username && empleado.password[i] === password)
                console.log("usuaio no valido incorecta");
            }
        }
        if (ventrada===1){
            // administrador
            console.log("administrador");
            
        }else{
            // usuario admitido
            console.log("Empleado normal");
        }
        
    });
    
    
});