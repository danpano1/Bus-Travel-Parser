const Joi = require('joi')
module.exports = (userInput) =>{
    const schema = {
        departureCity: Joi.string().min(3).required(),
        arrivalCity: Joi.string().min(3).required(),
        travelOpts:
            {
                date: Joi.string().regex(/^([0-2][0-9]|(3)[0-1]).(((0)[0-9])|((1)[0-2])).\d{4}$/).required(),
                time: Joi.string().regex(/^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/).required(),
                passengers: Joi.number().required()
            }
        
    }
    return Joi.validate(userInput, schema)
}
