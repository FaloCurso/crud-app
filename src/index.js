import { getAllEmployees, getOneEmployee } from "./crud.js";
let vId;

document.addEventListener("DOMContentLoaded", () => {
  const loginButton = document.getElementById("loginButton");

  loginButton.addEventListener("click", async () => {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    if (!username || !password) {
      alert("Por favor, completa todos los campos");
      return;
    }

    const empleados = await getAllEmployees();
    let ventrada = 0;
    empleados.forEach((empleado) => {
      if (empleado.username === username && empleado.password === password) {
        vId = empleado.id; // para pasarlo como argumento en la página que vamos abrir
        if (empleado.admin) {
          ventrada = 1;
        } else {
          ventrada = 2;
        }
      }
    });
    if (ventrada === 1) {
      // administrador
      // alert("entrada como administrador");
      window.location.href = `gestion_Admin.html?id=${vId}`;
    } else if (ventrada === 2) {
      // usuario admitido
      // alert("entrada como usuario");
      window.location.href = `entrada_Salida.html?id=${vId}`;
    } else {
      alert("contraseña o nombre de usuario no validos");
    }
  });
});
