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

// app.post('/jobs/:job_id/pay', getProfile, async (req, res) => {
//     const { Contract, Job, Profile } = req.app.get('models');
//     const { job_id: jobId } = req.params;
//     const profile = req.profile;
//     if (profile.type !== 'client') return res.status(401).end(); // only client profile can use this endpoint
//     const job = await Job.findOne({ where: { jobId } });
//     if (!job) return res.status(404).end(); // job not found
//     if (job.paid != null) return res.status(400).end(); // job already paid
//     if (job.price > profile.balance) return res.status(400).end(); // insufficient funds

//     const dbTransaction = await sequelize.transaction();

//     try {
//         const now = new Date();

//         const contract = await Contract.findOne({ where: { id: job.ContractId } });
//         await contract.update({
//             status: 'terminated',
//             updatedAt: now
//         }); // TODO: I'm not sure if the payment should finish the contract
//         // contract.save();
//         await job.update({ 
//             paid: true,
//             paymentDate: now
//         });
//         // job.save();
//         // Update client balance
//         await profile.update({ 
//             balance: profile.balance - job.price,
//             updatedAt: now
//         });
//         const contractor = await Profile.findOne({ where: { id: contract.ContractorId } });
//         // Update contractor balance
//         await contractor.update({ 
//             balance: contractor.balance + job.price,
//             updatedAt: now
//         });
//         // profile.save();

//         await dbTransaction.commit();
//         res.status(204).send();
//     } catch (error) {
//         await dbTransaction.rollback();
//         res.status(500).send();
//     }
// });

// app.get('/admin/best-profession', async (req, res) => {
//     const { Contract, Job, Profile } = req.app.get('models');
//     const { start, end } = req.query;

//     const jobs = await Job.findAll({
//         attributes: [
//             'id',
//         ],
//         where: {
//             paid: {
//                 [Op.ne]: null
//             } 
//         },
//         include: [
//             {
//                 model: Contract,
//                 required: true,
//                 include: [ {
//                     model: Profile,
//                     required: true,
//                     as: 'Contractor'
//                 }]
//             }
//         ],
//     });
//     res.json(jobs);
// });
module.exports = app;
