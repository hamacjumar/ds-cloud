const fs = require('fs')
const path = require("path")
const os = require("os")
const vars = require("./local-vars")

function getLocalData() {
    var filePath = path.join(os.homedir(), vars.configFileName)
    var cfg = {}
    if( fs.existsSync(filePath) ) {
        const fileData = fs.readFileSync(filePath, 'utf8')
        try {
            cfg = JSON.parse( fileData )
        }
        catch( err ) {
            console.log( err )
        }
    }
    return cfg
}

module.exports = getLocalData