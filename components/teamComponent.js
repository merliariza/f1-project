class TeamComponent extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.apiUrl = this.getAttribute('api-url') || 'http://localhost:3000/db';
    }

    connectedCallback() {
        this.loadData();
    }

    async loadData() {
        try {
            console.log('Intentando cargar datos desde:', this.apiUrl);
            const response = await fetch(this.apiUrl);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            
            if (!data.teams || !data.drivers || !data.vehicles) {
                throw new Error('Datos incompletos en la respuesta');
            }
            
            // Combinar los datos de equipos con sus vehículos correspondientes
            this.teams = data.teams.map(team => {
                const vehicle = data.vehicles.find(v => v.team === team.name);
                return {
                    ...team,
                    vehicles: vehicle
                };
            });
            this.drivers = data.drivers;
            this.render();
        } catch (error) {
            console.error('Error cargando los datos:', error);
            this.shadowRoot.innerHTML = `
                <p style="color: red; padding: 1rem;">
                    Error cargando los datos: ${error.message}
                    <br>
                    Asegúrate de que json-server está corriendo y la URL es correcta.
                    <br>
                    URL actual: ${this.apiUrl}
                    <br>
                    Intenta: json-server --watch db.json
                </p>`;
        }
    }

    getDriversByTeam(teamDriverIds) {
        return this.drivers.filter(driver => teamDriverIds.includes(driver.id));
    }

    handleImageError(event) {
        console.error('Error cargando imagen:', event.target.src);
        event.target.src = 'https://via.placeholder.com/120x60?text=Logo+No+Disponible';
    }

    render() {
        const styles = `
            <style>
                :host {
                    --f1-red: #e10600;
                    --f1-black: #15151e;
                    --f1-dark: #1f1f27;
                    --f1-light: #ffffff;
                    --neon-glow: 0 0 10px rgba(225, 6, 0, 0.7);
                    display: block;
                    background-color: var(--f1-black);
                    color: var(--f1-light);
                    padding: 2rem;
                    padding-top: 5rem;
                }

                .teams-container {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
                    gap: 2rem;
                    padding: 1rem;
                    max-width: 1400px;
                    margin: 0 auto;
                }

                .team-card {
                    border: 1px solid rgba(225, 6, 0, 0.3);
                    border-radius: 12px;
                    padding: 1.5rem;
                    background: var(--f1-dark);
                    box-shadow: 0 4px 15px rgba(225, 6, 0, 0.1);
                    transition: all 0.3s ease;
                }

                .team-card:hover {
                    transform: translateY(-5px);
                    box-shadow: var(--neon-glow);
                    border-color: var(--f1-red);
                }

                .team-header {
                    display: flex;
                    align-items: center;
                    gap: 1.5rem;
                    margin-bottom: 1.5rem;
                    padding-bottom: 1rem;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                }

                .team-logo {
                    width: 120px;
                    height: 60px;
                    object-fit: contain;
                    filter: brightness(1);
                    transition: all 0.3s ease;
                    background: transparent;
                }

                .team-card:hover .team-logo {
                    transform: scale(1.05);
                    filter: brightness(1.2);
                }

                .team-info {
                    flex-grow: 1;
                }

                .team-name {
                    margin: 0;
                    color: var(--f1-light);
                    font-size: 1.8rem;
                    font-weight: 700;
                    text-shadow: 0 0 10px rgba(225, 6, 0, 0.3);
                }

                .team-details {
                    color: rgba(255, 255, 255, 0.7);
                    font-size: 0.9rem;
                    margin-top: 0.5rem;
                }

                .team-details p {
                    margin: 0.3rem 0;
                }

                .drivers-container {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 1rem;
                    margin-top: 1rem;
                }

                .driver-card {
                    text-align: center;
                    padding: 1rem;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 8px;
                    background: rgba(255, 255, 255, 0.05);
                    transition: all 0.3s ease;
                }

                .driver-card:hover {
                    background: rgba(225, 6, 0, 0.1);
                    border-color: var(--f1-red);
                    box-shadow: 0 0 15px rgba(225, 6, 0, 0.2);
                }

                .driver-photo {
                    width: 120px;
                    height: 120px;
                    border-radius: 50%;
                    object-fit: cover;
                    margin-bottom: 0.5rem;
                    border: 2px solid var(--f1-red);
                    box-shadow: var(--neon-glow);
                }

                .driver-card:hover .driver-photo {
                    transform: scale(1.05);
                    box-shadow: 0 0 20px rgba(225, 6, 0, 0.5);
                }

                .driver-name {
                    margin: 0;
                    font-size: 1.2rem;
                    color: var(--f1-light);
                }

                .driver-role {
                    margin: 0.2rem 0 0;
                    font-size: 0.8rem;
                    color: var(--f1-red);
                    text-transform: uppercase;
                }

                @keyframes neonPulse {
                    0% {
                        box-shadow: 0 0 10px rgba(225, 6, 0, 0.3);
                    }
                    50% {
                        box-shadow: 0 0 20px rgba(225, 6, 0, 0.5);
                    }
                    100% {
                        box-shadow: 0 0 10px rgba(225, 6, 0, 0.3);
                    }
                }

                .team-card:hover {
                    animation: neonPulse 2s infinite;
                }

                .vehicle-info {
                    background: rgba(20, 20, 20, 0.8);
                    border-radius: 8px;
                    padding: 1rem;
                    margin: 1rem 0;
                }

                .vehicle-stats {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 1rem;
                    margin-top: 1rem;
                }

                .performance-modes {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 1rem;
                    margin-top: 1rem;
                }

                .mode {
                    background: rgba(255, 0, 0, 0.1);
                    padding: 0.8rem;
                    border-radius: 6px;
                    border: 1px solid rgba(255, 0, 0, 0.2);
                }

                .stats-grid {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 1rem;
                    margin-top: 1rem;
                }

                .stat-box {
                    background: rgba(255, 0, 0, 0.1);
                    padding: 1rem;
                    border-radius: 8px;
                    text-align: center;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 0.5rem;
                }

                .stat-box i {
                    font-size: 1.5rem;
                    color: #ff0000;
                }

                .stat {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 0.5rem;
                    background: rgba(255, 0, 0, 0.05);
                    border-radius: 4px;
                }

                .mode h4 {
                    color: #ff0000;
                    margin: 0 0 0.5rem 0;
                }

                .mode p {
                    margin: 0;
                    font-size: 0.9rem;
                }
            </style>
        `;

        const teamsHTML = this.teams.map(team => {
            const teamDrivers = this.getDriversByTeam(team.drivers);
            const driversHTML = teamDrivers.map(driver => `
                <div class="driver-card">
                    <img class="driver-photo" 
                         src="${driver.photo}" 
                         alt="${driver.name}"
                         onerror="this.onerror=null; this.src='https://www.formula1.com/etc/designs/fom-website/images/driver-silhouette.png';">
                    <h3 class="driver-name">${driver.name}</h3>
                    <p class="driver-role">${driver.role}</p>
                </div>
            `).join('');

            return `
                <div class="team-card">
                    <div class="team-header">
                        <img class="team-logo" 
                             src="${team.image}" 
                             alt="${team.name} logo"
                             onerror="this.onerror=null; this.src='https://via.placeholder.com/120x60?text=Logo';">
                        <div class="team-info">
                            <h2 class="team-name">${team.name}</h2>
                            <div class="team-details">
                                <p><i class="fas fa-flag"></i> País: ${team.country}</p>
                                <p><i class="fas fa-cog"></i> Motor: ${team.engine}</p>
                            </div>
                        </div>
                    </div>

                    <!-- Información del Vehículo -->
                    <div class="vehicle-info">
                        <h3><i class="fas fa-car"></i> ${team.vehicles?.model}</h3>
                        <div class="vehicle-stats">
                            <div class="stat">
                                <span>Velocidad Máxima:</span>
                                <span>${team.vehicles?.max_speed_kmh} km/h</span>
                            </div>
                            <div class="stat">
                                <span>0-100 km/h:</span>
                                <span>${team.vehicles?.acceleration_0_100}s</span>
                            </div>
                        </div>
                        <div class="performance-modes">
                            <div class="mode">
                                <h4>Modo Normal</h4>
                                <p>Velocidad Promedio: ${team.vehicles?.performance?.normal_driving?.average_speed_kmh} km/h</p>
                                <p>Consumo: ${team.vehicles?.performance?.normal_driving?.fuel_consumption?.dry} L/vuelta</p>
                                <p>Desgaste: ${team.vehicles?.performance?.normal_driving?.tire_wear?.dry}%/vuelta</p>
                            </div>
                            <div class="mode">
                                <h4>Modo Agresivo</h4>
                                <p>Velocidad Promedio: ${team.vehicles?.performance?.aggressive_driving?.average_speed_kmh} km/h</p>
                                <p>Consumo: ${team.vehicles?.performance?.aggressive_driving?.fuel_consumption?.dry} L/vuelta</p>
                                <p>Desgaste: ${team.vehicles?.performance?.aggressive_driving?.tire_wear?.dry}%/vuelta</p>
                            </div>
                        </div>
                    </div>

                    <!-- Pilotos del Equipo -->
                    <div class="drivers-container">
                        ${driversHTML}
                    </div>
                </div>
            `;
        }).join('');

        this.shadowRoot.innerHTML = `
            ${styles}
            <div class="teams-container">
                ${teamsHTML}
            </div>
        `;
    }
}

// Verificar si el componente ya está definido antes de definirlo
if (!customElements.get('team-component')) {
    customElements.define('team-component', TeamComponent);
}

