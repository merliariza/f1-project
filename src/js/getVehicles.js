export default async function getVehicles() {
    try {
        const response = await fetch('http://localhost:3000/vehicles');
        const data = await response.json(); 
        return data; 
    } catch (error) {
        console.error('Error al obtener datos:', error);
    }
}