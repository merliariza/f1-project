const addCircuitForm = document.getElementById('addCircuitForm');
const circuitList = document.getElementById('table-custom');

// Cargar los circuitos desde el servidor
async function loadCircuits() {
    try {
        const response = await fetch('http://localhost:3000/circuits');
        const circuits = await response.json();
        displayCircuits(circuits);
    } catch (error) {
        console.error('Error al cargar los circuitos:', error);
    }
}

// Mostrar los circuitos en la tabla
function displayCircuits(circuits) {
    circuitList.innerHTML = ''; // Limpiar la tabla antes de mostrar nuevos datos
    circuits.forEach(circuit => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${circuit.name}</td>
            <td>${circuit.country}</td>
            <td>${circuit.difficulty}</td>
            <td><img src="${circuit.image}" alt="Imagen de ${circuit.name}" style="width: 100px; height: auto;"></td>
            <td>
                <button class="btn btn-danger" onclick="deleteCircuit(${circuit.id})">Eliminar</button>
                <button class="btn btn-secondary" onclick="editCircuit(${circuit.id})">Editar</button>
            </td>
        `;
        circuitList.appendChild(row);
    });
}

// Función para agregar o editar un circuito
addCircuitForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('circuitName').value.trim();
    const difficulty = document.getElementById('difficulty').value.trim();
    const lengthKm = document.getElementById('circuitLength').value.trim();
    const laps = document.getElementById('circuitLaps').value.trim();
    const country = document.getElementById('circuitLocation').value.trim();
    const description = document.getElementById('circuitDescription').value.trim();
    const imageFile = document.getElementById('circuitImage').files[0];

    if (!name || !difficulty || !lengthKm || !laps || !country || !description) {
        Swal.fire('Error', 'Todos los campos son obligatorios.', 'error');
        return;
    }

    let imageBase64 = "";
    if (imageFile) {
        imageBase64 = await convertImageToBase64(imageFile);
    }

    const circuitData = {
        name,
        difficulty,
        lengthKm: parseFloat(lengthKm),
        laps: parseInt(laps),
        country,
        description,
        image: imageBase64,
    };

    try {
        const response = await fetch('http://localhost:3000/circuits', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(circuitData),
        });

        if (response.ok) {
            Swal.fire('Éxito', 'Circuito agregado correctamente.', 'success');
            addCircuitForm.reset();
            document.getElementById('selectedDifficulty').innerText = "";
            loadCircuits();
        } else {
            Swal.fire('Error', 'No se pudo guardar el circuito.', 'error');
        }
    } catch (error) {
        console.error('Error al guardar circuito:', error);
        Swal.fire('Error', 'Hubo un problema con la conexión.', 'error');
    }
});

// Convertir imagen a base64
function convertImageToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
    });
}

// Editar circuito
window.editCircuit = async function (id) {
    try {
        const response = await fetch(`http://localhost:3000/circuits/${id}`);
        const circuit = await response.json();

        document.getElementById('circuitName').value = circuit.name;
        document.getElementById('difficulty').value = circuit.difficulty;
        document.getElementById('selectedDifficulty').innerText = `Dificultad seleccionada: ${circuit.difficulty}`;
        document.getElementById('circuitLength').value = circuit.lengthKm;
        document.getElementById('circuitLaps').value = circuit.laps;
        document.getElementById('circuitLocation').value = circuit.country;
        document.getElementById('circuitDescription').value = circuit.description;

        // Cambiar el modo de edición
        addCircuitForm.querySelector('button').innerText = 'Actualizar Circuito';

        Swal.fire('Modo Edición', 'Ahora puedes editar el circuito.', 'info');
    } catch (error) {
        console.error('Error al cargar circuito para edición:', error);
    }
};

// Eliminar circuito
window.deleteCircuit = async function (id) {
    const confirmDelete = await Swal.fire({
        title: '¿Estás seguro?',
        text: "Esta acción no se puede deshacer.",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    });

    if (confirmDelete.isConfirmed) {
        try {
            const response = await fetch(`http://localhost:3000/circuits/${id}`, { method: 'DELETE' });

            if (response.ok) {
                Swal.fire('Eliminado', 'Circuito eliminado correctamente.', 'success');
                loadCircuits();
            } else {
                Swal.fire('Error', 'No se pudo eliminar el circuito.', 'error');
            }
        } catch (error) {
            console.error('Error al eliminar circuito:', error);
            Swal.fire('Error', 'Hubo un problema con la conexión.', 'error');
        }
    }
};

// Cargar los circuitos cuando se cargue la página
document.addEventListener('DOMContentLoaded', loadCircuits);
