import '../components/vehiclesMenuComponent.js'; // Importar antes de usar

export function setupVehicleClickListener() {
  document.getElementById('show-vehicles').addEventListener('click', function(event) {
    event.preventDefault(); 

    const contentArea = document.getElementById('content-area');
    contentArea.innerHTML = '';  

    // Crear correctamente el elemento personalizado
    const vehiclesMenuComponent = document.createElement('vehicles-menu-component');
    
    if (vehiclesMenuComponent instanceof HTMLElement) { 
      contentArea.appendChild(vehiclesMenuComponent);
    } else {
      console.error("Error: El componente 'vehicles-menu-component' no se pudo crear.");
    }
  });
}
