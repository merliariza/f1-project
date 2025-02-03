import getVehicles from '../js/getVehicles.js';
import getVehiclesByTeamId from '../js/getVehiclesByTeamId.js';
export class SavingDrivingComponent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.vehicles = [];
    this.editingVehicle = null;
}

connectedCallback() {
    this.loadVehicles();
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
    const formData = new FormData(event.target);
    const vehicleData = {
        model: formData.get('model'),
        engine: formData.get('engine'),
        maxSpeedKmh: formData.get('maxSpeedKmh'),
        acceleration: formData.get('acceleration'),
        performance: {
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
                },
                
            }
        }
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
            event.target.reset();
            this.editingVehicle = null;
        }
    } catch (error) {
        console.error('Error guardando vehículo:', error);
    }
}
render() {
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
      background: transparent;
      color: rgb(205,39,38);
      letter-spacing: 4px;
      text-decoration: none;
      font-size: 20px;
      overflow: hidden;
      transition: 0.2s;
      border: transparent;
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
      <h2 class="text-center mb-4">Conducción de ahorro</h2>
      
      <form id="vehicle-performance-form">
        
        <!-- Velocidad Promedio -->
<div class="form-group mb-3">
  <label for="averageSpeed">Velocidad Promedio</label>
  <div class="d-flex justify-content-between">
    
  <div class="col-md-12">
  <div class="form-floating">
    <input type="number" class="form-control" id="averageSpeedSaving"" name="averageSpeedSaving" placeholder="Velocidad promedio" required>
    <label for="averageSpeedSaving">Velocidad promedio</label>
  </div>
</div>

  </div>
</div>

<!-- Consumo de Combustible -->
<div class="form-group mb-3">
  <label for="fuelConsumption">Consumo de Combustible</label>
  <div class="d-flex justify-content-between">
    
    <!-- Columna Seco -->
    <div class="col-md-4">
      <div class="form-floating">
        <input type="number" class="form-control" id="fuelConsumptionDrySaving" name="fuelConsumptionDrySaving" placeholder="Seco" required>
        <label for="fuelConsumptionDrySaving">Seco</label>
      </div>
    </div>
    
    <!-- Columna Húmedo -->
    <div class="col-md-4">
      <div class="form-floating">
        <input type="number" class="form-control" id="fuelConsumptionRainySaving" name="fuelConsumptionRainySaving" placeholder="Húmedo" required>
        <label for="fuelConsumptionRainySaving">Húmedo</label>
      </div>
    </div>

    <!-- Columna Extremo -->
    <div class="col-md-4">
      <div class="form-floating">
        <input type="number" class="form-control" id="fuelConsumptionExtremeSaving" name="fuelConsumptionExtremeSaving" placeholder="Extremo" required>
        <label for="fuelConsumptionExtremeSaving">Extremo</label>
      </div>
    </div>

  </div>
</div>


<!-- Desgaste de Neumáticos -->
<div class="form-group mb-3">
  <label for="tireWear">Desgaste de Neumáticos</label>
  <div class="d-flex justify-content-between">
    
    <!-- Columna Seco -->
    <div class="col-md-4">
      <div class="form-floating">
        <input type="number" class="form-control" id="tireWearDrySaving" name="tireWearDrySaving" placeholder="Seco" required>
        <label for="tireWearDrySaving">Seco</label>
      </div>
    </div>
    
    <!-- Columna Húmedo -->
    <div class="col-md-4">
      <div class="form-floating">
        <input type="number" class="form-control" id="tireWearRainySaving" name="tireWearRainySaving" placeholder="Húmedo" required>
        <label for="tireWearRainySaving">Húmedo</label>
      </div>
    </div>

    <!-- Columna Extremo -->
    <div class="col-md-4">
      <div class="form-floating">
        <input type="number" class="form-control" id="tireWearExtremeSaving" name="tireWearExtremeSaving" placeholder="Extremo" required>
        <label for="tireWearExtremeSaving">Extremo</label>
      </div>
    </div>

  </div>
</div>


        <button type="submit" class="btn-neon">
          <span id="span1"></span>
          <span id="span2"></span>
          <span id="span3"></span>
          <span id="span4"></span>
          AGREGAR RENDIMIENTO
        </button>
      </form>
    </div>
    <div class="corner top-left"></div>
    <div class="corner top-right"></div>
    <div class="corner bottom-left"></div>
    <div class="corner bottom-right"></div>
  </div>
</div>


    `;
    this.shadowRoot.querySelector('#vehicle-performance-form').addEventListener('submit', (e) => this.handleSubmit(e));
  }
}
customElements.define('saving-driving-component', SavingDrivingComponent);
