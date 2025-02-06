import adjustPerformanceForDownforce from './adjustPerformanceForDownforce.js';
import adjustPerformanceForTirePressure from './adjustPerformanceForTirePressure.js';
import calcTireWearPerLap from './calcTireWearPerLap.js';
import calcWeatherAcceleration from './calcWeatherAcceleration.js';
import calcWeatherFuelConsumption from './calcWeatherFuelConsumption.js';
import calcWeatherMaxSpeed from './calcWeatherMaxSpeed.js';
import calcWeatherTireWear from './calcWeatherTireWear.js';
import curveReduceSpeed from './curveReduceSpeed.js';
import generateRandomWeather from './generateRandomWeather.js';

const simulateRace = function (circuitDistance, curvePositions, maxSpeed, acceleration, fuelConsumption, tireWear, fuelMax, downforce, tirePressure) {
    let randomWeather = generateRandomWeather();
    console.log("Simulacion")
    let modifiedCurves = [...curvePositions];
    //let circuitDistance = 5; // Distancia total en km
    //let curvePositions = [1.2, 2.8, 3.5, 4.7]; // Posiciones de curvas (en km)
    
    
    // Ajustes por carga aerodinámica

    let adjustPerformanceForDownforceResults = adjustPerformanceForDownforce(downforce, maxSpeed, acceleration, fuelConsumption, tireWear);
    maxSpeed = adjustPerformanceForDownforceResults.maxSpeed;
    acceleration = adjustPerformanceForDownforceResults.acceleration;
    fuelConsumption = adjustPerformanceForDownforceResults.fuelConsumption;
    tireWear = adjustPerformanceForDownforceResults.tireWear;
    
    // Ajustes por presión de neumáticos

    let adjustPerformanceForTirePressureResults = adjustPerformanceForTirePressure(tirePressure, maxSpeed, acceleration, fuelConsumption, tireWear);
    maxSpeed = adjustPerformanceForTirePressureResults.maxSpeed;
    acceleration = adjustPerformanceForTirePressureResults.acceleration;
    fuelConsumption = adjustPerformanceForTirePressureResults.fuelConsumption;
    tireWear = adjustPerformanceForTirePressureResults.tireWear;

    // Actualización de propiedades por clima
    maxSpeed = calcWeatherMaxSpeed(maxSpeed, randomWeather, downforce, tirePressure);
    acceleration = calcWeatherAcceleration(acceleration, randomWeather, downforce, tirePressure);
    fuelConsumption = calcWeatherFuelConsumption(fuelConsumption, randomWeather, downforce, tirePressure);
    tireWear = calcWeatherTireWear(tireWear, randomWeather, downforce, tirePressure);
    console.log("Desgaste de neumaticos");
    console.log(tireWear)
    console.log(typeof tireWear)
    let error = false;
    // Parámetros del vehículo
    let speed = 0; // Velocidad actual (km/h)
    let tireWearPerLap = calcTireWearPerLap(circuitDistance, tireWear); // Desgaste por vuelta (%)
    let maxSpeedInCircuit = maxSpeed // Esta es la velocidad máxima que se modificará por el desgaste de los neumáticos
    let fuelUsed = (fuelConsumption * circuitDistance) / 100; // Combustible medido en L/100km
    //  Datos del circuito
    
    // Variables de simulación
    let position = 0; // Posición en km
    let lapCount = 0; // Contador de vueltas
    let raceFuel = fuelMax; // Combustible actual (litros)
    let raceTireWear = 0; // Desgaste inicial (%)
    let fuelStops = 0; // Contador de recargas
    let tireChanges = 0; // Contador de cambios de neumáticos
    let totalTime = 0;

    //  Simulación
    while (lapCount < 50) { // Simula 10 vueltas
        console.log("Vuelta " + lapCount);
        let time = 0; // Reinicio del tiempo por vuelta
        while (position < circuitDistance) {
            // Comprobar si estamos en una curva y reducir velocidad
            for (let i = 0; i < modifiedCurves.length; i++) {
                if (position > modifiedCurves[i]) {
                    // Se reduce la velocidad
                    speed = parseFloat(curveReduceSpeed(speed, randomWeather, downforce, tirePressure));
                    // Se elimina la curva del array
                    modifiedCurves.splice(i, 1);
                    console.log("Curva eliminada")
                    console.log(modifiedCurves)
                    console.log("Curvas originales");
                    console.log(curvePositions);
                    // Se sale del bucle
                    break;
                }
            }

            // Avanzar según velocidad
            let distanceTraveled;
            if (speed > 0){
                distanceTraveled = (speed / 3600);
            } else {
                distanceTraveled = 0
            }
            // Convertimos km/h a km por segundo

        
            position += parseFloat(distanceTraveled);

            // Aumentar velocidad según aceleración (convertimos m/s² a km/h por iteración)
            speed += (acceleration * 3.6);
            if (speed > maxSpeed) speed = maxSpeed;

            // Contabilizar el tiempo
            time++;

            // Si se completa una vuelta
            if (position >= circuitDistance) {
                lapCount++;
                position = (position-circuitDistance); // Reiniciamos la posición
                modifiedCurves = curvePositions;
                console.log("Curvas restablecidas");
                console.log(modifiedCurves);
                console.log("Curvas originales");
                console.log(curvePositions);
                //  Desgaste de neumáticos
                raceTireWear += tireWearPerLap;
                
                //  Ajuste de velocidad por desgaste de neumáticos
                if (raceTireWear >= 50 && raceTireWear < 60) maxSpeedInCircuit = maxSpeed * 0.9;  // -10% de velocidad máxima
                if (raceTireWear >= 60 && raceTireWear < 70) maxSpeedInCircuit = maxSpeed * 0.85; // -15% de velocidad máxima
                if (raceTireWear >= 70) { // Cambio de neumáticos si supera el 70%
                    raceTireWear = 0;
                    maxSpeedInCircuit = maxSpeed; // Restauramos velocidad máxima
                    tireChanges++;
                }
                
                // Consumo de combustible
                
                raceFuel -= fuelUsed;

                //  Si el combustible es insuficiente, se recarga
                if (raceFuel < fuelUsed) {
                    raceFuel = fuelMax;
                    fuelStops++;
                }

                //  Mostrar datos de la vuelta
                console.log(`Vuelta ${lapCount}:`);
                console.log(`Tiempo: ${time} s`);
                console.log(`Combustible restante: ${raceFuel.toFixed(2)} L`);
                console.log(`Desgaste de neumáticos: ${raceTireWear}%`);
                console.log(`Max Speed: ${maxSpeedInCircuit} km/h`);
                console.log("------------------------------");

                // Acumulamos el tiempo total de la carrera
                totalTime += time;
                break;
            }
        }
        
        
    }

    //  Resumen de carrera
    console.log("Simulación completada");
    console.log(`Total de vueltas: ${lapCount}`);
    console.log(`Paradas para combustible: ${fuelStops}`);
    console.log(`Cambios de neumáticos: ${tireChanges}`);
    console.log(`Tiempo total de la carrera: ${totalTime} s`);

    return "hola"
};

export default simulateRace;