const path = require("path")
const chalk = require("chalk")
const getAppInfo = require("../helpers/get-app-info")
const vars = require("../helpers/local-vars")
const utils = require("../helpers/utils")
const getConfig = require("../helpers/get-config")
const FormData = require('form-data')
const fs = require("fs")
const fetch = require('node-fetch')
const ora = require('ora')

let url, cfg, requests = []

async function deploy() {

    var info = getAppInfo(), targetFolder, rmUrl, res, spinner
    
    cfg = getConfig()

    if(info.type == "server" &&  !info.app) {
        console.log( chalk.hex('#FFA500')("App info is incomplete, run "+chalk.bold("'cloud  init'")+" again") )
        return
    }

    if(info.type == "server") {
        console.log("Deploying project to "+info.app)
    }
    else {
        console.log("Deploying website")
    }

    targetFolder = vars.cloudHome + "/apps/" + info.app

    if(info.type == "website") {
        targetFolder = vars.cloudHome + "/public"
    }

    url = utils.getUrl(cfg.cloudKey, "upload")
    rmUrl = utils.getUrl(cfg.cloudKey, "action")

    // try to remove the app
    spinner = ora({
        text: "Cleaning online files...",
        color: "green"
    }).start()

    try {
        let opt = {
            type: "rm",
            file: targetFolder
        }
        res = await utils.postRequest(rmUrl, opt, cfg.cloudKey)
        
        if(!res.status && !res.message.includes("ENOENT: no such file or directory")) {
            spinner.fail("Unable to clear online files. Make sure you have internet connection and try again!")
            return
        }

        spinner.succeed("Online files are cleared")
    }
    catch( err ) {
        spinner.fail("Unable to clear online files. Make sure you have internet connection and try again!")
    }

    requests = []

    spinner = ora({
        text: "Preparing files for upload...",
        color: "green"
    }).start()

    uploadDir(process.cwd(), targetFolder)

    spinner.succeed("Files are ready")

    spinner = ora({
        text: "Uploading files...",
        color: "green"
    }).start()

    try {
        res = await Promise.all(requests)

        spinner.succeed("Uploaded successfully")

        if(info.type == "server") {
            console.log( chalk.green(`Go to '${chalk.bold(utils.getAppsUrl(cfg.cloudKey, info.app))}' and restart your app`) )
        }
        else {
            console.log( chalk.green(`Your website is now ready. Visit '${chalk.bold(utils.getSiteUrl(cfg.cloudKey))}'`) )
        }
    }
    catch( err ) {
        // 
        spinner.fail("Unable to upload files to the server! Make sure you have internet connection and try again!")
    }
    return
}

function uploadDir(folderPath, targetFolder) {

    let formData = new FormData()
    formData.append("cwd", targetFolder)

    let files = fs.readdirSync(folderPath), filePath, stats

    for(let i=0; i<files.length; i++) {

        filePath = path.join(folderPath, files[i])

        stats = fs.lstatSync(filePath)

        if( stats.isFile() ) {
            formData.append("file", fs.createReadStream(filePath))
        }
        else {
            uploadDir(filePath, targetFolder+"/"+files[i])
        }
    }

    requests.push(
        fetch(url, {
            method: "POST",
            body: formData,
            headers: {
                ...formData.getHeaders(),
                "Cookie": "key="+utils.getCloudKey(cfg.cloudKey)
            }
        })
    )
}

module.exports = deploy