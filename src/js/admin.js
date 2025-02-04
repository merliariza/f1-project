const addCircuitForm = document.getElementById('addCircuitForm');
const circuitList = document.getElementById('circuitList');
let isEditing = false;
let currentCircuitId = null;

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
    circuitList.innerHTML = ''; // Limpiar la lista antes de agregar nuevos circuitos

    const row = document.createElement('div');
    row.classList.add('row'); // Usamos una fila para agrupar las tarjetas

    circuits.forEach(circuit => {
        const col = document.createElement('div');
        col.classList.add('col-md-6', 'col-12', 'mb-4'); // 2 por fila en PC (md), 1 en móvil (col-12)

        col.innerHTML = `
            <div class="card shadow ">
                <div class="card-body">
                    <h4 style="color: #b9b9b9;" class="card-title">${circuit.name}</h4>
                    <img src="${circuit.image}" alt="Imagen de ${circuit.name}" class="img-fluid" style="width: 100%; height: auto; max-width: 400px;">
                    <br><br>

                    <div class="row">
                        <div class="col-6">
                            <h5>País</h5>
                            <p class="card-text">${circuit.country}</p>
                        </div>
                        <div class="col-6">
                            <h5>Dificultad</h5>
                            <p class="card-text">${circuit.difficulty}</p>
                        </div>
                        <div class="col-6">
                            <h5>Longitud (Km)</h5>
                            <p class="card-text">${circuit.lengthKm}</p>
                        </div>
                        <div class="col-6">
                            <h5>Vueltas</h5>
                            <p class="card-text">${circuit.laps}</p>
                        </div>
                        <div class="col-12">
                            <small class="card-text">${circuit.description}</small>
                        </div>
                    </div>

                    <div class="card-footer text-center">
                    <button class="btn btn-secondary" onclick="editCircuit('${circuit.id}')">Editar</button>
                    <button class="btn btn-danger" onclick="deleteCircuit('${circuit.id}')">Eliminar</button>
                    </div>
                </div>
            </div>
        `;

        row.appendChild(col); // Agregamos la columna a la fila
    });

    circuitList.appendChild(row); // Agregamos la fila al contenedor principal
}// Función para agregar o editar un circuito
addCircuitForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = document.getElementById('circuitName').value.trim();
    const difficulty = document.getElementById('difficulty').value.trim();
    const lengthKm = document.getElementById('circuitLength').value.trim();
    const laps = document.getElementById('circuitLaps').value.trim();
    const country = document.getElementById('circuitLocation').value.trim();
    const description = document.getElementById('circuitDescription').value.trim();
    const imageFile = document.getElementById('circuitImage').files[0];
    const recordTime = document.getElementById('recordTime').value.trim();
    const recordPilot = document.getElementById('recordPilot').value.trim();
    const recordYear = document.getElementById('recordYear').value.trim();
    const winnerSeason = document.getElementById('winnerSeason').value.trim();
    const winnerPilot = document.getElementById('winnerPilot').value.trim();

    if (!name || !difficulty || !lengthKm || !laps || !country || !description) {
        Swal.fire('Error', 'Todos los campos son obligatorios.', 'error');
        return;
    }

    let imageBase64 = "";
    // Solo convertimos la imagen a base64 si se ha cargado una nueva imagen
    if (imageFile) {
        imageBase64 = await convertImageToBase64(imageFile);
    } else if (isEditing) {
        // Si estamos editando, mantenemos la imagen actual sin cambios
        const response = await fetch(`http://localhost:3000/circuits/${currentCircuitId}`);
        const existingCircuit = await response.json();
        imageBase64 = existingCircuit.image;
    }

    const circuitData = {
        name,
        difficulty,
        lengthKm: parseFloat(lengthKm),
        laps: parseInt(laps),
        country,
        description,
        image: imageBase64, // Utilizamos la imagen actual o la nueva, si se ha subido
        lapRecord: {
            time: recordTime,
            pilot: recordPilot,
            year: recordYear
        },
        winners: [{
            season: winnerSeason,
            pilot: winnerPilot
        }]
    };

    try {
        const url = isEditing ? `http://localhost:3000/circuits/${currentCircuitId}` : 'http://localhost:3000/circuits';
        const method = isEditing ? 'PUT' : 'POST';

        const response = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(circuitData),
        });

        if (response.ok) {
            Swal.fire('Éxito', isEditing ? 'Circuito actualizado correctamente.' : 'Circuito agregado correctamente.', 'success');
            addCircuitForm.reset();
            document.getElementById('selectedDifficulty').innerText = "";
            isEditing = false;
            currentCircuitId = null;
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
        document.getElementById('recordTime').value = circuit.lapRecord.time;
        document.getElementById('recordPilot').value = circuit.lapRecord.pilot;
        document.getElementById('recordYear').value = circuit.lapRecord.year;
        document.getElementById('winnerSeason').value = circuit.winners[0].season;
        document.getElementById('winnerPilot').value = circuit.winners[0].pilot;

        // Cambiar el modo de edición
        isEditing = true;
        currentCircuitId = id;
        addCircuitForm.querySelector('button').innerText = 'Actualizar Circuito';

        Swal.fire('Modo Edición', 'Ahora puedes editar el circuito.', 'info');
    } catch (error) {
        console.error('Error al cargar circuito para edición:', error);
    }
};

// Eliminar circuito
deleteCircuit = async function (id) {
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