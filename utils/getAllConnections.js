const findStationsByName = require('../utils/findStationsByName')
const flatten = require('array-flatten')

module.exports = async (startStation, endStation, travelOpts, arrayOfBusServiceClasses) => {
    let parrarelPromises = [];
    const possibleStations = [];
    let classPromiseResolveOrder = [];
    let findedStations = [];        
    const allPossibleConnections = [];
    
    arrayOfBusServiceClasses.forEach(busServiceClass=>{        
        parrarelPromises.push(            
            busServiceClass.getPossibleStations()
            .then(stations=>{
                possibleStations.push(stations)                
                classPromiseResolveOrder.push(busServiceClass)
        }))

    })
    await Promise.all(parrarelPromises);

    parrarelPromises = []
    
    possibleStations.forEach(oneServiceStations =>{
        findedStations.push( findStationsByName( startStation, endStation, oneServiceStations ) )
    })
            
    findedStations.forEach((findedSericeStations, i)=>{
        findedSericeStations.start.forEach(departureStation=>{
            findedSericeStations.end.forEach(arrivalStation=>{
                parrarelPromises.push(                        
                    classPromiseResolveOrder[i].getTravelConnection(departureStation, arrivalStation, travelOpts)
                    .then(possibleConnections=>{
                        allPossibleConnections.push(possibleConnections)                        
                    })
                )                    
            })
        })
    })
    await Promise.all(parrarelPromises)            
    
    

    const flatAllPossibleConnection = flatten(allPossibleConnections)

    flatAllPossibleConnection.sort((a, b)=>{
        if(a.departureDate<b.departureDate) return -1
        else return 1
    })
    
    return flatAllPossibleConnection
    
}