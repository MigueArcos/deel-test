const { ErrorCodes } = require('./../errors/errors');
const { HttpErrors } = require('./../errors/http/httpErrors');
const { sequelize } = require('./../model');

const profileNotFound = HttpErrors[ErrorCodes.ProfileNotFound];
const profileHeader = 'profile_id';

const getProfile = async (req, res, next) => {
    const { Profile } = sequelize.models;
    const profile = await Profile.findOne({ where: { id: req.get(profileHeader) || 0 } });
    if(!profile) return res.status(profileNotFound.httpStatusCode).send({ code: profileNotFound.code });
    req.profile = profile;
    next();
}

module.exports = { getProfile }