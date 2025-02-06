const calcTireWearPerLap = function (lapDistance, tireWearMultiplier) {
    let tireLifespan = 130 // Duración en km antes del desgaste total

    // Cálculo del desgaste por vuelta
    let wearPerLap = ((lapDistance / tireLifespan) * 100) * tireWearMultiplier;
    return parseFloat(wearPerLap.toFixed(2)); // Redondeo a 2 decimales
};

export default calcTireWearPerLap;