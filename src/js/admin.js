const addCircuitForm = document.getElementById('addCircuitForm');
const circuitList = document.getElementById('table-custom');

// Cargar circuitos desde el archivo JSON
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
  circuitList.innerHTML = ''; // Limpiar la tabla antes de mostrar los nuevos datos
  circuits.forEach(circuit => {
    const row = document.createElement('tr');

    row.innerHTML = `
      <td>${circuit.name}</td>
      <td>${circuit.country}</td>
      <td>${circuit.difficulty}</td>
      <td>
        <button class="btn btn-danger" onclick="deleteCircuit(${circuit.id})">Eliminar</button>
        <button class="btn btn-secondary" onclick="editCircuit(${circuit.id})">Editar</button>
      </td>
      
    `;
    circuitList.appendChild(row);
  });
}

// Agregar un nuevo circuito
addCircuitForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const name = document.getElementById('circuitName').value;
  const country = document.getElementById('circuitLocation').value;
  const lengthKm = document.getElementById('circuitLength').value;
  const laps = document.getElementById('circuitLaps').value;
  const description = document.getElementById('circuitDescription').value;
  const difficulty = document.getElementById('difficulty').value;
  const image = document.getElementById('circuitImage').files[0] ? URL.createObjectURL(document.getElementById('circuitImage').files[0]) : ''; // Imagen de circuito

  const newCircuit = {
    id: Date.now(),  // Asignar un ID único (puedes ajustarlo según tus necesidades)
    name,
    country,
    lengthKm,
    laps,
    description,
    difficulty,
    image
  };

  try {
    // Guardar el nuevo circuito en el archivo JSON (simulando con un POST)
    const response = await fetch('http://localhost:3000/circuits', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newCircuit)
    });

    if (response.ok) {
      Swal.fire('¡Éxito!', 'Circuito agregado correctamente.', 'success');
      loadCircuits();  // Recargar los circuitos después de agregar
    } else {
      throw new Error('Error al guardar el circuito');
    }
  } catch (error) {
    console.error('Error al agregar el circuito:', error);
    Swal.fire('¡Error!', 'Hubo un problema al agregar el circuito.', 'error');
  }
});

// Eliminar un circuito
async function deleteCircuit(circuitId) {
  try {
    const response = await fetch(`http://localhost:3000/circuits/${circuitId}`, {
      method: 'DELETE'
    });

    if (response.ok) {
      Swal.fire('¡Éxito!', 'Circuito eliminado correctamente.', 'success');
      loadCircuits();  // Recargar los circuitos después de eliminar
    } else {
      throw new Error('Error al eliminar el circuito');
    }
  } catch (error) {
    console.error('Error al eliminar el circuito:', error);
    Swal.fire('¡Error!', 'Hubo un problema al eliminar el circuito.', 'error');
  }
}

// Llamar a la función para cargar los circuitos cuando se carga la página
document.addEventListener('DOMContentLoaded', loadCircuits);
