const chalk = require("chalk")
const getConfig = require("../helpers/get-config")

async function showKey() {
    let cfg = getConfig()
    console.log("Cloud key: " + chalk.green(cfg.cloudKey))
}

module.exports = showKey