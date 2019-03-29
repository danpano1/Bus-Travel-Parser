const express = require('express')
const app = express();

const connectionRoute = require('./controllers/routes/search/getConnections')

app.use(express.json())

app.use('/api/', connectionRoute)

const port = process.env.PORT || 3000

app.listen(port, ()=>{
    console.log(`Listening on port ${port}`)
})