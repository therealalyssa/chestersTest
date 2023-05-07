const Zoho = require("./zohospec");
//Shivneel Rattan 14-4-2023 You may need to flip the slash. This is because Linux and OS X (Unix based systems) treat this differently.
//Shivneel Rattan 14-4-2023 output.json has 24540 records (data.length)
const data = require("./output2.json");
//Run this file using://Shivneel Rattan 14-4-2023 You may need to flip the slash. This is because Linux and OS X (Unix based systems) treat this differently.
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
    //const reportLink = "Contact";
    const reportLink = "Pricebook";
    // const test = [{
    //     Product_ID:"#12",
    //     Product_Description:"Microlene  Water Filter Tap Adaptor for Greens/Dorf/Amercian Standard Chrome",
    //     Unit:"EA",
    //     Decimal_1:"50.88",
    //     Decimal_2:"63.60"
    // }];
    //{"Product ID":"#12","Product Description":"Microlene  Water Filter Tap Adaptor for Greens/Dorf/Amercian Standard Chrome","Unit":"EA","Decimal 1":"50.88","Decimal 2":"63.60"}
    //Shivneel Rattan 14-4-2023 Zoho creator has a limit of 200 records per request, so we should send post requests with 200 or less records to add.

    //console.log(Name);
    //const recs = await Zoho.createRecords (appLink, reportLink, test);
    //console.log("records? ", recs);
    //let count = 1;
    let send = [];
    //Arrays start from zero
    let Total = 0;
    for(const product in data)
    {
        Total++;
        //const Markup= Price-Cost/Cost  * 100;
        //const Margin= Price-Cost/Price * 100;
        //Calculate the markup and margin percentages
        let markupValue= (((data[product]["Decimal 2"] - data[product]["Decimal 1"])/ data[product]["Decimal 1"])*100).toFixed(2);
        let marginValue = (((data[product]["Decimal 2"] - data[product]["Decimal 1"]) / data[product]["Decimal 2"]) * 100).toFixed(2);
        //We need to convert the output.json because the labels on the data have spaces, something which zoho creator does not like.
        let item ={
            SKU: data[product]["Product ID"],
            Description: data[product]["Product Description"],
            Unit: data[product]["Unit"],
            Cost: data[product]["Decimal 1"], //cost
            Price: data[product]["Decimal 2"], //price
            Margin:marginValue,
            Mark_Up:markupValue, 
            
        };
        send.push(item);
        //console.log("Markup: " + markupValue);
        //console.log("Margin: " + marginValue);
        //It has now reached 200 items, reset the count, send the data, and clear the array.
        //It also checks to see if it is the last data in the input (output.json), so send it anyway.
        // if(count === 200 || parseInt(product) + 1 === data.length)
        // {
        //     count = 1;
        //     //***WARNING! This function will always create new records, not update existing ones.***//
        //     const recs = await Zoho.createRecords (appLink, reportLink, send);
        //     console.log(recs);
        //     //This will set the length of the send array to zero, removing data. This is because we can only send 200 records at a time, so we need to clear the old records.
        //     send.length = 0;
        // }
        // else
        // {
        //     count++;
        // }
    }
    //Shivneel Rattan 17-4-2023 according to AJ, the data should paginate automatically when you import it, so doing it manually is not necessary.
    //console.log(send);
    //console.log(send.length);
    const recs = await Zoho.createRecords (appLink, reportLink, send);
    //console.log(recs);
    //console.log("Total Iterations Complete: "+ Total+". Total length of input data: " +data.length);
    //console.log("Loop execution complete.");
}

Execute();