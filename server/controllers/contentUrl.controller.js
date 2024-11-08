
const db = require("../models");
const ContentUrl = db.contentUrl;

// Create and Save a new ContentUrl
exports.create = async (req, res) => {
  if (!req.body.url || !req.body.content_id) {
    res.status(400).send({
      message: "URL and content_id cannot be empty!"
    });
    return;
  }

  try {
    const contentUrl = await ContentUrl.create({
      content_id: req.body.content_id,
      url: req.body.url
    });
    res.send(contentUrl);
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while creating the ContentUrl."
    });
  }
};

// Retrieve all ContentUrls
exports.findAll = async (req, res) => {
  try {
    const contentUrls = await ContentUrl.findAll();
    res.send(contentUrls);
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while retrieving contentUrls."
    });
  }
};

// Find a single ContentUrl with an id
exports.findOne = async (req, res) => {
  const id = req.params.id;

  try {
    const contentUrl = await ContentUrl.findByPk(id);
    if (contentUrl) {
      res.send(contentUrl);
    } else {
      res.status(404).send({
        message: `Cannot find ContentUrl with id=${id}.`
      });
    }
  } catch (err) {
    res.status(500).send({
      message: "Error retrieving ContentUrl with id=" + id
    });
  }
};

// Update a ContentUrl by the id
exports.update = async (req, res) => {
  const id = req.params.id;

  try {
    const num = await ContentUrl.update(req.body, {
      where: { id: id }
    });

    if (num == 1) {
      res.send({
        message: "ContentUrl was updated successfully."
      });
    } else {
      res.send({
        message: `Cannot update ContentUrl with id=${id}. Maybe ContentUrl was not found or req.body is empty!`
      });
    }
  } catch (err) {
    res.status(500).send({
      message: "Error updating ContentUrl with id=" + id
    });
  }
};

// Delete a ContentUrl with the specified id
exports.delete = async (req, res) => {
  const id = req.params.id;

  try {
    const num = await ContentUrl.destroy({
      where: { id: id }
    });

    if (num == 1) {
      res.send({
        message: "ContentUrl was deleted successfully!"
      });
    } else {
      res.send({
        message: `Cannot delete ContentUrl with id=${id}. Maybe ContentUrl was not found!`
      });
    }
  } catch (err) {
    res.status(500).send({
      message: "Could not delete ContentUrl with id=" + id
    });
  }
};