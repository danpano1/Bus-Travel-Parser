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

        possibleStations = neobusHtml('#initial_stop > option').toArray().filter(divsWithStaions => divsWithStaions.attribs.value !== '').map(divsWithStaions=>{
            let initialStationData = {};
            
            if(divsWithStaions.children[0]){            
                initialStationData = {
                    id: divsWithStaions.attribs.value,
                    name: divsWithStaions.children[0].data.toLowerCase()
                }
                
                return initialStationData
            }       
        })
        console.log(possibleStations)
        return possibleStations
        
    }

    static async getTravelPossibilities(startStationId, endStationId, travelOpts){
        let jsonTravelData = '';
        let neobusData = {}        

        const travelDateUserWantTo = travelOpts.date.split('.')
        const userTravelDateProperForm = `${travelDateUserWantTo[2]}-${travelDateUserWantTo[1]}-${travelDateUserWantTo[0]}`

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
                    initial_stop: startStationId,
                    final_stop: endStationId           
        }})

        neobusData = JSON.parse(jsonTravelData)

        const $ = cheerio.load(neobusData.neotickets.html)

        $('.route').toArray().forEach((route) =>{
            
            if(route.children[1].attribs && route.children[3].attribs){
                const travelDate = route.children[1].attribs.value
                const travelDateTimeAndDaySeparated = travelDate.split(' ')  
               
               
                
                if(travelDateTimeAndDaySeparated[0]===userTravelDateProperForm) {

                    

                    travelsToShow.push({
                        departureDate: route.children[1].attribs.value,
                        arrivalDate:  route.children[3].attribs.value,
                        price: $(route).find($(('.price'))).text()
                    })
                }
            }
        })

                
        
        return travelsToShow
  
    }
    
}   

Neobus.page = 'https://neobus.pl/'

// Neobus.getPossibleStations()

// Neobus.getTravelPossibilities('47', '85',  travelOpts = {
//     ticketType: 'student',
//     passengers: '1',
//     date: '27.03.2019'  

// });

