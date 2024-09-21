const {input, select} = require('@inquirer/prompts')
const chalk = require("chalk")
const saveConfig = require("../helpers/save-config")
const getConfig = require("../helpers/get-config")
const utils = require("../helpers/utils")
const vars = require("../helpers/local-vars")
const savePackageJSON = require("../helpers/save-package-json")
const ora = require('ora')

let config = {}

let appName = ""
let appType = ""

async function init() {
    let url, data, spinner

    config = getConfig()

    if( !config.cloudKey ) {

        config.cloudKey = await input({
            message: "Enter your cloud key: "
        })

        if(!config.cloudKey || !config.cloudKey.includes("-")) {
            console.log(chalk.hex('#FFA500')("Key is invalid!"))
            return init()
        }

        saveConfig("cloudKey", config.cloudKey)
    }

    url = utils.getUrl(config.cloudKey, "cd", "folder=&path="+vars.cloudHome)

    try {

        spinner = ora({
            text: "Connecting to the cloud...",
            color: "green"
        }).start()

        data = await utils.getRequest(url, config.cloudKey)

        if( data.error ) {

            spinner.fail( chalk.hex('#FFA500')(data.msg) )

            if( data.invalidKey ) {
                saveConfig("cloudKey", "")
                config.cloudKey = ""
                return init()
            }
        }
        else if( data.status ) {
            spinner.succeed( chalk.green("Connected to the cloud") )
            return selectType()
        }
    }
    catch( err ) {
        spinner.fail( chalk.hex('#FFA500')("Error connecting to the cloud. Make sure you have an internet connection!") )
        console.log()
    }
}

async function selectType() {
    appType = await select({
        message: 'Select project type',
        choices: [
            {
                name: 'NodeJS Server',
                value: 'server',
                description: 'Set this project as nodejs server',
            },
            {
                name: 'Static Website',
                value: 'website',
                description: 'Set this project as static website',
            },
        ],
    })

    if(appType == "server") {
        selectApp()
    }
    else {
        savePackageJSON("type", appType)
        console.log( chalk.green("You're all set-up. Run 'cloud deploy' to publish your site.") )
    }
}

async function selectApp() {
    let url, data = {}, choices = []
    
    url = utils.getUrl(config.cloudKey, "cd", "path="+vars.cloudHome+"&folder=apps")

    try {
        data = await utils.getRequest(url, config.cloudKey)
        if(data.status && data.data?.files?.length) {
            var folders = data.data.files.filter(m => m.isFolder)
            choices = folders.map(m => {
                return {
                    name: m.filename,
                    value: m.filename
                }
            })

            choices.push({
                name: "Create an app",
                value: "create-new-nodejs-server",
                description: "Create a new NodeJS server in the cloud"
            })

            appName = await select({
                message: 'Select an app',
                choices
            })

            if(appName == "create-new-nodejs-server") {
                appName = await enterAppName()
            }

            savePackageJSON("app", appName)
            savePackageJSON("type", appType)

            console.log( chalk.green("You're all set-up. Run 'cloud deploy' to publish "+chalk.bold(appName)+" app.") )
        }
    }
    catch( err ) {
        //
    }
}

async function enterAppName() {
    var name = await input({
        message: "Enter new app name: "
    })

    if( !name ) {
        console.log( chalk.hex("#FFA500")("Server name cannot be empty!") )
        return enterAppName()
    }

    return name
}

module.exports = init