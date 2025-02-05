class CircuitSlider extends HTMLElement {
    constructor() {
      super();
      const shadow = this.attachShadow({ mode: 'open' });
  
      // Crear el contenedor del componente con una clase para estilizarlo
      const container = document.createElement('div');
      container.innerHTML = `
          <br>
          <div class="container">
              <div class="col-12">
                  <h1> SELECCIONA UN CIRCUITO </h1>
                  <br>
              </div>
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
              <div id="circuit-info" class="circuit-info"></div> <!-- Información del circuito -->
          </div>
      `;
  
      // Crear el estilo para el componente
      const style = document.createElement('style');
      style.textContent = `
          /* Reset y estilos base */
          * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
              color: rgb(201, 197, 197);
          }
          
          :host {
              display: block;
          }
          
          /* Estilos para el contenedor con una sombra neutra */
          .container {
              background: rgba(0, 0, 0, 0.6);
              padding: 20px;
              border-radius: 8px;
              box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
          }
      
          /* Animación hover para el h1 */
          h1 {
              transition: color 0.3s ease, text-shadow 0.3s ease;
              color: rgb(187, 182, 182);
              text-shadow: 0 0 10px rgba(172, 163, 163, 0.79);
              font-size: 3rem;
          }
          
          h1:hover {
              color: red;
              text-shadow: 0 0 10px rgba(255, 0, 0, 0.45);
          }
      
          /* Estilos para el slider */
          [type=radio] {
              display: none;
          }
      
          #slider {
              height: 35vw;
              position: relative;
              perspective: 1000px;
              transform-style: preserve-3d;
          }
      
          /* Aplicar efecto de reflejo a las imágenes */
          label img {
              width: 100%;
              height: 100%;
              border-radius: 8px;
              /* Se crea un reflejo sutil debajo de la imagen */
              -webkit-box-reflect: below 0px linear-gradient(transparent, rgba(255,255,255,0.2));
              transition: transform 0.3s ease;
          }
      
          #slider label {
              margin: auto;
              width: 60%;
              height: 100%;
              border-radius: 8px;
              position: absolute;
              left: 0; right: 0;
              cursor: pointer;
              transition: transform 0.4s ease;
              border: 4px solid rgba(240, 240, 240, 0.1);
          }
      
          /* Hover en las tarjetas con un sutil brillo */
          #slider label:hover {
              box-shadow: 0 8px 16px rgba(255,255,255,0.2);
          }
      
          /* Estados "checked" sin sombra roja, usando tonos neutros */
          #s1:checked ~ #slide4, #s2:checked ~ #slide5,
          #s3:checked ~ #slide1, #s4:checked ~ #slide2,
          #s5:checked ~ #slide3 {
              box-shadow: 0 1px 4px 2px rgba(0, 0, 0, 0.5);
              transform: translate3d(-50%, 0, -200px);
          }
      
          #s1:checked ~ #slide5, #s2:checked ~ #slide1,
          #s3:checked ~ #slide2, #s4:checked ~ #slide3,
          #s5:checked ~ #slide4 {
              box-shadow: 0 6px 10px 0 rgba(0, 0, 0, 0.3), 0 2px 2px 0 rgba(255,255,255,0.2);
              transform: translate3d(-25%, 0, -100px);
          }
      
          #s1:checked ~ #slide1, #s2:checked ~ #slide2,
          #s3:checked ~ #slide3, #s4:checked ~ #slide4,
          #s5:checked ~ #slide5 {
              box-shadow: 0 10px 25px 0 rgba(0, 0, 0, 0.5), 0 11px 7px 0 rgba(255,255,255,0.2);
              transform: translate3d(0, 0, 0);
          }
      
          #s1:checked ~ #slide2, #s2:checked ~ #slide3,
          #s3:checked ~ #slide4, #s4:checked ~ #slide5,
          #s5:checked ~ #slide1 {
              box-shadow: 0 6px 10px 0 rgba(0, 0, 0, 0.3), 0 2px 2px 0 rgba(255,255,255,0.2);
              transform: translate3d(25%, 0, -100px);
          }
      
          #s1:checked ~ #slide3, #s2:checked ~ #slide4,
          #s3:checked ~ #slide5, #s4:checked ~ #slide1,
          #s5:checked ~ #slide2 {
              box-shadow: 0 1px 4px 0 rgba(0, 0, 0, 0.5);
              transform: translate3d(50%, 0, -200px);
          }
  
          /* Estilos para la información del circuito */
          .circuit-info {
              margin-top: 20px;
              padding: 20px;
              background-color: rgb(0, 0, 0);
              border-radius: 8px;
          }
      `;
  
      // Adjuntar el estilo y el contenido al Shadow DOM
      shadow.appendChild(style);
      shadow.appendChild(container);
  
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
  