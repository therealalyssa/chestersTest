require("dotenv").config();
const {Getpagecount} = require('./getpagecount.js');
const {Getpage} = require("./getpage.js");
const {EmailToJson} = require('./emailtojson.js');
const express = require('express');
const multer = require("multer");
const moment = require("moment-timezone");
const PATH = require("path");
const bodyParser = require('body-parser');
const app = express();
const UTIL = require("util");
const fs = require("fs");
//const csvtojson = require('csvtojson');
//const Zoho = require('./zohospec.js');

//const options = false;

app.use(bodyParser.json());
require("dotenv").config();

app.use(express.json({limit: "80mb"}));
app.use(express.urlencoded({extended: true}));

//Shivneel Rattan 10-5-2023 **HOME** This is the url that needs to be called in order for the emails to be created into json files. This is the endpoint that the email uses in order to ADD and UPDATE a pricebook.
app.get('/pricebook/updatePricebook', async (req, res) => {
    try
    {
        let emailResponse = await EmailToJson();
        res.json({
            message: 'Success! The email has been decoded and added into the pricebook list.',
        });
    }
    catch (error)
    {
        res.status(500).json({error: 'Email not updating.'});
    }
});

//This will need to have the pricebook / account number in order to get the pricebook to work.
app.get('/pricebook/getPageCount', async (req, res) => {
    try {
        //let pageCount;
        //let AccountNo = req.get('accountno');
        let AccountNo = req.query.AccountNo;
        //console.log(AccountNo);
        if (AccountNo !== undefined) {
            //Send the request.
            let pageCount = await Getpagecount(AccountNo);
            //console.log("This is after awaiting data: " + pageCount);
            if (pageCount !== undefined && pageCount != 0) {
                res.json({
                    pageCount,
                    message: 'Success! There are ' + pageCount + ' pages. The account number is: ' + AccountNo
                });
            } else {
                res.json({
                    message: "There are no records matching the Account Number."
                });
            }
        } else {
            //Not really necessary, just used for the error. We could throw some info instead.
            res.status(500).json({error: 'No Account Number provided.'});
        }
    } catch (error) {
        console.error(error);
        console.log(req);
        res.status(500).json({error: 'There was an error parsing data'});
        console.log('There was an error parsing data');
    }
});

//This will need to have the account number / pricebook number, as well as the required page.
app.get('/pricebook/getPage', async (req, res) => {
    try {
        let AccountNo = req.query.AccountNo;
        let Page = req.query.Page;
        console.log("Input Data, Accont No: "+ AccountNo +" Page No: " +Page);
        let jsonData;
        if (AccountNo !== undefined && Page !== undefined) {
            //Send the request.
            jsonData = await Getpage(AccountNo, Page);
            //console.log("This is JSONDATA: " +jsonData);
            if(jsonData === undefined)
            {
                res.json({message: "Page Not Found."});
            }
            else
            {
                res.json([jsonData]);
                //res.sendFile(jsonData);
            }
            //console.log(jsonData);
        } else {
            //Not really necessary, just used for the error. We could throw some info instead.
            res.status(500).json({error: 'No Account Number or Page Provided.'});
        }
        //res.json({ jsonData, message: 'Success!' });
    } catch (error) {
        console.error(error);
        //console.log(req);
        res.status(500).json({error: 'There was an error parsing data'});
        console.log('There was an error parsing data');
    }
});

app.post('/chestersData', multer({
    limits: {fieldSize: 25 * 1024 * 1024},
    storage: multer.diskStorage({
        destination: (req, file, SetDest) => {
            SetDest(null, PATH.resolve("./"));
            console.log('test');
        },
        filename: (req, file, SetFileName) => {
            SetFileName(null, "ChestersData_" + moment().tz("Pacific/Auckland").format("YYYYMMDDHHmmss") + ".csv");
        }
    })
}).any(), async (req, res, next) => {
    try {
        //const writeFile = UTIL.promisify(fs.writeFile);
        const readFile = UTIL.promisify(fs.readFile);

        // await WriteFile(PATH.resolve("response.json"), req.body.email.split(`Content-ID: <35905C69D152B245B3694C9B0A0293C5@AUSP282.PROD.OUTLOOK.COM>
        // Content-Transfer-Encoding: base64`)[1]);

        // Use split() to split the response into an array
        //const responseArray = req.body.email.toString().split('ARC-Seal: ');

        // Log the responseArray to the console
        //var test = Buffer.from(responseArray[1], "base64").toString("ascii");
        //console.log(UTIL.inspect("This is the responseArray", responseArray, { maxStringLength: 3000 }));
        //console.log("This is a test for the base64 thing.");
        //console.log(test);

        // Write the responseArray to a file
        //await writeFile('./testfile.txt', "Hello");
        //await writeFile('./response.csv', Buffer.from(responseArray[1], "base64").toString("ascii"));

        //Read the file
        // const fileContent= await (function() {
        //     return new Promise((resolve, reject) => {
        //         fs.readFile("./response.csv", (err, fileContent) => {
        //             if (err)
        //             {
        //                 reject("Error reading the file");
        //                 return;
        //             }

        //             resolve(fileContent);
        //             return;
        //         });
        //     });
        // })();

        // //Logging the read file
        // console.log("Display it!", UTIL.inspect(fileContent.toString(), { maxStringLength: 200 }));
        res.status(200).send("OK");
    } catch (error) {
        console.log(error);
        res.status(200).send("Problem");
    }
});

const {count} = require('console');

app.listen(process.env.PORT, async () => {
    const readFile = UTIL.promisify(fs.readFile);
    console.log(`Our app is running on port ${process.env.PORT}`);

    /*let FileContent = await readFile(PATH.resolve("./response.txt"));
    // let FileParts = FileContent.toString().split(`Content-ID: <35905C69D152B245B3694C9B0A0293C5@AUSP282.PROD.OUTLOOK.COM>\nContent-Transfer-Encoding: base64`);
    let FileParts = FileContent.toString().split(`Content-Disposition: attachment;\n\tfilename="Chesters_CSV`);
    let fileContent = FileParts[1];
    console.log(UTIL.inspect(fileContent, {maxStringLength:500}));
   
    let removedText= ` 01-03-2023 1302 PM.csv"; size=1730384;\n\tcreation-date="Wed, 01 Mar 2023 00:02:55 GMT";\n\tmodification-date="Fri, 17 Mar 2023 04:56:19 GMT"\nContent-ID: <35905C69D152B245B3694C9B0A0293C5@AUSP282.PROD.OUTLOOK.COM>\nContent-Transfer-Encoding: base64\n`;
    console.log(removedText.length);
    newDecode= fileContent.substring(246,fileContent.length);
    console.log("Test:"+ newDecode);
    // console.log(decodedContent.substring(24,decodedContent.length));
    let decodedContent = Buffer.from(newDecode, 'base64').toString('ascii');
    await WriteFile (PATH.resolve("./extractedCsv.csv"),decodedContent);
    // Convert CSV to JSON
    const csvData = await readFile(PATH.resolve('./extractedCsv.csv'), 'utf8');
    const jsonData = await csvtojson({headers: ['Product ID', 'Product Description', 'Unit','Decimal 1','Decimal 2']}).fromString(csvData);
    await WriteFile('./output.json', JSON.stringify(jsonData));*/

    console.log("Records in output.json = " + JSON.parse(await readFile(PATH.resolve("./output.json"))).length);

});

// app.listen(process.env.PORT, async () => {
//     const readFile=UTIL.promisify(fs.readFile);
//     console.log(`Our app is running on port ${ process.env.PORT }`);

//     let FileContent = await readFile(PATH.resolve("./response.json"));
//     let FileParts = FileContent.toString().split(`Content-ID: <35905C69D152B245B3694C9B0A0293C5@AUSP282.PROD.OUTLOOK.COM>\nContent-Transfer-Encoding: base64`);
//     let fileContent = FileParts[1].replace(/#/g, '\\u0023');
// let decodedContent = Buffer.from(fileContent, 'base64').toString('ascii');
// let jsonData = JSON.parse(decodedContent.replace(/\\u0023/g, '#'));
// console.log(jsonData);


// console.log(UTIL.inspect(Buffer.from(FileParts[1], "base64").toString("ascii"), { maxStringLength: 1000 }));

// });

function WriteFile(path, data) {
    return new Promise((resolve, reject) => {
        fs.writeFile(path, data, (err) => {
            if (err) {
                reject(err);
                return;
            }
            resolve("File Written to " + path);
        });
    }).catch((error) => {
        console.log(error);
    });
}