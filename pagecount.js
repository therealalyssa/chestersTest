const UTIL = require("util");
const fs = require("fs");
const ReadFile=UTIL.promisify(fs.readFile);

const itemLimit = 1000;

require.extensions['.txt'] = function (module, filename) {
  module.exports = fs.readFileSync(filename, 'utf8');
};

let email = require("./response.txt");
const { json } = require("express");
async function PageCount()
{
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
console.log(FileAccountNo);

CSVData = CSVData.split(SearchStr3).length > 1 ? CSVData.split(SearchStr3)[1] : CSVData.split(SearchStr3)[0];

console.log("CSVData length", CSVData.length);

CSVData = CSVData.split(SearchStr4)[0].trim();

//let testjson = await CSVData.csvToJson()
//console.log(CSVData);
bufferCSV = Buffer.from(CSVData, "base64").toString("utf-8");
//We have also put the \n into this so that it does not show up when we stringify it later.
splitcsv = bufferCSV.split('\r\n');
//count stores the amount of records that have been processed.
// for (i = itemLimit * getPage; i < splitcsv.length; ++i)
// {
// }
console.log(Math.ceil(splitcsv.length/itemLimit));
return Math.ceil(splitcsv.length/itemLimit);
}

// PageCount();
module.exports = { PageCount };