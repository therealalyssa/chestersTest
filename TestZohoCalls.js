const Zoho = require("./zohospec");
//Run this file using:
// node .\TestZohoCalls.js
async function Execute()
{
    // require("dotenv").config({ path: "./.env" })
    console.log("ENV =", process.env);
    //
    // const appLink = "construction-mini";
    // const reportLink = "All_Contacts";
    //
    // const recs = await Zoho.getAllRecords (appLink, reportLink);
    // console.log("records? ", recs);

    const appLink = "construction-mini";
    const reportLink = "Contact";
    // const Name = {
    //     "display_value":"Test Name",
    //     "prefix": "",
    //     "last_name": "Test",
    //     "suffix": "",
    //     "first_name": "Name"
    // };

    const Name =
    [{
        Name: {
            last_name: "Appleee",
            first_name: "Timeee"
        }
    }];

    console.log(Name);
    const recs = await Zoho.createRecords (appLink, reportLink, Name);
    console.log("records? ", recs);
}

Execute();