
const express = require('express');
const zoho = require('zoho-subscriptions');
const app = express();

// Define your GET endpoint
app.get('/records', async (req, res) => {
  try {
    // Call the zoho.getAllRecords function to get all records
    const records = await zoho.getAllRecords();
    // Send the records as a response
    res.json(records);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Start the server
app.listen(3000, () => {
  console.log('Server started on port 3000');
});

const appLink = "your-app-name";
const reportLink = "view/#Report:Price_Book_View";

const options = {}; // Add any options you want to include

Zoho.getAllRecords(appLink, reportLink, options)
  .then((records) => {
    console.log(records);
  })
  .catch((error) => {
    console.log(error);
  });

  console.log()
// const express = require('express');
// const multer = require("multer");
// const moment = require("moment-timezone");
// const PATH = require("path");
// const bodyParser = require('body-parser');
// const app = express();
// const UTIL = require("util");
// const fs = require("fs");

// app.use(bodyParser.json());
// require("dotenv").config();
// let testvar2 = "Chesters Data will display here";

// app.use(express.json({ limit: "80mb"}));
// app.use(express.urlencoded({ extended: true }));

// app.get ('/chestersData', (req, res) => {
//     res.send(testvar2);
// })


// app.post('/chestersData', multer({
//     limits: { fieldSize: 25 * 1024 * 1024 },
//     storage: multer.diskStorage({
//     destination: (req, file, SetDest) => {
//         SetDest(null, PATH.resolve("./"));
//         console.log('test');
//     },
//     filename: (req, file, SetFileName) => {
//         SetFileName(null, "ChestersData_" + moment().tz("Pacific/Auckland").format("YYYYMMDDHHmmss") + ".csv");
//     }
// })}).any(), async (req, res, next) => {
// try 
// {

//     const readFile=UTIL.promisify(fs.readFile);
   
//     res.status(200).send("OK");
//     return;
// }
// catch (error)
// {
//     console.log(error);
//     res.status(200).send("Problem");
//     return;
// }
// });

// app.listen(process.env.PORT, async () => {
//     const readFile=UTIL.promisify(fs.readFile);
//     console.log(`Our app is running on port ${ process.env.PORT }`);

//     let FileContent = await readFile(PATH.resolve("./response.json"));

//     let FileParts = FileContent.toString().split(`Content-ID: <35905C69D152B245B3694C9B0A0293C5@AUSP282.PROD.OUTLOOK.COM>\nContent-Transfer-Encoding: base64`);

//     console.log(UTIL.inspect(Buffer.from(FileParts[1], "base64").toString("ascii"), { maxStringLength: 1000 }));
//     let jsonData = JSON.parse(Buffer.from(FileParts[1], "base64").toString("ascii"));
// console.log(jsonData);
// });

// function WriteFile(path, data)
//     {
//         return new Promise((resolve, reject) => 
//         {   
//             fs.writeFile(path, data, (err) =>
//             {
//                 if (err)
//                 {
//                     reject(err);
//                     return;
//                 }
                
//                 resolve("File Written to " + path);
//                 return;
//             });
//         }).catch((error) => 
//         {
//             console.log(error);
//         });
// }

// const express = require('express');
// const multer = require("multer");
// const moment = require("moment-timezone");
// const PATH = require("path");
// const bodyParser = require('body-parser');
// const app = express();

// app.use(bodyParser.json());
// // const hostname = 'localhost';
// // const port = 3000;
// require("dotenv").config();
// let testvar2 = "Chesters Data will display here";


// // app.use(express.json({ limit: "80mb"}));
// // app.use(express.urlencoded({ extended: true }));

// app.get ('/chestersData', (req, res) => {
//     //res.send('Hello World!')
//     res.send(testvar2);
// })

// /*
// app.post('/chestersData', (req, res, next) => {
//     try 
//     {
//         console.log("Data from E-mail =", req);
//         res.status(200).send("OK");
//         return;
//     }
//     catch (error)
//     {
//         console.log(error);
//         res.status(200).send("Problem");
//         return;
//     }
// });
// */

// //Trying something out, alyssa

// // app.post('/chestersData', multer({
// //         limits: { fieldSize: 25 * 1024 * 1024 },
// //         storage: multer.diskStorage({
// //         destination: (req, file, SetDest) => {
// //             SetDest(null, PATH.resolve("./"));
// //             // SetDest(null, PATH.join(__dirname, 'uploads'));
// //         },
// //         filename: (req, file, SetFileName) => {
// //             SetFileName(null, "ChestersData_" + moment().tz("Pacific/Auckland").format("YYYYMMDDHHmmss") + ".csv");
// //         }
// //     })}).any(), (req, res, next) => {
// //     try 
// //     {
// //         const UTIL = require("util");
// //         const fs= require("fs");
// //         //console.log("Data from E-mail =", req);
// //         console.log("Received Request, Destructured Props =", Object.keys(req));
// //         console.log(UTIL.inspect(req, { maxStringLength: 500}));
// //         res.status(200).send("OK");
// //         return;
// //     }
// //     catch (error)
// //     {
// //         console.log(error);
// //         res.status(200).send("Problem");
// //         return;
// //     }
// // });

// app.post('/chestersData', multer({
//     limits: { fieldSize: 25 * 1024 * 1024 },
//     storage: multer.diskStorage({
//     destination: (req, file, SetDest) => {
//         SetDest(null, PATH.resolve("./"));
    
//     },
//     filename: (req, file, SetFileName) => {
//         SetFileName(null, "ChestersData_" + moment().tz("Pacific/Auckland").format("YYYYMMDDHHmmss") + ".csv");
//     }
// })}).any(), (req, res, next) => {
// try 
// {
//     const UTIL = require("util");
//     const fs = require("fs");

//     // Use split() to split the response into an array
//     const responseArray = req.body.toString().split('ARC-Seal');

//     // Log the responseArray to the console
//     console.log(UTIL.inspect(responseArray, { maxStringLength: 500 }));

//     // Write the responseArray to a file
//     fs.writeFile('response.txt', UTIL.inspect(responseArray, { maxStringLength: 500 }), (err) => {
//         if (err) throw err;
//         console.log('The responseArray has been saved to response.txt');
//     });


//     res.status(200).send("OK");
//     return;
// }
// catch (error)
// {
//     console.log(error);
//     res.status(200).send("Problem");
//     return;
// }
// });

// app.listen(process.env.PORT, () => {
//     console.log(`Our app is running on port ${ process.env.PORT }`);
// });
// // app.listen(port, hostname, () => {
// //   console.log(`Server running at http://${hostname}:${port}/`);
// // });