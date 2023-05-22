const EntityModel = require("../../db/models/Entity");

async function runDBScripts({ dbConnection }) {
  // run any useful scripts here (including production)

  // dont run bellow in production (excluding production)
  if (process.env.NODE_ENV === "production") return;
  await updateDefaultThumbnail();
}

async function updateDefaultThumbnail() {
  try {
    const thumbnailCount = await EntityModel.find(
      { imageThumbnail: { $regex: /picsum\.photos.*?random=/ } },
      { type: 1, imageThumbnail: 1 }
    ).count();

    console.log("Old Thumbnail found: ", thumbnailCount);

    if (thumbnailCount > 0) {
      // const thumbnailDocs = await EntityModel.find(
      //   { imageThumbnail: { $regex: /picsum\.photos.*?random=/ } },
      //   { _id: 1, type: 1, imageThumbnail: 1 }
      // ).limit(10);
      const res = await EntityModel.updateMany(
        { imageThumbnail: { $regex: /picsum\.photos.*?random=/ } },
        { $set: { imageThumbnail: "/default-om_256.png" } }
      );
      console.log("updated entity thumbnails: ", res.modifiedCount);
    }
  } catch (e) {
    console.log(e);
  }
}

module.exports = {
  runDBScripts,
  updateDefaultThumbnail,
};
