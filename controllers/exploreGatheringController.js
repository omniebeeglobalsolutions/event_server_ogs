import ExploreGathering from '../models/ExploreGathering.js';

// @desc    Fetch all explore gatherings
// @route   GET /api/explore-gatherings
// @access  Public
export const getExploreGatherings = async (req, res) => {
  try {
    const gatherings = await ExploreGathering.find({}).populate('createdBy', 'name');
    res.json(gatherings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create an explore gathering
// @route   POST /api/explore-gatherings
// @access  Private/Admin
export const createExploreGathering = async (req, res) => {
  try {
    const { name, image } = req.body;

    const gathering = new ExploreGathering({
      name,
      image,
      createdBy: req.user._id
    });

    const createdGathering = await gathering.save();
    res.status(201).json(createdGathering);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update an explore gathering
// @route   PUT /api/explore-gatherings/:id
// @access  Private/Admin
export const updateExploreGathering = async (req, res) => {
  try {
    const { name, image } = req.body;

    const gathering = await ExploreGathering.findById(req.params.id);

    if (gathering) {
      gathering.name = name || gathering.name;
      gathering.image = image || gathering.image;

      const updatedGathering = await gathering.save();
      res.json(updatedGathering);
    } else {
      res.status(404).json({ message: 'Gathering not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete an explore gathering
// @route   DELETE /api/explore-gatherings/:id
// @access  Private/Admin
export const deleteExploreGathering = async (req, res) => {
  try {
    const gathering = await ExploreGathering.findById(req.params.id);

    if (gathering) {
      await gathering.deleteOne();
      res.json({ message: 'Gathering removed' });
    } else {
      res.status(404).json({ message: 'Gathering not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
