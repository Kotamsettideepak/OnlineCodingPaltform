const TagCountModel = require("../Model/TagCount.js");

const updateTagCounts = async (tags) => {
  try {
    await Promise.all(
      tags.map((tag) =>
        TagCountModel.findOneAndUpdate(
          { tag }, // Ensure the tag is associated with the 'arena' region
          { $inc: { count: 1 } }, // Increment the count field by 1
          { upsert: true } // Create a new document if one does not exist
        )
      )
    );
    console.log("updated");
  } catch (error) {
    console.error("Error updating tag counts:", error);
  }
};

const decrementTagCounts = async (tags) => {
  try {
    await Promise.all(
      tags.map((tag) =>
        TagCountModel.findOneAndUpdate({ tag }, { $inc: { count: -1 } })
      )
    );
  } catch (error) {
    console.error("Error decrementing tag counts:", error);
  }
};

const getTagCounts = async (req, res) => {
  const { fields } = req.params;

  // Convert comma-separated string into an array of tags
  const tags = fields.split(",").map((tag) => tag.trim());

  try {
    // Fetch counts for all the tags that belong to the 'arena' region
    const counts = await TagCountModel.find({
      tag: { $in: tags },
    });

    const tagCounts = {};

    tags.forEach((tag) => {
      tagCounts[tag] = 0;
    });

    counts.forEach((tagCount) => {
      tagCounts[tagCount.tag] = tagCount.count;
    });

    console.log(tagCounts);

    res.json(tagCounts);
  } catch (error) {
    console.error("Error fetching tag counts:", error);
    res.status(500).send("Error fetching tag counts");
  }
};

module.exports = { updateTagCounts, decrementTagCounts, getTagCounts };
