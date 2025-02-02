class AdminTeamComponent extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.teams = [];
        this.drivers = [];
        this.editingTeam = null;
    }

    connectedCallback() {
        this.loadTeams();
    }

    async loadTeams() {
        try {
            const [teamsResponse, driversResponse] = await Promise.all([
                fetch('http://localhost:3000/teams'),
                fetch('http://localhost:3000/drivers')
            ]);
            
            this.teams = await teamsResponse.json();
            this.drivers = await driversResponse.json();
            this.render();
        } catch (error) {
            console.error('Error cargando datos:', error);
        }
    }

    getTeamDrivers(team) {
        return team.drivers
            .map(driverId => this.drivers.find(d => d.id === driverId))
            .filter(driver => driver);
    }

    async editTeam(id) {
        try {
            const team = this.teams.find(t => t.id === id);
            if (!team) return;

            // Llenar el formulario con los datos del equipo
            const form = this.shadowRoot.querySelector('#teamForm');
            form.name.value = team.name;
            form.country.value = team.country;
            form.engine.value = team.engine;
            form.image.value = team.image;

            // Cambiar el botón de submit
            const submitBtn = form.querySelector('button[type="submit"]');
            submitBtn.textContent = 'Actualizar Equipo';
            
            // Guardar referencia del equipo que se está editando
            this.editingTeam = team;

            // Scroll hacia el formulario
            this.shadowRoot.querySelector('.form-section').scrollIntoView({ behavior: 'smooth' });
        } catch (error) {
            console.error('Error al editar equipo:', error);
        }
    }

    async handleSubmit(event) {
        event.preventDefault();
        const formData = new FormData(event.target);
        const teamData = {
            name: formData.get('name'),
            country: formData.get('country'),
            engine: formData.get('engine'),
            image: formData.get('image'),
            drivers: this.editingTeam ? this.editingTeam.drivers : [] // Mantener los pilotos existentes si es edición
        };

        try {
            let url = 'http://localhost:3000/teams';
            let method = 'POST';

            if (this.editingTeam) {
                url += `/${this.editingTeam.id}`;
                method = 'PUT';
            }

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(teamData)
            });

            if (response.ok) {
                this.loadTeams();
                event.target.reset();
                
                // Resetear el estado de edición
                this.editingTeam = null;
                const submitBtn = event.target.querySelector('button[type="submit"]');
                submitBtn.textContent = 'Registrar Equipo';

                // Mostrar mensaje de éxito
                this.showSuccessMessage(this.editingTeam ? 'Equipo actualizado' : 'Equipo registrado');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }

    showSuccessMessage(message) {
        const successDiv = this.shadowRoot.querySelector('.success-message');
        successDiv.textContent = message;
        successDiv.style.display = 'block';
        setTimeout(() => {
            successDiv.style.display = 'none';
        }, 3000);
    }

    async deleteTeam(id) {
        if (confirm('¿Estás seguro de eliminar este equipo?')) {
            try {
                const response = await fetch(`http://localhost:3000/teams/${id}`, {
                    method: 'DELETE'
                });
                if (response.ok) {
                    this.loadTeams();
                }
            } catch (error) {
                console.error('Error eliminando equipo:', error);
            }
        }
    }

    async addDriver(teamId, event) {
        event.preventDefault();
        const team = this.teams.find(t => t.id === teamId);
        if (!team) return;

        const driverData = {
            name: this.shadowRoot.querySelector(`#driverName_${teamId}`).value,
            number: parseInt(this.shadowRoot.querySelector(`#driverNumber_${teamId}`).value),
            country: this.shadowRoot.querySelector(`#driverCountry_${teamId}`).value,
            photo: this.shadowRoot.querySelector(`#driverPhoto_${teamId}`).value,
            team: team.name
        };

        try {
            const driverResponse = await fetch('http://localhost:3000/drivers', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(driverData)
            });

            if (driverResponse.ok) {
                const newDriver = await driverResponse.json();
                
                const updatedTeam = {
                    ...team,
                    drivers: Array.isArray(team.drivers) ? [...team.drivers, newDriver.id] : [newDriver.id]
                };

                const teamResponse = await fetch(`http://localhost:3000/teams/${teamId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(updatedTeam)
                });

                if (teamResponse.ok) {
                    // Limpiar el formulario
                    this.shadowRoot.querySelector(`#driverName_${teamId}`).value = '';
                    this.shadowRoot.querySelector(`#driverNumber_${teamId}`).value = '';
                    this.shadowRoot.querySelector(`#driverCountry_${teamId}`).value = '';
                    this.shadowRoot.querySelector(`#driverPhoto_${teamId}`).value = '';
                    
                    this.loadTeams();
                    this.showSuccessMessage('Piloto agregado correctamente');
                }
            } else {
                console.error('Error al agregar piloto:', await driverResponse.text());
            }
        } catch (error) {
            console.error('Error agregando piloto:', error);
        }
    }

    async removeDriver(teamId, driverId) {
        if (!confirm('¿Estás seguro de eliminar este piloto?')) return;

        const team = this.teams.find(t => t.id === teamId);
        if (!team) return;

        try {
            const updatedTeam = {
                ...team,
                drivers: team.drivers.filter(id => id !== driverId)
            };

            const teamResponse = await fetch(`http://localhost:3000/teams/${teamId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedTeam)
            });

            if (teamResponse.ok) {
                await fetch(`http://localhost:3000/drivers/${driverId}`, {
                    method: 'DELETE'
                });

                this.loadTeams();
                this.showSuccessMessage('Piloto eliminado correctamente');
            }
        } catch (error) {
            console.error('Error eliminando piloto:', error);
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
                    margin-bottom: 30px;
                    padding: 20px;
                    border-radius: 10px;
                    background: rgba(30, 30, 30, 0.9);
                    box-shadow: 0 0 10px rgba(255, 0, 0, 0.3);
                }

                .teams-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                    gap: 20px;
                    margin-top: 20px;
                }

                .team-card {
                    background: rgba(30, 30, 30, 0.9);
                    border-radius: 10px;
                    padding: 15px;
                    box-shadow: 0 0 15px rgba(255, 0, 0, 0.2);
                    transition: all 0.3s ease;
                }

                .team-card:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 0 20px rgba(255, 0, 0, 0.4);
                }

                .team-card img {
                    width: 100%;
                    height: 200px;
                    object-fit: cover;
                    border-radius: 8px;
                    margin-bottom: 15px;
                }

                .team-info {
                    margin-bottom: 15px;
                }

                .team-info h3 {
                    color: #ff0000;
                    margin: 0 0 10px 0;
                    text-shadow: 0 0 5px rgba(255, 0, 0, 0.5);
                }

                .drivers-section {
                    margin-top: 15px;
                    padding: 15px;
                    background: rgba(40, 40, 40, 0.9);
                    border-radius: 8px;
                }

                .driver-item {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 10px;
                    margin: 5px 0;
                    background: rgba(50, 50, 50, 0.9);
                    border-radius: 5px;
                    border: 1px solid rgba(255, 0, 0, 0.1);
                }

                .driver-form {
                    display: grid;
                    grid-template-columns: 1fr;
                    gap: 10px;
                    margin-top: 15px;
                }

                input, button {
                    padding: 10px;
                    border-radius: 5px;
                    border: 1px solid rgba(255, 0, 0, 0.3);
                    background: rgba(30, 30, 30, 0.9);
                    color: #fff;
                    transition: all 0.3s ease;
                }

                input:focus {
                    outline: none;
                    border-color: #ff0000;
                    box-shadow: 0 0 10px rgba(255, 0, 0, 0.3);
                }

                button {
                    cursor: pointer;
                    font-weight: bold;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                }

                .add-driver-btn {
                    background: linear-gradient(45deg, #ff0000, #cc0000);
                    border: none;
                    color: #fff;
                    font-weight: bold;
                }

                .add-driver-btn:hover {
                    background: linear-gradient(45deg, #cc0000, #ff0000);
                    box-shadow: 0 0 15px rgba(255, 0, 0, 0.5);
                }

                .edit-btn, .delete-btn {
                    padding: 8px 15px;
                    margin: 5px;
                    border: none;
                }

                .edit-btn {
                    background: linear-gradient(45deg, #ff0000, #cc0000);
                    color: #fff;
                }

                .delete-btn {
                    background: linear-gradient(45deg, #ff3366, #cc0000);
                    color: #fff;
                }

                .success-message {
                    display: none;
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    padding: 15px 25px;
                    background: rgba(255, 0, 0, 0.2);
                    border: 1px solid #ff0000;
                    border-radius: 5px;
                    color: #ff0000;
                    text-shadow: 0 0 5px rgba(255, 0, 0, 0.5);
                    animation: fadeIn 0.3s ease;
                }

                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(-20px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                .team-actions {
                    display: flex;
                    justify-content: flex-end;
                    gap: 10px;
                    margin-top: 15px;
                }

                h4 {
                    color: #ff0000;
                    margin: 0 0 15px 0;
                    text-shadow: 0 0 5px rgba(255, 0, 0, 0.5);
                }

                .remove-driver-btn {
                    background: linear-gradient(45deg, #ff3366, #cc0000);
                    border: none;
                    color: #fff;
                    padding: 5px 10px;
                    border-radius: 3px;
                    cursor: pointer;
                }

                .remove-driver-btn:hover {
                    box-shadow: 0 0 10px rgba(255, 0, 0, 0.5);
                }
            </style>

            <div class="admin-panel">
                <div class="success-message"></div>
                <div class="form-section">
                    <h2>Registrar Nuevo Equipo</h2>
                    <form id="teamForm">
                        <div class="form-group">
                            <label for="name">Nombre del Equipo</label>
                            <input type="text" id="name" name="name" required>
                        </div>
                        <div class="form-group">
                            <label for="country">País</label>
                            <input type="text" id="country" name="country" required>
                        </div>
                        <div class="form-group">
                            <label for="engine">Motor</label>
                            <input type="text" id="engine" name="engine" required>
                        </div>
                        <div class="form-group">
                            <label for="image">URL de la Imagen</label>
                            <input type="url" id="image" name="image" required>
                        </div>
                        <div class="form-actions">
                            <button type="submit">Registrar Equipo</button>
                            ${this.editingTeam ? `
                                <button type="button" onclick="this.getRootNode().host.cancelEdit()">
                                    Cancelar
                                </button>
                            ` : ''}
                        </div>
                    </form>
                </div>

                <h2>Equipos Registrados</h2>
                <div class="teams-grid">
                    ${this.teams.map(team => `
                        <div class="team-card">
                            <img src="${team.image}" alt="${team.name}">
                            <div class="team-info">
                                <h3>${team.name}</h3>
                                <p>País: ${team.country}</p>
                                <p>Motor: ${team.engine}</p>
                            </div>
                            <div class="drivers-section">
                                <h4>Pilotos</h4>
                                ${this.getTeamDrivers(team).map(driver => `
                                    <div class="driver-item">
                                        <div class="driver-info">
                                            <strong>${driver.name}</strong> #${driver.number}
                                            <br>
                                            <small>${driver.country}</small>
                                        </div>
                                        <button class="remove-driver-btn" 
                                            onclick="this.getRootNode().host.removeDriver(${team.id}, ${driver.id})">
                                            ✕
                                        </button>
                                    </div>
                                `).join('')}
                                
                                <form class="driver-form" id="driverForm_${team.id}" onsubmit="this.getRootNode().host.addDriver(${team.id}, event)">
                                    <input type="text" id="driverName_${team.id}" placeholder="Nombre del piloto" required>
                                    <input type="number" id="driverNumber_${team.id}" placeholder="Número" required>
                                    <input type="text" id="driverCountry_${team.id}" placeholder="País" required>
                                    <input type="url" id="driverPhoto_${team.id}" placeholder="URL de la foto" required>
                                    <button type="submit" class="add-driver-btn">Agregar Piloto</button>
                                </form>
                            </div>
                            <div class="team-actions">
                                <button class="edit-btn" onclick="this.getRootNode().host.editTeam(${team.id})">
                                    Editar
                                </button>
                                <button class="delete-btn" onclick="this.getRootNode().host.deleteTeam(${team.id})">
                                    Eliminar
                                </button>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;

        this.shadowRoot.querySelector('#teamForm').addEventListener('submit', (e) => this.handleSubmit(e));
    }

    cancelEdit() {
        const form = this.shadowRoot.querySelector('#teamForm');
        form.reset();
        this.editingTeam = null;
        const submitBtn = form.querySelector('button[type="submit"]');
        submitBtn.textContent = 'Registrar Equipo';
    }
}

// Verificar si el componente ya está definido antes de definirlo
if (!customElements.get('admin-team-component')) {
    customElements.define('admin-team-component', AdminTeamComponent);
} 