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
const AdmZip = require("adm-zip");

async function deploy() {

    let info = getAppInfo(), targetFolder, appsFolder, actionUrl, res, spinner
    let formData, url, cfg
    
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
    appsFolder = vars.cloudHome + "/apps"

    if(info.type == "website") {
        targetFolder = vars.cloudHome + "/public"
        appsFolder = vars.cloudHome
        info.app = "public"
    }

    url = utils.getUrl(cfg.cloudKey, "upload")
    actionUrl = utils.getUrl(cfg.cloudKey, "action")

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
        res = await utils.postRequest(actionUrl, opt, cfg.cloudKey)
        
        if(!res.status && !res.message.includes("ENOENT: no such file or directory")) {
            spinner.fail("Unable to clear online files. Make sure you have internet connection and try again!")
            return
        }

        spinner.succeed("Online files are cleared")
    }
    catch( err ) {
        spinner.fail("Unable to clear online files. Make sure you have internet connection and try again!")
    }

    spinner = ora({
        text: "Preparing files for upload...",
        color: "green"
    }).start()

    formData = uploadDir(info, appsFolder)

    spinner.succeed("Files are ready")

    spinner = ora({
        text: "Uploading files...",
        color: "green"
    }).start()

    try {
        res = await fetch(url, {
            method: "POST",
            body: formData,
            headers: {
                ...formData.getHeaders(),
                "Cookie": "key="+utils.getCloudKey(cfg.cloudKey)
            }
        })

        opt = {
            type: "unzip",
            file: appsFolder+"/"+info.app+".zip"
        }
        res = await utils.postRequest(actionUrl, opt, cfg.cloudKey)

        opt = {
            type: "rm",
            file: appsFolder+"/"+info.app+".zip"
        }
        res = await utils.postRequest(actionUrl, opt, cfg.cloudKey)

        spinner.succeed("Uploaded successfully")

        if(info.type == "server") {
            console.log( chalk.green(`Go to '${chalk.bold(utils.getAppsUrl(cfg.cloudKey, info.app))}' and restart your app`) )
        }
        else {
            console.log( chalk.green(`Your website is now ready. Visit '${chalk.bold(utils.getSiteUrl(cfg.cloudKey))}'`) )
        }
        fs.rmSync(process.cwd() +"/"+ info.app + ".zip")
    }
    catch( err ) {
        // 
        spinner.fail("Unable to upload files to the server! Make sure you have internet connection and try again!")
    }
    return
}

function uploadDir(info, targetFolder) {

    var filePath = process.cwd() + "/" + info.app + ".zip"
    if( fs.existsSync(filePath) ) {
        fs.rmSync( filePath )
    }
    var zip = new AdmZip()
    zip.addLocalFolder( process.cwd() )
    zip.writeZip( filePath )

    let formData = new FormData()
    formData.append("cwd", targetFolder)
    formData.append("file", fs.createReadStream(filePath))

    return formData
}

module.exports = deploy