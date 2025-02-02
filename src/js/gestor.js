export function setupVehicleClickListener() {
    document.getElementById('show-vehicles').addEventListener('click', function(event) {
      event.preventDefault(); 
      
      const contentArea = document.getElementById('content-area');
      contentArea.innerHTML = '';  
  
      const vehiclesComponent = document.createElement('vehicles-component');
      contentArea.appendChild(vehiclesComponent);
    });
  }
  