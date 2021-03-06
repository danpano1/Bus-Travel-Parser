const request = require('request-promise');
const cheerio = require('cheerio');

class Neobus {
    static async getPossibleStations(){
        let neobusHtml = {};
        let possibleStations = [];
        
        const requestOpts = {
            uri: this.page,
            transform: function (body) {
                return cheerio.load(body);
            }
        }

        neobusHtml = await request(requestOpts)

        neobusHtml('#initial_stop > option').toArray().forEach(divsWithStaions=>{
            if (divsWithStaions.attribs.value !== '') {                
                
                if(divsWithStaions.children[0]){            
                
                    possibleStations.push({
                        id: divsWithStaions.attribs.value,
                        name: divsWithStaions.children[0].data.toLowerCase()
                    })
                }
            }       
        })
        
        return possibleStations
        
    }

    static async getTravelConnection(startStation, endStation, travelOpts){
        let jsonTravelData = '';
        let neobusData = {}        

        const travelDateUserWantTo = travelOpts.date.split('.')
        const userTravelDateNeobusFormat = `${travelDateUserWantTo[2]}-${travelDateUserWantTo[1]}-${travelDateUserWantTo[0]}`

        const travelsToShow = [];

        jsonTravelData = await request.post(
            this.page, 
            { 
                form: {
                    ajax: true,
                    dataType: 'json',
                    module: 'neotickets',
                    step: 1,                   
                    ticket_type: travelOpts.ticketType,
                    date_there: travelOpts.date,
                    passengers: travelOpts.passengers,
                    initial_stop: startStation.id,
                    final_stop: endStation.id           
        }})
    try {
        neobusData = JSON.parse(jsonTravelData)
    
        const $ = cheerio.load(neobusData.neotickets.html)
    
        $('.route').toArray().forEach((route) =>{
            
            if(route.children[1].attribs && route.children[3].attribs){    

                const departureDateAndTimeSeparated = route.children[1].attribs.value.split(' ')  
               
               
                if(departureDateAndTimeSeparated[0]===userTravelDateNeobusFormat) {
                    if(departureDateAndTimeSeparated[1]>=travelOpts.time){
                    
                        const departureDateToFormat = departureDateAndTimeSeparated[0].split('-')

                        const arrivalDateAndTimeSeparated = route.children[3].attribs.value.split(' ')
                        const arrivalDateToFormat = arrivalDateAndTimeSeparated[0].split('-')
                        
                        const properDepartureFormat = `${departureDateToFormat[2]}.${departureDateToFormat[1]}.${departureDateToFormat[0]} ${departureDateAndTimeSeparated[1]}`
                        const properArrivalFormat = `${arrivalDateToFormat[2]}.${arrivalDateToFormat[1]}.${arrivalDateToFormat[0]} ${arrivalDateAndTimeSeparated[1]}`

                        travelsToShow.push({
                            departureStation: startStation.name,
                            arrivalStation: endStation.name,
                            departureDate: properDepartureFormat,
                            arrivalDate:  properArrivalFormat,
                            price: $(route).find($(('.price'))).text(),
                            service: 'Neobus'
                        })
                    }
                }
            }
        })
                        
    }
    catch(err){
        console.log(err)
    }

    return travelsToShow
  
    }   
    
}   

Neobus.page = 'https://neobus.pl/'
module.exports = Neobus;

// Neobus.getAllPossibleConnections('Ostrowiec', 'Warszawa', {
//     ticketType: 'student',
//     passengers: '1',
//     date: '30.03.2019',
//     time: '11:00'
// })

