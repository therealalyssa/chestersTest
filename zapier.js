// // using axios
// const axios = require("axios");

// notifyWebhook("https://hooks.zapier.com/hooks/catch/14643068/3o59l87/", {
//   user: "3PM",
//   message: "Trigger Webhook event test",
// });

// export const notifyWebhook = async (url, body) => {
//   const res = await axios.post(url, body, {
//     Accept: "application/json",
//     "Content-Type": "application/json",
//   });
//   console.log(res.json());
// };

// // using fetch
// // export const notifyWebhook = async (url, body) => {
// //   const res = await fetch(url, {
// //     method: "POST",
// //     headers: {
// //       Accept: "application/json",
// //       "Content-Type": "application/json",
// //     },
// //     body: JSON.stringify({ body }),
// //   });

// //   console.log(res.json());
// // };