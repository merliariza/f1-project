export default async function getDrivers() {
    try {
        const response = await fetch('http://localhost:3000/drivers');
        const data = await response.json(); 
        return data; 
    } catch (error) {
        console.error('Error al obtener datos:', error);
    }
}