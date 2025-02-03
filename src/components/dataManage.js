/*class AdminVehiclePerformanceComponent extends HTMLElement {
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
            const response = await fetch('http://localhost:5008/vehicles');
            this.vehicles = await response.json();
            this.render();
        } catch (error) {
            console.error('Error cargando vehículos:', error);
        }
    }

    async editVehicle(id) {
        const vehicle = this.vehicles.find(v => v.id === id);
        if (!vehicle) return;

        const form = this.shadowRoot.querySelector('#vehicleForm');
        form.model.value = vehicle.model;
        form.engine.value = vehicle.engine;
        form.maxSpeed.value = vehicle.maxSpeedKmh;
        form.aceleration.value = vehicle.aceleration;

        this.editingVehicle = vehicle;
        this.shadowRoot.querySelector('.form-section').scrollIntoView({ behavior: 'smooth' });
    }

    async handleSubmit(event) {
        event.preventDefault();
        const formData = new FormData(event.target);
        const vehicleData = {
            model: formData.get('model'),
            engine: formData.get('engine'),
            maxSpeedKmh: parseFloat(formData.get('maxSpeed')),
            aceleration: parseFloat(formData.get('aceleration')),
        };

        let url = 'http://localhost:5008/vehicles';
        let method = 'POST';

        if (this.editingVehicle) {
            url += `/${this.editingVehicle.id}`;
            method = 'PUT';
        }

        try {
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
            console.error('Error:', error);
        }
    }

    async deleteVehicle(id) {
        if (confirm('¿Eliminar este vehículo?')) {
            try {
                await fetch(`http://localhost:5008/vehicles/${id}`, { method: 'DELETE' });
                this.loadVehicles();
            } catch (error) {
                console.error('Error eliminando vehículo:', error);
            }
        }
    }

    render() {
        this.shadowRoot.innerHTML = `
            <style>
                .admin-panel { padding: 20px; color: #fff; background-color: #1a1a1a; }
                .form-section { margin-bottom: 20px; }
                .vehicles-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 15px; }
                .vehicle-card { background: rgba(30, 30, 30, 0.9); padding: 10px; }
                .vehicle-card h3 { color: #ff0000; }
                .form-actions button { padding: 10px; }
            </style>

            <div class="admin-panel">
                <div class="form-section">
                    <h2>Registrar Nuevo Vehículo</h2>
                    <form id="vehicleForm">
                        <input type="text" name="model" placeholder="Modelo" required>
                        <input type="text" name="engine" placeholder="Motor" required>
                        <input type="number" name="maxSpeed" placeholder="Velocidad Máxima" required>
                        <input type="number" name="aceleration" placeholder="Aceleración" required>
                        <button type="submit">Registrar Vehículo</button>
                    </form>
                </div>

                <h2>Vehículos Registrados</h2>
                <div class="vehicles-grid">
                    ${this.vehicles.map(vehicle => `
                        <div class="vehicle-card">
                            <h3>${vehicle.model}</h3>
                            <p>Motor: ${vehicle.engine}</p>
                            <p>Velocidad Máxima: ${vehicle.maxSpeedKmh} km/h</p>
                            <p>Aceleración: ${vehicle.aceleration} seg</p>
                            <button onclick="this.getRootNode().host.editVehicle(${vehicle.id})">Editar</button>
                            <button onclick="this.getRootNode().host.deleteVehicle(${vehicle.id})">Eliminar</button>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;

        this.shadowRoot.querySelector('#vehicleForm').addEventListener('submit', (e) => this.handleSubmit(e));
    }
}

customElements.define('admin-vehicle-performance', AdminVehiclePerformanceComponent);
*/

class AdminVehiclePerformanceComponent extends HTMLElement {
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
                .admin-panel {
                    padding: 20px;
                    color: #fff;
                    background-color: #1a1a1a;
                }
                .form-section {
                    padding: 20px;
                    background: rgba(30, 30, 30, 0.9);
                    border-radius: 10px;
                    box-shadow: 0 0 10px rgba(255, 0, 0, 0.3);
                }
            </style>
            <div class="admin-panel">
                <div class="form-section">
                    <h2>Registrar Rendimiento del Vehículo</h2>
                    <form id="vehicleForm">
                        <label>Modelo</label>
                        <input type="text" name="model" required>

                        <label>Motor</label>
                        <input type="text" name="engine" required>

                        <label>Velocidad Máxima (km/h)</label>
                        <input type="number" name="maxSpeedKmh" required>

                        <label>Aceleración (0-100 km/h)</label>
                        <input type="number" name="acceleration" required>

                        <h4>Normal Driving</h4>
                        <label>Velocidad Promedio (km/h)</label>
                        <input type="number" name="averageSpeedNormal" required>

                        <label>Consumo de Combustible</label>
                        <input type="number" name="fuelConsumptionDryNormal" placeholder="Seco" required>
                        <input type="number" name="fuelConsumptionRainyNormal" placeholder="Húmedo" required>
                        <input type="number" name="fuelConsumptionExtremeNormal" placeholder="Extremo" required>

                        <label>Desgaste de Neumáticos</label>
                        <input type="number" name="tireWearDryNormal" placeholder="Seco" required>
                        <input type="number" name="tireWearRainyNormal" placeholder="Húmedo" required>
                        <input type="number" name="tireWearExtremeNormal" placeholder="Extremo" required>

                        <button type="submit">Guardar</button>
                    </form>
                </div>
            </div>
        `;

        this.shadowRoot.querySelector('#vehicleForm').addEventListener('submit', (e) => this.handleSubmit(e));
    }
}

customElements.define('admin-vehicle-performance', AdminVehiclePerformanceComponent);
