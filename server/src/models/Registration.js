import mongoose from 'mongoose';

const registrationSchema = new mongoose.Schema(
  {
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
      required: [true, 'Event ID is required'],
    },
    name: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email address is required'],
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
    },
    college: {
      type: String,
      required: [true, 'College / University is required'],
      trim: true,
    },
    year: {
      type: String,
      required: [true, 'Academic year is required'],
      enum: ['1st Year', '2nd Year', '3rd Year', '4th Year', 'Postgraduate', 'Other'],
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
      match: [/^[0-9+ -]{8,15}$/, 'Please provide a valid phone number (8-15 digits)'],
    },
    branch: {
      type: String,
      trim: true,
      default: 'Computer Science & Engineering',
    },
    rollNumber: {
      type: String,
      trim: true,
      default: '',
    },
    status: {
      type: String,
      enum: ['Confirmed', 'Waitlist', 'Cancelled'],
      default: 'Confirmed',
    },
    ticketId: {
      type: String,
      unique: true,
      default: () => `CC-${Math.floor(100000 + Math.random() * 900000)}`,
    },
    registeredAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Compound unique index to strictly prevent duplicate registration per event and email
registrationSchema.index({ eventId: 1, email: 1 }, { unique: true });
registrationSchema.index({ email: 1 });
registrationSchema.index({ registeredAt: -1 });

export const Registration = mongoose.model('Registration', registrationSchema);
