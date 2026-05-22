import Gallery from '../models/Gallery.js';

// @desc    Fetch all gallery images
// @route   GET /api/gallery
// @access  Public
export const getGalleryItems = async (req, res) => {
  try {
    const items = await Gallery.find({}).sort({ createdAt: -1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a gallery image
// @route   POST /api/gallery
// @access  Private/Admin
export const createGalleryItem = async (req, res) => {
  try {
    const { title, description, image, category } = req.body;

    const galleryItem = new Gallery({
      title,
      description,
      image,
      category,
      createdBy: req.user._id
    });

    const createdItem = await galleryItem.save();
    res.status(201).json(createdItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a gallery image
// @route   DELETE /api/gallery/:id
// @access  Private/Admin
export const deleteGalleryItem = async (req, res) => {
  try {
    const item = await Gallery.findById(req.params.id);

    if (item) {
      await item.deleteOne();
      res.json({ message: 'Gallery image removed' });
    } else {
      res.status(404).json({ message: 'Gallery image not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
