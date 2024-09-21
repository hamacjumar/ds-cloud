const fs = require('fs')
const path = require("path")
const os = require("os")
const vars = require("./local-vars")

function saveConfig(key, value) {
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
    
    if( key ) {
        cfg[key] = value
    }

    fs.writeFileSync(filePath, JSON.stringify(cfg, null, 4), "utf-8")
}

module.exports = saveConfig