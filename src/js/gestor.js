import '../components/vehiclesMenuComponent.js'; 

export function setupVehicleClickListener() {
  document.getElementById('show-vehicles').addEventListener('click', function(event) {
    event.preventDefault(); 

    const contentArea = document.getElementById('content-area');
    contentArea.innerHTML = '';  

    const vehiclesMenuComponent = document.createElement('vehicles-menu-component');
    
    if (vehiclesMenuComponent instanceof HTMLElement) { 
      contentArea.appendChild(vehiclesMenuComponent);
    } else {
      console.error("Error: El componente 'vehicles-menu-component' no se pudo crear.");
    }
  });
}
