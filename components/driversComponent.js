class DriversComponent extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.drivers = [];
        this.filteredDrivers = [];
    }

    connectedCallback() {
        this.loadDrivers();
    }

    async loadDrivers() {
        try {
            const response = await fetch('http://localhost:3000/drivers');
            this.drivers = await response.json();
            this.filteredDrivers = [...this.drivers];
            this.render();
        } catch (error) {
            console.error('Error cargando pilotos:', error);
        }
    }

    filterDrivers(searchTerm) {
        this.filteredDrivers = this.drivers.filter(driver => 
            driver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            driver.team.toLowerCase().includes(searchTerm.toLowerCase())
        );
        this.renderDrivers();
    }

    render() {
        const styles = `
            <style>
                .drivers-container {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                    gap: 2rem;
                    padding: 1rem;
                }

                .search-container {
                    margin-bottom: 2rem;
                    padding: 1rem;
                    background: rgba(30, 30, 30, 0.9);
                    border-radius: 8px;
                }

                .search-input {
                    width: 100%;
                    padding: 0.8rem;
                    background: rgba(0, 0, 0, 0.3);
                    border: 1px solid rgba(255, 0, 0, 0.3);
                    border-radius: 4px;
                    color: #fff;
                }

                .driver-card {
                    background: rgba(30, 30, 30, 0.9);
                    border: 1px solid rgba(255, 0, 0, 0.3);
                    border-radius: 12px;
                    padding: 1.5rem;
                    transition: all 0.3s ease;
                }

                .driver-card:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 0 20px rgba(255, 0, 0, 0.4);
                }

                .driver-photo {
                    width: 150px;
                    height: 150px;
                    border-radius: 50%;
                    margin: 0 auto 1rem;
                    display: block;
                    border: 2px solid #ff0000;
                }

                .driver-info h3 {
                    color: #fff;
                    text-align: center;
                    margin: 0.5rem 0;
                }

                .driver-stats {
                    margin-top: 1rem;
                    padding-top: 1rem;
                    border-top: 1px solid rgba(255, 0, 0, 0.3);
                }

                .stat-item {
                    display: flex;
                    justify-content: space-between;
                    color: #fff;
                    margin: 0.5rem 0;
                }
            </style>
        `;

        this.shadowRoot.innerHTML = `
            ${styles}
            <div class="search-container">
                <input type="text" 
                       class="search-input" 
                       placeholder="Buscar piloto por nombre o equipo..."
                       @input="filterDrivers">
            </div>
            <div class="drivers-container">
                ${this.renderDrivers()}
            </div>
        `;

        this.shadowRoot.querySelector('.search-input').addEventListener('input', (e) => {
            this.filterDrivers(e.target.value);
        });
    }

    renderDrivers() {
        return this.filteredDrivers.map(driver => `
            <div class="driver-card">
                <img src="${driver.photo}" 
                     alt="${driver.name}" 
                     class="driver-photo"
                     onerror="this.onerror=null; this.src='https://www.formula1.com/etc/designs/fom-website/images/driver-silhouette.png';">
                <div class="driver-info">
                    <h3>${driver.name}</h3>
                    <div class="driver-stats">
                        <div class="stat-item">
                            <span>Equipo:</span>
                            <span>${driver.team}</span>
                        </div>
                        <div class="stat-item">
                            <span>Rol:</span>
                            <span>${driver.role}</span>
                        </div>
                        <div class="stat-item">
                            <span>Número:</span>
                            <span>#${driver.number}</span>
                        </div>
                        <div class="stat-item">
                            <span>País:</span>
                            <span>${driver.country}</span>
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
    }
}

if (!customElements.get('drivers-component')) {
    customElements.define('drivers-component', DriversComponent);
}
