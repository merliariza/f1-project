import adjustPerformanceForDownforce from './adjustPerformanceForDownforce.js';
import adjustPerformanceForTirePressure from './adjustPerformanceForTirePressure.js';
import calcTireWearPerLap from './calcTireWearPerLap.js';
import calcWeatherAcceleration from './calcWeatherAcceleration.js';
import calcWeatherFuelConsumption from './calcWeatherFuelConsumption.js';
import calcWeatherMaxSpeed from './calcWeatherMaxSpeed.js';
import calcWeatherTireWear from './calcWeatherTireWear.js';
import curveReduceSpeed from './curveReduceSpeed.js';
import generateRandomWeather from './generateRandomWeather.js';

const simulateRace = async function (configurationId, totalLaps, circuitDistance, curvePositions, maxSpeed, acceleration, fuelConsumption, tireWear, fuelMax, downforce, tirePressure) {
    let randomWeather = generateRandomWeather();

    let modifiedCurves = [...curvePositions];
    
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
    while (lapCount < totalLaps) {
        alert("Vuelta " + lapCount);
        let time = 0; // Reinicio del tiempo por vuelta
        while (position < circuitDistance) {
            // Comprobar si estamos en una curva y reducir velocidad
            for (let i = 0; i < modifiedCurves.length; i++) {
                if (position > modifiedCurves[i]) {
                    // Se reduce la velocidad
                    speed = parseFloat(curveReduceSpeed(speed, randomWeather, downforce, tirePressure));
                    // Se elimina la curva del array
                    modifiedCurves.splice(i, 1);
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
                modifiedCurves = [...curvePositions];
                //  Desgaste de neumáticos
                raceTireWear += tireWearPerLap;
                
                //  Ajuste de velocidad por desgaste de neumáticos
                if (raceTireWear >= 50 && raceTireWear < 60) maxSpeedInCircuit = maxSpeed * 0.9;  // -10% de velocidad máxima
                if (raceTireWear >= 60 && raceTireWear < 70) maxSpeedInCircuit = maxSpeed * 0.85; // -15% de velocidad máxima
                if (raceTireWear >= 70) { // Cambio de neumáticos si supera el 70%
                    raceTireWear = 0;
                    maxSpeedInCircuit = maxSpeed; // Restauramos velocidad máxima
                    tireChanges++;
                    speed = 0;
                }
                
                // Consumo de combustible
                
                raceFuel -= fuelUsed;

                //  Si el combustible es insuficiente, se recarga
                if (raceFuel < fuelUsed) {
                    raceFuel = fuelMax;
                    fuelStops++;
                    speed = 0;
                }
                // Acumulamos el tiempo total de la carrera
                totalTime += time;
                break;
            }
        }
        
        
    }
    totalTime += ((fuelStops*10) + (tireChanges*5));
    
    let averageLapTime = totalTime/totalLaps;
    //  Resumen de carrera
    alert("Simulación completada");
    alert(`Clima: ${randomWeather}`);
    alert(`Velocidad Max: ${maxSpeed} Km/h`);
    alert(`Aceleración: ${acceleration} m/s2`);
    alert(`Consumo de combustible: ${fuelConsumption} L/100km`);
    alert(`Desgaste de neumáticos: ${tireWearPerLap} % por vuelta`);
    alert(`Tiempo promedio por vuelta: ${averageLapTime} s`);
    alert(`Paradas para combustible: ${fuelStops}`);
    alert(`Cambios de neumáticos: ${tireChanges}`);
    alert(`Tiempo total de la carrera: ${totalTime} s`);

    const simulationResults = {
        configurationId: configurationId,
        randomWeather: randomWeather,
        maxSpeed: maxSpeed,
        acceleration: acceleration,
        fuelConsumption: fuelConsumption,
        tireWearPerLap: tireWearPerLap,
        averageLapTime: averageLapTime,
        fuelStops: fuelStops,
        tireChanges: tireChanges,
        totalTime: totalTime,
      };
    
      try {
        const response = await fetch(`http://localhost:3000/simulationResults/`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(simulationResults)
        });
        if (response.ok) {
          alert("Se registraron los resultados de la simulación.")
        } else {
          alert("Error en la respuesta del servidor: " + await response.text());
        }
      } catch (error) {
        console.error("Error al guardar la configuración:", error);
      }

};

export default simulateRace;