export default async function getTeams() {
    console.log("equipo")
    try {
        const response = await fetch('http://localhost:3000/teams');
        const data = await response.json(); 
        return data; 
    } catch (error) {
        console.error('Error al obtener datos:', error);
    }
}