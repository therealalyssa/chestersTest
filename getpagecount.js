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
    return new Promise((resolve, reject) => {
        //An important thing about fs is that it does not return a promise. as such, we need to be able to wrap this up in a promise in order for the data to be sent correctly.
        fs.readdir(Directory, (err, files) => {
            if (err) {
                console.log(err);
                return reject(err);
            }
            else {
                files.forEach(file => {
                    //Shivneel Rattan 10-5--2023 **HOME** We need to check if the string contains the account in a specific format
                    if (file.includes("Account No - " + AccountNo + " - Output Page")) {
                        ++pagecount;
                    }
                });
                //console.log("This is pagecount " + pagecount);
                return resolve(pagecount);
            }
        });
    });
}

//Getpagecount("TEST1234");
//module.exports = {PageCount: Getpagecount};
module.exports = {Getpagecount};