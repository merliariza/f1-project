
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const newUsernameInput = document.getElementById('newUsername');
const newPasswordInput = document.getElementById('newPassword');
const roleInput = document.getElementById('role');
const loginMessageBox = document.getElementById('loginMessageBox');
const registerMessageBox = document.getElementById('registerMessageBox');


const loginFormContainer = document.getElementById('loginFormContainer');
const registerFormContainer = document.getElementById('registerFormContainer');
const showRegisterFormLink = document.getElementById('showRegisterForm');
const showLoginFormLink = document.getElementById('showLoginForm');

// Mostrar formulario de registro
showRegisterFormLink.addEventListener('click', () => {
  loginFormContainer.style.display = 'none';
  registerFormContainer.style.display = 'block';
});

// Mostrar formulario de login
showLoginFormLink.addEventListener('click', () => {
  loginFormContainer.style.display = 'block';
  registerFormContainer.style.display = 'none';
});
// Iniciar sesión
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = usernameInput.value;
    const password = passwordInput.value;

    try {
        const response = await fetch('http://localhost:3000/users');
        const users = await response.json();

        // Buscar si el usuario existe
        const user = users.find((user) => user.username === username);

        if (user) {
            // Si el usuario existe, verificamos la contraseña
            if (user.password === password) {
                Swal.fire({
                    title: "Inicio de sesión exitoso",
                    text: `Bienvenido, ${user.username}!`,
                    icon: "success",
                    width: 600,
                    padding: "3em",
                    color: "#000",
                    background: '#004346b4', 
                    backdrop: `
                      rgb(48, 48, 51)
                      url("/images/nyan-cat.gif")
                      left top
                      no-repeat
                    `
                });

                // Redirigir según el rol del usuario
                setTimeout(() => {
                    if (user.role === "admin") {
                        window.location.href = 'src/pages/admin.html'; // Página para administradores
                    } else {
                        window.location.href = 'src/pages/inicio.html'; // Página para usuarios normales
                    }
                }, 800); // Espera 800 milisegundos antes de redirigir
            } else {
              loginMessageBox.textContent = 'Contraseña incorrecta.';
              loginMessageBox.style.color = 'red';

              setTimeout(() => {
                  loginMessageBox.textContent = '';
              }, 1000);
            }
        } else {
          loginMessageBox.textContent = 'Usuario incorrecto.';
          loginMessageBox.style.color = 'red';

          setTimeout(() => {
              loginMessageBox.textContent = '';
          }, 1000);
        }
    } catch (error) {
        console.error('Error al hacer login:', error);
        messageBox.textContent = 'Hubo un problema con la conexión al servidor.';
        messageBox.style.color = 'red';
        setTimeout(() => {
          messageBox.textContent = '';
      }, 1000);
    }
});

// Registrar un nuevo usuario
registerForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const newUsername = newUsernameInput.value;
  const newPassword = newPasswordInput.value;
  const role = roleInput.value;

  try {
    const response = await fetch('http://localhost:3000/users');
    const users = await response.json();

    const userExists = users.find((user) => user.username === newUsername);

    if (userExists) {
      registerMessageBox.textContent = 'El usuario ya existe.';
      registerMessageBox.style.color = 'red';

      setTimeout(() => {
          registerMessageBox.textContent = '';
      }, 2000);
     
    } else {
      const newUser = {
        username: newUsername,
        password: newPassword,
        role: role,
      };

      const postResponse = await fetch('http://localhost:3000/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUser),
      });

      if (postResponse.ok) {
        registerMessageBox.textContent = 'Usuario registrado exitosamente. ¡Inicia sesión!';
                registerMessageBox.style.color = 'green';

                setTimeout(() => {
                    registerMessageBox.textContent = '';
                }, 3000);

                registerForm.reset();
                loginFormContainer.style.display = 'block';
                registerFormContainer.style.display = 'none';
      } else {
        registerMessageBox.textContent = 'Hubo un problema al registrar al usuario.';
        registerMessageBox.style.color = 'red';

        setTimeout(() => {
            registerMessageBox.textContent = '';
        }, 1000);
      }
    }
  } catch (error) {
    console.error('Error al registrar usuario:', error);
    registerMessageBox.textContent = 'Hubo un problema con la conexión al servidor.';
    registerMessageBox.style.color = 'red';

    setTimeout(() => {
        registerMessageBox.textContent = '';
    }, 1000);
  }
});

// Funcionalidad para seleccionar el rol desde el dropdown
const dropdownLinks = document.querySelectorAll('.dropdown-content a');
const dropdownButton = document.querySelector('.dropdown-button');

dropdownLinks.forEach((link) => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const selectedRole = link.getAttribute('data-role');
    roleInput.value = selectedRole;
    dropdownButton.textContent = link.textContent; // Cambiar el texto del botón
  });
});
