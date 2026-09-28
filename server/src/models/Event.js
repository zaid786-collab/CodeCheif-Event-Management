import mongoose from 'mongoose';

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Event title is required'],
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    code: {
      type: String,
      trim: true,
      default: function() {
        const catMap = {
          'Competitive Programming': 'CP',
          'Hackathon': 'HACK',
          'Workshop': 'WKP',
          'Web Development': 'WEB',
          'AI/ML': 'AI',
          'Open Source': 'OSS',
          'Gaming': 'GAME',
          'Technical Talk': 'TALK',
        };
        const prefix = catMap[this.category] || 'EVT';
        return `${prefix}-${Math.floor(10 + Math.random() * 90)}`;
      }
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: [
        'Competitive Programming',
        'Hackathon',
        'Workshop',
        'Web Development',
        'AI/ML',
        'Open Source',
        'Gaming',
        'Technical Talk',
      ],
      default: 'Competitive Programming',
    },
    date: {
      type: Date,
      required: [true, 'Event date is required'],
    },
    time: {
      type: String,
      required: [true, 'Event time is required'],
      trim: true,
    },
    venue: {
      type: String,
      required: [true, 'Venue is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Event description is required'],
    },
    rules: {
      type: [String],
      default: [],
    },
    eligibility: {
      type: String,
      default: 'Open to all college students & engineering enthusiasts',
    },
    registrationDeadline: {
      type: Date,
      required: [true, 'Registration deadline is required'],
    },
    maxParticipants: {
      type: Number,
      default: 100,
      min: [1, 'Participants must be at least 1'],
    },
    featured: {
      type: Boolean,
      default: false,
    },
    image: {
      type: String,
      default: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=80',
    },
    prizePool: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['Upcoming', 'Ongoing', 'Completed', 'Closed'],
      default: 'Upcoming',
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for registration count
eventSchema.virtual('registrationsCount', {
  ref: 'Registration',
  localField: '_id',
  foreignField: 'eventId',
  count: true,
});

eventSchema.index({ date: 1 });
eventSchema.index({ category: 1 });
eventSchema.index({ featured: 1 });

export const Event = mongoose.model('Event', eventSchema);
