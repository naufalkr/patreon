const db = require("../models");
const Content = db.content;

exports.create = async (req, res) => {
  try {
<<<<<<< HEAD
    // Parse tags if they're sent as a string
=======
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
>>>>>>> 0ef3824ce756a512370338ec60802ed52afe658d
    let tags = [];
    if (req.body.tags) {
      try {
        tags = JSON.parse(req.body.tags);
      } catch (e) {
        console.error('Error parsing tags:', e);
        tags = [];
      }
    }

<<<<<<< HEAD
    // Handle uploaded file
    let mediaFile = null;
    if (req.file) {
      mediaFile = req.file.filename;
    }

    // Create content
    const content = await Content.create({
=======
    // Create content object with all required fields
    const content = {
>>>>>>> 0ef3824ce756a512370338ec60802ed52afe658d
      user_id: req.userId,
      title: req.body.title,
      description: req.body.description || '',
      upload_date: new Date(),
      like_count: 0,
      comment_count: 0,
      view_count: 0,
      tags: tags,
      tier: parseInt(req.body.tier) || 1,
<<<<<<< HEAD
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
=======
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
>>>>>>> 0ef3824ce756a512370338ec60802ed52afe658d
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
