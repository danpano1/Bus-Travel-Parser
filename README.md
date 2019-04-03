Used technologies:
  - Node.js
  - Express
  - Cheerio
  - Request
  - Joi
  
How it works:
  - Live scraping two bus travel pages: Flixbus and Neobus
  - Users just type two cities, date, time and number of tickets they want to travel
  - Server validate their input
  - App make api requests or just scrapes page to find cities and their ids from travel pages
  - Names of the cities from that pages are compared with user inputs
  - If there is any match server make asynchronous pararell requests to that pages to find travel posibilites
  - Server sends finded results by API

NOTE: If this app do not work properly the reason is that pages of the services or their API have been changed, if you see this, please note me that and it will be fixed as soon as possible
