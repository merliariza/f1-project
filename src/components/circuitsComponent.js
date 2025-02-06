class CircuitsComponent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    // Almacena si se está editando un circuito (null = creando nuevo)
    this.editingCircuitId = null;
    this.apiUrl = "http://localhost:3000/circuits";
  }

  connectedCallback() {
    this.render();
    this.setupListeners();
    this.loadCircuits();
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
        }
        .card-admin {
          margin-top: 2rem;
          background: linear-gradient(145deg, #1a1717, #2b2626);
          border: 2px solid #31312d;
          border-radius: 12px;
          box-shadow: 0 4px 8px rgba(139, 0, 0, 0.3);
          padding: 2rem;
          width: 90%;
          max-width: 800px;
          margin-left: auto;
          margin-right: auto;
        }
        .card-content h5 {
          color: #ffffff;
          text-align: center;
          margin-bottom: 1rem;
          font-size: 1.5rem;
        }
        form {
          display: grid;
          gap: 1rem;
        }
        .form-control {
          width: 100%;
          padding: 0.75rem 1rem;
          border: 1px solid #5e52527a;
          background-color: #383535;
          color: #ffffff;
          border-radius: 6px;
          transition: background-color 0.3s, border-color 0.3s;
        }
        .form-control:focus {
          outline: none;
          border-color: #8b0000;
          background-color: #404040;
        }
        .dropdown-menu {
          list-style: none;
          padding: 0.5rem 0;
          background-color: #1a1717;
          border: 1px solid #5e52527a;
          border-radius: 6px;
        }
        .dropdown-item {
          padding: 0.5rem 1rem;
          color: #ffffff;
          cursor: pointer;
          transition: background-color 0.3s;
        }
        .dropdown-item:hover {
          background-color: #660000;
        }
        .btn-neon {
          background-color: #262626;
          border: 1px solid #8b0000;
          color: #ffffff;
          padding: 0.75rem 1.5rem;
          font-size: 1rem;
          border-radius: 6px;
          transition: background-color 0.3s, transform 0.3s;
          cursor: pointer;
          margin-top: 1rem;
        }
        .btn-neon:hover {
          background-color: #660909;
          transform: scale(1.03);
        }
        .bg-custom2 {
          background-color: #333;
          padding: 1.5rem;
          margin-top: 2rem;
          border-radius: 8px;
        }
        .card {
          background: linear-gradient(145deg, #1a1717, #2b2626);
          border: 2px solid #31312d;
          border-radius: 10px;
          box-shadow: 0 4px 8px rgba(139, 0, 0, 0.3);
          margin-bottom: 1rem;
          padding: 1rem;
        }
        .card-body {
          color: #ffffff;
        }
        @media (max-width: 600px) {
          .card-admin {
            width: 95%;
            padding: 1.5rem;
          }
        }
      </style>
      <div class="card-admin">
        <div class="card-content">
          <h5>Agregar Nuevo Circuito</h5>
          <form id="addCircuitForm">
            <hr>
            <div class="mb-3">
              <label for="circuitName" class="form-label">Nombre del Circuito</label>
              <input class="form-control" type="text" id="circuitName" required>
            </div>
            <div class="mb-3">
              <label for="difficultyDropdown" class="form-label">Dificultad del Circuito</label>
              <button class="btn-neon dropdown-toggle" type="button" id="difficultyDropdown" data-bs-toggle="dropdown">
                Seleccionar dificultad
              </button>
              <ul class="dropdown-menu">
                <li><a class="dropdown-item" href="#" data-dff data-difficulty="Baja">Baja</a></li>
                <li><a class="dropdown-item" href="#" data-dff data-difficulty="Media">Media</a></li>
                <li><a class="dropdown-item" href="#" data-dff data-difficulty="Alta">Alta</a></li>
              </ul>
              <input type="hidden" id="difficulty">
              <p id="selectedDifficulty" class="mt-2"></p>
            </div>
            <div class="mb-3">
              <label for="circuitLength" class="form-label">Longitud del Circuito (km)</label>
              <input class="form-control" type="number" id="circuitLength" required>
            </div>
            <div class="mb-3">
              <label for="circuitLaps" class="form-label">Cantidad de Vueltas</label>
              <input class="form-control" type="number" id="circuitLaps" required>
            </div>
            <div class="mb-3">
              <label for="circuitDescription" class="form-label">Descripción</label>
              <input class="form-control" type="text" id="circuitDescription" required>
            </div>
            <div class="mb-3">
              <label for="circuitLocation" class="form-label">Ubicación del Circuito</label>
              <input class="form-control" type="text" id="circuitLocation" required>
            </div>
            <div class="mb-3">
              <label for="circuitImage" class="form-label">Imagen del Circuito</label>
              <input class="form-control" type="file" id="circuitImage" accept="image/*">
            </div>
            <h3>Registrar nuevo Record</h3>
            <div class="mb-3">
              <label class="form-label">Registrar tiempo</label>
              <input type="text" id="recordTime" class="form-control" required>
            </div>
            <div class="mb-3">
              <label class="form-label">Piloto</label>
              <input class="form-control" type="text" id="recordPilot">
            </div>
            <div class="mb-3">
              <label class="form-label">Año</label>
              <input class="form-control" type="number" id="recordYear">
            </div>
            <h3>Ganadores</h3>
            <div class="mb-3">
              <label class="form-label">Sesión</label>
              <input class="form-control" type="number" id="winnerSeason">
            </div>
            <div class="mb-3">
              <label class="form-label">Piloto</label>
              <input class="form-control" type="text" id="winnerPilot">
            </div>
            <button type="submit" class="btn-neon">Agregar Circuito</button>
            <button type="button" id="cancelEdit" class="btn-neon" style="display: none;">Cancelar Edición</button>
          </form>
        </div>
      </div>
      <div class="bg-custom2 card-table">
        <div class="card">
          <div class="card-body" id="circuitList"></div>
        </div>
      </div>
    `;
  }

  setupListeners() {
    // Asignar evento a cada item del dropdown para seleccionar la dificultad
    const difficultyItems = this.shadowRoot.querySelectorAll('[data-dff]');
    difficultyItems.forEach(item => {
      item.addEventListener('click', (e) => {
        e.preventDefault();
        const difficulty = item.getAttribute('data-difficulty');
        this.selectDifficulty(difficulty);
      });
    });

    // Ejemplo de listener para el envío del formulario
    const form = this.shadowRoot.getElementById('addCircuitForm');
    form.addEventListener('submit', (e) => this.saveCircuit(e));

    // Cancelar edición
    const cancelEdit = this.shadowRoot.getElementById('cancelEdit');
    cancelEdit.addEventListener('click', () => {
      this.clearForm();
    });
  }

  selectDifficulty(value) {
    const difficultyInput = this.shadowRoot.getElementById('difficulty');
    const selectedDifficulty = this.shadowRoot.getElementById('selectedDifficulty');
    if (difficultyInput && selectedDifficulty) {
      difficultyInput.value = value;
      selectedDifficulty.innerText = `Dificultad seleccionada: ${value}`;
    }
  }

  async loadCircuits() {
    try {
      const response = await fetch(this.apiUrl);
      const circuits = await response.json();
      this.displayCircuits(circuits);
    } catch (error) {
      console.error("Error al cargar circuitos:", error);
    }
  }

  displayCircuits(circuits) {
    const circuitList = this.shadowRoot.getElementById('circuitList');
    circuitList.innerHTML = ''; // Limpiar listado previo
    circuits.forEach((circuit) => {
      const card = document.createElement('div');
      card.classList.add('card');
      card.innerHTML = `
        <div class="card-body">
          <h4 class="card-title">${circuit.name}</h4>
          ${circuit.image ? `<img src="${circuit.image}" alt="Imagen de ${circuit.name}" style="width:100%; max-width:400px;">` : ''}
          <p><strong>País:</strong> ${circuit.country}</p>
          <p><strong>Dificultad:</strong> ${circuit.difficulty}</p>
          <p><strong>Longitud (Km):</strong> ${circuit.lengthKm}</p>
          <p><strong>Vueltas:</strong> ${circuit.circuitLaps || circuit.laps}</p>
          <p><strong>Descripción:</strong> ${circuit.description}</p>
          <button class="btn-neon editBtn" data-id="${circuit.id}">Editar</button>
          <button class="btn-neon deleteBtn" data-id="${circuit.id}" style="margin-left: 10px;">Eliminar</button>
        </div>
      `;
      circuitList.appendChild(card);

      // Eventos para editar y eliminar circuito
      card.querySelector('.editBtn').addEventListener('click', () => {
        this.loadCircuitIntoForm(circuit);
      });
      card.querySelector('.deleteBtn').addEventListener('click', () => {
        this.deleteCircuit(circuit.id);
      });
    });
  }

  async saveCircuit(e) {
    e.preventDefault();
    // Recoger datos del formulario
    const circuitName = this.shadowRoot.getElementById('circuitName').value;
    const difficulty = this.shadowRoot.getElementById('difficulty').value;
    const circuitLength = this.shadowRoot.getElementById('circuitLength').value;
    const circuitLaps = this.shadowRoot.getElementById('circuitLaps').value;
    const circuitDescription = this.shadowRoot.getElementById('circuitDescription').value;
    const circuitLocation = this.shadowRoot.getElementById('circuitLocation').value;
    const recordTime = this.shadowRoot.getElementById('recordTime').value;
    const recordPilot = this.shadowRoot.getElementById('recordPilot').value;
    const recordYear = this.shadowRoot.getElementById('recordYear').value;
    const winnerSeason = this.shadowRoot.getElementById('winnerSeason').value;
    const winnerPilot = this.shadowRoot.getElementById('winnerPilot').value;

    // Procesar imagen (convertir a Base64) si se seleccionó alguna
    const circuitImageInput = this.shadowRoot.getElementById('circuitImage');
    let imageBase64 = '';
    if (circuitImageInput && circuitImageInput.files && circuitImageInput.files[0]) {
      imageBase64 = await this.convertImageToBase64(circuitImageInput.files[0]);
    }

    // Preparar objeto con la información del circuito
    const circuitData = {
      name: circuitName,
      difficulty,
      lengthKm: parseFloat(circuitLength),
      circuitLaps: parseInt(circuitLaps),
      description: circuitDescription,
      location: circuitLocation,
      image: imageBase64,
      record: {
        time: recordTime,
        pilot: recordPilot,
        year: parseInt(recordYear)
      },
      winner: {
        season: parseInt(winnerSeason),
        pilot: winnerPilot
      }
    };

    try {
      if (this.editingCircuitId) {
        // Actualizar circuito existente (PUT)
        await fetch(`${this.apiUrl}/${this.editingCircuitId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(circuitData)
        });
      } else {
        // Crear nuevo circuito (POST)
        await fetch(this.apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(circuitData)
        });
      }
      this.clearForm();
      this.loadCircuits();
    } catch (error) {
      console.error('Error al guardar el circuito:', error);
    }
  }

  async deleteCircuit(id) {
    try {
      await fetch(`${this.apiUrl}/${id}`, {
        method: 'DELETE'
      });
      this.loadCircuits();
    } catch (error) {
      console.error('Error al eliminar circuito:', error);
    }
  }

  loadCircuitIntoForm(circuit) {
    // Rellenar el formulario con la información del circuito para editarlo
    this.editingCircuitId = circuit.id;
    this.shadowRoot.getElementById('circuitName').value = circuit.name;
    this.shadowRoot.getElementById('difficulty').value = circuit.difficulty;
    this.shadowRoot.getElementById('selectedDifficulty').innerText = `Dificultad seleccionada: ${circuit.difficulty}`;
    this.shadowRoot.getElementById('circuitLength').value = circuit.lengthKm;
    this.shadowRoot.getElementById('circuitLaps').value = circuit.circuitLaps || circuit.laps;
    this.shadowRoot.getElementById('circuitDescription').value = circuit.description;
    this.shadowRoot.getElementById('circuitLocation').value = circuit.location;
    this.shadowRoot.getElementById('recordTime').value = circuit.record.time;
    this.shadowRoot.getElementById('recordPilot').value = circuit.record.pilot;
    this.shadowRoot.getElementById('recordYear').value = circuit.record.year;
    this.shadowRoot.getElementById('winnerSeason').value = circuit.winner.season;
    this.shadowRoot.getElementById('winnerPilot').value = circuit.winner.pilot;
    // Mostrar botón para cancelar la edición
    this.shadowRoot.getElementById('cancelEdit').style.display = 'inline-block';
  }

  clearForm() {
    // Limpiar formulario y reiniciar estado
    this.shadowRoot.getElementById('addCircuitForm').reset();
    this.shadowRoot.getElementById('selectedDifficulty').innerText = '';
    this.editingCircuitId = null;
    this.shadowRoot.getElementById('cancelEdit').style.display = 'none';
  }

  convertImageToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(file);
    });
  }
}

customElements.define('circuits-component', CircuitsComponent);
