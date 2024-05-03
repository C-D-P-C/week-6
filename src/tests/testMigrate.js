const sequelize = require('../utils/connection');
const usercreate = require('./userCrate');
require('../models')

const testMigrate = async () => {

    try {
        await sequelize.sync({ force: true })
        console.log('DB reset ✅');
        await usercreate()
        process.exit()
    } catch (error) {
        console.error(error);
    }
}

testMigrate()