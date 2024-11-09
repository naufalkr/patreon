
const db = require("../models");
const Comment = db.comment;
const User = db.user;

exports.create = async (req, res) => {
  try {
    const comment = await Comment.create({
      content_id: req.params.contentId,
      user_id: req.userId,
      text: req.body.text
    });

    const commentWithUser = await Comment.findByPk(comment.id, {
      include: [{
        model: User,
        attributes: ['id', 'username']
      }]
    });

    res.status(201).send(commentWithUser);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

exports.findAllByContent = async (req, res) => {
  try {
    const comments = await Comment.findAll({
      where: { content_id: req.params.contentId },
      include: [{
        model: User,
        attributes: ['id', 'username']
      }],
      order: [['created_at', 'DESC']]
    });
    res.send(comments);
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

    await comment.destroy();
    res.send({ message: "Comment deleted successfully" });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};