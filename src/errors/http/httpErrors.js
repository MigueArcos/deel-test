const { ErrorCodes } = require('./../errors');

const HttpErrors = {
    [ErrorCodes.UnknownError]: { 
        httpStatusCode: 500, 
        code: ErrorCodes.UnknownError
    },
    [ErrorCodes.ProfileNotFound]: { 
        httpStatusCode: 401, 
        code: ErrorCodes.ProfileNotFound
    },
    [ErrorCodes.ContractDoesNotBelongToUser]: { 
        httpStatusCode: 403, 
        code: ErrorCodes.ContractDoesNotBelongToUser
    },
    [ErrorCodes.InsufficientFunds]: { 
        httpStatusCode: 400, 
        code: ErrorCodes.InsufficientFunds
    },
    [ErrorCodes.JobAlreadyPaid]: { 
        httpStatusCode: 400, 
        code: ErrorCodes.JobAlreadyPaid
    },
    [ErrorCodes.JobNotFound]: { 
        httpStatusCode: 404, 
        code: ErrorCodes.JobNotFound
    },
    [ErrorCodes.ContractNotFound]: { 
        httpStatusCode: 404, 
        code: ErrorCodes.ContractNotFound
    },
    [ErrorCodes.UnauthorizedProfile]: { 
        httpStatusCode: 401, 
        code: ErrorCodes.UnauthorizedProfile
    },
    [ErrorCodes.UnknownProfile]: { 
        httpStatusCode: 401, 
        code: ErrorCodes.UnknownProfile
    },
};

module.exports = { HttpErrors }