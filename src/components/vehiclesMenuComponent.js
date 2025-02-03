import './vehiclesComponent.js';
import './normalDrivingComponent.js';
import './agressiveDrivingComponent.js'
import './savingDrivingComponent.js'
import './formDataDriving.js'
export class VehiclesMenuComponent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" }); 
    this.render();
  }

  render() {
    this.shadowRoot.innerHTML = /* html */ `
      <style>
        .nav-tabs {
          display: flex;
          list-style: none;
          padding: 0;
          margin: 0;
          border-bottom: 2px solid #ccc;
        }
        .nav-item {
          margin-right: 10px;
        }
        .nav-link {
          padding: 10px 15px;
          text-decoration: none;
          color: rgb(205,39,38);
          cursor: pointer;
          border: 1px solid transparent;
        }
        .nav-link.active {
          border-bottom: 3px solid rgb(205,39,38);
          font-weight: bold;
        }
        .container {
          display: none;
        }
        .container.active {
          display: block;
        }
      </style>

      <ul class="nav nav-tabs">
        <li class="nav-item">
          <a class="nav-link active mnuVehicle" data-section="form-data-driving-component">Agregar Vehículo</a>
        </li>
        <li class="nav-item">
          <a class="nav-link mnuVehicle" data-section="vehiclesComponent">Ver vehículos</a>
        </li>
        <li class="nav-item">
          <a class="nav-link mnuVehicle" data-section="normalDrivingComponent">Conducción normal</a>
        </li>
        <li class="nav-item">
          <a class="nav-link mnuVehicle" data-section="aggressiveDrivingComponent">Conducción agresiva</a>
        </li>
        <li class="nav-item">
          <a class="nav-link mnuVehicle" data-section="savingDrivingComponent">Conducción de ahorro</a>
        </li>
      </ul>

      <div class="container active" id="form-data-driving-component">
        <form-data-driving-component></form-data-driving-component>
      </div>
      <div class="container" id="vehiclesComponent">
        <vehicles-component></vehicles-component>
      </div>
      <div class="container" id="normalDrivingComponent">
        <normal-driving-component></normal-driving-component>
      </div>
      <div class="container" id="aggressiveDrivingComponent">
        <aggressive-driving-component></aggressive-driving-component>
      </div>
      <div class="container" id="savingDrivingComponent">
        <saving-driving-component></saving-driving-component>
      </div>
    `;

    this.addEventListeners();
  }

  addEventListeners() {
    this.shadowRoot.querySelectorAll(".mnuVehicle").forEach((tab) => {
      tab.addEventListener("click", (e) => {
        e.preventDefault();
        const sectionId = tab.dataset.section;
        this.updateSections(sectionId);
      });
    });
  }

  updateSections(activeId) {
    this.shadowRoot.querySelectorAll(".nav-link").forEach((tab) => {
      tab.classList.toggle("active", tab.dataset.section === activeId);
    });

    this.shadowRoot.querySelectorAll(".container").forEach((section) => {
      section.classList.toggle("active", section.id === activeId);
    });
  }
}

customElements.define("vehicles-menu-component", VehiclesMenuComponent);
