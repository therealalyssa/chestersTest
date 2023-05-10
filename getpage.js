//const UTIL = require("util");
const fs = require("fs");
//const fsextra = require("fs-extra");
//const ReadFile = UTIL.promisify(fs.readFile);


require.extensions['.txt'] = function (module, filename) {
    module.exports = fs.readFileSync(filename, 'utf8');
};

async function Getpage(AccountNo, Page) {
    let Directory = "Output/";
    fs.readdir(Directory, (err, files) => {
        if (err)
            console.log(err);
        else {
            files.forEach(file => {
                //Shivneel Rattan 10-5--2023 **HOME** We need to check if the string contains the account in a specific format
                if(file.includes("Account No - "+AccountNo+" - Output Page "+Page+" - "))
                {
                    fs.readFile(Directory + file, 'utf8', (err, data) => {
                        if (err) {
                            console.error(err);
                            return;
                        }
                        return data;
                    });
                }
            });
        }
    });
}

//Getpage("TEST1234", "25");
//ExampleParse(1,25);
module.exports = {Getpage};