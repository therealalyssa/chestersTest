const fs = require("fs");


require.extensions['.txt'] = function (module, filename) {
    module.exports = fs.readFileSync(filename, 'utf8');
};

//let email = require("./response.txt");

//Shivneel Rattan 10-5-2023 **HOME** This function gets the COUNT of pages in the Output directory matching the account number.
async function Getpagecount(AccountNo) {
    //AccountNo = "TEST1234";
    let Directory = "Output";
    let pagecount = 0;
    fs.readdir(Directory, (err, files) => {
        if (err)
            console.log(err);
        else {
            files.forEach(file => {
                //Shivneel Rattan 10-5--2023 **HOME** We need to check if the string contains the account in a specific format
                if(file.includes("Account No - "+AccountNo+" - Output Page"))
                {
                    ++pagecount;
                }
            });
            return pagecount;
        }
    });
}

//Getpagecount("TEST1234");
//module.exports = {PageCount: Getpagecount};
module.exports = {Getpagecount};