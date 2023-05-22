const axios = require("axios");
const https = require("https");

const directusUtilsAPI = axios.create({
  baseURL: process.env.DIRECTUS_API_URL || "https://directus.local.terabits.io",
  // timeout: 5000,
  headers: {
    "X-Sanscript-Client": "DevHubJS",
    Authorization: `Bearer ${process.env.DIRECTUS_USER_AUTH_TOKEN}`,
  },
});

module.exports = {
  directusUtilsAPI,
  proxied: async (req, res) => {
    const { path, query } = req;

    const fwdPath = path.replace("/directus-assets", "/assets");
    // console.log(fwdPath, query);
    try {
      const apiRes = await directusUtilsAPI.get(fwdPath, {
        responseType: "arraybuffer",
        params: {
          access_token: process.env.DIRECTUS_USER_AUTH_TOKEN,
          ...query,
        },
      });
      // console.log(apiRes.headers);
      // console.log(apiRes.data);
      res.set(apiRes.headers);
      res.status(apiRes.status);
      res.send(apiRes.data);
    } catch (e) {
      res.status(404).send("not found");
    }
  },
};
