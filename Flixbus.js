const request = require('request-promise');
const cheerio = require('cheerio');

class Flixbus{
    static async getPossibleStations(){

        const jsonCityData = await request(this.citiesJsonUrl)
        const cityData = JSON.parse(jsonCityData)
        const allCities = cityData.cities;
        const citiesFromPoland = []
        
        for(let city in allCities){
            
            if (allCities[city].countryCode === 'PL'){
                citiesFromPoland.push({
                    id: allCities[city].id,
                    name: allCities[city].name.toLowerCase()
                })
            }
        }
        
        return citiesFromPoland
    }

        static async getTravelConnection(startCity, endCity, travelOpts){
            let $ = {};
            let travelPossibilities = [];

            const requestOpts = {
                uri: `https://shop.flixbus.pl/search?departureCity=${startCity.id}&arrivalCity=${endCity.id}&rideDate=${travelOpts.date}&adult=${travelOpts.passengers}`,
                transform: function (body) {
                    return cheerio.load(body);
                }
            }
            try{
            $ = await request(requestOpts)
            
            
            $('#results-group-container-direct').children().toArray().forEach(divWithTravels =>{
                let arrivalDate = travelOpts.date

                const departureTime = $($(divWithTravels).find($('.departure')).get(0)).text();
                
                if(departureTime>= travelOpts.time){

                    const arrivalTime = $($(divWithTravels).find($('.arrival')).get(0)).text();
                    
                    if(arrivalTime<departureTime){

                        const arrayOfDate = arrivalDate.split('.')

                        arrayOfDate[0]++

                        arrivalDate = `${arrayOfDate[0]}.${arrayOfDate[1]}.${arrayOfDate[2]}`
                    }               
                    
                    const startPoint = $($(divWithTravels).find($('.departure-station-name')).get(0)).text()
                    const endPoint = $($(divWithTravels).find($('.arrival-station-name')).get(0)).text()

                    const price = $($(divWithTravels).find($('span.num:not(.visible-sm-inline, visible-lg-inline)')).get(0)).text()                
                

                    travelPossibilities.push({
                        departureStation: startPoint,
                        arrivalStation: endPoint,
                        departureDate: `${travelOpts.date} ${departureTime}`,
                        arrivalDate: `${arrivalDate} ${arrivalTime}`,
                        price: price,
                        service: 'Flixbus'
                    })
                }
            })
        } catch(err) {
            console.log(err)
        }        
        return travelPossibilities
    }  
}

Flixbus.citiesJsonUrl = 'https://d11mb9zho2u7hy.cloudfront.net/api/v1/cities?locale=pl'
// const travelOpts = {
//     date: '28.03.2019',
//     time: '00:00',
//     passengers: '1'
// }
// Flixbus.getTravelConnection({id: 18598}, {id: 7568}, travelOpts);





