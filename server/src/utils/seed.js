import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Event } from '../models/Event.js';
import { Registration } from '../models/Registration.js';
import { Admin } from '../models/Admin.js';

dotenv.config();

const sampleEvents = [
  {
    title: 'CodeSprint 2026: Annual Inter-College Algorithmic Championship',
    slug: 'codesprint-2026',
    code: 'CP-01',
    category: 'Competitive Programming',
    date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
    time: '10:00 AM - 02:00 PM IST',
    venue: 'Computing Centre, Tech Block & CodeChef Judge Online',
    description:
      'The flagship competitive programming contest of CodeChef Campus Club. Test your data structures, algorithmic prowess, mathematical modeling, and problem-solving speed against the brightest minds across universities. Ranked on the global CodeChef rating system with custom campus leaderboard.',
    rules: [
      'Individual participation only (no teams allowed).',
      'Supported languages: C++, Java, Python, and Rust.',
      'Contest duration is strictly 4 hours with 7 algorithmic problems of escalating difficulty.',
      'Plagiarism checks (MOSS & CodeChef Judge similarity detection) are active; any detected collusion will result in immediate disqualification.',
      'Standard ICPC penalty timing applies (wrong submissions incur a 20-minute penalty on solved problems).',
    ],
    eligibility: 'Open to all undergraduate & postgraduate students from recognized technical institutions.',
    registrationDeadline: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
    maxParticipants: 180,
    featured: true,
    image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80',
    prizePool: '₹35,000 Cash + CodeChef Pro Vouchers + Official T-Shirts',
    status: 'Upcoming',
  },
  {
    title: 'WebForge: 24-Hour Production-Grade Web Hackathon',
    slug: 'webforge-hackathon',
    code: 'HACK-04',
    category: 'Hackathon',
    date: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000),
    time: '09:00 AM (Day 1) to 09:00 AM (Day 2)',
    venue: 'Auditorium Hall B & Virtual Discord War-Room',
    description:
      'A grueling yet exhilarating 24-hour sprint to build next-generation web applications. Focus on performance, micro-interactions, robust database design, and real-world deployment. Tracks include Developer Tools, EdTech, ClimateTech, and Web3 / Decentralized Systems.',
    rules: [
      'Teams of 2 to 4 members. Inter-college teams are welcome.',
      'All code must be written during the 24-hour window; boilerplate/starter templates are permitted with disclosure.',
      'Public GitHub repository with commit history is mandatory for evaluation.',
      '3-minute live pitch + 2-minute live demo in front of industry judges.',
    ],
    eligibility: 'Open to all students with basic familiarity in full-stack web development.',
    registrationDeadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
    maxParticipants: 120,
    featured: false,
    image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80',
    prizePool: '₹50,000 Total Prize Pool + Internship Interviews with Partner Startups',
    status: 'Upcoming',
  },
  {
    title: 'DSA Masterclass: Advanced Graph Algorithms & Flow Networks',
    slug: 'dsa-masterclass-graph-algorithms',
    code: 'WKP-02',
    category: 'Workshop',
    date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    time: '04:00 PM - 07:00 PM IST',
    venue: 'Seminar Hall 3 & Google Meet Live Stream',
    description:
      'Deep dive into competitive graph algorithms with club alumni working at top tech firms (FAANG/MAANG). Topics include Tarjan’s SCC, Bridges & Articulation Points, Dinic’s Max-Flow algorithm, Heavy-Light Decomposition, and solving recent CodeChef Division-1 problems.',
    rules: [
      'Bring your own charged laptop with your preferred C++/Java/Python IDE setup.',
      'Prerequisite: basic knowledge of BFS, DFS, and Dijkstra.',
      'Interactive hands-on session with 4 practice problems on CodeChef platform.',
    ],
    eligibility: '2nd, 3rd, and 4th-year engineering students aiming for product companies & competitive programming contests.',
    registrationDeadline: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    maxParticipants: 90,
    featured: false,
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80',
    prizePool: 'Certificate of Excellence + DSA Handbook PDF',
    status: 'Upcoming',
  },
  {
    title: 'Debugging Duel 3.0: High-Stakes Bug Hunting Challenge',
    slug: 'debugging-duel-3',
    code: 'CP-09',
    category: 'Competitive Programming',
    date: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000),
    time: '02:00 PM - 05:00 PM IST',
    venue: 'Computer Lab 4 (Systems Lab)',
    description:
      'Given broken, buggy, edge-case-failing codebases in C++, Python, and JavaScript, race against the clock to fix memory leaks, race conditions, time limit exceeded bugs, and subtle off-by-one errors. Test your code-reading ability under intense pressure.',
    rules: [
      'Solo event with 6 bug-fixing rounds.',
      'Points awarded based on speed of pass across hidden stress test suites.',
      'No external internet or LLM access allowed during the contest.',
    ],
    eligibility: 'Open to all college students.',
    registrationDeadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    maxParticipants: 80,
    featured: false,
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80',
    prizePool: '₹15,000 Cash + Mechanical Keyboards for Top 3 Winners',
    status: 'Upcoming',
  },
  {
    title: 'AI Builders Weekend: Fine-Tuning LLMs & Agentic Systems',
    slug: 'ai-builders-weekend',
    code: 'AI-03',
    category: 'AI/ML',
    date: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000),
    time: '10:00 AM - 05:00 PM IST',
    venue: 'Innovation & Incubation Hub, Room 102',
    description:
      'Learn how to build real-world agentic workflows, function calling pipelines, and deploy quantized models locally. From RAG architecture to building multi-agent developer assistants, get hands-on experience with modern AI stacks.',
    rules: [
      'Participants must bring a laptop with Python 3.10+ installed.',
      'Google Colab GPU credits provided to registered participants.',
      'Includes team project sprint in the afternoon.',
    ],
    eligibility: 'Students with knowledge of Python and basic machine learning concepts.',
    registrationDeadline: new Date(Date.now() + 16 * 24 * 60 * 60 * 1000),
    maxParticipants: 60,
    featured: false,
    image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
    prizePool: 'Cloud Compute Credits ($500) + Swag Bags',
    status: 'Upcoming',
  },
  {
    title: 'OpenSource Sprint: First Pull Request to Major Repositories',
    slug: 'opensource-sprint',
    code: 'OSS-01',
    category: 'Open Source',
    date: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
    time: '11:00 AM - 04:00 PM IST',
    venue: 'Main Library Conference Room & GitHub Live',
    description:
      'Demystifying open source contribution for beginners. Learn Git workflows, rebasing, issue triaging, signing CLAs, and how to get your first PR merged into popular developer libraries and documentation.',
    rules: [
      'Laptop with Git and active GitHub profile required.',
      'Mentors will pair up with participants to guide submissions.',
    ],
    eligibility: 'Freshers and 2nd years especially encouraged.',
    registrationDeadline: new Date(Date.now() + 24 * 24 * 60 * 60 * 1000),
    maxParticipants: 100,
    featured: false,
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80',
    prizePool: 'Digital Badges, Stickers & CodeChef Swag Pack',
    status: 'Upcoming',
  },
  {
    title: 'CodeCraft: Architecture & System Design for High Scale',
    slug: 'codecraft-system-design',
    code: 'TALK-05',
    category: 'Technical Talk',
    date: new Date(Date.now() + 32 * 24 * 60 * 60 * 1000),
    time: '05:00 PM - 07:30 PM IST',
    venue: 'Auditorium Hall A & YouTube Live',
    description:
      'An architectural masterclass on scaling web systems to millions of concurrent users. Covering rate limiting, distributed caching with Redis, message queues with Kafka, database sharding, and resilience patterns.',
    rules: ['Open Q&A at the conclusion with guest speaker from Uber Engineering.'],
    eligibility: 'All students and faculty members interested in backend systems.',
    registrationDeadline: new Date(Date.now() + 31 * 24 * 60 * 60 * 1000),
    maxParticipants: 250,
    featured: false,
    image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80',
    prizePool: 'Distributed Systems Book Giveaway',
    status: 'Upcoming',
  },
];

const sampleRegistrations = [
  {
    name: 'Aarav Sharma',
    email: 'aarav.sharma@college.edu',
    college: 'ABES Engineering College',
    year: '3rd Year',
    phone: '+91 9876543210',
    branch: 'Computer Science & Engineering',
    rollNumber: 'CS23B1042',
  },
  {
    name: 'Priya Iyer',
    email: 'priya.iyer@college.edu',
    college: 'ABES Engineering College',
    year: '2nd Year',
    phone: '+91 9811223344',
    branch: 'Information Technology',
    rollNumber: 'IT24B1015',
  },
  {
    name: 'Rohan Mehta',
    email: 'rohan.mehta@mit.edu',
    college: 'National Institute of Engineering',
    year: '3rd Year',
    phone: '+91 9765432109',
    branch: 'Electronics & Communication',
    rollNumber: 'EC23B088',
  },
  {
    name: 'Sneha Patel',
    email: 'sneha.patel@techuniv.ac.in',
    college: 'University College of Engineering',
    year: '1st Year',
    phone: '+91 9123456780',
    branch: 'Artificial Intelligence & Data Science',
    rollNumber: 'AI25B034',
  },
  {
    name: 'Aditya Verma',
    email: 'aditya.v@engg.edu',
    college: 'ABES Engineering College',
    year: '4th Year',
    phone: '+91 9988776655',
    branch: 'Computer Science & Engineering',
    rollNumber: 'CS22B007',
  },
  {
    name: 'Ananya Deshmukh',
    email: 'ananya.d@institute.ac.in',
    college: 'Regional Engineering College',
    year: '2nd Year',
    phone: '+91 9345678901',
    branch: 'Computer Science & Engineering',
    rollNumber: 'CS24B120',
  },
];

const seedDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/codechef_club';
    await mongoose.connect(mongoUri);
    console.log(' Connected to MongoDB for seeding...');

    // Clear existing collections
    await Event.deleteMany({});
    await Registration.deleteMany({});
    await Admin.deleteMany({});
    console.log(' Cleared old Events, Registrations, and Admin collections.');

    // Create Default Admin
    const adminEmail = (process.env.ADMIN_EMAIL || 'admin@codechefclub.com').toLowerCase().trim();
    const adminPassword = process.env.ADMIN_PASSWORD || 'CodeChef@123';

    const admin = await Admin.create({
      name: 'Club Lead Admin',
      email: adminEmail,
      password: adminPassword,
      role: 'superadmin',
    });
    console.log(` Created default admin: ${admin.email} (Password: ${adminPassword})`);

    // Insert Events
    const createdEvents = await Event.insertMany(sampleEvents);
    console.log(` Inserted ${createdEvents.length} events successfully.`);

    // Insert Registrations distributed among first few events
    const regPromises = [];
    const event1 = createdEvents[0]; // CodeSprint
    const event2 = createdEvents[1]; // WebForge
    const event3 = createdEvents[2]; // DSA Masterclass

    sampleRegistrations.slice(0, 3).forEach((r) => {
      regPromises.push(
        Registration.create({
          ...r,
          eventId: event1._id,
          ticketId: `CC-${event1.code}-${Math.floor(100000 + Math.random() * 900000)}`,
        })
      );
    });

    sampleRegistrations.slice(2, 5).forEach((r) => {
      // Modify email slightly if already used in event1
      regPromises.push(
        Registration.create({
          ...r,
          email: r.email.replace('@', '.hack@'),
          eventId: event2._id,
          ticketId: `CC-${event2.code}-${Math.floor(100000 + Math.random() * 900000)}`,
        })
      );
    });

    sampleRegistrations.slice(4, 6).forEach((r) => {
      regPromises.push(
        Registration.create({
          ...r,
          email: r.email.replace('@', '.dsa@'),
          eventId: event3._id,
          ticketId: `CC-${event3.code}-${Math.floor(100000 + Math.random() * 900000)}`,
        })
      );
    });

    await Promise.all(regPromises);
    console.log(` Created ${regPromises.length} sample registrations.`);

    console.log(' Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error(' Seeding failed:', error);
    process.exit(1);
  }
};

seedDB();
