const express = require('express');
const bodyParser = require('body-parser');
const { sequelize } = require('./model');
const { getProfile } = require('./middleware/getProfile');
const { Op } = require("sequelize");
const app = express();
app.use(bodyParser.json());
app.set('sequelize', sequelize);
app.set('models', sequelize.models);


const searchProperties = {
    client: 'ClientId',
    contractor: 'ContractorId'
};

/**
 * FIX ME!
 * @returns contract by id
 */
app.get('/contracts/:id', getProfile, async (req, res) => {
    const { Contract } = req.app.get('models');
    const { id } = req.params;
    const contract = await Contract.findOne({ where: { id } });
    if (!contract) return res.status(404).end();
    if (![contract.ClientId, contract.ContractorId].includes(req.profile.id)) return res.status(401).end(); // unauthroized to view contract
    res.json(contract);
});


app.get('/contracts', getProfile, async (req, res) => {
    const { Contract } = req.app.get('models');
    const searchProperty = searchProperties[req.profile.type];
    if (!searchProperty) return res.status(401).end(); // neither client nor contractor (Move to middleware?)
    const contracts = await Contract.findAll({ 
        where: { 
            [searchProperty]: req.profile.id,
            status: {
                [Op.ne]: 'terminated'
            } 
        } 
    });
    res.json(contracts);
});


module.exports = app;
