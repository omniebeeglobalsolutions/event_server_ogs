import CuratedFormat from '../models/CuratedFormat.js';

// @desc    Fetch all curated formats
// @route   GET /api/curated-formats
// @access  Public
export const getCuratedFormats = async (req, res) => {
  try {
    const formats = await CuratedFormat.find({}).populate('createdBy', 'name');
    res.json(formats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a curated format
// @route   POST /api/curated-formats
// @access  Private/Admin
export const createCuratedFormat = async (req, res) => {
  try {
    const { title, tag, description, image } = req.body;

    const format = new CuratedFormat({
      title,
      tag,
      description,
      image,
      createdBy: req.user._id
    });

    const createdFormat = await format.save();
    res.status(201).json(createdFormat);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a curated format
// @route   PUT /api/curated-formats/:id
// @access  Private/Admin
export const updateCuratedFormat = async (req, res) => {
  try {
    const { title, tag, description, image } = req.body;

    const format = await CuratedFormat.findById(req.params.id);

    if (format) {
      format.title = title || format.title;
      format.tag = tag || format.tag;
      format.description = description || format.description;
      format.image = image || format.image;

      const updatedFormat = await format.save();
      res.json(updatedFormat);
    } else {
      res.status(404).json({ message: 'Curated format not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a curated format
// @route   DELETE /api/curated-formats/:id
// @access  Private/Admin
export const deleteCuratedFormat = async (req, res) => {
  try {
    const format = await CuratedFormat.findById(req.params.id);

    if (format) {
      await format.deleteOne();
      res.json({ message: 'Curated format removed' });
    } else {
      res.status(404).json({ message: 'Curated format not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
