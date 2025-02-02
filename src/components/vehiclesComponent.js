/*import { postVehicles, patchVehicles, deleteVehicles } from '../../../Apis/vehicle/vehicleApi.js';
import VehicleModel from '../../../Models/vehicleModel.js';
*/

import getTeams from '../js/getTeams.js';
import getDrivers from '../js/getDrivers.js';
import getVehicles from '../js/getVehicles.js';
import getDriversByTeamId from '../js/getDriversByTeamId.js';
import getVehiclesByTeamId from '../js/getVehiclesByTeamId.js';
export class VehiclesComponent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.render();
    const vehicleTeamSelect = this.shadowRoot?.querySelector('#vehicleTeam');
    const vehicleDriverSelect = this.shadowRoot?.querySelector('#vehicleDriver');
    const vehicleSelect = this.shadowRoot?.querySelector('#vehicleSelect');

    vehicleTeamSelect.onchange = (event) => {
      this.vehicleTeamSelectHandleChange(event, vehicleDriverSelect, vehicleSelect);
    }

    //this.saveData();
    this.loadVehicles();
    this.setVehicleTeamOptions(vehicleTeamSelect);
  }
  render() {
    /* let vehicles;
     getVehicles().then(data => {
      vehicles = data;
    }); */


    this.shadowRoot.innerHTML = `
     <style>
     .form-container {
      background: rgba(0, 0, 0, 0.5) !important;
      border: 2px solid rgb(205,39,38); 
      border-radius: 6px;
      margin: 2px;
      border: 2px solid rgb(205,39,38); 
      border-radius: 8px;
      padding: 30px;
      justify-content: center;
      
      }
      
      
    .form-floating input, .form-floating textarea, .form-floating select {
      background-color: rgba(0, 0, 0, 0.5) !important;
      border-color: rgb(205,39,38);
      color: rgb(205,39,38);
      }
      
    .form-floating input:focus, .form-floating textarea:focus, .form-floating select:focus {
      border-color: rgb(205,39,38) !important;
      color: rgb(255, 255, 255) !important;  
      box-shadow: 0 0 5px rgb(205,39,38); 
      background-color: rgba(0, 0, 0, 0.5) !important; 
    }

    .form-floating input::placeholder, .form-floating textarea::placeholder {
      color: rgba(205,39,38, 0.7);  
    }
    .form-control{
      background-color: #f5f5f52f;
      box-shadow: 1px 1px 8px  #cd2726;
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
          
    .btn-neon{
      position: relative;
      display: inline-block;
      padding: 15px 30px;
      color: rgb(205,39,38);
      letter-spacing: 4px;
      text-decoration: none;
      font-size: 20px;
      overflow: hidden;
      transition: 0.2s;
      }
    .btn-neon:hover{
      background: #cd2726;
      box-shadow: 0 0 10px #cd2726, 0 0 40px #cd2726, 0 0 80px #cd2726;
      transition-delay: 1s;
      color: white;
      }
    .btn-neon span{
      position: absolute;
      display: block;
      }
    #span1{
      top: 0;
      left: -100%;
      width: 100%;
      height: 2px;
      background: linear-gradient(90deg, transparent,#cd2726);
      }
    .btn-neon:hover #span1{
      left: 100%;
      transition: 1s;
      }
    #span3{
      bottom: 0;
      right: -100%;
      width: 100%;
      height: 2px;
      background: linear-gradient(270deg, transparent,#cd2726);
      }
    .btn-neon:hover #span3{
      right: 100%;
      transition: 1s;
      transition-delay: 0.5s;
      }
    #span2{
      top: -100%;
      right: 0;
      width: 2px;
      height: 100%;
      background: linear-gradient(180deg,transparent,#cd2726);
      }
    .btn-neon:hover #span2{
      top: 100%;
      transition: 1s;
      transition-delay: 0.25s;
      }
    #span4{
      bottom: -100%;
      left: 0;
      width: 2px;
      height: 100%;
      background: linear-gradient(360deg,transparent,#cd2726);
      }
    .btn-neon:hover #span4{
      bottom: 100%;
      transition: 1s;
      transition-delay: 0.75s;
      }
    .card {
      text-align: center;
      display: flex;
      justify-content: center;
      align-items: center;
      position: relative;
      border: 2px solid #cd2726;
      border-radius: 8px;
      overflow: hidden;
      background-color: unset; 
      background-color:  rgba(0, 0, 0, 0.5) !important;
      }
                                
    :root {
      --bs-card-bg: transparent;  
      }
                                  
    .card-glow {
      position: absolute;
      inset: 0;
      background: transparent;
      border: 2px solid #cd2726;
      border-radius: 6px;
      margin: 2px;
      pointer-events: none;
      box-shadow: 1px 1px 8px 1px #cd2726;
    }
    
    .card-content {
      position: relative;
      height: 100%;
      z-index: 1;
      padding: 16px;
      color: #cd2726;
    }
    
    .corner {
      position: absolute;
      width: 20px;
      height: 20px;
      border: 5px solid #cd2726;
    }
    .corner-btn {
      position: absolute;
      width: 10px;
      height: 10px;
      border: 4px solid #cd2726;
    }
    
    .top-left {
      top: -1px;
      left: -1px;
      border-right: 0;
      border-bottom: 0;
    }
    
    .top-right {
      top: -1px;
      right: -1px;
      border-left: 0;
      border-bottom: 0;
    }
    
    .bottom-left {
      bottom: -1px;
      left: -1px;
      border-right: 0;
      border-top: 0;
    }
    
    a{
      text-decoration: none;
      color: #cd2726;
    }
    a:hover{
      text-decoration: none;
      color: #054c55;
    }
    
    .bottom-right {
      bottom: -1px;
      right: -1px;
      border-left: 0;
      border-top: 0;
    }
    .card:hover {
      box-shadow: 0 0 20px #cd2726;
      transform: scale(1);
    }
    
    .card:hover .card-glow {
      box-shadow: 0 0 20px #cd2726;
      transform: scale(1);
    }
    
    .card::before {
      content: '';
      position: absolute;
      inset: 4px;
      border: 1px solid #cd2726;
      border-radius: 6px;
      pointer-events: none;
    }

      </style>
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet" />
      <div class="container d-flex justify-content-center align-items-center">
      <div class="card">
      <div class="card-glow"></div>
      <div class="card-content">
      <h2 class="text-center mb-4" >Administración de Vehículos</h2>
      <form id="add-vehicle-form">
      
              <!-- Equipo del vehículo -->
              <div class="form-floating mb-3">
                <select class="form-control" id="vehicleTeam" required>
                  <option value="" disabled selected>Equipo</option>

                </select>
              </div>

              <!-- Piloto del vehículo -->
              <div class="form-floating mb-3">
                <select class="form-control select-disabled" id="vehicleDriver" required disabled>
                  <option value="" disabled selected>Piloto</option>
                </select>
              </div>
              
              <!-- Selección de vehículo -->
              <div class="form-floating mb-3">
                <select class="form-control select-disabled" id="vehicleSelect" required>
                  <option value="" disabled selected>Selecciona tu vehículo</option>
                  
                </select>
              </div>
        
              <!-- Desgaste de neumáticos -->
              <div class="form-floating mb-3">
              <select class="form-control" id="tireWear" required>
              <option value="" disabled selected>Desgaste de Neumáticos</option>
                  <option value="low">Bajo</option>
                  <option value="medium">Medio</option>
                  <option value="high">Alto</option>
                </select>
              </div>
              
              <!-- Consumo de combustible -->
              <div class="form-floating mb-3">
                <select class="form-control" id="fuelConsumption" required>
                <option value="" disabled selected>Consumo de combustible</option>
                  <option value="low">Bajo</option>
                  <option value="medium">Medio</option>
                  <option value="high">Alto</option>
                </select>
              </div>
  
              <!-- Velocidad máxima -->
              <div class="form-floating mb-3">
                <input type="number" class="form-control" id="vehicleSpeed" placeholder="Velocidad máxima" required>
                <label class="label" for="vehicleSpeed">Velocidad Máxima (km/h)</label>
              </div>
  
              <!-- Aceleración -->
              <div class="form-floating mb-3">
                <input type="number" class="form-control" id="vehicleAcceleration" placeholder="Aceleración (0-100 km/h)" required>
                <label class="label" for="vehicleAcceleration">Aceleración (segundos)</label>
              </div>
  
              <a href="#" class="btn-neon">
              <span id="span1"></span>
              <span id="span2"></span>
              <span id="span3"></span>
              <span id="span4"></span>
              AGREGAR VEHÍCULO
          </a>
  
        </div>
        <div class="corner top-left"></div>
        <div class="corner top-right"></div>
        <div class="corner bottom-left"></div>
        <div class="corner bottom-right"></div>
      </div>

        </div>
      </div>
    `;
  }

  vehicleTeamSelectHandleChange(event, vehicleDriverSelect, vehicleSelect) {
    const teamId = event.target.value;
    this.setVehicleDriverOptions(teamId, vehicleDriverSelect);
    this.setVehicleOptions(teamId, vehicleSelect)
  }

  async setVehicleTeamOptions(vehicleTeamSelect) {
    try {
      if (!vehicleTeamSelect) {
        console.error('Elemento #vehicleTeam no encontrado');
        return;
      }
      let teams = await getTeams();
      if (!Array.isArray(teams)) {
        console.error('Error: La respuesta de getTeams() no es un array');
        return;
      }
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
      let allDrivers = await getDrivers();
      if (!Array.isArray(allDrivers)) {
        console.error('Error: La respuesta de getDrivers() no es un array');
        return;
      }

      let teamDrivers = getDriversByTeamId(allDrivers, teamId);

      teamDrivers.forEach(Driver => {
        const option = document.createElement('option');
        option.value = Driver.id;
        option.textContent = Driver.name;
        vehicleDriverSelect.appendChild(option);
      });
    } catch (error) {
      console.error('Error al obtener equipos:', error);
    }
  }

  async setVehicleOptions(teamId, vehicleSelect) {
    try {
      if (!vehicleSelect) {
        console.error('Elemento #vehicleSelect no encontrado');
        return;
      }
      vehicleSelect.disabled = false;
      vehicleSelect.classList.remove('select-disabled');
      let allVehicles = await getVehicles();
      if (!Array.isArray(allVehicles)) {
        console.error('Error: La respuesta de getVehicles() no es un array');
        return;
      }

      let teamVehicles = getVehiclesByTeamId(allVehicles, teamId);

      teamVehicles.forEach(vehicle => {
        const option = document.createElement('option');
        option.value = vehicle.id;
        option.textContent = vehicle.engine + ' ' + vehicle.model;
        vehicleSelect.appendChild(option);
      });
    } catch (error) {
      console.error('Error al obtener equipos:', error);
    }
  }

  saveData() {
    this.shadowRoot.querySelector('#btnGuardar').addEventListener("click", (e) => {
      e.preventDefault();

      const vehicleSelect = this.shadowRoot.querySelector('#vehicleSelect').value;
      const vehicleDescription = this.shadowRoot.querySelector('#vehicleDescription').value;
      const vehicleDriver = this.shadowRoot.querySelector('#vehicleDriver').value;
      const vehicleTeam = this.shadowRoot.querySelector('#vehicleTeam').value;

      const vehicleData = {
        name: vehicleSelect,
        description: vehicleDescription,
        Driver: vehicleDriver,
        team: vehicleTeam,
        id: Date.now()
      };

      let vehicles = JSON.parse(localStorage.getItem('vehicles')) || [];
      vehicles.push(vehicleData);
      localStorage.setItem('vehicles', JSON.stringify(vehicles));

      this.createVehicleCard(vehicleData);
    });
  }

  loadVehicles() {
    let vehicles = JSON.parse(localStorage.getItem('vehicles')) || [];
    vehicles.forEach(vehicle => this.createVehicleCard(vehicle));
  }

  createVehicleCard(vehicleData) {
    const vehicleContainer = this.shadowRoot.querySelector('#vehicleContainer');
    const card = document.createElement('div');
    card.innerHTML = `
        <div class="card">
          <h3>${vehicleData.name}</h3>
          <p>${vehicleData.description}</p>
          <p>Drivero: ${vehicleData.Driver}</p>
          <p>Equipo: ${vehicleData.team}</p>
          <button class="edit-btn">Editar</button>
          <button class="delete-btn">Eliminar</button>
        </div>
      `;

    card.querySelector('.delete-btn').addEventListener('click', () => {
      this.deleteVehicle(vehicleData.id, card);
    });

    card.querySelector('.edit-btn').addEventListener('click', () => {
      this.editVehicle(vehicleData, card);
    });

    vehicleContainer.appendChild(card);
  }

  deleteVehicle(id, card) {
    let vehicles = JSON.parse(localStorage.getItem('vehicles')) || [];
    vehicles = vehicles.filter(vehicle => vehicle.id !== id);
    localStorage.setItem('vehicles', JSON.stringify(vehicles));
    card.remove();
  }

  editVehicle(vehicleData, card) {
    const newName = prompt("Editar vehículo", vehicleData.name);
    const newDescription = prompt("Editar descripción", vehicleData.description);

    if (newName && newDescription) {
      vehicleData.name = newName;
      vehicleData.description = newDescription;

      let vehicles = JSON.parse(localStorage.getItem('vehicles')) || [];
      vehicles = vehicles.map(vehicle => vehicle.id === vehicleData.id ? vehicleData : vehicle);
      localStorage.setItem('vehicles', JSON.stringify(vehicles));

      card.querySelector('h3').innerText = newName;
      card.querySelector('p').innerText = newDescription;
    }
  }
}

customElements.define('vehicles-component', VehiclesComponent);
