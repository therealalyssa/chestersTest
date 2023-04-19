const env = require("dotenv").config();
const fetch = require("node-fetch-commonjs");
const moment = require("moment-timezone");
const { createHmac } = require("crypto");

const Zoho = {
    getAllRecords: async function(appLink, reportLink, options) {
        let allRecords = [];
        let _from = 0;
        let makeRequest = true;
            while(makeRequest) {
                let resp = await this.getRecords(appLink, reportLink, { ...options, from: _from });
                    if(resp.hasOwnProperty("records") && Array.isArray(resp.records)) {
                        for(let i = 0; i < resp.records.length; i++) {
                            allRecords.push(resp.records[i]);
                        }
                        _from = resp.nextRowsFrom;
                    } else if(resp.hasOwnProperty("message") && ((resp.message.toString() === "No Data Available") || (resp.message.toString() === "No records found for the given criteria."))) {
                        makeRequest = false;
                    } else {
                        makeRequest = false;
                        return resp;
                    }
            }
        return allRecords;
    },
    
    getRecords: async function(appLink, reportLink, options, retry = 4) {
        const url = !options ? `${process.env.DEV_URL}/api/${appLink}/${reportLink}` : `${process.env.DEV_URL}/api/${appLink}/${reportLink}/${encodeURIComponent(JSON.stringify(options))}`;
        const method = "GET";
        //SR
        console.log("This is the URL: "+url);
        const timeStamp = moment().tz("Pacific/Auckland").format("x");
        const headers = {
            Authorization: `Bearer ${calculateSignature(method, url, process.env.SECRET, process.env.OWNER, process.env.TOKEN, timeStamp)}`,
            timestamp: timeStamp,
            tokenid: process.env.TOKEN
        }
        const request = await fetch(url, {
            headers: headers,
            method: method
        }).then(async (resp) => {
            if(resp.ok) {
                const result = await resp.json();
                return result;
            } else {
                if(retry > 0) {
                    retry--;
                    return this.getRecords(appLink, reportLink, options, retry);
                } else {
                    try {
                        const error = await resp.json();
                        return error;
                    } catch (error) {
                        return ({ code: resp.status, error: resp.statusText });
                    }
                }
            }
        }).catch((error) => {
            return error;
        });
        return request;
    },
    
    createRecords: async function(appLink, formLink, payload, options = { fields: [], tasks: true }, retry = 4) {
        const url = !options ? `${process.env.DEV_URL}/api/${appLink}/${formLink}` : `${process.env.DEV_URL}/api/${appLink}/${formLink}/${JSON.stringify(options)}`;
        const method = "POST";
        const timeStamp = moment().tz("Pacific/Auckland").format("x");
        const headers = {
            Authorization: `Bearer ${calculateSignature(method, url, process.env.SECRET, process.env.OWNER, process.env.TOKEN, timeStamp)}`,
            timestamp: timeStamp,
            tokenid: process.env.TOKEN,
            "content-type": "application/json"
        }
        const request = await fetch(url, {
            headers: headers,
            method: method,
            body: JSON.stringify(payload)
        }).then(async (resp) => {
            if(resp.ok) {
                const result = await resp.json();
                return result;
            } else {
                if(retry > 0) {
                    retry--;
                    return this.createRecords(appLink, formLink, payload, options, retry);
                } else {
                    try {
                        const error = await resp.json();
                        return error;
                    } catch (error) {
                        return ({ code: resp.status, error: resp.statusText });
                    }
                }
            }
        }).catch((error) => {
            return error;
        });
        return request;
    },
    
    updateRecords: async function(appLink, reportLink, payload, options = { fields: [], tasks: true, recordId: undefined, criteria: undefined }, retry = 4) {
        const url = !options ? `${process.env.DEV_URL}/api/${appLink}/${reportLink}` : `${process.env.DEV_URL}/api/${appLink}/${reportLink}/${JSON.stringify(options)}`;
        const method = "PUT";
        const timeStamp = moment().tz("Pacific/Auckland").format("x");
        const headers = {
            Authorization: `Bearer ${calculateSignature(method, url, process.env.SECRET, process.env.OWNER, process.env.TOKEN, timeStamp)}`,
            timestamp: timeStamp,
            tokenid: process.env.TOKEN,
            "content-type": "application/json"
        }
        const request = await fetch(url, {
            headers: headers,
            method: method,
            body: JSON.stringify(payload)
        }).then(async (resp) => {
            if(resp.ok) {
                const result = await resp.json();
                return result;
            } else {
                if(retry > 0) {
                    retry--;
                    return this.updateRecords(appLink, reportLink, payload, options, retry);
                } else {
                    try {
                        const error = await resp.json();
                        return error;
                    } catch (error) {
                        return ({ code: resp.status, error: resp.statusText });
                    }
                }
            }
        }).catch((error) => {
            return error;
        });
        return request;
    },

    /**
     * 
     * @param {String} appLink The app link string
     * @param {String} reportLink The relevant report link string
     * @param {String} fieldLinkName The field link name on the Zoho Form that the file/image is being uploaded to
     * @param {String} recordId The Zoho Creator Row ID to which the file/image is being uploaded to
     * @param {String} fileName The name of image / file (Zoho Creator prefers short names)
     * @param {String} uploadType Can either be BUFFER or PATH - e.g. if you're uploading a file or image and you have
     * the direct download url, you should specify PATH, but if you have the file's buffer data, specify BUFFER
     * @param {String} fieldType This can either be FILE or IMAGE depending on what you're uploading | maximum of 50 MB for FILE and 10 MB for IMAGE
     * @param {String | Buffer} FileBufferOrUrl Provide either the file's buffer data or specify the direct download URL of the file/image. Make sure the uploadType
     * parameter conforms
     * @param {Integer} retry # of times to attempt the upload incase of request fails 
     * @returns 
     */
    uploadFile: async function(appLink, reportLink, fieldLinkName, recordId, fileName, uploadType, fieldType, FileBufferOrUrl, retry = 3) {
        const url = `${process.env.DEV_URL}/api/${appLink}/${reportLink}/${fieldLinkName}/${recordId}/${fileName}/${uploadType}/${fieldType}`;
        const method = "POST";
        const timeStamp = moment().tz("Pacific/Auckland").format("x");
        const headers = {
            Authorization: `Bearer ${calculateSignature(method, url, process.env.SECRET, process.env.OWNER, process.env.TOKEN, timeStamp)}`,
            timestamp: timeStamp,
            tokenid: process.env.TOKEN,
            "content-type": "application/json"
        }
        const request = await fetch(url, {
            headers: headers,
            method: method,
            body: JSON.stringify({
                file: {
                    UrlOrBuffer: FileBufferOrUrl
                }
            })
        }).then(async (resp) => {
            if(resp.ok) {
                const result = await resp.text();
                return result;
            } else {
                if(retry > 0) {
                    retry--;
                    return this.uploadFile(appLink, reportLink, fieldLinkName, recordId, fileName, uploadType, fieldType, FileBufferOrUrl, retry);
                } else {
                    try {
                        const error = await resp.text();
                        return error;
                    } catch (error) {
                        return ({ code: resp.status, error: resp.statusText });
                    }
                }
            }
        }).catch((error) => {
            return error;
        });
        return request;
    },

    /**
     * 
     * @param {String} appLink The app link string
     * @param {String} reportLink The relevant report link string
     * @param {String} fieldLinkName The field link name on the Zoho Form that the file/image is being downloaded from
     * @param {String} recordId The Zoho Creator Row ID to which the file/image is being downloaded from
     * @param {Integer} retry # of times to attempt the upload incase of request fails 
     * @returns a JSON object containing a Filename and a Buffer which can either be a Buffer or an ArrayBuffer 
     * containing file data that can be saved. use null encoding when saving the file.
     */
     downloadFile: async function(appLink, reportLink, fieldLinkName, recordId, retry = 3) {
        const url = `${process.env.DEV_URL}/api/${appLink}/${reportLink}/${fieldLinkName}/${recordId}/download`;
        const method = "GET";
        const timeStamp = moment().tz("Pacific/Auckland").format("x");
        const headers = {
            Authorization: `Bearer ${calculateSignature(method, url, process.env.SECRET, process.env.OWNER, process.env.TOKEN, timeStamp)}`,
            timestamp: timeStamp,
            tokenid: process.env.TOKEN,
            "content-type": "application/json"
        }
        const request = await fetch(url, {
            headers: headers,
            method: method
        }).then(async (resp) => {
            if(resp.ok) {
                const result = await resp.json();
                return result;
            } else {
                if(retry > 0) {
                    retry--;
                    return this.downloadFile(appLink, reportLink, fieldLinkName, recordId, retry);
                } else {
                    try {
                        const error = await resp.json();
                        return error;
                    } catch (error) {
                        return ({ code: resp.status, error: resp.statusText });
                    }
                }
            }
        }).catch((error) => {
            return error;
        });
        return request;
    }
}

const MYOB = {
    getCompanies: async function () {
        const timestamp = new Date();
        return fetch(`${process.env.MYOB_URL}/api/companyfiles`, 
        {
            headers: {
                Authorization: `Bearer ${calculateSignature(
                    "GET", 
                    `${process.env.MYOB_URL}/api/companyfiles`, 
                    process.env.SECRET, 
                    process.env.OWNER, 
                    process.env.TOKEN, 
                    timestamp
                )}`,
                timestamp: timestamp,
                tokenid: process.env.TOKEN,
                "content-type": "application/json"
            },
            method: "GET"
        }).then((resp) => {
            if (resp.ok) {
                return resp.json();
            } else {
                throw new Error(JSON.stringify({
                    error: resp.statusText,
                    code: resp.status
                }));
            }
        }).catch((error) => {
            console.log(error);
            return;
        });
    },

    getTaxRates: async function () {
        const uri = encodeURIComponent("https://arl2.api.myob.com/accountright/...");
        const timestamp = new Date();
        return fetch(`${process.env.MYOB_URL}/api/taxCodes/${uri}`, 
        {
            headers: {
                Authorization: `Bearer ${calculateSignature(
                    "GET", 
                    `${process.env.MYOB_URL}/api/taxCodes/${decodeURIComponent(uri)}`, 
                    process.env.SECRET, 
                    process.env.OWNER, 
                    process.env.TOKEN, 
                    timestamp
                )}`,
                timestamp: timestamp,
                tokenid: process.env.TOKEN,
                "content-type": "application/json"
            },
            method: "GET"
        }).then((resp) => {
            if (resp.ok) {
                return resp.json();
            } else {
                throw new Error(JSON.stringify({
                    error: resp.statusText,
                    code: resp.status
                }));
            }
        }).catch((error) => {
            console.log(error);
            return;
        });
    }
}

function calculateSignature(method, url, secret, ownerId, tokenId, timestamp) {
    // Create signature string in .update()
    return Buffer.from(createHmac("sha256", secret).update(`${method}&${encodeURIComponent(url)}&${timestamp}&${secret}&${ownerId}&${tokenId}`).digest("hex")).toString("base64");
}

async function test() {
    //console.log(await Zoho.createRecords("api-sandbox", "Mock", [{ Name: { first_name: "Jane", last_name: "Miller"} }]));
    // console.log(await Zoho.getAllRecords("pm-operations", "API_Appenate_Users"));
    try {
        console.log("Attempting to get file");
        const file = await Zoho.downloadFile("api-sandbox", "All_Test_Invoices", "File_upload", "3598851000025173440", 3);
        console.log("The File =", file);
    } catch (error) {
        console.log(error.stack);
    }
}

// test();

module.exports = Zoho;