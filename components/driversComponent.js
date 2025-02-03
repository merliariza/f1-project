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
        if (!searchTerm) {
            this.filteredDrivers = [...this.drivers];
        } else {
            searchTerm = searchTerm.toLowerCase();
            this.filteredDrivers = this.drivers.filter(driver => 
                driver.name.toLowerCase().includes(searchTerm) ||
                driver.team.toLowerCase().includes(searchTerm) ||
                driver.country.toLowerCase().includes(searchTerm) ||
                driver.number.toString().includes(searchTerm)
            );
        }
        
        const driversContainer = this.shadowRoot.querySelector('.drivers-container');
        if (driversContainer) {
            driversContainer.innerHTML = this.renderDrivers();
        }
    }

    render() {
        const styles = `
            <style>
                :host {
                    display: block;
                    padding: 2rem;
                }

                .drivers-container {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
                    gap: 2rem;
                    padding: 1rem;
                    max-width: 1400px;
                    margin: 0 auto;
                }

                .search-container {
                    max-width: 600px;
                    margin: 0 auto 3rem;
                    position: relative;
                    display: flex;
                    align-items: center;
                }

                .search-container i {
                    position: absolute;
                    left: 1.5rem;
                    color: #ff0000;
                    font-size: 1.2rem;
                }

                .search-input {
                    width: 100%;
                    padding: 1.2rem 1.5rem 1.2rem 3.5rem;
                    background: rgba(20, 20, 20, 0.9);
                    border: 2px solid rgba(255, 0, 0, 0.2);
                    border-radius: 50px;
                    color: #fff;
                    font-size: 1.1rem;
                    transition: all 0.3s ease;
                    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
                }

                .search-input:focus {
                    outline: none;
                    border-color: #ff0000;
                    box-shadow: 0 0 20px rgba(255, 0, 0, 0.3);
                    transform: translateY(-2px);
                }

                .search-input::placeholder {
                    color: rgba(255, 255, 255, 0.5);
                }

                .back-button {
                    position: fixed;
                    top: 2rem;
                    left: 2rem;
                    padding: 1rem 2rem;
                    background: rgba(255, 0, 0, 0.1);
                    border: 2px solid #ff0000;
                    border-radius: 50px;
                    color: #fff;
                    font-size: 1.1rem;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    display: flex;
                    align-items: center;
                    gap: 0.8rem;
                    backdrop-filter: blur(5px);
                    z-index: 100;
                }

                .back-button i {
                    font-size: 1.2rem;
                }

                .back-button:hover {
                    background: rgba(255, 0, 0, 0.2);
                    transform: translateX(-5px);
                    box-shadow: 0 0 20px rgba(255, 0, 0, 0.3);
                }

                .driver-card {
                    background: linear-gradient(145deg, rgba(30, 30, 30, 0.9), rgba(20, 20, 20, 0.9));
                    border: 1px solid rgba(255, 0, 0, 0.2);
                    border-radius: 20px;
                    padding: 2rem;
                    transition: all 0.3s ease;
                    position: relative;
                    overflow: hidden;
                }

                .driver-card::before {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: linear-gradient(45deg, transparent, rgba(255, 0, 0, 0.1));
                    opacity: 0;
                    transition: all 0.3s ease;
                }

                .driver-card:hover {
                    transform: translateY(-10px);
                    box-shadow: 0 10px 30px rgba(255, 0, 0, 0.2);
                    border-color: rgba(255, 0, 0, 0.4);
                }

                .driver-card:hover::before {
                    opacity: 1;
                }

                .driver-photo {
                    width: 180px;
                    height: 180px;
                    border-radius: 50%;
                    margin: 0 auto 1.5rem;
                    display: block;
                    border: 3px solid #ff0000;
                    box-shadow: 0 0 20px rgba(255, 0, 0, 0.3);
                    transition: all 0.3s ease;
                    object-fit: cover;
                }

                .driver-card:hover .driver-photo {
                    transform: scale(1.05);
                    box-shadow: 0 0 30px rgba(255, 0, 0, 0.4);
                }

                .driver-info h3 {
                    color: #fff;
                    text-align: center;
                    margin: 0.5rem 0;
                    font-size: 1.8rem;
                    font-weight: 600;
                    text-shadow: 0 0 10px rgba(255, 0, 0, 0.3);
                }

                .driver-stats {
                    margin-top: 1.5rem;
                    padding-top: 1.5rem;
                    border-top: 2px solid rgba(255, 0, 0, 0.2);
                    display: grid;
                    gap: 0.8rem;
                }

                .stat-item {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 0.8rem 1.2rem;
                    background: rgba(255, 0, 0, 0.1);
                    border-radius: 8px;
                    transition: all 0.3s ease;
                }

                .stat-item:hover {
                    background: rgba(255, 0, 0, 0.15);
                    transform: translateX(5px);
                }

                .stat-item i {
                    color: #ff0000;
                    margin-right: 0.8rem;
                    font-size: 1.1rem;
                }

                .stat-item span:first-child {
                    font-weight: 500;
                    color: rgba(255, 255, 255, 0.9);
                    display: flex;
                    align-items: center;
                }

                .stat-item span:last-child {
                    color: #ff0000;
                    font-weight: 600;
                    text-shadow: 0 0 5px rgba(255, 0, 0, 0.3);
                }

                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                .driver-card {
                    animation: fadeIn 0.5s ease forwards;
                }
            </style>
        `;

        this.shadowRoot.innerHTML = `
            ${styles}
            <div class="search-container">
                <i class="fas fa-search"></i>
                <input type="text" 
                       class="search-input" 
                       placeholder="Buscar piloto por nombre, equipo, país o número..."
                       id="searchInput">
            </div>
            <div class="drivers-container">
                ${this.renderDrivers()}
            </div>
        `;

        const searchInput = this.shadowRoot.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.filterDrivers(e.target.value);
            });
        }
    }

    renderDrivers() {
        return this.filteredDrivers.map(driver => `
            <div class="driver-card">
                <img src="${driver.photo}" 
                     alt="${driver.name}" 
                     class="driver-photo"
                     loading="lazy"
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
                            <span><i class="fas fa-flag"></i> País:</span>
                            <span>${driver.country}</span>
                        </div>
                        <div class="stat-item">
                            <span><i class="fas fa-hashtag"></i> Número:</span>
                            <span>${driver.number}</span>
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
