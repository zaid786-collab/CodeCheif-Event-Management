import mongoose from 'mongoose';
import { Event } from '../models/Event.js';
import { Registration } from '../models/Registration.js';

// Helper to escape regex special characters
const escapeRegex = (string) => string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// Helper to generate slug from title
const generateSlug = (title) => {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
};

// @desc    Get all events with filters, search, and registration counts
// @route   GET /api/events
// @access  Public
export const getEvents = async (req, res, next) => {
  try {
    const { category, search, sort, status, featured, limit, dateFilter } = req.query;

    const query = {};

    if (category && category !== 'All') {
      query.category = category;
    }

    if (status && status !== 'All') {
      query.status = status;
    }

    if (featured === 'true') {
      query.featured = true;
    }

    // Date range filtering
    const now = new Date();
    if (dateFilter === 'upcoming') {
      query.date = { $gte: now };
    } else if (dateFilter === 'this-week') {
      const endOfWeek = new Date();
      endOfWeek.setDate(now.getDate() + (7 - now.getDay()));
      endOfWeek.setHours(23, 59, 59, 999);
      query.date = { $gte: now, $lte: endOfWeek };
    } else if (dateFilter === 'this-month') {
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
      query.date = { $gte: now, $lte: endOfMonth };
    } else if (dateFilter === 'past') {
      query.date = { $lt: now };
    }

    if (search && search.trim()) {
      const sanitized = escapeRegex(search.trim());
      query.$or = [
        { title: { $regex: sanitized, $options: 'i' } },
        { description: { $regex: sanitized, $options: 'i' } },
        { venue: { $regex: sanitized, $options: 'i' } },
        { code: { $regex: sanitized, $options: 'i' } },
      ];
    }

    let sortOptions = { date: 1 }; // default upcoming first

    if (sort === 'date-desc') {
      sortOptions = { date: -1 };
    } else if (sort === 'date-asc') {
      sortOptions = { date: 1 };
    } else if (sort === 'title-asc') {
      sortOptions = { title: 1 };
    } else if (sort === 'newest') {
      sortOptions = { createdAt: -1 };
    }

    let eventQuery = Event.find(query).sort(sortOptions);

    if (limit) {
      eventQuery = eventQuery.limit(Number(limit));
    }

    const events = await eventQuery.lean();

    // Aggregate registration counts for each event
    const eventIds = events.map((e) => e._id);
    const regCounts = await Registration.aggregate([
      { $match: { eventId: { $in: eventIds }, status: { $ne: 'Cancelled' } } },
      { $group: { _id: '$eventId', count: { $sum: 1 } } },
    ]);

    const countMap = {};
    regCounts.forEach((rc) => {
      countMap[rc._id.toString()] = rc.count;
    });

    const enrichedEvents = events.map((evt) => {
      const currentRegistrations = countMap[evt._id.toString()] || 0;
      const seatsLeft = Math.max(0, (evt.maxParticipants || 100) - currentRegistrations);
      return {
        ...evt,
        currentRegistrations,
        seatsLeft,
        isSoldOut: seatsLeft <= 0,
      };
    });

    res.status(200).json({
      success: true,
      count: enrichedEvents.length,
      data: enrichedEvents,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get featured event
// @route   GET /api/events/featured
// @access  Public
export const getFeaturedEvent = async (req, res, next) => {
  try {
    let event = await Event.findOne({ featured: true }).lean();

    // If no event marked featured, grab next upcoming
    if (!event) {
      event = await Event.findOne({ date: { $gte: new Date() } })
        .sort({ date: 1 })
        .lean();
    }

    // If still none, grab the latest event
    if (!event) {
      event = await Event.findOne().sort({ createdAt: -1 }).lean();
    }

    if (!event) {
      return res.status(200).json({
        success: true,
        data: null,
      });
    }

    const currentRegistrations = await Registration.countDocuments({
      eventId: event._id,
      status: { $ne: 'Cancelled' },
    });

    const seatsLeft = Math.max(0, (event.maxParticipants || 100) - currentRegistrations);

    res.status(200).json({
      success: true,
      data: {
        ...event,
        currentRegistrations,
        seatsLeft,
        isSoldOut: seatsLeft <= 0,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single event by ID or slug
// @route   GET /api/events/:idOrSlug
// @access  Public
export const getEventById = async (req, res, next) => {
  try {
    const { idOrSlug } = req.params;

    let event = null;
    if (mongoose.Types.ObjectId.isValid(idOrSlug)) {
      event = await Event.findById(idOrSlug).lean();
    }
    if (!event) {
      event = await Event.findOne({ slug: idOrSlug.toLowerCase().trim() }).lean();
    }

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found with provided identifier',
      });
    }

    const currentRegistrations = await Registration.countDocuments({
      eventId: event._id,
      status: { $ne: 'Cancelled' },
    });

    const seatsLeft = Math.max(0, (event.maxParticipants || 100) - currentRegistrations);

    res.status(200).json({
      success: true,
      data: {
        ...event,
        currentRegistrations,
        seatsLeft,
        isSoldOut: seatsLeft <= 0,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new event
// @route   POST /api/events
// @access  Private (Admin)
export const createEvent = async (req, res, next) => {
  try {
    const {
      title,
      category,
      date,
      time,
      venue,
      description,
      rules,
      eligibility,
      registrationDeadline,
      maxParticipants,
      featured,
      image,
      prizePool,
      status,
      code,
    } = req.body;

    if (!title || !category || !date || !time || !venue || !description || !registrationDeadline) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: title, category, date, time, venue, description, registrationDeadline',
      });
    }

    const eventDateObj = new Date(date);
    const deadlineObj = new Date(registrationDeadline);

    if (isNaN(eventDateObj.getTime()) || isNaN(deadlineObj.getTime())) {
      return res.status(400).json({
        success: false,
        message: 'Invalid date or registration deadline format provided.',
      });
    }

    if (deadlineObj > eventDateObj) {
      return res.status(400).json({
        success: false,
        message: 'Registration deadline cannot be scheduled after the event date.',
      });
    }

    if (maxParticipants !== undefined && (isNaN(Number(maxParticipants)) || Number(maxParticipants) < 1)) {
      return res.status(400).json({
        success: false,
        message: 'Maximum participants must be a valid number of at least 1.',
      });
    }

    let baseSlug = generateSlug(title);
    let slug = baseSlug;
    let counter = 1;
    while (await Event.findOne({ slug })) {
      slug = `${baseSlug}-${counter++}`;
    }

    const isFeatured = featured === true || featured === 'true';

    // If marked featured, unmark any previous featured event
    if (isFeatured) {
      await Event.updateMany({ featured: true }, { featured: false });
    }

    // Rules array handling
    let parsedRules = rules;
    if (typeof rules === 'string') {
      parsedRules = rules
        .split('\n')
        .map((r) => r.trim())
        .filter((r) => r.length > 0);
    }

    const event = await Event.create({
      title,
      slug,
      category,
      date: eventDateObj,
      time,
      venue,
      description,
      rules: parsedRules || [],
      eligibility: eligibility || 'Open to all college students & engineering enthusiasts',
      registrationDeadline: deadlineObj,
      maxParticipants: maxParticipants ? Number(maxParticipants) : 100,
      featured: isFeatured,
      image: image || undefined,
      prizePool: prizePool || '',
      status: status || 'Upcoming',
      code: code || undefined,
    });

    res.status(201).json({
      success: true,
      message: 'Event created successfully',
      data: event,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update event
// @route   PUT /api/events/:id
// @access  Private (Admin)
export const updateEvent = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({
        success: false,
        message: 'Event not found with provided identifier',
      });
    }

    let event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    if (req.body.maxParticipants !== undefined && (isNaN(Number(req.body.maxParticipants)) || Number(req.body.maxParticipants) < 1)) {
      return res.status(400).json({
        success: false,
        message: 'Maximum participants must be a valid number of at least 1.',
      });
    }

    if (req.body.date && isNaN(new Date(req.body.date).getTime())) {
      return res.status(400).json({
        success: false,
        message: 'Invalid date format for event date.',
      });
    }

    if (req.body.registrationDeadline && isNaN(new Date(req.body.registrationDeadline).getTime())) {
      return res.status(400).json({
        success: false,
        message: 'Invalid date format for registration deadline.',
      });
    }

    // Check date vs deadline if either or both are being updated
    const targetDate = req.body.date ? new Date(req.body.date) : new Date(event.date);
    const targetDeadline = req.body.registrationDeadline
      ? new Date(req.body.registrationDeadline)
      : new Date(event.registrationDeadline);

    if (targetDeadline > targetDate) {
      return res.status(400).json({
        success: false,
        message: 'Registration deadline cannot be scheduled after the event date.',
      });
    }

    // If setting featured to true, clear others
    if (req.body.featured === true || req.body.featured === 'true') {
      await Event.updateMany({ _id: { $ne: id }, featured: true }, { featured: false });
      req.body.featured = true;
    }

    if (req.body.title && req.body.title !== event.title) {
      let baseSlug = generateSlug(req.body.title);
      let slug = baseSlug;
      let counter = 1;
      while (await Event.findOne({ slug, _id: { $ne: id } })) {
        slug = `${baseSlug}-${counter++}`;
      }
      req.body.slug = slug;
    }

    if (typeof req.body.rules === 'string') {
      req.body.rules = req.body.rules
        .split('\n')
        .map((r) => r.trim())
        .filter((r) => r.length > 0);
    }

    event = await Event.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: 'Event updated successfully',
      data: event,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete event & its registrations
// @route   DELETE /api/events/:id
// @access  Private (Admin)
export const deleteEvent = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    // Cascade delete registrations
    const deletedRegs = await Registration.deleteMany({ eventId: id });
    await Event.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: `Event "${event.title}" and ${deletedRegs.deletedCount} registrations removed successfully.`,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle featured status of an event
// @route   PATCH /api/events/:id/toggle-featured
// @access  Private (Admin)
export const toggleFeatured = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    const newFeaturedState = !event.featured;

    if (newFeaturedState) {
      await Event.updateMany({ _id: { $ne: id }, featured: true }, { featured: false });
    }

    event.featured = newFeaturedState;
    await event.save();

    res.status(200).json({
      success: true,
      message: `Event ${newFeaturedState ? 'marked as featured' : 'unmarked as featured'}`,
      data: event,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get dynamic public club overview stats
// @route   GET /api/events/overview-stats
// @access  Public
export const getClubOverviewStats = async (req, res, next) => {
  try {
    const totalEvents = await Event.countDocuments();
    const totalRegistrations = await Registration.countDocuments({ status: { $ne: 'Cancelled' } });

    res.status(200).json({
      success: true,
      data: {
        totalEvents,
        totalRegistrations,
        activeMembers: 500 + totalRegistrations,
        hackathonsWon: 12,
        problemsSolved: '40k+',
      },
    });
  } catch (error) {
    next(error);
  }
};
