import mongoose from 'mongoose';
import dotenv from 'dotenv';
import dns from 'dns';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { Event } from '../models/Event.js';
import { Registration } from '../models/Registration.js';
import { Admin } from '../models/Admin.js';

// Public DNS resolver fallback to prevent Windows SRV lookup errors
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {}

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '../../.env') });

const sampleEvents = [
  {
    title: 'CodeSprint 2026: Annual Inter-College Algorithmic Championship',
    slug: 'codesprint-2026-algorithmic-championship',
    code: 'CP-101',
    category: 'Competitive Programming',
    date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
    time: '10:00 AM - 02:00 PM IST',
    venue: 'Bhabha Block Computing Centre & Online CodeChef Judge',
    description:
      'The flagship competitive programming contest of CodeChef Campus Club, ABES Engineering College. Test your data structures, algorithmic paradigms, mathematical modeling, and problem-solving speed against the sharpest collegiate coders across India. Fully ranked on the official CodeChef rating judge with a live campus scoreboard.',
    rules: [
      'Individual participation only (no teams allowed).',
      'Supported languages: C++, Java, Python 3, and Rust.',
      'Contest duration is strictly 4 hours with 7 algorithmic problems of escalating difficulty.',
      'Plagiarism checks (MOSS & CodeChef Judge similarity detection) are active; collusion results in immediate disqualification.',
      'Standard ICPC penalty timing applies (wrong submissions incur a 20-minute penalty on solved problems).',
    ],
    eligibility: 'Open to all undergraduate & postgraduate students from recognized technical institutions.',
    registrationDeadline: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
    maxParticipants: 180,
    featured: true,
    image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80',
    prizePool: '₹40,000 Cash Pool + CodeChef Pro Badges & Goodies',
    status: 'Upcoming',
  },
  {
    title: 'WebForge 2026: 24-Hour Production Web Hackathon',
    slug: 'webforge-2026-production-hackathon',
    code: 'HACK-204',
    category: 'Hackathon',
    date: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000),
    time: '09:00 AM (Day 1) - 09:00 AM (Day 2)',
    venue: 'Ramanujan Hall, Tech Block & Discord War-Room',
    description:
      'A grueling yet exhilarating 24-hour sprint to build next-generation web platforms. Focus on performance, micro-interactions, robust database schemas, and cloud deployment. Tracks include Developer Tools, EdTech, ClimateTech, and Web3 / Decentralized Systems.',
    rules: [
      'Teams of 2 to 4 members. Inter-college teams are permitted.',
      'All code must be committed during the 24-hour window to a public GitHub repository.',
      'Starter templates are permitted with full disclosure in README.',
      '3-minute live pitch + 2-minute live demo in front of industry judges.',
    ],
    eligibility: 'Open to all students with basic familiarity in full-stack web development.',
    registrationDeadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
    maxParticipants: 120,
    featured: false,
    image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80',
    prizePool: '₹60,000 Total Prize Pool + Fast-Track Startup Interviews',
    status: 'Upcoming',
  },
  {
    title: 'DSA Masterclass: Advanced Graph Algorithms & Flow Networks',
    slug: 'dsa-masterclass-graph-algorithms-flow-networks',
    code: 'WKP-310',
    category: 'Workshop',
    date: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000),
    time: '03:00 PM - 06:00 PM IST',
    venue: 'Seminar Hall 2 & Microsoft Teams Stream',
    description:
      'An intensive deep-dive workshop into advanced graph theory: Edmonds-Karp Max Flow, Dinic Algorithm, Push-Relabel, Bridges, Articulation Points, and Lowest Common Ancestor (LCA) in tree hierarchies with binary lifting.',
    rules: [
      'Hands-on problem solving session; bring your laptop with C++ or Java IDE installed.',
      'Interactive Q&A and code walkthroughs included.',
    ],
    eligibility: 'Intermediate programmers familiar with BFS, DFS, and Dijkstra algorithms.',
    registrationDeadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    maxParticipants: 90,
    featured: false,
    image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80',
    prizePool: 'Algorithm Textbooks & 1-Month CodeChef Premium Access',
    status: 'Upcoming',
  },
  {
    title: 'CodeChef Starters: ABES Campus Chapter Edition',
    slug: 'codechef-starters-abes-campus-edition',
    code: 'CP-102',
    category: 'Competitive Programming',
    date: new Date(Date.now() + 16 * 24 * 60 * 60 * 1000),
    time: '08:00 PM - 10:30 PM IST',
    venue: 'Online CodeChef Contest Portal (Rated for All Divisions)',
    description:
      'A rated competitive contest hosted under the official CodeChef Campus Chapter banner. Specially curated problem set ranging from Division 4 entry-level to Division 1 Grandmaster challenges.',
    rules: [
      'Contest rated globally on CodeChef for registered college chapter students.',
      'Strict penalty timings on incorrect submissions.',
      'Live editorial video release 30 minutes following contest conclusion.',
    ],
    eligibility: 'All students across 1st to 4th year enrolled in technical courses.',
    registrationDeadline: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
    maxParticipants: 250,
    featured: false,
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80',
    prizePool: 'Official CodeChef Rating Boost + Star Performer Certificates',
    status: 'Upcoming',
  },
  {
    title: 'BugHunt: Rapid Code Debugging Duel & Static Analysis',
    slug: 'bughunt-rapid-code-debugging-duel',
    code: 'CP-103',
    category: 'Competitive Programming',
    date: new Date(Date.now() + 19 * 24 * 60 * 60 * 1000),
    time: '02:00 PM - 05:00 PM IST',
    venue: 'Advanced Computing Lab 3, ABES Engineering College',
    description:
      'Sharpen your eyes and logic. Participants are given flawed algorithms plagued with memory leaks, race conditions, integer overflows, and off-by-one errors. Fix the code under intense countdown pressure.',
    rules: [
      '30-minute speed rounds followed by knockout bracket.',
      'Zero external internet access during rounds (offline man-pages and docs only).',
    ],
    eligibility: 'Open to all undergraduate students.',
    registrationDeadline: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000),
    maxParticipants: 80,
    featured: false,
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80',
    prizePool: '₹15,000 Cash + Mechanical Keyboards for Top 3',
    status: 'Upcoming',
  },
  {
    title: 'Full-Stack API Engineering with Node.js & Docker',
    slug: 'fullstack-api-engineering-nodejs-docker',
    code: 'WEB-401',
    category: 'Web Development',
    date: new Date(Date.now() + 23 * 24 * 60 * 60 * 1000),
    time: '10:00 AM - 01:00 PM IST',
    venue: 'Central Auditorium & YouTube Live Stream',
    description:
      'Learn production-ready backend development. Hands-on architectural guide to Express.js, connection pooling, Redis caching, rate limiting, and containerizing full microservices with Docker Compose.',
    rules: [
      'Attendees should have Node.js 20+ and Docker Desktop installed on their machines.',
      'Interactive repo clone provided at the beginning of the session.',
    ],
    eligibility: 'All collegiate developers interested in scalable web backends.',
    registrationDeadline: new Date(Date.now() + 22 * 24 * 60 * 60 * 1000),
    maxParticipants: 150,
    featured: false,
    image: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?auto=format&fit=crop&w=1200&q=80',
    prizePool: 'Cloud Hosting Credits ($100 per attendee) + Swag Kits',
    status: 'Upcoming',
  },
  {
    title: 'NeuralSprint: Hands-On LLM Agent Orchestration & RAG',
    slug: 'neuralsprint-llm-agent-orchestration-rag',
    code: 'AI-502',
    category: 'AI/ML',
    date: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000),
    time: '11:00 AM - 04:00 PM IST',
    venue: 'AI & Robotics Centre of Excellence, Tech Block',
    description:
      'Build autonomous LLM agents that execute tools, query vector stores via Retrieval Augmented Generation (RAG), and coordinate multi-turn problem solving. Practical real-world deployment on cloud endpoints.',
    rules: [
      'Bring your own laptop with Python 3.11+ environment.',
      'API keys and sandbox compute will be provided for all registered participants.',
    ],
    eligibility: 'Students with Python programming experience.',
    registrationDeadline: new Date(Date.now() + 26 * 24 * 60 * 60 * 1000),
    maxParticipants: 110,
    featured: false,
    image: 'https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&w=1200&q=80',
    prizePool: '₹30,000 Prize Pool + OpenAI API Grant Vouchers',
    status: 'Upcoming',
  },
  {
    title: 'Open Source Odyssey: Contributing to High-Impact Repositories',
    slug: 'open-source-odyssey-contributing-high-impact-repos',
    code: 'OSS-601',
    category: 'Open Source',
    date: new Date(Date.now() + 34 * 24 * 60 * 60 * 1000),
    time: '04:00 PM - 07:00 PM IST',
    venue: 'Kalpana Chawla Seminar Hall & GitHub Classroom',
    description:
      'A practical guide to making your first meaningful contribution to major open-source projects. Learn git rebase workflows, squash commits, semantic PRs, writing unit tests, and engaging with project maintainers.',
    rules: [
      'Active GitHub profile required.',
      'Mentors will assist with real pull request creation during the workshop.',
    ],
    eligibility: 'All students eager to contribute to global open source software.',
    registrationDeadline: new Date(Date.now() + 33 * 24 * 60 * 60 * 1000),
    maxParticipants: 100,
    featured: false,
    image: 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?auto=format&fit=crop&w=1200&q=80',
    prizePool: 'GitHub Campus Pack Swag + Verified Contributor Badges',
    status: 'Upcoming',
  },
  {
    title: 'High-Scale System Design: Architectural Lessons from Uber & Netflix',
    slug: 'high-scale-system-design-uber-netflix',
    code: 'TALK-701',
    category: 'Technical Talk',
    date: new Date(Date.now() + 40 * 24 * 60 * 60 * 1000),
    time: '05:00 PM - 07:30 PM IST',
    venue: 'Main Auditorium & Zoom Webinar',
    description:
      'An exclusive guest lecture by senior distributed systems engineers. Topics include geo-distributed databases, event-driven architectures with Kafka, consensus algorithms (Raft), and zero-downtime deployment patterns.',
    rules: [
      'Live audience Q&A session in the concluding 45 minutes.',
    ],
    eligibility: 'Open to all computer science & engineering students and faculty.',
    registrationDeadline: new Date(Date.now() + 39 * 24 * 60 * 60 * 1000),
    maxParticipants: 300,
    featured: false,
    image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80',
    prizePool: '5 Distributed Systems & Microservices Hardcover Books',
    status: 'Upcoming',
  },
  {
    title: 'AlgoRumble: 1v1 Fast-Paced Competitive Debugging Tournament',
    slug: 'algorumble-1v1-fast-paced-debugging-tournament',
    code: 'GAME-801',
    category: 'Gaming',
    date: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
    time: '01:00 PM - 06:00 PM IST',
    venue: 'E-Sports & Gaming Arena, Student Activity Centre',
    description:
      'Competitive coding meets esports. Duals are projected on big arena screens with live commentary as two coders race head-to-head to solve algorithmic puzzles and fix failing unit tests in under 10 minutes.',
    rules: [
      'Single elimination tournament bracket.',
      'Headphones and dedicated test environments provided.',
    ],
    eligibility: 'Open to registered participants; limited to 64 contestants.',
    registrationDeadline: new Date(Date.now() + 43 * 24 * 60 * 60 * 1000),
    maxParticipants: 64,
    featured: false,
    image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1200&q=80',
    prizePool: '₹20,000 Cash Pool + Gaming Accessories',
    status: 'Upcoming',
  },
];

const sampleRegistrations = [
  {
    name: 'Aarav Sharma',
    email: 'aarav.sharma@abes.ac.in',
    college: 'ABES Engineering College',
    year: '3rd Year',
    phone: '+91 9876543210',
    branch: 'Computer Science & Engineering',
    rollNumber: '22CS1042',
  },
  {
    name: 'Priya Iyer',
    email: 'priya.iyer@abes.ac.in',
    college: 'ABES Engineering College',
    year: '2nd Year',
    phone: '+91 9811223344',
    branch: 'Information Technology',
    rollNumber: '23IT1015',
  },
  {
    name: 'Rohan Mehta',
    email: 'rohan.mehta@abes.ac.in',
    college: 'ABES Engineering College',
    year: '3rd Year',
    phone: '+91 9765432109',
    branch: 'Computer Science & Engineering',
    rollNumber: '22CS1088',
  },
  {
    name: 'Sneha Patel',
    email: 'sneha.patel@abes.ac.in',
    college: 'ABES Engineering College',
    year: '1st Year',
    phone: '+91 9123456780',
    branch: 'Artificial Intelligence & Data Science',
    rollNumber: '24AI1034',
  },
  {
    name: 'Aditya Verma',
    email: 'aditya.verma@abes.ac.in',
    college: 'ABES Engineering College',
    year: '4th Year',
    phone: '+91 9988776655',
    branch: 'Computer Science & Engineering',
    rollNumber: '21CS1007',
  },
  {
    name: 'Ananya Deshmukh',
    email: 'ananya.deshmukh@abes.ac.in',
    college: 'ABES Engineering College',
    year: '2nd Year',
    phone: '+91 9345678901',
    branch: 'Computer Science & Engineering',
    rollNumber: '23CS1120',
  },
  {
    name: 'Kabir Singhania',
    email: 'kabir.s@abes.ac.in',
    college: 'ABES Engineering College',
    year: '3rd Year',
    phone: '+91 9822334455',
    branch: 'Information Technology',
    rollNumber: '22IT1055',
  },
  {
    name: 'Diya Sen',
    email: 'diya.sen@abes.ac.in',
    college: 'ABES Engineering College',
    year: '2nd Year',
    phone: '+91 9433221100',
    branch: 'Computer Science & Engineering',
    rollNumber: '23CS1077',
  },
  {
    name: 'Varun Nair',
    email: 'varun.nair@abes.ac.in',
    college: 'ABES Engineering College',
    year: '3rd Year',
    phone: '+91 9711224466',
    branch: 'Computer Science & Engineering',
    rollNumber: '22CS1099',
  },
  {
    name: 'Ishaan Kulkarni',
    email: 'ishaan.k@abes.ac.in',
    college: 'ABES Engineering College',
    year: '1st Year',
    phone: '+91 9544332211',
    branch: 'Artificial Intelligence & Data Science',
    rollNumber: '24AI1012',
  },
  {
    name: 'Tanya Joshi',
    email: 'tanya.joshi@abes.ac.in',
    college: 'ABES Engineering College',
    year: '2nd Year',
    phone: '+91 9655443322',
    branch: 'Information Technology',
    rollNumber: '23IT1044',
  },
  {
    name: 'Siddharth Rao',
    email: 'siddharth.rao@abes.ac.in',
    college: 'ABES Engineering College',
    year: '4th Year',
    phone: '+91 9877665544',
    branch: 'Computer Science & Engineering',
    rollNumber: '21CS1019',
  },
  {
    name: 'Meera Chawla',
    email: 'meera.chawla@abes.ac.in',
    college: 'ABES Engineering College',
    year: '3rd Year',
    phone: '+91 9788990011',
    branch: 'Computer Science & Engineering',
    rollNumber: '22CS1063',
  },
  {
    name: 'Harsh Gupta',
    email: 'harsh.gupta@abes.ac.in',
    college: 'ABES Engineering College',
    year: '2nd Year',
    phone: '+91 9122334455',
    branch: 'Information Technology',
    rollNumber: '23IT1028',
  },
  {
    name: 'Riya Malhotra',
    email: 'riya.malhotra@abes.ac.in',
    college: 'ABES Engineering College',
    year: '1st Year',
    phone: '+91 9911882233',
    branch: 'Computer Science & Engineering',
    rollNumber: '24CS1005',
  },
  {
    name: 'Ayush Pandey',
    email: 'ayush.pandey@abes.ac.in',
    college: 'ABES Engineering College',
    year: '3rd Year',
    phone: '+91 9322445566',
    branch: 'Computer Science & Engineering',
    rollNumber: '22CS1112',
  },
  {
    name: 'Kavya Pillai',
    email: 'kavya.pillai@abes.ac.in',
    college: 'ABES Engineering College',
    year: '2nd Year',
    phone: '+91 9455667788',
    branch: 'Electronics & Communication',
    rollNumber: '23EC1021',
  },
  {
    name: 'Devansh Trivedi',
    email: 'devansh.t@abes.ac.in',
    college: 'ABES Engineering College',
    year: '3rd Year',
    phone: '+91 9566778899',
    branch: 'Computer Science & Engineering',
    rollNumber: '22CS1070',
  },
];

export const seedAtlas = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      console.error('ERROR: MONGO_URI is missing from environment.');
      process.exit(1);
    }

    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 10000 });
    const dbName = mongoose.connection.name;
    console.log(`Connected to database: ${dbName}`);

    // Clean up empty dummy documents if any exist (documents missing required fields)
    const db = mongoose.connection.db;
    const deletedEmptyAdmins = await db.collection('admins').deleteMany({ email: { $exists: false } });
    const deletedEmptyEvents = await db.collection('events').deleteMany({ title: { $exists: false } });
    const deletedEmptyRegs = await db.collection('registrations').deleteMany({ eventId: { $exists: false } });
    if (deletedEmptyAdmins.deletedCount || deletedEmptyEvents.deletedCount || deletedEmptyRegs.deletedCount) {
      console.log(`Cleaned up empty shell documents (Admins: ${deletedEmptyAdmins.deletedCount}, Events: ${deletedEmptyEvents.deletedCount}, Regs: ${deletedEmptyRegs.deletedCount})`);
    }

    // 1. ADMIN SETUP
    const adminEmail = (process.env.ADMIN_EMAIL || 'admin@codechefclub.com').toLowerCase().trim();
    const adminPassword = process.env.ADMIN_PASSWORD || 'CodeChef@123';

    let existingAdmin = await Admin.findOne({ email: adminEmail });
    if (existingAdmin) {
      // Check if password matches
      const isMatch = await existingAdmin.matchPassword(adminPassword);
      if (!isMatch) {
        existingAdmin.password = adminPassword; // Triggers pre-save bcrypt hash
        await existingAdmin.save();
        console.log(`Updated password for existing admin: ${adminEmail}`);
      } else {
        console.log(`Admin already verified and up-to-date: ${adminEmail}`);
      }
    } else {
      existingAdmin = await Admin.create({
        name: 'Club Lead Admin',
        email: adminEmail,
        password: adminPassword,
        role: 'superadmin',
      });
      console.log(`Created demo admin: ${existingAdmin.email}`);
    }

    // 2. EVENTS SEEDING (Deterministic upsert by slug)
    const seededEvents = [];
    for (const evData of sampleEvents) {
      const existing = await Event.findOne({ slug: evData.slug });
      if (!existing) {
        const created = await Event.create(evData);
        seededEvents.push(created);
      } else {
        // Update fields to keep it fresh
        Object.assign(existing, evData);
        await existing.save();
        seededEvents.push(existing);
      }
    }
    console.log(`Seeded/Updated ${seededEvents.length} events successfully.`);

    // 3. REGISTRATIONS SEEDING
    let createdRegsCount = 0;
    const targetEvents = seededEvents.slice(0, 4); // Distribute among first 4 events

    for (let i = 0; i < sampleRegistrations.length; i++) {
      const reg = sampleRegistrations[i];
      const targetEvent = targetEvents[i % targetEvents.length];

      const existingReg = await Registration.findOne({
        eventId: targetEvent._id,
        email: reg.email,
      });

      if (!existingReg) {
        await Registration.create({
          ...reg,
          eventId: targetEvent._id,
          ticketId: `CC-${targetEvent.code}-${Math.floor(100000 + Math.random() * 900000)}`,
        });
        createdRegsCount++;
      }
    }

    const totalAdmins = await Admin.countDocuments();
    const totalEvents = await Event.countDocuments();
    const totalRegistrations = await Registration.countDocuments();

    console.log('--- ATLAS SEED SUMMARY ---');
    console.log(`Total Admins: ${totalAdmins}`);
    console.log(`Total Events: ${totalEvents}`);
    console.log(`Total Registrations: ${totalRegistrations}`);
    console.log(`New Registrations added in this run: ${createdRegsCount}`);

    await mongoose.disconnect();
    return { totalAdmins, totalEvents, totalRegistrations };
  } catch (err) {
    console.error(`Atlas Seeding Failed: ${err.message}`);
    process.exit(1);
  }
};

// If run directly
if (process.argv[1] && process.argv[1].endsWith('seedAtlas.js')) {
  seedAtlas().then(() => process.exit(0));
}
