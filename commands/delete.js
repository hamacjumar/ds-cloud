const chalk = require("chalk")
const vars = require("../helpers/local-vars")
const utils = require("../helpers/utils")
const getConfig = require("../helpers/get-config")
const ora = require('ora')
const { confirm } = require('@inquirer/prompts')

async function removeApp( appName ) {

    let cfg = getConfig(), targetFolder, res, spinner, url, yesNo

    targetFolder = vars.cloudHome + "/apps/" + appName

    url = utils.getUrl(cfg.cloudKey, "action")

    yesNo = await confirm({ message: `Are you sure you want to delete ${appName}` })

    if( !yesNo ) return

    // try to remove the app
    spinner = ora({
        text: "Deleting "+ appName,
        color: "green"
    }).start()

    try {
        let opt = {
            type: "rm",
            file: targetFolder
        }
        res = await utils.postRequest(url, opt, cfg.cloudKey)
        
        if(!res.status && !res.message.includes("ENOENT: no such file or directory")) {
            spinner.fail("Unable to delete app. Make sure you have internet connection and try again!")
            return
        }

        if(!res.status && res.message.includes("ENOENT: no such file or directory")) {
            spinner.warn( chalk.hex("#FFA500")(appName + " app cannot be found") )
            return
        }

        spinner.succeed(appName + " deleted successfully")
    }
    catch( err ) {
        spinner.fail("Unable to delete app. Make sure you have internet connection and try again!")
    }
}

module.exports = removeApp