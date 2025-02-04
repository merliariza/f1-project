class UserComponent extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
      this.shadowRoot.innerHTML = /*html*/ `
        <style>
          #slider {
            position: relative;
            width: 300px;
            height: 200px;
            perspective: 1000px;
            margin: auto;
          }
          #spinner {
            width: 100%;
            height: 100%;
            position: absolute;
            transform-style: preserve-3d;
            transition: transform 1s;
          }
          #spinner img {
            position: absolute;
            width: 100%;
            height: 100%;
            backface-visibility: hidden;
          }
          #spinner img:nth-child(1) { transform: rotateY(0deg) translateZ(300px); }
          #spinner img:nth-child(2) { transform: rotateY(72deg) translateZ(300px); }
          #spinner img:nth-child(3) { transform: rotateY(144deg) translateZ(300px); }
          #spinner img:nth-child(4) { transform: rotateY(216deg) translateZ(300px); }
          #spinner img:nth-child(5) { transform: rotateY(288deg) translateZ(300px); }
          button {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            background-color: rgba(0, 0, 0, 0.5);
            color: white;
            padding: 10px;
            border: none;
            cursor: pointer;
          }
          #prev { left: 10px; }
          #next { right: 10px; }
        </style>
        <section id="slider">
          <div id="spinner">
            <img src="../../media/circuitos/2020-09-17-2019-formula-1-f1-bahrain_1u3tck9dc157a1g6y74lxr2a05.webp" alt="Image 1">
            <img src="../../media/circuitos/circuito1.webp" alt="Image 2">
            <img src="../../media/circuitos/interlagos.webp" alt="Image 3">
            <img src="../../media/circuitos/monza.webp" alt="Image 4">
            <img src="../../media/circuitos/yas-marine.webp" alt="Image 5">
          </div>
          <button id="prev">Previous</button>
          <button id="next">Next</button>
        </section>
      `;
  
      this.angle = 0;
      this.spinner = this.shadowRoot.querySelector("#spinner");
  
      // Los botones de navegación
      this.shadowRoot.querySelector("#next").addEventListener("click", () => this.galleryspin(false));
      this.shadowRoot.querySelector("#prev").addEventListener("click", () => this.galleryspin(true));
    }
  
    galleryspin(isPrev) {
      // Calcula el ángulo
      if (isPrev) {
        this.angle -= 50;  // Mueve 72 grados hacia atrás
      } else {
        this.angle += 72;  // Mueve 72 grados hacia adelante
      }
  
      // Realiza la rotación del carrusel
      this.spinner.style.transform = `rotateY(${this.angle}deg)`;
    }
  }
  
  customElements.define('user-component', UserComponent);
  