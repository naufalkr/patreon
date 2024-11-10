const db = require("../models");
const Content = db.content;
const User = db.user;

exports.create = async (req, res) => {
  try {
    console.log('Received request body:', req.body);
    console.log('Received file:', req.file);
    console.log('User ID from token:', req.userId);

    // Validate request
    if (!req.body.title) {
      return res.status(400).send({
        message: "Content title cannot be empty!"
      });
    }

    // Parse tags
    let tags = [];
    if (req.body.tags) {
      try {
        tags = JSON.parse(req.body.tags);
      } catch (e) {
        console.error('Error parsing tags:', e);
        tags = [];
      }
    }

    // Create content object with all required fields
    const content = {
      user_id: req.userId,
      title: req.body.title,
      description: req.body.description || '',
      upload_date: new Date(),
      like_count: 0,
      comment_count: 0,
      view_count: 0,
      tags: tags,
      tier: parseInt(req.body.tier) || 1,
      visibility: (req.body.visibility || 'public').toLowerCase(),
      media_file: req.file ? req.file.filename : null
    };

    console.log('Creating content with:', content);

    // Save Content in the database
    const data = await Content.create(content);
    console.log('Content created:', data);

    res.status(201).send({
      message: "Content created successfully!",
      data: data
    });
  } catch (err) {
    console.error('Error in create content:', err);
    res.status(500).send({
      message: err.message || "Some error occurred while creating the content.",
      error: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  }
};

exports.findAll = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const visibility = req.query.visibility || 'public';
  const offset = (page - 1) * limit;

  try {
    const contents = await Content.findAll({
      where: {
        visibility: visibility, // Filter by visibility
        tier: {
          [db.Sequelize.Op.lte]: req.query.userTier || 1
        }
      },
      include: [{
        model: User,
        attributes: ['username', 'id']
      }],
      order: [['created_at', 'DESC']],
      limit: limit,
      offset: offset
    });

    res.json(contents);
  } catch (err) {
    res.status(500).json({
      message: err.message || "Some error occurred while retrieving contents."
    });
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
