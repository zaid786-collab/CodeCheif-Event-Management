import mongoose from 'mongoose';
import { Registration } from '../models/Registration.js';
import { Event } from '../models/Event.js';

// Helper to escape regex special characters
const escapeRegex = (string) => string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// @desc    Register for an event
// @route   POST /api/registrations
// @access  Public
export const registerForEvent = async (req, res, next) => {
  try {
    const { eventId, name, email, college, year, phone, branch, rollNumber } = req.body;

    if (!eventId || !name || !email || !college || !year || !phone) {
      return res.status(400).json({
        success: false,
        message: 'Please fill in all required fields (Name, Email, College, Year, Phone, Event ID)',
      });
    }

    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid event identifier format.',
      });
    }

    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address (e.g. yourname@college.edu)',
      });
    }

    const cleanPhone = phone.replace(/[^0-9+]/g, '');
    if (cleanPhone.length < 8 || cleanPhone.length > 15) {
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid phone number with 8 to 15 digits',
      });
    }

    // Verify event exists
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'The requested event does not exist.',
      });
    }

    // Check if event is closed or completed
    if (event.status === 'Closed' || event.status === 'Completed') {
      return res.status(400).json({
        success: false,
        message: `Registration for this event is closed (${event.status.toLowerCase()}).`,
      });
    }

    // Check registration deadline
    if (new Date() > new Date(event.registrationDeadline)) {
      return res.status(400).json({
        success: false,
        message: 'Registration for this event has closed. The deadline has passed.',
      });
    }

    // Check duplicate registration
    const normalizedEmail = email.trim().toLowerCase();
    const existingRegistration = await Registration.findOne({
      eventId,
      email: normalizedEmail,
    });

    if (existingRegistration) {
      return res.status(409).json({
        success: false,
        message: `This email (${normalizedEmail}) is already registered for "${event.title}". Ticket: ${existingRegistration.ticketId}`,
        existingTicketId: existingRegistration.ticketId,
      });
    }

    // Check participant limit
    const currentCount = await Registration.countDocuments({
      eventId,
      status: { $ne: 'Cancelled' },
    });

    if (currentCount >= event.maxParticipants) {
      return res.status(400).json({
        success: false,
        message: `Registration is full. The maximum capacity of ${event.maxParticipants} participants has been reached.`,
      });
    }

    // Create unique ticket ID
    const randomCode = Math.floor(100000 + Math.random() * 900000);
    const ticketId = `CC-${event.code || 'EVT'}-${randomCode}`;

    const registration = await Registration.create({
      eventId,
      name: name.trim(),
      email: normalizedEmail,
      college: college.trim(),
      year,
      phone: phone.trim(),
      branch: branch ? branch.trim() : 'Computer Science & Engineering',
      rollNumber: rollNumber ? rollNumber.trim() : '',
      status: 'Confirmed',
      ticketId,
      registeredAt: new Date(),
    });

    res.status(201).json({
      success: true,
      message: 'Registration successful! Your seat is confirmed.',
      data: {
        registration,
        event: {
          id: event._id,
          title: event.title,
          category: event.category,
          date: event.date,
          time: event.time,
          venue: event.venue,
          code: event.code,
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get registrations with search and filtering
// @route   GET /api/registrations
// @access  Private (Admin)
export const getRegistrations = async (req, res, next) => {
  try {
    const { eventId, year, search, status, page = 1, limit = 50 } = req.query;

    const query = {};

    if (eventId && eventId !== 'All') {
      if (mongoose.Types.ObjectId.isValid(eventId)) {
        query.eventId = eventId;
      }
    }

    if (year && year !== 'All') {
      query.year = year;
    }

    if (status && status !== 'All') {
      query.status = status;
    }

    if (search && search.trim()) {
      const sanitized = escapeRegex(search.trim());
      // Find events matching title or code
      const matchedEvents = await Event.find({
        $or: [
          { title: { $regex: sanitized, $options: 'i' } },
          { code: { $regex: sanitized, $options: 'i' } },
        ],
      }).select('_id');

      const matchedEventIds = matchedEvents.map((e) => e._id);

      query.$or = [
        { name: { $regex: sanitized, $options: 'i' } },
        { email: { $regex: sanitized, $options: 'i' } },
        { college: { $regex: sanitized, $options: 'i' } },
        { phone: { $regex: sanitized, $options: 'i' } },
        { rollNumber: { $regex: sanitized, $options: 'i' } },
        { ticketId: { $regex: sanitized, $options: 'i' } },
        ...(matchedEventIds.length > 0 ? [{ eventId: { $in: matchedEventIds } }] : []),
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);

    const total = await Registration.countDocuments(query);
    const registrations = await Registration.find(query)
      .populate('eventId', 'title category date time venue code')
      .sort({ registeredAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .lean();

    res.status(200).json({
      success: true,
      count: registrations.length,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
      data: registrations,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single registration details
// @route   GET /api/registrations/:id
// @access  Private (Admin)
export const getRegistrationById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({
        success: false,
        message: 'Registration record not found',
      });
    }

    const registration = await Registration.findById(id).populate(
      'eventId',
      'title category date time venue rules eligibility code'
    );

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: 'Registration record not found',
      });
    }

    res.status(200).json({
      success: true,
      data: registration,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete / Cancel a registration
// @route   DELETE /api/registrations/:id
// @access  Private (Admin)
export const deleteRegistration = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({
        success: false,
        message: 'Registration record not found',
      });
    }

    const registration = await Registration.findById(id);
    if (!registration) {
      return res.status(404).json({
        success: false,
        message: 'Registration record not found',
      });
    }

    await Registration.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: `Registration for ${registration.name} (${registration.email}) deleted successfully`,
    });
  } catch (error) {
    next(error);
  }
};
