
export default function getDriversByTeamId(teams, teamId) {
    const team = teams.find(team => team.id == teamId);
    const teamDrivers = team.drivers;
    return teamDrivers
}