//const UTIL = require("util");
const fs = require("fs");
const fsextra = require("fs-extra");
//const ReadFile = UTIL.promisify(fs.readFile);

const itemLimit = 1000;

require.extensions['.txt'] = function (module, filename) {
    module.exports = fs.readFileSync(filename, 'utf8');
};

let email = require("./response.txt");
//const {json} = require("express");

//Shivneel Rattan 10-5-2023 **HOME** This function is designed to turn an email into a json file with data. It stores the data in Output
async function EmailToJson() {
//let Base64Str = await ReadFile("./response.txt");
    let Base64Str = email;//await ReadFile("./response.txt");

    const SearchStr1 = 'filename="Chesters_CSV';

    const SearchStr2 = ".csv";

    const SearchStr3 = "Content-Transfer-Encoding: base64";

    const SearchStr4 = "\n--";

    let CSVData = Base64Str.split(SearchStr1).length > 1 ? Base64Str.split(SearchStr1)[1] : Base64Str.split(SearchStr1)[0];

    let FileName = SearchStr1.split('filename="')[1] + CSVData.split(SearchStr2)[0] + ".csv";
    let FileAccountNo = CSVData.split(SearchStr2)[0] + ".csv";
    FileAccountNo = FileAccountNo.split("#")[1];
    FileAccountNo = FileAccountNo.split(".csv")[0];
    console.log("File Account No: " + FileAccountNo);

    CSVData = CSVData.split(SearchStr3).length > 1 ? CSVData.split(SearchStr3)[1] : CSVData.split(SearchStr3)[0];

    console.log("CSVData length", CSVData.length);

    CSVData = CSVData.split(SearchStr4)[0].trim();


    bufferCSV = Buffer.from(CSVData, "base64").toString("utf-8");
//csvJson = bufferCSV.toString();
    csvJson = JSON.stringify(bufferCSV);
//We have also put the \n into this so that it does not show up when we stringify it later.
    splitcsv = bufferCSV.split('\r\n');
//count stores the amount of records that have been processed.
    let count = 0;
    let senddata = [];
    //let pagedata;
    let page = 0;
    for (let i = 0; i < splitcsv.length; ++i) {
        //thiscsv should be 5 separate values, we will need to map these.
        thiscsv = splitcsv[i].split(",");
        //thiscsv[3] is decimal 1, thiscsv[4] is decimal 2
        //Shivneel Rattan 10-5-2023 to counteract the divide by zero bug
        //let markupValue = (((thiscsv[4] - thiscsv[3])/ thiscsv[3])*100).toFixed(2);
        //let marginValue = (((thiscsv[4] - thiscsv[3]) / thiscsv[4]) * 100).toFixed(2);
        let markupValue = 0;
        let marginValue = 0;
        if (thiscsv[3] != 0) {
            markupValue = (((thiscsv[4] - thiscsv[3]) / thiscsv[3]) * 100).toFixed(2);
        }
        if (thiscsv[4] != 0) {
            marginValue = (((thiscsv[4] - thiscsv[3]) / thiscsv[4]) * 100).toFixed(2);
        }

        //We need to convert the output.json because the labels on the data have spaces, something which zoho creator does not like.
        let item = {
            SKU: thiscsv[0],
            Description: thiscsv[1],
            Unit: thiscsv[2],
            Cost: thiscsv[3], //cost
            Price: thiscsv[4], //price
            Margin: marginValue,
            Mark_Up: markupValue,
        };
        senddata.push(item);
        //console.log(JSON.stringify(item));
        //Max limit for one page to zoho
        //We also need to send the request page if its the last one, even if its not 1000 records.
        if (senddata.length >= itemLimit || (i == splitcsv.length - 1)) {
            let pagedata = {
                pageNo: page,
                AdditionalData: true,
                AccountNo: FileAccountNo,
                Data: senddata
            }
            if ((i == splitcsv.length - 1) == true) {
                pagedata.AdditionalData = false;
            }
            //Uncomment to make file.
            fsextra.outputFile("Output/Account No - " + FileAccountNo + " - Output Page " + page + ".json", JSON.stringify(pagedata), function (err) {
                if (err) throw err;
                console.log('File is created successfully.');
            });
            //console.log(JSON.stringify(pagedata));
            ++page;
            count = i + 1;

            //Set the length to zero because we need to clear the array for more data.
            senddata.length = 0;
            pagedata.length = 0;
        }
    }
}

//EmailToJson();
module.exports = {EmailToJson};