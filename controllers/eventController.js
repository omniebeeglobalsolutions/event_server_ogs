import Event from '../models/Event.js';

// @desc    Fetch all active events
// @route   GET /api/events
// @access  Public
export const getEvents = async (req, res) => {
  try {
    const events = await Event.find({ isPublished: true }).populate('createdBy', 'name');
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Fetch single event
// @route   GET /api/events/:id
// @access  Public
export const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id).populate('createdBy', 'name');
    if (event) {
      res.json(event);
    } else {
      res.status(404).json({ message: 'Event not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create an event
// @route   POST /api/events
// @access  Private/Admin
export const createEvent = async (req, res) => {
  try {
    const { title, description, image, location, date, ticketPrice, totalSeats, category, theme, minAge, maxAge } = req.body;

    const event = new Event({
      title,
      description,
      image,
      location,
      date,
      ticketPrice,
      totalSeats,
      availableSeats: totalSeats,
      category,
      theme: theme || 'normal',
      minAge: minAge !== undefined ? Number(minAge) : 0,
      maxAge: maxAge !== undefined ? Number(maxAge) : 100,
      createdBy: req.user._id
    });

    const createdEvent = await event.save();
    res.status(201).json(createdEvent);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update an event
// @route   PUT /api/events/:id
// @access  Private/Admin
export const updateEvent = async (req, res) => {
  try {
    const { title, description, image, location, date, ticketPrice, totalSeats, availableSeats, category, theme, minAge, maxAge, isPublished } = req.body;

    const event = await Event.findById(req.params.id);

    if (event) {
      event.title = title || event.title;
      event.description = description || event.description;
      event.image = image || event.image;
      event.location = location || event.location;
      event.date = date || event.date;
      event.ticketPrice = ticketPrice !== undefined ? ticketPrice : event.ticketPrice;
      event.totalSeats = totalSeats !== undefined ? totalSeats : event.totalSeats;
      event.availableSeats = availableSeats !== undefined ? availableSeats : event.availableSeats;
      event.category = category || event.category;
      event.theme = theme || event.theme;
      event.minAge = minAge !== undefined ? Number(minAge) : event.minAge;
      event.maxAge = maxAge !== undefined ? Number(maxAge) : event.maxAge;
      event.isPublished = isPublished !== undefined ? isPublished : event.isPublished;

      const updatedEvent = await event.save();
      res.json(updatedEvent);
    } else {
      res.status(404).json({ message: 'Event not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete an event
// @route   DELETE /api/events/:id
// @access  Private/Admin
export const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (event) {
      await event.deleteOne();
      res.json({ message: 'Event removed' });
    } else {
      res.status(404).json({ message: 'Event not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
