const { sequelize } = require('./../model');
const { Op } = require("sequelize");
const { ErrorCodes } = require('./../errors/errors');

const { ContractStatusEnum, MapperProfileType, ProfileTypeEnum } = require('./domainModels');

class JobsService {
    getContractById = async (id, profileId) => {
        const { Contract } = sequelize.models;
        const contract = await Contract.findOne({ where: { id } });
        if (!contract) throw new Error(ErrorCodes.ContractNotFound);
        if (![contract.ClientId, contract.ContractorId].includes(profileId)) throw new Error(ErrorCodes.ContractDoesNotBelongToUser);
        return contract;
    }
    getContractsByProfile = async profile => {
        const { Contract } = sequelize.models;
        const searchProperty = MapperProfileType[profile.type];
        if (!searchProperty) throw new Error(ErrorCodes.UnknownProfile); // neither client nor contractor
        const contracts = await Contract.findAll({ 
            where: { 
                [searchProperty]: profile.id,
                status: {
                    [Op.ne]: ContractStatusEnum.Terminated
                } 
            } 
        });
        return contracts;
    }
    getUnpaidJobsByProfile = async profile => {
        const { Contract, Job } = sequelize.models;
        const searchProperty = MapperProfileType[profile.type];
        if (!searchProperty) throw new Error(ErrorCodes.UnknownProfile); // neither client nor contractor
        const jobs = await Job.findAll({ 
            where: {
                paid: {
                    [Op.is]: null
                } 
            },
            include: [{
                model: Contract,
                where: {
                    [searchProperty]: req.profile.id,
                    status: ContractStatusEnum.InProgress
                }
            }],
        });
        return jobs;
    }
    payJob = async (jobId, clientProfile) => {
        const { Contract, Job, Profile } = sequelize.models;
        if (clientProfile.type !== ProfileTypeEnum.Client) throw new Error(ErrorCodes.UnauthorizedProfile); // only client profile can use this endpoint
        const job = await Job.findOne({ where: { id: jobId } });
        if (!job) throw new Error(ErrorCodes.JobNotFound); // job not found
        if (job.paid != null) throw new Error(ErrorCodes.JobAlreadyPaid); // job already paid
        if (job.price > clientProfile.balance) throw new Error(ErrorCodes.InsufficientFunds); // insufficient funds
    
        const dbTransaction = await sequelize.transaction();
    
        try {
            const now = new Date();
    
            const contract = await Contract.findOne({ where: { id: job.ContractId } });
            if (contract.ClientId != clientProfile.id) throw new Error(ErrorCodes.ContractDoesNotBelongToUser); // Contract and Jobs does not belong to this client
            await job.update({ 
                paid: true,
                paymentDate: now
            });
            // job.save();

            // Update client balance
            await clientProfile.update({ 
                balance: clientProfile.balance - job.price,
                updatedAt: now
            });
            const contractor = await Profile.findOne({ where: { id: contract.ContractorId } });
            // Update contractor balance
            await contractor.update({ 
                balance: contractor.balance + job.price,
                updatedAt: now
            });    
            await dbTransaction.commit();
            return true;
        } catch (error) {
            await dbTransaction.rollback();
            throw error;
        }
    }
}

module.exports = JobsService;