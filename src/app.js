const express = require('express');
const bodyParser = require('body-parser');
const { getProfile } = require('./middleware/getProfile');
const app = express();
app.use(bodyParser.json());




const JobsService = require('./services/jobsService');
const jobsService = new JobsService();
const { ErrorCodes } = require('./errors/errors');
const { HttpErrors } = require('./errors/http/httpErrors');

const httpDefaultErrorCallback = expressResponse => error => {
    console.error(error);
    const { httpStatusCode, code } = HttpErrors[error.message] || HttpErrors[ErrorCodes.UnknownError];
    expressResponse.status(httpStatusCode).send({ code });
};

/**
 * FIX ME!
 * @returns contract by id
 */
app.get('/contracts/:id', getProfile, (req, res) => {
    const { id } = req.params;
    const profile = req.profile;
    jobsService.getContractById(id, profile.id).then(result => {
        res.json(result);
    }).catch(httpDefaultErrorCallback(res));
});


app.get('/contracts', getProfile, async (req, res) => {
    const profile = req.profile;
    jobsService.getContractsByProfile(profile).then(result => {
        res.json(result);
    }).catch(httpDefaultErrorCallback(res));
});


app.get('/jobs/unpaid', getProfile, async (req, res) => {
    const profile = req.profile;
    jobsService.getUnpaidJobsByProfile(profile).then(result => {
        res.json(result);
    }).catch(httpDefaultErrorCallback(res));
});

app.post('/jobs/:job_id/pay', getProfile, async (req, res) => {
    const { job_id: jobId } = req.params;
    const profile = req.profile;
    jobsService.payJob(jobId, profile).then(result => {
        res.status(204).send();
    }).catch(httpDefaultErrorCallback(res));
});

app.post('/balances/deposit', getProfile, async (req, res) => {
    const { quantity } = req.body;
    const profile = req.profile;
    jobsService.depositMoney(quantity, profile).then(result => {
        res.status(204).send();
    }).catch(httpDefaultErrorCallback(res));
});

module.exports = app;
