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
                    name: allCities[city].name
                })
            }
        }
        
        return citiesFromPoland
    }

        static async getTravelPossibilities(startCityId, endCityId, travelOpts){
            let $ = {};
            let travelPossibilities = [];

            const requestOpts = {
                uri: `https://shop.flixbus.pl/search?departureCity=${startCityId}&arrivalCity=${endCityId}&rideDate=${travelOpts.date}&adult=${travelOpts.passgengers}`,
                transform: function (body) {
                    return cheerio.load(body);
                }
            }

            $ = await request(requestOpts)
            
            $('#results-group-container-direct').children().toArray().forEach(divWithTravels =>{
                console.log('divWithTravels')
                const departureTime = $(divWithTravels).find($('.departure')).text();
                const arrivalTime = $(divWithTravels).find($('.arrival')).text();

                const startPoint = $(divWithTravels).find($('.departure-station-name')).text();
                const endPoint = $(divWithTravels).find($('.arrival-station-name')).text();

                const price = $(divWithTravels).find($('span.num')).text();


                travelPossibilities.push({
                    departureStation: startPoint,
                    arrivalStation: endPoint,
                    departureDate: `${travelOpts.date} ${departureTime}`,
                    arrivalDate: `${travelOpts.date} ${arrivalTime}`,
                    price: price
                })
            })
            console.log(travelPossibilities)
            return travelPossibilities
        }
        
}

Flixbus.citiesJsonUrl = 'https://d11mb9zho2u7hy.cloudfront.net/api/v1/cities?locale=pl'

Flixbus.getTravelPossibilities(18598, 7568, {
    date: '29.03.2019',
    passengers: '1'
});



