module.exports = (nameOfStartStation, nameOfEndStation, possibleStations) => {
    const stationsFinded = {
        start: [],
        end: []
    };

    possibleStations.forEach(station=>{

        if ( station.name.indexOf(nameOfStartStation.toLowerCase()) !== -1 ) {
            stationsFinded.start.push({
                id: station.id,
                name: station.name
            })
        }

        if ( station.name.indexOf(nameOfEndStation.toLowerCase()) !== -1 ) {
            stationsFinded.end.push({
            id: station.id,
            name: station.name
            })
        }
    })
    
    return stationsFinded
}