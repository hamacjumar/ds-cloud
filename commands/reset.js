const fs = require('fs')
const path = require("path")
const os = require("os")
const vars = require("../helpers/local-vars")
const chalk = require("chalk")

function reset() {
    var filePath = path.join(os.homedir(), vars.configFileName)
    if( fs.existsSync(filePath) ) {
        try {
            fs.unlinkSync( filePath )
            console.log( chalk.green("DS Cloud local data has been cleared") )
        }
        catch( err ) {
            console.log( err )
            console.log( chalk.hex('#FFA500')("An error occured clearing DS cloud local data") )
        }
    }
    else {
        console.log( chalk.hex('#FFA500')("No DS cloud data found locally") )
    }
}

module.exports = reset