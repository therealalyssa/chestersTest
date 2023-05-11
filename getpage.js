//const UTIL = require("util");
const fs = require("fs");
//const fsextra = require("fs-extra");
//const ReadFile = UTIL.promisify(fs.readFile);


require.extensions['.txt'] = function (module, filename) {
    module.exports = fs.readFileSync(filename, 'utf8');
};

async function Getpage(AccountNo, Page) {
    let Directory = "./Output/";
    return new Promise((resolve, reject) => {
        //Shivneel Rattan 10-5--2023 **HOME** We need to check if the string contains the account in a specific format
        fs.readFile(Directory + "Account No - " + AccountNo + " - Output Page " + Page + ".json", 'utf8', (err, data) => {
            if (err) {
                console.error("Error " + err);
                //return reject(err);
                return resolve(err);
            }
            //return data;
            return resolve(data);
        });
    });
}

//Getpage("TEST1234", "25");
//ExampleParse(1,25);
module.exports = {Getpage};