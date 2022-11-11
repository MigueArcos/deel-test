// Maps the profile.type to search with the correct DB Field
const MapperProfileType = {
    client: 'ClientId',
    contractor: 'ContractorId'
};

const ContractStatusEnum = {
    New: 'new',
    InProgress: 'in_progress',
    Terminated: 'terminated'
}

module.exports = { MapperProfileType, ContractStatusEnum };