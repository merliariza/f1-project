
export default function getVehiclesByTeamId(allVehicles, teamId) {
    return allVehicles.filter(vehicle =>vehicle.teamId == teamId);
}