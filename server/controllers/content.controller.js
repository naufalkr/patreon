const db = require("../models");
const Content = db.content;
const ContentUrl = db.contentUrl;

exports.create = async (req, res) => {
  try {
    const content = await Content.create({
      user_id: req.userId, // Ensure user_id is set from token
      title: req.body.title,
      description: req.body.description,
      tags: req.body.tags
    });

    if (req.body.urls && req.body.urls.length > 0) {
      const contentUrls = req.body.urls.map(url => ({
        content_id: content.id,
        url: url
      }));
      await ContentUrl.bulkCreate(contentUrls);
    }

    res.status(201).send({ message: "Content created successfully!", content });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

exports.findAll = async (req, res) => {
  try {
    const contents = await Content.findAll({
      include: [ContentUrl]
    });
    res.send(contents);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

exports.findOne = async (req, res) => {
  try {
    const content = await Content.findByPk(req.params.id, {
      include: [ContentUrl]
    });
    if (!content) {
      return res.status(404).send({ message: "Content not found" });
    }
    res.send(content);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const content = await Content.findByPk(req.params.id);
    if (!content) {
      return res.status(404).send({ message: "Content not found" });
    }
    
    await content.update(req.body);
    
    if (req.body.urls) {
      await ContentUrl.destroy({ where: { content_id: content.id }});
      const contentUrls = req.body.urls.map(url => ({
        content_id: content.id,
        url: url
      }));
      await ContentUrl.bulkCreate(contentUrls);
    }
    
    res.send({ message: "Content updated successfully" });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const content = await Content.findByPk(req.params.id);
    if (!content) {
      return res.status(404).send({ message: "Content not found" });
    }
    
    await content.destroy();
    res.send({ message: "Content deleted successfully" });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};
