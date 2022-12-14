const ErrorCodes = {
    UnknownError: 'unknown-error',
    ProfileNotFound: 'profile-not-found',
    ContractDoesNotBelongToUser: 'contract-does-not-belong-to-user',
    DepositLimitExceeded: 'deposit-limit-exceeded',
    InvalidQuantity: 'invalid-quantity',
    UnknownProfile: 'unknown-profile',
    UnauthorizedProfile: 'unauthorized-profile',
    ContractNotFound: 'contract-not-found',
    JobNotFound: 'job-not-found',
    JobAlreadyPaid: 'job-already-paid',
    InsufficientFunds: 'insufficient-funds'
};

module.exports = { ErrorCodes };