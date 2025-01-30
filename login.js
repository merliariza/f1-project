
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const newUsernameInput = document.getElementById('newUsername');
const newPasswordInput = document.getElementById('newPassword');
const roleInput = document.getElementById('role');
const messageBox = document.getElementById('messageBox');

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
        const response = await fetch('http://localhost:5000/users');
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
                    background: "rgba(255, 255, 255, 0.61)",
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
                }, 2000); // Esperar 2 segundos antes de redirigir
            } else {
                messageBox.textContent = 'Contraseña incorrecta.';
                messageBox.style.color = 'red';
            }
        } else {
            messageBox.textContent = 'Usuario incorrecto.';
            messageBox.style.color = 'red';
        }
    } catch (error) {
        console.error('Error al hacer login:', error);
        messageBox.textContent = 'Hubo un problema con la conexión al servidor.';
        messageBox.style.color = 'red';
    }
});

// Registrar un nuevo usuario
registerForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const newUsername = newUsernameInput.value;
  const newPassword = newPasswordInput.value;
  const role = roleInput.value;

  try {
    const response = await fetch('http://localhost:5000/users');
    const users = await response.json();

    const userExists = users.find((user) => user.username === newUsername);

    if (userExists) {
      messageBox.textContent = 'El usuario ya existe.';
      messageBox.style.color = 'red';
    } else {
      const newUser = {
        username: newUsername,
        password: newPassword,
        role: role,
      };

      const postResponse = await fetch('http://localhost:5000/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newUser),
      });

      if (postResponse.ok) {
        messageBox.textContent = 'Usuario registrado exitosamente. ¡Inicia sesión!';
        messageBox.style.color = 'green';
        registerForm.reset();
        loginFormContainer.style.display = 'block';
        registerFormContainer.style.display = 'none';
      } else {
        messageBox.textContent = 'Hubo un problema al registrar al usuario.';
        messageBox.style.color = 'red';
      }
    }
  } catch (error) {
    console.error('Error al registrar usuario:', error);
    messageBox.textContent = 'Hubo un problema con la conexión al servidor.';
    messageBox.style.color = 'red';
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
