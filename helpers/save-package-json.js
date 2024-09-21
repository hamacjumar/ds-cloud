const fs = require('fs')
const path = require("path")
const vars = require("./local-vars")

function savePackageJSON(key, value) {
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

    if( !cfg.dscloud ) cfg.dscloud = {}
    
    if( key ) {
        cfg.dscloud[key] = value
    }

    fs.writeFileSync(filePath, JSON.stringify(cfg, null, 2), "utf-8")
}

module.exports = savePackageJSON