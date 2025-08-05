
require('dotenv').config();

console.log("🔍 DEBUG - ENV CHECK");
console.log("🔑 publicKey:", process.env.IMAGEKIT_PUBLIC_KEY);
console.log("🔑 privateKey:", process.env.IMAGEKIT_PRIVATE_KEY);
console.log("🔑 urlEndpoint:", process.env.IMAGEKIT_URL_ENDPOINT);

if (!process.env.IMAGEKIT_PUBLIC_KEY) {
  throw new Error("❌ ENV ERROR: IMAGEKIT_PUBLIC_KEY is undefined");
}

const ImageKit = require("imagekit");

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
});

module.exports = imagekit;