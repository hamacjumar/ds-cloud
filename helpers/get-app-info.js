const fs = require('fs')
const path = require("path")
const vars = require("./local-vars")

function getAppInfo() {
    var filePath = path.join(process.cwd(), vars.packageJson)
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

    return cfg.dscloud || {}
}

module.exports = getAppInfo