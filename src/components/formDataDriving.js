import getTeams from '../js/getTeams.js';
import getDrivers from '../js/getDrivers.js';
import getVehicles from '../js/getVehicles.js';
import getDriversByTeamId from '../js/getDriversByTeamId.js';
import getVehiclesByTeamId from '../js/getVehiclesByTeamId.js';

export class FormDataDrivingComponent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.vehicles = [];
    this.editingVehicle = null;
  }

  connectedCallback() {
    this.loadVehicles();
    this.render();
  }

  async loadVehicles() {
    try {
      const response = await fetch('http://localhost:3000/vehicles');
      this.vehicles = await response.json();
      this.render();
    } catch (error) {
      console.error('Error cargando vehículos:', error);
    }
  }

  async handleSubmit(event) {
    event.preventDefault();
    const form = event.target;
    if (!form.checkValidity()) {
      alert("Por favor, complete todos los campos requeridos correctamente.");
      return;
    }
    const formData = new FormData(form);
    const vehicleData = {
      model: formData.get('model'),
      engine: formData.get('engine'),
      maxSpeedKmh: formData.get('maxSpeedKmh'),
      acceleration: formData.get('acceleration'),
      model3dLink: formData.get('model3dLink'),
      performance: {
        normalDriving: {
          averageSpeedKmh: formData.get('averageSpeedNormal'),
          fuelConsumption: {
            dry: formData.get('fuelConsumptionDryNormal'),
            rainy: formData.get('fuelConsumptionRainyNormal'),
            extreme: formData.get('fuelConsumptionExtremeNormal')
          },
          tireWear: {
            dry: formData.get('tireWearDryNormal'),
            rainy: formData.get('tireWearRainyNormal'),
            extreme: formData.get('tireWearExtremeNormal')
          }
        },
        aggressiveDriving: {
          averageSpeedKmh: formData.get('averageSpeedAggressive'),
          fuelConsumption: {
            dry: formData.get('fuelConsumptionDryAggressive'),
            rainy: formData.get('fuelConsumptionRainyAggressive'),
            extreme: formData.get('fuelConsumptionExtremeAggressive')
          },
          tireWear: {
            dry: formData.get('tireWearDryAggressive'),
            rainy: formData.get('tireWearRainyAggressive'),
            extreme: formData.get('tireWearExtremeAggressive')
          }
        },
        fuelSaving: {
          averageSpeedKmh: formData.get('averageSpeedSaving'),
          fuelConsumption: {
            dry: formData.get('fuelConsumptionDrySaving'),
            rainy: formData.get('fuelConsumptionRainySaving'),
            extreme: formData.get('fuelConsumptionExtremeSaving')
          },
          tireWear: {
            dry: formData.get('tireWearDrySaving'),
            rainy: formData.get('tireWearRainySaving'),
            extreme: formData.get('tireWearExtremeSaving')
          }
        }
      },
      image: formData.get('vehicleImageUrl')
    };

    try {
      let url = 'http://localhost:3000/vehicles';
      let method = 'POST';
      if (this.editingVehicle) {
        url += `/${this.editingVehicle.id}`;
        method = 'PUT';
      }
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(vehicleData)
      });
      if (response.ok) {
        this.loadVehicles();
        form.reset();
        this.editingVehicle = null;
      } else {
        alert("Error en la respuesta del servidor: " + await response.text());
      }
    } catch (error) {
      alert("Error guardando vehículo: " + error);
      console.error('Error guardando vehículo:', error);
    }
  }

  vehicleTeamSelectHandleChange(event, vehicleDriverSelect) {
    const teamId = event.target.value;
    if (teamId) {
      this.setVehicleDriverOptions(teamId, vehicleDriverSelect);
    } else {
      vehicleDriverSelect.disabled = true;
      vehicleDriverSelect.classList.add('select-disabled');
      vehicleDriverSelect.innerHTML =
        '<option value="" disabled selected>Seleccione un piloto</option>';
    }
  }

  async setVehicleTeamOptions(vehicleTeamSelect) {
    try {
      if (!vehicleTeamSelect) {
        console.error('Elemento #vehicleTeam no encontrado');
        return;
      }
      const teams = await getTeams();
      if (!Array.isArray(teams)) {
        console.error('Error: La respuesta de getTeams() no es un array');
        return;
      }
      vehicleTeamSelect.innerHTML =
        '<option value="" disabled selected>Seleccione un equipo</option>';
      teams.forEach(team => {
        const option = document.createElement('option');
        option.value = team.id;
        option.textContent = team.name;
        vehicleTeamSelect.appendChild(option);
      });
    } catch (error) {
      console.error('Error al obtener equipos:', error);
    }
  }

  async setVehicleDriverOptions(teamId, vehicleDriverSelect) {
    try {
      if (!vehicleDriverSelect) {
        console.error('Elemento #vehicleDriver no encontrado');
        return;
      }
      vehicleDriverSelect.disabled = false;
      vehicleDriverSelect.classList.remove('select-disabled');
      vehicleDriverSelect.innerHTML =
        '<option value="" disabled selected>Seleccione un piloto</option>';
      const allDrivers = await getDrivers();
      if (!Array.isArray(allDrivers)) {
        console.error('Error: La respuesta de getDrivers() no es un array');
        return;
      }
      const teamDrivers = getDriversByTeamId(allDrivers, teamId);
      if (teamDrivers.length === 0) {
        const option = document.createElement('option');
        option.value = "";
        option.textContent = "No hay pilotos disponibles";
        option.disabled = true;
        vehicleDriverSelect.appendChild(option);
        return;
      }
      teamDrivers.forEach(driver => {
        const option = document.createElement('option');
        option.value = driver.id;
        option.textContent = driver.name;
        vehicleDriverSelect.appendChild(option);
      });
    } catch (error) {
      console.error('Error al obtener pilotos:', error);
      vehicleDriverSelect.innerHTML =
        '<option value="" disabled selected>Error al cargar pilotos</option>';
    }
  }


  getVehicleCardHTML(vehicle) {
    return `
      <div class="card mb-3 vehicle-card">
        <div class="card-embed">
          ${
            vehicle.model3dLink
              ? `<div class="sketchfab-embed-wrapper" id="sketchfab-${vehicle.id}">
                   <p style="color:#fff; text-align:center; padding-top: 40%;">Cargando modelo 3D...</p>
                 </div>`
              : `<img src="${vehicle.image}" class="card-img-top" alt="${vehicle.model}">`
          }
        </div>
        <div class="card-body">
          <h5 class="card-title">${vehicle.model}</h5>
          <p class="card-text"><strong>Motor:</strong> ${vehicle.engine}</p>
          <p class="card-text"><strong>Velocidad máxima:</strong> ${vehicle.maxSpeedKmh} km/h</p>
          <p class="card-text"><strong>Aceleración:</strong> ${vehicle.acceleration} s</p>
          <div class="btns">
            <button class="btn-edit" data-id="${vehicle.id}">Editar</button>
            <button class="btn-delete" data-id="${vehicle.id}">Eliminar</button>
          </div>
        </div>
      </div>
    `;
  }

  attachCardEventListeners() {
    const editButtons = this.shadowRoot.querySelectorAll('.btn-edit');
    editButtons.forEach(button => {
      button.addEventListener('click', (e) => this.editVehicle(e));
    });
    const deleteButtons = this.shadowRoot.querySelectorAll('.btn-delete');
    deleteButtons.forEach(button => {
      button.addEventListener('click', (e) => this.deleteVehicle(e));
    });
  }

  editVehicle(e) {
    const id = e.target.dataset.id;
    const vehicle = this.vehicles.find(v => v.id == id);
    if (vehicle) {
      const form = this.shadowRoot.querySelector('#vehicle-performance-form');
      form.querySelector('[name="model"]').value = vehicle.model;
      form.querySelector('[name="engine"]').value = vehicle.engine;
      form.querySelector('[name="maxSpeedKmh"]').value = vehicle.maxSpeedKmh;
      form.querySelector('[name="acceleration"]').value = vehicle.acceleration;
      form.querySelector('[name="vehicleImageUrl"]').value = vehicle.image;
      form.querySelector('[name="model3dLink"]').value = vehicle.model3dLink || '';
      form.querySelector('[name="averageSpeedNormal"]').value = vehicle.performance.normalDriving.averageSpeedKmh;
      form.querySelector('[name="fuelConsumptionDryNormal"]').value = vehicle.performance.normalDriving.fuelConsumption.dry;
      form.querySelector('[name="fuelConsumptionRainyNormal"]').value = vehicle.performance.normalDriving.fuelConsumption.rainy;
      form.querySelector('[name="fuelConsumptionExtremeNormal"]').value = vehicle.performance.normalDriving.fuelConsumption.extreme;
      form.querySelector('[name="tireWearDryNormal"]').value = vehicle.performance.normalDriving.tireWear.dry;
      form.querySelector('[name="tireWearRainyNormal"]').value = vehicle.performance.normalDriving.tireWear.rainy;
      form.querySelector('[name="tireWearExtremeNormal"]').value = vehicle.performance.normalDriving.tireWear.extreme;
      form.querySelector('[name="averageSpeedAggressive"]').value = vehicle.performance.aggressiveDriving.averageSpeedKmh;
      form.querySelector('[name="fuelConsumptionDryAggressive"]').value = vehicle.performance.aggressiveDriving.fuelConsumption.dry;
      form.querySelector('[name="fuelConsumptionRainyAggressive"]').value = vehicle.performance.aggressiveDriving.fuelConsumption.rainy;
      form.querySelector('[name="fuelConsumptionExtremeAggressive"]').value = vehicle.performance.aggressiveDriving.fuelConsumption.extreme;
      form.querySelector('[name="tireWearDryAggressive"]').value = vehicle.performance.aggressiveDriving.tireWear.dry;
      form.querySelector('[name="tireWearRainyAggressive"]').value = vehicle.performance.aggressiveDriving.tireWear.rainy;
      form.querySelector('[name="tireWearExtremeAggressive"]').value = vehicle.performance.aggressiveDriving.tireWear.extreme;
      form.querySelector('[name="averageSpeedSaving"]').value = vehicle.performance.fuelSaving.averageSpeedKmh;
      form.querySelector('[name="fuelConsumptionDrySaving"]').value = vehicle.performance.fuelSaving.fuelConsumption.dry;
      form.querySelector('[name="fuelConsumptionRainySaving"]').value = vehicle.performance.fuelSaving.fuelConsumption.rainy;
      form.querySelector('[name="fuelConsumptionExtremeSaving"]').value = vehicle.performance.fuelSaving.fuelConsumption.extreme;
      form.querySelector('[name="tireWearDrySaving"]').value = vehicle.performance.fuelSaving.tireWear.dry;
      form.querySelector('[name="tireWearRainySaving"]').value = vehicle.performance.fuelSaving.tireWear.rainy;
      form.querySelector('[name="tireWearExtremeSaving"]').value = vehicle.performance.fuelSaving.tireWear.extreme;
      this.editingVehicle = vehicle;
    }
  }

  async deleteVehicle(e) {
    const id = e.target.dataset.id;
    try {
      const response = await fetch(`http://localhost:3000/vehicles/${id}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        this.loadVehicles();
      } else {
        alert("Error al eliminar vehículo: " + await response.text());
        console.error('Error al eliminar vehículo:', await response.text());
      }
    } catch (error) {
      alert("Error al eliminar vehículo: " + error);
      console.error('Error al eliminar vehículo:', error);
    }
  }

  attachSketchfabEmbeds() {
    this.vehicles.forEach(vehicle => {
      if (vehicle.model3dLink) {
        const embedUrl = `https://sketchfab.com/oembed?url=${encodeURIComponent(vehicle.model3dLink)}`;
        console.log("Obteniendo embed para:", vehicle.model3dLink, "->", embedUrl);
        fetch(embedUrl)
          .then(response => {
            if (!response.ok) {
              throw new Error("Respuesta de Sketchfab: " + response.status);
            }
            return response.json();
          })
          .then(data => {
            console.log("Respuesta de Sketchfab:", data);
            const container = this.shadowRoot.getElementById(`sketchfab-${vehicle.id}`);
            if (container) {
              container.innerHTML = data.html ? data.html : "<p>No se pudo obtener el embed del modelo 3D.</p>";
            }
          })
          .catch(err => {
            console.error("Error al cargar modelo 3D:", err);
            const container = this.shadowRoot.getElementById(`sketchfab-${vehicle.id}`);
            if (container) {
              container.innerHTML = `<p>Error al cargar el modelo 3D: ${err.message}</p>`;
            }
          });
      }
    });
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>

        .form-container {
          background: rgba(0, 0, 0, 0.5) !important;
          border: 2px solid rgb(205,39,38);
          border-radius: 6px;
          margin: 2px;
          padding: 30px;
          justify-content: center;
        }
        .form-floating input,
        .form-floating textarea,
        .form-floating select {
          background-color: rgba(0, 0, 0, 0.5) !important;
          border-color: rgb(205,39,38);
          color: rgb(205,39,38);
        }
        .form-floating input:focus,
        .form-floating textarea:focus,
        .form-floating select:focus {
          border-color: rgb(205,39,38) !important;
          color: rgb(255,255,255) !important;
          box-shadow: 0 0 5px rgb(205,39,38);
          background-color: rgba(0, 0, 0, 0.5) !important;
        }
        .form-floating input::placeholder,
        .form-floating textarea::placeholder {
          color: rgba(205,39,38,0.7);
        }
        .form-control {
          background-color: #f5f5f52f;
          box-shadow: 1px 1px 8px #cd2726;
          width: 300px;
          border: none;
        }
        .form-control::placeholder {
          color: #cd2726;
          font-style: italic;
        }
        .select-disabled {
          opacity: 0.5 !important;
        }
        .form-floating label {
          color: rgb(205,39,38) !important;
          transition: 0.2s ease;
        }
        input[type="number"]::-webkit-outer-spin-button,
        input[type="number"]::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        input[type="number"] {
          -webkit-appearance: textfield;
        }
        .btn-neon {
          position: relative;
          display: inline-block;
          padding: 15px 30px;
          background: transparent;
          color: rgb(205,39,38);
          letter-spacing: 4px;
          text-decoration: none;
          font-size: 20px;
          overflow: hidden;
          transition: 0.2s;
          border: transparent;
        }
        .btn-neon:hover {
          background: #cd2726;
          box-shadow: 0 0 10px #cd2726, 0 0 40px #cd2726, 0 0 80px #cd2726;
          transition-delay: 1s;
          color: white;
        }
        .btn-neon span {
          position: absolute;
          display: block;
        }
        #span1 {
          top: 0;
          left: -100%;
          width: 100%;
          height: 2px;
          background: linear-gradient(90deg, transparent, #cd2726);
        }
        .btn-neon:hover #span1 {
          left: 100%;
          transition: 1s;
        }
        #span3 {
          bottom: 0;
          right: -100%;
          width: 100%;
          height: 2px;
          background: linear-gradient(270deg, transparent, #cd2726);
        }
        .btn-neon:hover #span3 {
          right: 100%;
          transition: 1s;
          transition-delay: 0.5s;
        }
        #span2 {
          top: -100%;
          right: 0;
          width: 2px;
          height: 100%;
          background: linear-gradient(180deg, transparent, #cd2726);
        }
        .btn-neon:hover #span2 {
          top: 100%;
          transition: 1s;
          transition-delay: 0.25s;
        }
        #span4 {
          bottom: -100%;
          left: 0;
          width: 2px;
          height: 100%;
          background: linear-gradient(360deg, transparent, #cd2726);
        }
        .btn-neon:hover #span4 {
          bottom: 100%;
          transition: 1s;
          transition-delay: 0.75s;
        }

        .vehicle-card {
          width: 100%;
          max-width: 540px;
          margin: 10px;
          display: flex;
          flex-direction: column;
          border: 2px solid #cd2726;
          border-radius: 8px;
          overflow: hidden;
          background-color: #fff;
          box-shadow: 0 0 10px rgba(0,0,0,0.5);
        }
        .card-embed {
          width: 100%;
          height: 300px;
          background-color: #000;
          overflow: hidden;
          position: relative;
        }
        .sketchfab-embed-wrapper, .card-img-top {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .card-body {
          padding: 15px;
          color: #333;
        }
        .card-title {
          margin-bottom: 10px;
          font-size: 1.25rem;
          font-weight: bold;
        }
        .card-text {
          margin-bottom: 5px;
          font-size: 0.9rem;
        }
        .btn-edit, .btn-delete {
          margin-right: 5px;
          margin-top: 10px;
          padding: 5px 10px;
          font-size: 0.9rem;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }
        .btn-edit {
          background-color: rgb(90,90,90);
          color: #fff;
        }
        .btn-delete {
          background-color: #cd2726;
          color: #fff;
        }
        #vehicle-cards-container {
          margin-top: 30px;
          display: flex;
          flex-wrap: wrap;
          gap: 20px;
          justify-content: center;
        }
        @media (max-width: 768px) {
          .vehicle-card {
            max-width: 100%;
          }
          .card-embed {
            height: 200px;
          }
        }
      </style>
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" />
      <div class="container">
        <!-- Formulario -->
        <div id="form-container" class="d-flex justify-content-center align-items-center">
          <div class="card">
            <div class="card-glow"></div>
            <div class="card-content">
              <h2 class="text-center mb-4">Datos del vehículo</h2>
              <form id="vehicle-performance-form">
                <div class="row">
                  <!-- Equipo del vehículo -->
                  <div class="col-md-6 mb-3">
                    <div class="form-floating">
                      <select class="form-control" id="vehicleTeam" name="vehicleTeam" required>
                        <option value="" disabled selected>Seleccione un equipo</option>
                      </select>
                    </div>
                  </div>
                  <!-- Piloto del vehículo -->
                  <div class="col-md-6 mb-3">
                    <div class="form-floating">
                      <select class="form-control select-disabled" id="vehicleDriver" name="vehicleDriver" required disabled>
                        <option value="" disabled selected>Piloto</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div class="row">
                  <!-- Motor y Modelo -->
                  <div class="col-md-6 mb-3">
                    <div class="form-floating">
                      <textarea class="form-control" id="engine" name="engine" required placeholder="Motor del vehículo"></textarea>
                      <label for="engine">Motor del Vehículo</label>
                    </div>
                  </div>
                  <div class="col-md-6 mb-3">
                    <div class="form-floating">
                      <textarea class="form-control" id="model" name="model" required placeholder="Modelo del vehículo"></textarea>
                      <label for="model">Modelo del Vehículo</label>
                    </div>
                  </div>
                </div>
                <!-- URL de la imagen -->
                <div class="form-floating mb-3">
                  <input type="url" class="form-control" id="vehicleImageUrl" name="vehicleImageUrl" required placeholder="URL de la imagen del vehículo">
                  <label for="vehicleImageUrl">URL de la Imagen del Vehículo</label>
                </div>
                <!-- Campo para el link del modelo 3D -->
                <div class="form-floating mb-3">
                  <input type="url" class="form-control" id="model3dLink" name="model3dLink" placeholder="Link del modelo 3D (Sketchfab)">
                  <label for="model3dLink">Link del Modelo 3D</label>
                </div>
                <div class="row">
                  <!-- Velocidad máxima y Aceleración -->
                  <div class="col-md-6 mb-3">
                    <div class="form-floating">
                      <input type="number" step="any" class="form-control" id="vehicleSpeed" name="maxSpeedKmh" placeholder="Velocidad máxima" required>
                      <label for="vehicleSpeed">Velocidad Máxima (km/h)</label>
                    </div>
                  </div>
                  <div class="col-md-6 mb-3">
                    <div class="form-floating">
                      <input type="number" step="any" class="form-control" id="vehicleAcceleration" name="acceleration" placeholder="Aceleración (0-100 km/h)" required>
                      <label for="vehicleAcceleration">Aceleración (segundos)</label>
                    </div>
                  </div>
                </div>
                <h2 class="text-center mb-4">Conducción normal</h2>
                <!-- Campos de performance normal -->
                <div class="form-group mb-3">
                  <label for="averageSpeedNormal">Velocidad Promedio</label>
                  <div class="d-flex justify-content-between">
                    <div class="col-md-12">
                      <div class="form-floating">
                        <input type="number" step="any" class="form-control" id="averageSpeedNormal" name="averageSpeedNormal" placeholder="Velocidad promedio" required>
                        <label for="averageSpeedNormal">Velocidad promedio</label>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="form-group mb-3">
                  <label for="fuelConsumption">Consumo de Combustible</label>
                  <div class="d-flex justify-content-between">
                    <div class="col-md-4">
                      <div class="form-floating">
                        <input type="number" step="any" class="form-control" id="fuelConsumptionDryNormal" name="fuelConsumptionDryNormal" placeholder="Seco" required>
                        <label for="fuelConsumptionDryNormal">Seco</label>
                      </div>
                    </div>
                    <div class="col-md-4">
                      <div class="form-floating">
                        <input type="number" step="any" class="form-control" id="fuelConsumptionRainyNormal" name="fuelConsumptionRainyNormal" placeholder="Húmedo" required>
                        <label for="fuelConsumptionRainyNormal">Húmedo</label>
                      </div>
                    </div>
                    <div class="col-md-4">
                      <div class="form-floating">
                        <input type="number" step="any" class="form-control" id="fuelConsumptionExtremeNormal" name="fuelConsumptionExtremeNormal" placeholder="Extremo" required>
                        <label for="fuelConsumptionExtremeNormal">Extremo</label>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="form-group mb-3">
                  <label for="tireWearNormal">Desgaste de Neumáticos</label>
                  <div class="d-flex justify-content-between">
                    <div class="col-md-4">
                      <div class="form-floating">
                        <input type="number" step="any" class="form-control" id="tireWearDryNormal" name="tireWearDryNormal" placeholder="Seco" required>
                        <label for="tireWearDryNormal">Seco</label>
                      </div>
                    </div>
                    <div class="col-md-4">
                      <div class="form-floating">
                        <input type="number" step="any" class="form-control" id="tireWearRainyNormal" name="tireWearRainyNormal" placeholder="Húmedo" required>
                        <label for="tireWearRainyNormal">Húmedo</label>
                      </div>
                    </div>
                    <div class="col-md-4">
                      <div class="form-floating">
                        <input type="number" step="any" class="form-control" id="tireWearExtremeNormal" name="tireWearExtremeNormal" placeholder="Extremo" required>
                        <label for="tireWearExtremeNormal">Extremo</label>
                      </div>
                    </div>
                  </div>
                </div>
                <h2 class="text-center mb-4">Conducción agresiva</h2>
                <!-- Campos de performance agresiva -->
                <div class="form-group mb-3">
                  <label for="averageSpeedAggressive">Velocidad Promedio</label>
                  <div class="d-flex justify-content-between">
                    <div class="col-md-12">
                      <div class="form-floating">
                        <input type="number" step="any" class="form-control" id="averageSpeedAggressive" name="averageSpeedAggressive" placeholder="Velocidad promedio" required>
                        <label for="averageSpeedAggressive">Velocidad promedio</label>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="form-group mb-3">
                  <label for="fuelConsumptionAggressive">Consumo de Combustible</label>
                  <div class="d-flex justify-content-between">
                    <div class="col-md-4">
                      <div class="form-floating">
                        <input type="number" step="any" class="form-control" id="fuelConsumptionDryAggressive" name="fuelConsumptionDryAggressive" placeholder="Seco" required>
                        <label for="fuelConsumptionDryAggressive">Seco</label>
                      </div>
                    </div>
                    <div class="col-md-4">
                      <div class="form-floating">
                        <input type="number" step="any" class="form-control" id="fuelConsumptionRainyAggressive" name="fuelConsumptionRainyAggressive" placeholder="Húmedo" required>
                        <label for="fuelConsumptionRainyAggressive">Húmedo</label>
                      </div>
                    </div>
                    <div class="col-md-4">
                      <div class="form-floating">
                        <input type="number" step="any" class="form-control" id="fuelConsumptionExtremeAggressive" name="fuelConsumptionExtremeAggressive" placeholder="Extremo" required>
                        <label for="fuelConsumptionExtremeAggressive">Extremo</label>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="form-group mb-3">
                  <label for="tireWearAggressive">Desgaste de Neumáticos</label>
                  <div class="d-flex justify-content-between">
                    <div class="col-md-4">
                      <div class="form-floating">
                        <input type="number" step="any" class="form-control" id="tireWearDryAggressive" name="tireWearDryAggressive" placeholder="Seco" required>
                        <label for="tireWearDryAggressive">Seco</label>
                      </div>
                    </div>
                    <div class="col-md-4">
                      <div class="form-floating">
                        <input type="number" step="any" class="form-control" id="tireWearRainyAggressive" name="tireWearRainyAggressive" placeholder="Húmedo" required>
                        <label for="tireWearRainyAggressive">Húmedo</label>
                      </div>
                    </div>
                    <div class="col-md-4">
                      <div class="form-floating">
                        <input type="number" step="any" class="form-control" id="tireWearExtremeAggressive" name="tireWearExtremeAggressive" placeholder="Extremo" required>
                        <label for="tireWearExtremeAggressive">Extremo</label>
                      </div>
                    </div>
                  </div>
                </div>
                <h2 class="text-center mb-4">Conducción de ahorro</h2>
                <!-- Campos de performance de ahorro -->
                <div class="form-group mb-3">
                  <label for="averageSpeedSaving">Velocidad Promedio</label>
                  <div class="d-flex justify-content-between">
                    <div class="col-md-12">
                      <div class="form-floating">
                        <input type="number" step="any" class="form-control" id="averageSpeedSaving" name="averageSpeedSaving" placeholder="Velocidad promedio" required>
                        <label for="averageSpeedSaving">Velocidad promedio</label>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="form-group mb-3">
                  <label for="fuelConsumptionSaving">Consumo de Combustible</label>
                  <div class="d-flex justify-content-between">
                    <div class="col-md-4">
                      <div class="form-floating">
                        <input type="number" step="any" class="form-control" id="fuelConsumptionDrySaving" name="fuelConsumptionDrySaving" placeholder="Seco" required>
                        <label for="fuelConsumptionDrySaving">Seco</label>
                      </div>
                    </div>
                    <div class="col-md-4">
                      <div class="form-floating">
                        <input type="number" step="any" class="form-control" id="fuelConsumptionRainySaving" name="fuelConsumptionRainySaving" placeholder="Húmedo" required>
                        <label for="fuelConsumptionRainySaving">Húmedo</label>
                      </div>
                    </div>
                    <div class="col-md-4">
                      <div class="form-floating">
                        <input type="number" step="any" class="form-control" id="fuelConsumptionExtremeSaving" name="fuelConsumptionExtremeSaving" placeholder="Extremo" required>
                        <label for="fuelConsumptionExtremeSaving">Extremo</label>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="form-group mb-3">
                  <label for="tireWearSaving">Desgaste de Neumáticos</label>
                  <div class="d-flex justify-content-between">
                    <div class="col-md-4">
                      <div class="form-floating">
                        <input type="number" step="any" class="form-control" id="tireWearDrySaving" name="tireWearDrySaving" placeholder="Seco" required>
                        <label for="tireWearDrySaving">Seco</label>
                      </div>
                    </div>
                    <div class="col-md-4">
                      <div class="form-floating">
                        <input type="number" step="any" class="form-control" id="tireWearRainySaving" name="tireWearRainySaving" placeholder="Húmedo" required>
                        <label for="tireWearRainySaving">Húmedo</label>
                      </div>
                    </div>
                    <div class="col-md-4">
                      <div class="form-floating">
                        <input type="number" step="any" class="form-control" id="tireWearExtremeSaving" name="tireWearExtremeSaving" placeholder="Extremo" required>
                        <label for="tireWearExtremeSaving">Extremo</label>
                      </div>
                    </div>
                  </div>
                </div>
                <!-- Botón para agregar/editar vehículo -->
                <button type="submit" class="btn-neon">
                  <span id="span1"></span>
                  <span id="span2"></span>
                  <span id="span3"></span>
                  <span id="span4"></span>
                  AGREGAR VEHÍCULO
                </button>
              </form>
            </div>
            <div class="corner top-left"></div>
            <div class="corner top-right"></div>
            <div class="corner bottom-left"></div>
            <div class="corner bottom-right"></div>
          </div>
        </div>
        <!-- Contenedor de tarjetas de vehículos -->
        <div id="vehicle-cards-container">
          ${this.vehicles.map(vehicle => this.getVehicleCardHTML(vehicle)).join('')}
        </div>
      </div>
    `;

    const form = this.shadowRoot.querySelector('#vehicle-performance-form');
    form.addEventListener('submit', (e) => this.handleSubmit(e));

    const vehicleTeamSelect = this.shadowRoot.querySelector('#vehicleTeam');
    const vehicleDriverSelect = this.shadowRoot.querySelector('#vehicleDriver');
    vehicleTeamSelect.addEventListener('change', (event) => {
      this.vehicleTeamSelectHandleChange(event, vehicleDriverSelect);
    });
    this.setVehicleTeamOptions(vehicleTeamSelect);

    this.attachCardEventListeners();
    this.attachSketchfabEmbeds();
  }
}

customElements.define('form-data-driving-component', FormDataDrivingComponent);
