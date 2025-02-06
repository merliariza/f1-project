class CircuitSlider extends HTMLElement {
    constructor() {
      super();
      const shadow = this.attachShadow({ mode: 'open' });
  
      // Crear el contenedor del componente con una clase para estilizarlo
      const container = document.createElement('div');
      container.innerHTML = `
          <br>
          <div class="container overlay">
              <div class="col-12">
                  <h1> SELECCIONA UN CIRCUITO </h1>
                  <br>
              </div>
               <div class="search-container" id="searchWrapper">
                <input type="text" id="searchInput" placeholder="Buscar circuito...">
            </div>
            <div id="searchResults" class="search-results"></div>
              <section id="slider">
                  <input type="radio" name="slider" id="s1">
                  <input type="radio" name="slider" id="s2">
                  <input type="radio" name="slider" id="s3" checked>
                  <input type="radio" name="slider" id="s4">
                  <input type="radio" name="slider" id="s5">
                  <label for="s1" id="slide1">
                      <img src="../../media/circuitos/2020-09-17-2019-formula-1-f1-bahrain_1u3tck9dc157a1g6y74lxr2a05.webp" alt="Circuito 1">
                  </label>
                  <label for="s2" id="slide2">
                      <img src="../../media/circuitos/circuito1.webp" alt="Circuito 2">
                  </label>
                  <label for="s3" id="slide3">
                      <img src="../../media/circuitos/interlagos.webp" alt="Circuito 3">
                  </label>
                  <label for="s4" id="slide4">
                      <img src="../../media/circuitos/monanco.webp" alt="Circuito 4">
                  </label>
                  <label for="s5" id="slide5">
                      <img src="../../media/circuitos/monza.webp" alt="Circuito 5">
                  </label>
              </section>
                <!-- Resultados de búsqueda -->
                <div id="searchResults" class="search-results"></div>
                <div id="circuit-info" class="circuit-info"> <button id="selectButton" class="btn btn-4">Seleccionar</button></div> <!-- Información del circuito -->
               
          </div>
      `;
  
      // Crear el estilo para el componente
      const style = document.createElement('style');
      style.textContent = `
          /* Reset */
          * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
              color: rgb(230, 230, 230); /* Color gris claro para mejor legibilidad */
          }
               /* Estilo Profesional */
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
                box-shadow: 0 0 25px rgba(255, 0, 0, 0.74);
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
                background: rgb(27, 24, 24);
                padding: 20px;;
                border-radius: 12px;
                box-shadow: 0 0 5px rgba(58, 22, 22, 0.44);
                margin: 12px;
                text-align: center;
                width: 260px;
                transition: transform 0.3s ease, box-shadow 0.3s ease;
                border: 2px solid rgba(58, 2, 2, 0.5);
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
                color:rgb(139, 12, 12);
                font-size: 20px;
                font-weight: bold;
                margin-top: 10px;
                text-transform: uppercase;
            }
            
            .result-card p {
                color: rgba(223, 219, 219, 0.85);
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

          
          :host {
              display: block;
              background:rgb(0, 0, 0); /* Fondo gris oscuro en lugar de puro negro */
          }
          
          /* Contenedor */
          .container {
              background: rgba(0, 0, 0, 0.85);
              padding: 20px;
              border-radius: 8px;
              box-shadow: 0 2px 8px rgba(122, 0, 0, 0.77); /* Sombra blanca suave */
              border: 2px solid rgba(48, 45, 45, 0.57);
          }
      
          /* Título con efecto de luz dinámica */
          h1 {
              color: #e0e0e0;
              font-size: 2.5rem;
              text-align: center;
              text-shadow: 0 0 10px rgba(134, 78, 78, 0.4), 0 0 30px rgba(255, 0, 0, 0.95);
              animation: flicker 1.8s infinite alternate;
          }

          /* Efecto de parpadeo sutil */
          @keyframes flicker {
              0% { opacity: 1; text-shadow: 0 0 15px rgba(255, 255, 255, 0.5); }
              100% { opacity: 0.9; text-shadow: 0 0 8px rgba(148, 8, 8, 0.53); }
          }
      
          /* Slider */
          [type=radio] { display: none; }
      
          #slider {
              height: 22vw;
              position: relative;
              perspective: 1000px;
              transform-style: preserve-3d;
              margin: auto;
          }
      
          /* Imágenes del slider */
          label img {
              width: 100%;
              height: auto;
              border-radius: 8px;
              transition: transform 0.3s ease, opacity 0.3s ease;
              box-shadow: 0 0 15px rgba(141, 10, 10, 0.99), 0 0 10px rgba(61, 25, 25, 0.79);
              -webkit-box-reflect: below 8px 
                linear-gradient(transparent, rgba(255, 255, 255, 0.1)); /* Reflejo sutil */
          }
      
          #slider label {
              margin: auto;
              width: 45%;
              height: 100%;
              border-radius: 8px;
              position: absolute;
              left: 0; right: 0;
              cursor: pointer;
              transition: transform 0.4s ease;
              border: 2px solid rgba(255, 255, 255, 0.3);
              background: rgba(0, 0, 0, 0.5);
          }

          /* Efecto de hover */
          #slider label:hover {
              box-shadow: 0 10px 20px rgba(43, 0, 0, 0.81), 0 0 10px rgba(255, 0, 0, 0.6);
          }
      
          /* Posicionamiento de las imágenes */
          #s1:checked ~ #slide4, #s2:checked ~ #slide5,
          #s3:checked ~ #slide1, #s4:checked ~ #slide2,
          #s5:checked ~ #slide3 {
              transform: translate3d(-50%, 0, -200px);
          }
      
          #s1:checked ~ #slide5, #s2:checked ~ #slide1,
          #s3:checked ~ #slide2, #s4:checked ~ #slide3,
          #s5:checked ~ #slide4 {
              transform: translate3d(-25%, 0, -100px);
          }
      
          #s1:checked ~ #slide1, #s2:checked ~ #slide2,
          #s3:checked ~ #slide3, #s4:checked ~ #slide4,
          #s5:checked ~ #slide5 {
              transform: translate3d(0, 0, 0);
          }
      
          #s1:checked ~ #slide2, #s2:checked ~ #slide3,
          #s3:checked ~ #slide4, #s4:checked ~ #slide5,
          #s5:checked ~ #slide1 {
              transform: translate3d(25%, 0, -100px);
          }
      
          #s1:checked ~ #slide3, #s2:checked ~ #slide4,
          #s3:checked ~ #slide5, #s4:checked ~ #slide1,
          #s5:checked ~ #slide2 {
              transform: translate3d(50%, 0, -200px);
          }

          /* Información del circuito */
          .circuit-info {
              margin-top: 20px;
              padding: 15px;
              background-color: rgba(30, 30, 30, 0.9);
              border-radius: 8px;
              text-align: center;
              font-size: 1rem;
              color: #e0e0e0;
              box-shadow: 0 0 10px rgba(255, 255, 255, 0.2);
          }
       /* Barra de búsqueda */
            .search-container {
                text-align: center;
                margin-bottom: 15px;
            }

            #searchInput {
                width: 80%;
                padding: 10px;
                font-size: 16px;
                border-radius: 5px;
                border: 1px solid #ccc;
                background: rgba(30, 30, 30, 0.8);
                color: white;
                outline: none;
                transition: all 0.3s ease;
            }

            #searchInput:focus {
                box-shadow: 0 0 15px rgba(255, 0, 0, 0.8);
                border: 1px solid rgba(255, 0, 0, 0.8);
            }

            /* Resultados de búsqueda */
            .search-results {
                display: none;
                margin-top: 15px;
                text-align: center;
            }

            .result-card {
                display: inline-block;
                background: rgba(0, 0, 0, 0.9);
                padding: 15px;
                border-radius: 10px;
                box-shadow: 0 0 10px rgba(255, 0, 0, 0.7);
                margin: 10px;
                text-align: center;
                width: 250px;
                transition: transform 0.3s ease, box-shadow 0.3s ease;
            }

            .result-card img {
                width: 100%;
                border-radius: 8px;
            }

            .result-card:hover {
                transform: scale(1.05);
                box-shadow: 0 0 15px rgba(255, 0, 0, 1);
            }

            /* Mensaje cuando no hay resultados */
            .no-results {
                text-align: center;
                color: white;
                margin-top: 15px;
            }
        `;

  
      // Adjuntar el estilo y el contenido al Shadow DOM
      shadow.appendChild(style);
      shadow.appendChild(container);

        // Guardar elementos importantes
        this.searchInput = shadow.querySelector("#searchInput");
        this.searchResults = shadow.querySelector("#searchResults");
        this.slider = shadow.querySelector("#slider");
  
      // Definir la URL del servidor para obtener la información de los circuitos
      this.apiUrl = 'http://localhost:3000/circuits/';
    }
  
    connectedCallback() {
      // Cuando el componente esté en el DOM, cargamos los circuitos
      this.loadCircuitData();
    }
  
    

    async loadCircuitData() {
      try {
        // Obtén la información de los circuitos
        const response = await fetch(this.apiUrl);
        const circuits = await response.json();
  
        // Agregar la información a cada slider (debe ser dinámica según los datos obtenidos)
        const slider = this.shadowRoot.querySelector('#slider');
        circuits.forEach((circuit, index) => {
          const radioId = `s${index + 1}`;
          const labelId = `slide${index + 1}`;
  
          const label = this.shadowRoot.querySelector(`#${labelId}`);
          label.addEventListener('click', () => this.showCircuitInfo(circuit));
        });
      } catch (error) {
        console.error('Error al cargar los circuitos:', error);
      }
    }
  
    showCircuitInfo(circuit) {
      // Mostrar la información del circuito seleccionado
      const infoContainer = this.shadowRoot.querySelector('#circuit-info');
      infoContainer.innerHTML = `
        <h3>${circuit.name}</h3>
        <p><strong>Ubicación:</strong> ${circuit.country}</p>
        <p><strong>Longitud:</strong> ${circuit.lengthKm} km</p>
        <strong>Récord:</strong> ${circuit.lapRecord.time}
        <p><strong>Descripción:</strong> ${circuit.description}</p>
      `;
    }
  }
  
  // Definir el nuevo elemento personalizado
  customElements.define('circuit-slider', CircuitSlider);
