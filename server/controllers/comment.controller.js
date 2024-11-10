
const db = require("../models");
const Comment = db.comment;
const Content = db.content;

exports.create = async (req, res) => {
  try {
    const content = await Content.findByPk(req.params.contentId);
    if (!content) {
      return res.status(404).send({ message: "Content not found" });
    }

    const comment = await Comment.create({
      content_id: req.params.contentId,
      user_id: req.userId,
      text: req.body.text
    });

    // Increment comment_count
    await content.increment('comment_count');

    res.status(201).send({ 
      message: "Comment created successfully!", 
      comment: comment 
    });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

exports.findAll = async (req, res) => {
  try {
    const comments = await Comment.findAll({
      where: { content_id: req.params.contentId },
      include: [{
        model: db.user,
        attributes: ['username']
      }],
      order: [['created_at', 'DESC']]
    });
    res.send(comments);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

exports.findOne = async (req, res) => {
  try {
    const comment = await Comment.findByPk(req.params.id, {
      include: [{
        model: db.user,
        attributes: ['username']
      }]
    });
    if (!comment) {
      return res.status(404).send({ message: "Comment not found" });
    }
    res.send(comment);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const comment = await Comment.findByPk(req.params.id);
    if (!comment) {
      return res.status(404).send({ message: "Comment not found" });
    }

    if (comment.user_id !== req.userId) {
      return res.status(403).send({ message: "Not authorized to update this comment" });
    }

    await comment.update({ text: req.body.text });
    res.send({ message: "Comment updated successfully" });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

exports.delete = async (req, res) => {
  try {
    const comment = await Comment.findByPk(req.params.id);
    if (!comment) {
      return res.status(404).send({ message: "Comment not found" });
    }

    if (comment.user_id !== req.userId) {
      return res.status(403).send({ message: "Not authorized to delete this comment" });
    }

    const content = await Content.findByPk(comment.content_id);
    await content.decrement('comment_count');
    
    await comment.destroy();
    res.send({ message: "Comment deleted successfully" });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};