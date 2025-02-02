
export default function getPilotsByTeamId(allPilots, teamId) {
    return allPilots.filter(pilot =>pilot.teamId == teamId);
}