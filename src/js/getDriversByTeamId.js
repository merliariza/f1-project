
export default function getDriversByTeamId(allDrivers, teamId) {
    return allDrivers.filter(pilot =>pilot.teamId == teamId);
}