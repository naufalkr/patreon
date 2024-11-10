const db = require("../models");
const Content = db.content;

exports.create = async (req, res) => {
  try {
    // Parse tags if they're sent as a string
    let tags = [];
    if (req.body.tags) {
      try {
        tags = JSON.parse(req.body.tags);
      } catch (e) {
        // If parsing fails, assume it's already an array or single value
        tags = Array.isArray(req.body.tags) ? req.body.tags : [req.body.tags];
      }
    }

    // Handle uploaded file
    let mediaFile = null;
    if (req.file) {
      mediaFile = req.file.filename;
    }

    // Create content
    const content = await Content.create({
      user_id: req.userId,
      title: req.body.title,
      description: req.body.description,
      tags: tags,
      tier: parseInt(req.body.tier) || 1,
      media_file: mediaFile
    });

    res.status(201).send({ 
      message: "Content created successfully!", 
      content: content 
    });
  } catch (err) {
    console.error('Error creating content:', err);
    res.status(500).send({ 
      message: err.message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  }
};

exports.findAll = async (req, res) => {
  try {
    const userTier = req.query.userTier || 1;
    
    const contents = await Content.findAll({
      where: {
        tier: {
          [db.Sequelize.Op.lte]: userTier
        }
      },
      include: [{
        model: db.user,
        attributes: ['id', 'username']  // Only include necessary user fields
      }],
      order: [['created_at', 'DESC']]  // Show newest posts first
    });
    res.send(contents);
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

exports.findOne = async (req, res) => {
  try {
    const userTier = req.query.userTier || 1; // Get user's subscription tier from query
    
    const content = await Content.findByPk(req.params.id);
    
    if (!content) {
      return res.status(404).send({ message: "Content not found" });
    }

    // Check if user has access to this tier
    if (content.tier > userTier) {
      return res.status(403).send({ 
        message: "You need a higher tier subscription to access this content" 
      });
    }

    res.send(content);
  } catch (err) {
    res.status (500).send({ message: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const content = await Content.findByPk(req.params.id);
    if (!content) {
      return res.status(404).send({ message: "Content not found" });
    }

    // Validate tier if it's being updated
    if (req.body.tier) {
      const tier = parseInt(req.body.tier);
      if (tier < 1 || tier > 3) {
        return res.status(400).send({ 
          message: "Invalid tier value. Must be between 1 and 3" 
        });
      }
    }

    // Handle uploaded file
    if (req.file) {
      req.body.media_file = req.file.filename;
    }

    await content.update(req.body);
    
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
