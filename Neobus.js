const request = require('request-promise');
const cheerio = require('cheerio');

class Neobus {
    static async getPossibleStartStations(){
        let neobusHtml = {};
        let possibleInitialStations = [];
        
        const requestOpts = {
            uri: this.page,
            transform: function (body) {
                return cheerio.load(body);
            }
        }

        neobusHtml = await request(requestOpts)

        possibleInitialStations = neobusHtml('#initial_stop > option').toArray().filter($ => $.attribs.value !== '').map($=>{
            let initialStationData = {};
            
            if($.children[0]){            
                initialStationData = {
                    stopId: $.attribs.value,
                    stopName: $.children[0].data
                }
                
                return initialStationData
            }       
        })
        return possibleInitialStations
        
    }

    static async getPossibleEndStations(startStation, travelOpts){

        let jsonEndStationData = '';
        let neobusData = {};
        let neobusEndStationData = {};
        let possibleEndStations = [];

        jsonEndStationData = await request.post(
            this.page, 
            { 
                form: {
                    ajax: true,
                    dataType: 'json',
                    module: 'neotickets',
                    type: 'data',
                    ticket_type: travelOpts.ticketType,
                    passengers: travelOpts.passengers,
                    initial_stop: startStation.stopId                 
            
        }})
        neobusData = JSON.parse(jsonEndStationData)
        neobusEndStationData = neobusData.neotickets.stations
        
        for(let station in neobusEndStationData){
        
            const singleStationObj = neobusEndStationData[station]

            if(singleStationObj.value && singleStationObj.text){
                possibleEndStations.push({
                    stopId: singleStationObj.value,
                    stopName: singleStationObj.text
                })
            }
        }
        return possibleEndStations
    }

    static async getTravelPossibilities(startStation, endStation, travelOpts){
        let jsonTravelData = '';
        let neobusData = {}

        jsonTravelData = await request.post(
            this.page, 
            { 
                form: {
                    ajax: true,
                    dataType: 'json',
                    module: 'neotickets',
                    type: 'data',
                    ticket_type: travelOpts.ticketType,
                    date_there: travelOpts.date,
                    passengers: travelOpts.passengers,
                    initial_stop: startStation.stopId,
                    final_stop: endStation.stopId           
        }})

        neobusData = JSON.parse(jsonTravelData)
        
        console.log(neobusData)

    }
    
}   

Neobus.page = 'https://neobus.pl/'

Neobus.getTravelPossibilities(
    startStation = {
        stopId: '47'
    },
    endStation={
    stopId: '71'
},  
travelOpts = {
    ticketType: 'student',
    passengers: '1',
    date: '27.03.2019'   

});






