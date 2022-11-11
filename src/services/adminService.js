const { sequelize } = require('./../model');
const { Op } = require("sequelize");
const { ErrorCodes } = require('./../errors/errors');

const { ContractStatusEnum, MapperProfileType, ProfileTypeEnum } = require('./domainModels');

class AdminService {
    getBestProfession = async (start, end) => {
        const { Contract, Job, Profile } = sequelize.models;
        if (start == undefined || end == undefined) {
            // Default = last 3650 days (~10 years)
            const endDate = new Date();
            end = endDate.toISOString();
            start = new Date(endDate.getTime() - 3650 * 24 * 60 *60 * 1000).toISOString();
        }
        const query = await Job.findAll({
            attributes: [
                [sequelize.fn('SUM', sequelize.col('price')), 'payment_total']
            ],
            where: {
                paid: {
                    [Op.ne]: null
                },
                paymentDate: {
                    [Op.between]: [start, end], 
                } 
            },
            include: [
                {
                    model: Contract,
                    required: true,
                    include: [ {
                        model: Profile,
                        required: true,
                        as: 'Contractor',
                        attributes: ['profession'],
                    }]
                }
            ],
            group: ['Contract.Contractor.profession'],
            order: [['payment_total', 'DESC']]
        });

        const { payment_total: total, Contract: { Contractor: profession } } = query[0].dataValues;
        return {
            profession: profession.profession,
            totalRevenues: total
        };
    }

    getBestClients = async (start, end, limit) => {
        const { Contract, Job, Profile } = sequelize.models;
        if (start == undefined || end == undefined) {
            // Default = last 3650 days (~10 years)
            const endDate = new Date();
            end = endDate.toISOString();
            start = new Date(endDate.getTime() - 3650 * 24 * 60 *60 * 1000).toISOString();
        }
        limit = limit || 2;
        const query = await Job.findAll({
            attributes: [
                [sequelize.fn('SUM', sequelize.col('price')), 'payment_total']
            ],
            where: {
                paid: {
                    [Op.ne]: null
                },
                paymentDate: {
                    [Op.between]: [start, end], 
                }
            },
            include: [
                {
                    model: Contract,
                    required: true,
                    include: [ {
                        model: Profile,
                        required: true,
                        as: 'Client'
                    }]
                }
            ],
            group: ['Contract.Client.id'],
            order: [['payment_total', 'DESC']],
            limit: limit
        });

        return query.map(item => ({
            paymentTotal: item.dataValues.payment_total,
            client: item.dataValues.Contract.Client
        }));
    }
}

module.exports = AdminService;
