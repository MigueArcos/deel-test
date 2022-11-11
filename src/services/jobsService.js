const { sequelize } = require('./../model');
const { Op } = require("sequelize");
const { ErrorCodes } = require('./../errors/errors');

const { ContractStatusEnum, MapperProfileType } = require('./domainModels');

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
    getUnpaidJobsByProfile = async (profile) => {
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
}

module.exports = JobsService;