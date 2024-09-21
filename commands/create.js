const chalk = require("chalk")
const vars = require("../helpers/local-vars")
const utils = require("../helpers/utils")
const getConfig = require("../helpers/get-config")
const ora = require('ora')
const { input } = require('@inquirer/prompts')

async function createApp( appName ) {

    let cfg = getConfig(), targetFolder, res, spinner, url, yesNo

    targetFolder = vars.cloudHome + "/apps"

    url = utils.getUrl(cfg.cloudKey, "action")

    // try to remove the app
    spinner = ora({
        text: "Creating "+ appName + " app",
        color: "green"
    }).start()

    try {
        let opt = {
            type: "mkdir",
            cwd: targetFolder,
            name: appName
        }
        res = await utils.postRequest(url, opt, cfg.cloudKey)
        
        if(!res.status && res.message.includes("Please choose different name")) {
            spinner.warn( chalk.hex("#FFA500")(appName + " app already exists!") )
            return
        }

        spinner.succeed(appName + " created successfully")
    }
    catch( err ) {
        spinner.fail("Unable to create app. Make sure you have internet connection and try again!")
    }
}

module.exports = createApp