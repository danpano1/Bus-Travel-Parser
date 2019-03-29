const express = require('express');
const router = express.Router();

const Neobus = require('../../../parsers/Neobus')
const Flixbus = require('../../../parsers/Flixbus')

const connectionSearchValidation = require('../../../utils/validators/connectionSearchValidation')
const getAllConnections = require('../../../utils/getAllConnections')


router.post('/connections', async (req, res)=>{
    const userInput = req.body
    let allConnections = []

    const {error} = connectionSearchValidation(userInput);

    if (error) return res.status(422).send(error.details[0].message);
    
    allConnections = await getAllConnections(userInput.departureCity, userInput.arrivalCity, userInput.travelOpts, [Neobus, Flixbus])
    
    res.status(200).json(allConnections)
})


module.exports = router;