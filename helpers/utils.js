function getUrl(cloudKey, path, params) {
    var props = cloudKey.split("-")
    var name = props[0]
    var url = `https://${name}-fs.droidscript.cloud/`
    if( path ) url += path
    if( params ) url += "?"+params
    return url
}

function getAppsUrl(cloudKey, app) {
    var name = getCloudName(cloudKey)
    var url = `https://${name}-apps.droidscript.cloud/apps/${app}`
    return url
}

function getSiteUrl( cloudKey ) {
    var name = getCloudName(cloudKey)
    var url = `https://${name}.droidscript.cloud`
    return url;
}

function getCloudName( cloudKey ) {
    var props = cloudKey.split("-")
    return props[0]
}

function getCloudKey( cloudKey ) {
    var props = cloudKey.split("-")
    return props[1]
}

async function getRequest(url, cloudKey) {
    var data = {}, res, contentType
    try {
        res = await fetch(url, {
            method: "GET",
            headers: {
                "Cookie": "key="+getCloudKey(cloudKey)
            }
        })

        if( res.ok ) {

            contentType = res.headers.get('content-type')

            if (contentType && contentType.includes('application/json')) {
                data = await res.json()
            }
            else {
                var t = await res.text()
                if( t.includes("Not authorized!") ) {
                    data.error = true
                    data.msg = "Cloud key is incorrect"
                    data.invalidKey = true
                }
            }
        }
    }
    catch( err ) {
        data.error = true
        data.msg = "Error connecting to the cloud. Cloud name maybe incorrect or you don't have internet connection. Please try again."
        data.invalidKey = false
    }

    return data
}

async function postRequest(url, body={}, cloudKey) {
    var data = {}, res, contentType

    try {
        res = await fetch(url, {
            method: "POST",
            body: JSON.stringify( body ),
            headers: {
                "Content-Type": "application/json",
                "Cookie": "key="+getCloudKey(cloudKey)
            }
        })

        if( res.ok ) {

            contentType = res.headers.get('content-type')

            if (contentType && contentType.includes('application/json')) {
                data = await res.json()
            }
            else {
                var t = await res.text()
                console.log( t )

                data.error = true
                data.msg = t
            }
        }
    }
    catch( err ) {
        data.error = true
        data.msg = ""
    }
    return data
}

module.exports = {
    getUrl,
    getAppsUrl,
    getSiteUrl,
    getCloudKey,
    getRequest,
    postRequest
}