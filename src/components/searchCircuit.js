class SearchComponent extends HTMLElement {
    constructor() {
        super();
        const shadow = this.attachShadow({ mode: 'open' });

        // Contenedor principal
        const container = document.createElement('div');
        container.innerHTML = `
            <div class="search-container" id="searchWrapper">
                <input type="text" id="searchInput" placeholder="Buscar circuito...">
            </div>
            <div id="searchResults" class="search-results"></div>
        `;

        // Estilos del componente
        const style = document.createElement('style');
        style.textContent = `            /* Estilo Profesional */
            .search-container {
                text-align: center;
                margin-top: 15px;
                margin-bottom: 15px;
                display: none; /* Inicialmente oculto */
                position: relative;
            }

                     #searchInput {
                width: 60%;
                padding: 12px;
                font-size: 18px;
                border-radius: 30px;
                border: none;
                background: linear-gradient(45deg, rgba(20, 20, 20, 0.9), rgba(10, 10, 10, 0.8));
                color: white;
                outline: none;
                transition: all 0.4s ease;
                text-align: center;
                box-shadow: 0px 0px 10px rgba(255, 0, 0, 0.5);
                border: 1px solid rgba(255, 0, 0, 0.2);
            }

            #searchInput::placeholder {
                color: rgba(255, 255, 255, 0.6);
                font-style: italic;
            }

            #searchInput:focus {
                box-shadow: 0px 0px 20px rgba(255, 0, 0, 0.8), 0px 0px 10px rgba(255, 255, 255, 0.3);
                border: 1px solid rgba(255, 0, 0, 0.8);
                transform: scale(1.05);
            }

            #searchInput::placeholder {
                color: rgba(255, 255, 255, 0.6);
                font-style: italic;
            }

            #searchInput:focus {
                box-shadow: 0 0 25px rgba(255, 0, 0, 1);
                border: none;
                transform: scale(1.05);
            }

            .search-results {
                display: none;
                margin-top: 15px;
                text-align: center;
                padding: 20px;
                border-radius: 10px;
                background: rgba(5, 5, 5, 0.9);
                box-shadow: 0 0 20px rgba(82, 15, 15, 0.49);
            }

            .result-card {
                display: inline-block;
                background: rgb(46, 42, 42);
                padding: 20px;
                color: gray;
                border-radius: 12px;
                box-shadow: 0 0 5px rgba(58, 22, 22, 0.44);
                margin: 12px;
                text-align: center;
                width: 260px;
                transition: transform 0.3s ease, box-shadow 0.3s ease;
                border: 2px solid rgba(255, 0, 0, 0.5);
                position: relative;
                overflow: hidden;
            }

            .result-card img {
                width: 100%;
                border-radius: 8px;
                transition: transform 0.3s ease-in-out;
            }

            .result-card:hover img {
                transform: scale(1.05);
            }

            .result-card h3 {
                color:rgb(150, 22, 22);
                font-size: 20px;
                font-weight: bold;
                margin-top: 10px;
                text-transform: uppercase;
            }
            
            .result-card p {
                color: rgba(19, 19, 19, 0.85);
                font-size: 20px;
                margin: 5px 0;
            }

            .result-card:hover {
                transform: scale(1.08);
                box-shadow: 0 0 25px rgba(53, 35, 35, 0.52);
                border-color: rgb(34, 5, 5);
            }

            /* Brillo al pasar el cursor */
            .result-card::before {
                content: "";
                position: absolute;
                top: -50%;
                left: -50%;
                width: 200%;
                height: 200%;
                background: radial-gradient(circle, rgba(255, 0, 0, 0.3), transparent 60%);
                opacity: 0;
                transition: opacity 0.3s ease;
            }

            .result-card:hover::before {
                opacity: 1;
            }

            .no-results {
                text-align: center;
                color: white;
                margin-top: 15px;
                font-size: 18px;
                font-weight: bold;
                background: rgba(255, 0, 0, 0.2);
                padding: 10px;
                border-radius: 5px;
            }

        `;

        // Adjuntar estilos y estructura al Shadow DOM
        shadow.appendChild(style);
        shadow.appendChild(container);

        // Guardar referencias de los elementos importantes
        this.searchInput = shadow.querySelector("#searchInput");
        this.searchResults = shadow.querySelector("#searchResults");
        this.searchWrapper = shadow.querySelector("#searchWrapper");

        // Definir URL del servidor
        this.apiUrl = 'http://localhost:3000/circuits/';
        this.circuits = [];

        // Evento de búsqueda en tiempo real
        this.searchInput.addEventListener("input", () => this.filterCircuits());

        // Observar la visibilidad del circuito-slider
        this.observeCircuitSlider();

        // Escuchar eventos de los botones "Iniciar", "Siguiente" y "Atrás"
        this.listenForNavigationEvents();
    }

    connectedCallback() {
        this.loadCircuitData();
    }

    async loadCircuitData() {
        try {
            const response = await fetch(this.apiUrl);
            this.circuits = await response.json();
        } catch (error) {
            console.error("Error al cargar los circuitos:", error);
        }
    }

    filterCircuits() {
        const searchTerm = this.searchInput.value.toLowerCase();
        this.searchResults.innerHTML = ""; // Limpiar resultados previos

        const circuitSlider = document.querySelector("circuit-slider"); // Obtener el slider

        if (searchTerm === "") {
            // Si no hay búsqueda, mostrar el slider y ocultar resultados
            if (circuitSlider) circuitSlider.style.display = "block";
            this.searchResults.style.display = "none";
            return;
        }

        // Filtrar circuitos por nombre
        const filteredCircuits = this.circuits.filter(circuit =>
            circuit.name.toLowerCase().includes(searchTerm)
        );

        if (filteredCircuits.length === 0) {
            this.searchResults.innerHTML = "<p class='no-results'>No se encontraron circuitos</p>";
        } else {
            filteredCircuits.forEach(circuit => {
                const card = document.createElement("div");
                card.classList.add("result-card");
                card.innerHTML = `
                    <img src="${circuit.image}" alt="${circuit.name}">
                    <h3>${circuit.name}</h3>
                    <p><strong>Ubicación:</strong> ${circuit.country}</p>
                    <p><strong>Longitud:</strong> ${circuit.lengthKm} km</p>
                    <p><strong>Récord:</strong> ${circuit.lapRecord.time}</p>
                `;
                this.searchResults.appendChild(card);
            });
        }

        // Ocultar el slider y mostrar los resultados
        if (circuitSlider) circuitSlider.style.display = "none";
        this.searchResults.style.display = "block";
    }

    observeCircuitSlider() {
        const circuitSlider = document.querySelector("circuit-slider");

        if (!circuitSlider) return; // Si no existe, no hacer nada

        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Si el circuito-slider está en vista, mostrar la barra de búsqueda
                    this.searchWrapper.style.display = "block";
                }
            });
        }, { threshold: 0.2 }); // Se activa cuando el 20% del componente está en la pantalla

        observer.observe(circuitSlider);
    }

    listenForNavigationEvents() {
        const iniciarBtn = document.querySelector("#iniciar");
        const siguienteBtn = document.querySelector("next-button");
        const atrasBtn = document.querySelector("#atras");

        if (iniciarBtn) {
            iniciarBtn.addEventListener("click", () => {
                this.searchWrapper.style.display = "block"; // Mostrar la barra cuando se inicia
            });
        }

        if (siguienteBtn) {
            siguienteBtn.addEventListener("click", () => {
                this.searchWrapper.style.display = "none"; // Ocultar la barra en "Siguiente"
            });
        }

        if (atrasBtn) {
            atrasBtn.addEventListener("click", () => {
                this.searchWrapper.style.display = "none"; // Ocultar la barra en "Atrás"
            });
        }
    }
}

// Definir el nuevo Web Component
customElements.define("search-component", SearchComponent);
