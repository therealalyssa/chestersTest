const UTIL = require("util");
const fs = require("fs");
const ReadFile=UTIL.promisify(fs.readFile);

const itemLimit = 1000;

require.extensions['.txt'] = function (module, filename) {
  module.exports = fs.readFileSync(filename, 'utf8');
};

let email = require("./response.txt");
const { json } = require("express");
async function ExampleParse(AccountNo, Page)
{
//let Base64Str = await ReadFile("./response.txt");
let Base64Str = email;//await ReadFile("./response.txt");

const SearchStr1 = 'filename="Chesters_CSV';

const SearchStr2 = ".csv";

const SearchStr3 = "Content-Transfer-Encoding: base64";

const SearchStr4 = "\n--";

//Change this variable to get data from a specific page.
//let getPage = 1;
let getPage = Page;

let CSVData = Base64Str.split(SearchStr1).length > 1 ? Base64Str.split(SearchStr1)[1] : Base64Str.split(SearchStr1)[0];

let FileName = SearchStr1.split('filename="')[1] + CSVData.split(SearchStr2)[0] + ".csv";
let FileAccountNo = CSVData.split(SearchStr2)[0] + ".csv";
FileAccountNo = FileAccountNo.split("#")[1];
FileAccountNo = FileAccountNo.split(".csv")[0];
console.log("File Account No: "+FileAccountNo);

CSVData = CSVData.split(SearchStr3).length > 1 ? CSVData.split(SearchStr3)[1] : CSVData.split(SearchStr3)[0];

console.log("CSVData length", CSVData.length);

CSVData = CSVData.split(SearchStr4)[0].trim();

//let testjson = await CSVData.csvToJson()
//console.log(CSVData);
bufferCSV = Buffer.from(CSVData, "base64").toString("utf-8");
//csvJson = bufferCSV.toString();
csvJson = JSON.stringify(bufferCSV);
//We have also put the \n into this so that it does not show up when we stringify it later.
splitcsv = bufferCSV.split('\r\n');
//count stores the amount of records that have been processed.
let count = itemLimit * getPage;
let page = getPage;
let pagedata = [];
for (i = itemLimit * getPage; i < splitcsv.length; ++i)
{
  //thiscsv should be 5 separate values, we will need to map these.
  thiscsv = splitcsv[i].split(",");
  //thiscsv[3] is decimal 1, thiscsv[4] is decimal 2 
  let markupValue = (((thiscsv[4] - thiscsv[3])/ thiscsv[3])*100).toFixed(2);
  let marginValue = (((thiscsv[4] - thiscsv[3]) / thiscsv[4]) * 100).toFixed(2);
  //We need to convert the output.json because the labels on the data have spaces, something which zoho creator does not like.
  let item = {
      SKU: thiscsv[0],
      Description: thiscsv[1],
      Unit: thiscsv[2],
      Cost: thiscsv[3], //cost
      Price: thiscsv[4], //price
      Margin:marginValue,
      Mark_Up:markupValue,    
  };
  pagedata.push(item);
  //console.log(JSON.stringify(item));
  //Max limit for one page to zoho
  //We also need to send the request page if its the last one, even if its not 1000 records.
  if(pagedata.length >= itemLimit || (i == splitcsv.length-1))
  {
    let info = {
      pageNo: page,
      AdditionalData: true,
      AccountNo: FileAccountNo
    } 
    if((i == splitcsv.length-1) == true)
    {
      info.AdditionalData = false;
    }
    pagedata.push(info);
    //Uncomment to make file.
    // fs.writeFile("Output Page "+page+" - Records From "+count+" To "+i +".json", JSON.stringify(pagedata), function (err) {
    //   if (err) throw err;
    //   console.log('File is created successfully.');
    // });
    //console.log(JSON.stringify(pagedata));
    ++page;
    count = i+1;
    
    //Set the length to zero because we need to clear the array for more data.
    //pagedata.length = 0;
    //We can use the variable i to stop execution of the loop. We can do this by setting it to the size of the splitcsv, and this will mean once it creates a page, it will no longer run.
    i = splitcsv.length;
  }
}
console.log("Account Number: " + AccountNo);
console.log("Page: " + Page);
return pagedata;
}

//ExampleParse();
module.exports = { ExampleParse };