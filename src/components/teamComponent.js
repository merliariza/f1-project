class TeamComponent extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.teams = [];
    }

    connectedCallback() {
        this.loadData();
    }

    async loadData() {
        // Se obtiene la URL de la API desde el atributo api-url o se usa un valor por defecto.
        const apiUrl = this.getAttribute('api-url') || 'http://localhost:3000/db';
        try {
            const response = await fetch(apiUrl);
            const data = await response.json();

            // Se espera que el JSON tenga las propiedades "drivers" y "vehicles"
            const drivers = data.drivers || [];
            const vehicles = data.vehicles || [];

            // Agrupar pilotos por el nombre del equipo (propiedad "team")
            const teamsMap = {};
            drivers.forEach(driver => {
                if (driver.team) {
                    if (!teamsMap[driver.team]) {
                        teamsMap[driver.team] = {
                            name: driver.team,
                            drivers: [],
                            vehicle: null
                        };
                    }
                    teamsMap[driver.team].drivers.push(driver.name);
                }
            });

            // Asignar el vehículo a cada equipo buscando aquel cuya propiedad "drivers"
            // coincida con el id de alguno de los pilotos del equipo.
            vehicles.forEach(vehicle => {
                // Se asume que la propiedad "drivers" del vehículo es un id que corresponde a un piloto
                const driver = drivers.find(d => d.id === vehicle.drivers);
                if (driver && driver.team) {
                    // Asigna el primer vehículo encontrado para el equipo (si aún no se ha asignado ninguno)
                    if (!teamsMap[driver.team].vehicle) {
                        teamsMap[driver.team].vehicle = vehicle;
                    }
                }
            });

            // Convertir el objeto de equipos en un array
            this.teams = Object.values(teamsMap);
            this.render();
        } catch (error) {
            console.error("Error al cargar datos del db:", error);
        }
    }

    getLogoForTeam(teamName) {
        // Mapeo de logos para cada equipo (actualiza o agrega las claves según los nombres reales)
        const logos = {
            "Red Bull Racing": "https://upload.wikimedia.org/wikipedia/en/3/35/Red_Bull_Racing_Logo.svg",
            "Mercedes-AMG Petronas": "https://upload.wikimedia.org/wikipedia/en/8/80/Mercedes_AMG_Petronas_Formula_One_Team_logo.svg",
            "Ferrari": "https://upload.wikimedia.org/wikipedia/en/0/0e/Scuderia_Ferrari_Logo.svg",
            "McLaren": "https://upload.wikimedia.org/wikipedia/en/2/21/McLaren_Logo.svg"
        };
        return logos[teamName] || "https://via.placeholder.com/120x60?text=Logo";
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
            </style>
        `;

        const teamsHTML = this.teams.map(team => {
            return `
                <div class="team-card">
                    <div class="team-header">
                        <img src="${this.getLogoForTeam(team.name)}" alt="${team.name} logo" class="team-logo">
                        <div class="team-info">
                            <h2 class="team-name">${team.name}</h2>
                            <div class="team-details">
                                <p>Pilotos: ${team.drivers.length ? team.drivers.join(', ') : 'Sin pilotos asignados'}</p>
                                <p>Vehículo asignado: ${team.vehicle ? team.vehicle.model : 'Sin vehículo asignado'}</p>
                            </div>
                        </div>
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
