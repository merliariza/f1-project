class VehicleGalleryComponent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.vehicles = [];
    this.configurations = JSON.parse(localStorage.getItem('vehicleConfigurations')) || [];
    this.searchTerm = ""; 
  }

  connectedCallback() {
    this.fetchVehicles();
  }

  async fetchVehicles() {
    try {
      const response = await fetch('http://localhost:3000/vehicles');
      this.vehicles = await response.json();
      this.render();
    } catch (error) {
      console.error("Error al cargar vehículos:", error);
      this.shadowRoot.innerHTML = `<p>Error al cargar vehículos.</p>`;
    }
  }

  render() {
   
    const filteredVehicles = this.vehicles.filter(vehicle => {
    
      const fullName = `${vehicle.team} - ${vehicle.engine} - ${vehicle.model}`.toLowerCase();
      return fullName.includes(this.searchTerm.toLowerCase());
    });
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          font-family: Arial, sans-serif;
          background: #f7f7f7;
          padding: 16px;
        }
        .search-container {
          text-align: center;
          margin-bottom: 16px;
        }
        .search-container input {
          width: 80%;
          max-width: 400px;
          padding: 8px;
          font-size: 1rem;
          border: 1px solid #ccc;
          border-radius: 4px;
        }
        .gallery {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          justify-content: center;
        }
        .card {
          border: 1px solid #ccc;
          border-radius: 8px;
          overflow: hidden;
          width: 500px;
          height: 300px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
          cursor: pointer;
          transition: transform 0.2s;
          background: #fff;
          display: flex;
          flex-direction: column;
        }
        .card:hover {
          transform: scale(1.05);
        }

        .model3d-container {
          height: 180px;
          overflow: hidden;
          
        }
        .model3d-container iframe {
          width: 100%;
          height: 100%;
          border: none;
          object-fit: cover;
        }
        .card-body {
          padding: 6px 8px;
          height: calc(100% - 180px);
          box-sizing: border-box;
        }
        .card-body h3 {
          margin: 4px 0;
          font-size: 1rem;
          color: #333;
        }
        .card-body p {
          margin: 2px 0;
          font-size: 0.8rem;
          color: #555;
        }
        .modal {
          display: none;
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0,0,0,0.6);
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 16px;
        }
        .modal.active {
          display: flex;
        }
        .modal-content {
          background: #fff;
          border-radius: 8px;
          padding: 16px;
          max-width: 600px;
          width: 100%;
          position: relative;
          max-height: 90vh;
          overflow-y: auto;
        }
        .close {
          position: absolute;
          top: 8px;
          right: 12px;
          font-size: 24px;
          cursor: pointer;
          color: #cd2726;
        }
        .modal-content h2,
        .modal-content h3 {
          margin-top: 0;
          color: #333;
        }
        .modal-content p {
          margin: 4px 0;
          color: #555;
        }
        .config-form label {
          display: block;
          margin: 8px 0 4px;
          font-weight: bold;
          color: #333;
          font-size: 0.9rem;
        }
        .config-form select,
        .config-form button {
          width: 100%;
          padding: 8px;
          font-size: 1rem;
          margin-bottom: 8px;
        }
        .config-form button {
          background: #007BFF;
          color: #fff;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }
        .config-form button:hover {
          background: #0056b3;
        }
        .configurations {
          margin-top: 24px;
          border-top: 2px solid #ccc;
          padding-top: 16px;
        }
        .configurations h2 {
          text-align: center;
          color: #333;
        }
        .config-item {
          border: 1px solid #ddd;
          border-radius: 4px;
          padding: 8px;
          margin: 8px 0;
          background: #fff;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .config-item p {
          margin: 4px 0;
          font-size: 0.9rem;
          color: #333;
        }
        .config-item button {
          background: #cd2726;
          color: #fff;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          padding: 4px 8px;
          font-size: 0.8rem;
        }
        @media (max-width: 480px) {
          .card {
            width: 140px;
          }
          .model3d-container {
            height: 100px;
          }
          .card-body {
            height: calc(100% - 100px);
          }
        }
      </style>
      <div class="search-container">
        <input type="text" id="searchInput" placeholder="Buscar vehículo...">
      </div>
      <div class="gallery">
        ${filteredVehicles.map(vehicle => `
          <div class="card" data-id="${vehicle.id}">
            <div class="model3d-container">
              ${vehicle.model3dLink 
                ? `<iframe src="${vehicle.model3dLink}" title="Modelo 3D" allowfullscreen></iframe>`
                : `<p style="color:#fff; text-align:center; padding-top: 40%;">No hay modelo 3D disponible.</p>`
              }
            </div>
            <div class="card-body">
              <!-- El nombre se compone del equipo, motor y modelo -->
              <h3>${vehicle.team} - ${vehicle.engine} - ${vehicle.model}</h3>
              <p><strong>Motor:</strong> ${vehicle.engine}</p>
              <p><strong>Velocidad:</strong> ${vehicle.maxSpeedKmh} km/h</p>
            </div>
          </div>
        `).join('')}
      </div>
      <!-- Modal para detalles y configuración -->
      <div class="modal" id="modal">
        <div class="modal-content">
          <span class="close" id="modalClose">&times;</span>
          <h2>Detalles del Vehículo</h2>
          <div id="modalDetails"></div>
          <h3>Configuración</h3>
          <form id="configForm" class="config-form">
            <label for="drivingMode">Modo de Conducción:</label>
            <select id="drivingMode" required>
              <option value="" disabled selected>Seleccione</option>
              <option value="Normal">Normal</option>
              <option value="Agresiva">Agresiva</option>
              <option value="Ahorro">Ahorro de Combustible</option>
            </select>
            <label for="tirePressure">Presión de los Neumáticos:</label>
            <select id="tirePressure" required>
              <option value="" disabled selected>Seleccione</option>
              <option value="Baja">Baja</option>
              <option value="Estandar">Estándar</option>
              <option value="Alta">Alta</option>
            </select>
            <label for="downforce">Carga Aerodinámica:</label>
            <select id="downforce" required>
              <option value="" disabled selected>Seleccione</option>
              <option value="Baja">Baja</option>
              <option value="Media">Media</option>
              <option value="Alta">Alta</option>
            </select>
            <button type="submit">Guardar Configuración</button>
          </form>
        </div>
      </div>
      <!-- Sección de configuraciones guardadas -->
      <div class="configurations">
        <h2>Configuraciones Guardadas</h2>
        ${this.configurations.length 
          ? this.configurations.map((config, index) => `
              <div class="config-item" data-index="${index}">
                <div>
                  <p><strong>Vehículo ID:</strong> ${config.vehicleId}</p>
                  <p><strong>Modo de Conducción:</strong> ${config.drivingMode}</p>
                  <p><strong>Presión de Neumáticos:</strong> ${config.tirePressure}</p>
                  <p><strong>Carga Aerodinámica:</strong> ${config.downforce}</p>
                </div>
                <button class="delete-config">Borrar</button>
              </div>
            `).join('')
          : `<p style="text-align:center;">No hay configuraciones guardadas.</p>`
        }
      </div>
    `;
    this.setupEventListeners();
  }

  setupEventListeners() {

    const searchInput = this.shadowRoot.getElementById('searchInput');
    searchInput.addEventListener('input', (e) => {
      this.searchTerm = e.target.value;
      this.render();
    });


    const cards = this.shadowRoot.querySelectorAll('.card');
    cards.forEach(card => {
      card.addEventListener('click', () => {
        const id = card.getAttribute('data-id');
        const vehicle = this.vehicles.find(v => v.id == id);
        if (vehicle) {
          this.openModal(vehicle);
        }
      });
    });

    const modalClose = this.shadowRoot.getElementById('modalClose');
    modalClose.addEventListener('click', () => this.closeModal());
    const modal = this.shadowRoot.getElementById('modal');
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        this.closeModal();
      }
    });

   
    const configForm = this.shadowRoot.getElementById('configForm');
    configForm.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleConfigSubmit(e);
    });

   
    const deleteButtons = this.shadowRoot.querySelectorAll('.delete-config');
    deleteButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        const configItem = e.target.closest('.config-item');
        const index = configItem.getAttribute('data-index');
        this.deleteConfiguration(index);
      });
    });
  }

  openModal(vehicle) {
    const modal = this.shadowRoot.getElementById('modal');
    const modalDetails = this.shadowRoot.getElementById('modalDetails');
    
    modalDetails.innerHTML = `
      <p><strong>Nombre:</strong> ${vehicle.engine} - ${vehicle.model}</p>
      <p><strong>Velocidad máxima:</strong> ${vehicle.maxSpeedKmh} km/h</p>
      <p><strong>Combustible máximo:</strong> ${vehicle.maxFuel}</p>
      <p><strong>Aceleración:</strong> ${vehicle.acceleration} s</p>
    `;
    if (vehicle.model3dLink) {
      modalDetails.innerHTML += `
        <div class="model3d-container">
          <h3>Modelo 3D</h3>
          <iframe src="${vehicle.model3dLink}" title="Modelo 3D" allowfullscreen></iframe>
        </div>
      `;
    }

    this.shadowRoot.getElementById('configForm').setAttribute('data-vehicle-id', vehicle.id);
    modal.classList.add('active');
  }

  closeModal() {
    const modal = this.shadowRoot.getElementById('modal');
    modal.classList.remove('active');
    this.shadowRoot.getElementById('configForm').reset();
  }

  handleConfigSubmit(event) {
    const form = event.target;
    const config = {
      vehicleId: form.getAttribute('data-vehicle-id'),
      drivingMode: this.shadowRoot.getElementById('drivingMode').value,
      tirePressure: this.shadowRoot.getElementById('tirePressure').value,
      downforce: this.shadowRoot.getElementById('downforce').value,
     
    };
    this.configurations.push(config);
    localStorage.setItem('vehicleConfigurations', JSON.stringify(this.configurations));
    console.log("Configuraciones almacenadas:", this.configurations);
    this.closeModal();
    
    this.render();
  }

  deleteConfiguration(index) {
    this.configurations.splice(index, 1);
    localStorage.setItem('vehicleConfigurations', JSON.stringify(this.configurations));
    this.render();
  }
}

customElements.define('vehicle-gallery-component', VehicleGalleryComponent);
