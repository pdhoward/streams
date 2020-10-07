const events =                require('../events')

exports.getservers = async(app) => {
    let servers = await events(app)
    return {servers}
}