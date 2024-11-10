const db = require("../models");
const Like = db.like;
const Content = db.content;

exports.toggleLike = async (req, res) => {
  try {
    const contentId = req.params.contentId;
    const userId = req.userId;

    const content = await Content.findByPk(contentId);
    if (!content) {
      return res.status(404).send({ message: "Content not found" });
    }

    const existingLike = await Like.findOne({
      where: {
        content_id: contentId,
        user_id: userId
      }
    });

    if (existingLike) {
      // If like exists, remove it and decrement count
      await existingLike.destroy();
      const updatedContent = await Content.findByPk(contentId);
      const newLikeCount = Math.max(0, (updatedContent.like_count || 0) - 1);
      await updatedContent.update({ like_count: newLikeCount });
      
      return res.send({ 
        liked: false, 
        likeCount: newLikeCount
      });
    } else {
      // If like doesn't exist, create it and increment count
      await Like.create({
        content_id: contentId,
        user_id: userId
      });
      
      const updatedContent = await Content.findByPk(contentId);
      const newLikeCount = (updatedContent.like_count || 0) + 1;
      await updatedContent.update({ like_count: newLikeCount });

      return res.send({ 
        liked: true, 
        likeCount: newLikeCount
      });
    }
  } catch (err) {
    console.error("Error in toggleLike:", err);
    return res.status(500).send({ message: err.message });
  }
};

exports.hasLiked = async (req, res) => {
  try {
    const like = await Like.findOne({
      where: {
        content_id: req.params.contentId,
        user_id: req.userId
      }
    });
    
    const content = await Content.findByPk(req.params.contentId);
    if (!content) {
      return res.status(404).send({ message: "Content not found" });
    }

    res.send({ 
      hasLiked: !!like,
      likeCount: content.like_count || 0
    });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};