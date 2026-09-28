// Comprehensive Production QA Test Suite
import assert from 'assert';

const BASE_URL = 'http://127.0.0.1:5000/api';

const results = {
  passed: 0,
  failed: 0,
  details: [],
};

const test = async (name, fn) => {
  try {
    await fn();
    results.passed++;
    results.details.push({ name, status: 'PASS' });
    console.log(`✅ PASS: ${name}`);
  } catch (err) {
    results.failed++;
    results.details.push({ name, status: 'FAIL', error: err.message });
    console.error(`❌ FAIL: ${name} -> ${err.message}`);
  }
};

const runSuite = async () => {
  console.log('====================================================');
  console.log('STARTING RIGOROUS PRODUCTION READINESS QA TEST SUITE');
  console.log('====================================================\n');

  let adminToken = null;
  let testEventId = null;
  let testEventSlug = null;
  let closedEventId = null;
  let fullEventId = null;

  // --- HEALTH CHECK ---
  await test('GET /api/health returns 200 and healthy DB status', async () => {
    const res = await fetch(`${BASE_URL}/health`);
    assert.strictEqual(res.status, 200);
    const body = await res.json();
    assert.strictEqual(body.success, true);
    assert.strictEqual(body.status, 'ok');
    assert.strictEqual(body.database, 'connected');
  });

  // --- PUBLIC EVENTS ---
  await test('GET /api/events returns event array with seatsLeft and registration counts', async () => {
    const res = await fetch(`${BASE_URL}/events`);
    assert.strictEqual(res.status, 200);
    const body = await res.json();
    assert.strictEqual(body.success, true);
    assert.ok(Array.isArray(body.data));
    assert.ok(body.data.length > 0);
    const first = body.data[0];
    assert.ok(first._id);
    assert.ok(typeof first.currentRegistrations === 'number');
    assert.ok(typeof first.seatsLeft === 'number');
    testEventId = first._id;
    testEventSlug = first.slug;
  });

  await test('GET /api/events/featured returns featured event', async () => {
    const res = await fetch(`${BASE_URL}/events/featured`);
    assert.strictEqual(res.status, 200);
    const body = await res.json();
    assert.strictEqual(body.success, true);
    assert.ok(body.data);
    assert.ok(body.data.title);
  });

  await test('GET /api/events/overview-stats returns stats', async () => {
    const res = await fetch(`${BASE_URL}/events/overview-stats`);
    assert.strictEqual(res.status, 200);
    const body = await res.json();
    assert.strictEqual(body.success, true);
    assert.ok(typeof body.data.totalEvents === 'number');
    assert.ok(typeof body.data.totalRegistrations === 'number');
  });

  await test('GET /api/events/:idOrSlug by ObjectId returns event details', async () => {
    const res = await fetch(`${BASE_URL}/events/${testEventId}`);
    assert.strictEqual(res.status, 200);
    const body = await res.json();
    assert.strictEqual(body.success, true);
    assert.strictEqual(body.data._id, testEventId);
  });

  await test('GET /api/events/:idOrSlug by Slug returns event details', async () => {
    const res = await fetch(`${BASE_URL}/events/${testEventSlug}`);
    assert.strictEqual(res.status, 200);
    const body = await res.json();
    assert.strictEqual(body.success, true);
    assert.strictEqual(body.data.slug, testEventSlug);
  });

  await test('GET /api/events/:idOrSlug with nonexistent identifier returns 404', async () => {
    const res = await fetch(`${BASE_URL}/events/000000000000000000000000`);
    assert.strictEqual(res.status, 404);
  });

  // --- ADMIN AUTHENTICATION ---
  await test('POST /api/admin/login with invalid password returns 401', async () => {
    const res = await fetch(`${BASE_URL}/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@codechefclub.com', password: 'wrongpassword' }),
    });
    assert.strictEqual(res.status, 401);
  });

  await test('POST /api/admin/login with valid credentials returns 200 and JWT', async () => {
    const res = await fetch(`${BASE_URL}/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@codechefclub.com', password: 'CodeChef@123' }),
    });
    assert.strictEqual(res.status, 200);
    const body = await res.json();
    assert.strictEqual(body.success, true);
    assert.ok(body.token);
    assert.strictEqual(body.admin.email, 'admin@codechefclub.com');
    assert.strictEqual(body.admin.password, undefined); // Password never leaked
    adminToken = body.token;
  });

  await test('GET /api/admin/me returns authenticated admin profile', async () => {
    const res = await fetch(`${BASE_URL}/admin/me`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert.strictEqual(res.status, 200);
    const body = await res.json();
    assert.strictEqual(body.success, true);
    assert.strictEqual(body.admin.email, 'admin@codechefclub.com');
  });

  await test('GET /api/admin/stats returns dashboard analytics', async () => {
    const res = await fetch(`${BASE_URL}/admin/stats`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert.strictEqual(res.status, 200);
    const body = await res.json();
    assert.strictEqual(body.success, true);
    assert.ok(body.data.metrics);
    assert.ok(Array.isArray(body.data.categoryBreakdown));
  });

  // --- AUTHORIZATION & SECURITY ---
  await test('POST /api/events without auth token returns 401', async () => {
    const res = await fetch(`${BASE_URL}/events`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: 'Unauthorized Event' }),
    });
    assert.strictEqual(res.status, 401);
  });

  await test('POST /api/events with malformed JWT returns 401', async () => {
    const res = await fetch(`${BASE_URL}/events`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer invalid.token.structure',
      },
      body: JSON.stringify({ title: 'Unauthorized Event' }),
    });
    assert.strictEqual(res.status, 401);
  });

  await test('DELETE /api/events/:id without auth token returns 401', async () => {
    const res = await fetch(`${BASE_URL}/events/${testEventId}`, {
      method: 'DELETE',
    });
    assert.strictEqual(res.status, 401);
  });

  // --- EVENT BUSINESS LOGIC ---
  await test('POST /api/events creates valid event with unique slug and code', async () => {
    const newEvent = {
      title: 'Algorithmic Blitz 2026',
      category: 'Competitive Programming',
      date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
      time: '11:00 AM - 02:00 PM',
      venue: 'Lab 101',
      description: 'A test contest for algorithmic speed and accuracy.',
      registrationDeadline: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000).toISOString(),
      maxParticipants: 50,
      featured: true,
    };

    const res = await fetch(`${BASE_URL}/events`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify(newEvent),
    });
    assert.strictEqual(res.status, 201);
    const body = await res.json();
    assert.strictEqual(body.success, true);
    assert.strictEqual(body.data.featured, true);
    testEventId = body.data._id;
  });

  await test('POST /api/events rejects registration deadline after event date (400)', async () => {
    const invalidEvent = {
      title: 'Invalid Date Contest',
      category: 'Competitive Programming',
      date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
      time: '10:00 AM',
      venue: 'Hall 1',
      description: 'Testing deadline validation',
      registrationDeadline: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toISOString(), // After event!
      maxParticipants: 50,
    };

    const res = await fetch(`${BASE_URL}/events`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify(invalidEvent),
    });
    assert.strictEqual(res.status, 400);
    const body = await res.json();
    assert.ok(body.message.includes('deadline'));
  });

  await test('POST /api/events rejects missing required fields (400)', async () => {
    const res = await fetch(`${BASE_URL}/events`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({ title: 'Only Title' }),
    });
    assert.strictEqual(res.status, 400);
  });

  await test('POST /api/events rejects invalid maxParticipants <= 0 (400)', async () => {
    const invalidEvent = {
      title: 'Zero Capacity Contest',
      category: 'Competitive Programming',
      date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
      time: '10:00 AM',
      venue: 'Hall 1',
      description: 'Testing capacity validation',
      registrationDeadline: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(),
      maxParticipants: 0,
    };

    const res = await fetch(`${BASE_URL}/events`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify(invalidEvent),
    });
    assert.strictEqual(res.status, 400);
  });

  await test('Featured event exclusivity: featuring event B unfeatures event A', async () => {
    // Create Event A as featured
    const eventA = await (
      await fetch(`${BASE_URL}/events`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({
          title: 'Featured Event Alpha',
          category: 'Hackathon',
          date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          time: '10:00 AM',
          venue: 'Campus',
          description: 'Alpha',
          registrationDeadline: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000).toISOString(),
          featured: true,
        }),
      })
    ).json();

    // Create Event B as featured
    const eventB = await (
      await fetch(`${BASE_URL}/events`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({
          title: 'Featured Event Beta',
          category: 'Hackathon',
          date: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000).toISOString(),
          time: '10:00 AM',
          venue: 'Campus',
          description: 'Beta',
          registrationDeadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          featured: true,
        }),
      })
    ).json();

    // Check Event A is no longer featured
    const checkA = await (await fetch(`${BASE_URL}/events/${eventA.data._id}`)).json();
    assert.strictEqual(checkA.data.featured, false);

    // Check Event B is featured
    const checkB = await (await fetch(`${BASE_URL}/events/${eventB.data._id}`)).json();
    assert.strictEqual(checkB.data.featured, true);

    // Clean up
    await fetch(`${BASE_URL}/events/${eventA.data._id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    await fetch(`${BASE_URL}/events/${eventB.data._id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${adminToken}` },
    });
  });

  // --- REGISTRATION BUSINESS LOGIC ---
  let testRegId = null;

  await test('POST /api/registrations with valid data returns 201 and ticket', async () => {
    const regPayload = {
      eventId: testEventId,
      name: 'Test Student QA',
      email: 'qa.student@testcollege.edu',
      college: 'ABES Engineering College',
      year: '3rd Year',
      phone: '+91 9998887776',
      branch: 'Computer Science',
      rollNumber: 'CS23B999',
    };

    const res = await fetch(`${BASE_URL}/registrations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(regPayload),
    });
    assert.strictEqual(res.status, 201);
    const body = await res.json();
    assert.strictEqual(body.success, true);
    assert.ok(body.data.registration.ticketId);
    testRegId = body.data.registration._id;
  });

  await test('POST /api/registrations duplicate email for same event returns 409', async () => {
    const duplicatePayload = {
      eventId: testEventId,
      name: 'Duplicate Attempt',
      email: 'qa.student@testcollege.edu', // Same email
      college: 'ABES Engineering College',
      year: '3rd Year',
      phone: '+91 9998887776',
    };

    const res = await fetch(`${BASE_URL}/registrations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(duplicatePayload),
    });
    assert.strictEqual(res.status, 409);
    const body = await res.json();
    assert.ok(body.message.includes('already registered'));
  });

  await test('POST /api/registrations with invalid email returns 400', async () => {
    const res = await fetch(`${BASE_URL}/registrations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        eventId: testEventId,
        name: 'Bad Email',
        email: 'not-an-email',
        college: 'ABES Engineering College',
        year: '1st Year',
        phone: '9876543210',
      }),
    });
    assert.strictEqual(res.status, 400);
  });

  await test('POST /api/registrations with invalid phone returns 400', async () => {
    const res = await fetch(`${BASE_URL}/registrations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        eventId: testEventId,
        name: 'Bad Phone',
        email: 'valid@college.edu',
        college: 'ABES Engineering College',
        year: '1st Year',
        phone: '123', // Too short
      }),
    });
    assert.strictEqual(res.status, 400);
  });

  await test('POST /api/registrations with invalid eventId format returns 400', async () => {
    const res = await fetch(`${BASE_URL}/registrations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        eventId: 'invalid-id-format',
        name: 'Bad EventId',
        email: 'valid2@college.edu',
        college: 'ABES Engineering College',
        year: '1st Year',
        phone: '9876543210',
      }),
    });
    assert.strictEqual(res.status, 400);
  });

  await test('POST /api/registrations with nonexistent eventId returns 404', async () => {
    const res = await fetch(`${BASE_URL}/registrations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        eventId: '000000000000000000000000',
        name: 'Nonexistent EventId',
        email: 'valid3@college.edu',
        college: 'ABES Engineering College',
        year: '1st Year',
        phone: '9876543210',
      }),
    });
    assert.strictEqual(res.status, 404);
  });

  // Create a Closed event and test registration rejection
  await test('POST /api/registrations for Closed event returns 400', async () => {
    const closedEvent = await (
      await fetch(`${BASE_URL}/events`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({
          title: 'Closed Contest Testing',
          category: 'Competitive Programming',
          date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
          time: '10:00 AM',
          venue: 'Room 1',
          description: 'Closed test',
          registrationDeadline: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(),
          status: 'Closed',
        }),
      })
    ).json();

    closedEventId = closedEvent.data._id;

    const res = await fetch(`${BASE_URL}/registrations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        eventId: closedEventId,
        name: 'Closed Tester',
        email: 'closed.tester@college.edu',
        college: 'ABES Engineering College',
        year: '1st Year',
        phone: '9876543210',
      }),
    });
    assert.strictEqual(res.status, 400);
    const body = await res.json();
    assert.ok(body.message.includes('closed'));
  });

  // Create a Full event (capacity 1) and test full event rejection
  await test('POST /api/registrations when event capacity reached returns 400', async () => {
    const singleCapEvent = await (
      await fetch(`${BASE_URL}/events`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({
          title: 'Single Seat Elite Workshop',
          category: 'Workshop',
          date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
          time: '10:00 AM',
          venue: 'Lab 1',
          description: 'Capacity 1 test',
          registrationDeadline: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(),
          maxParticipants: 1,
        }),
      })
    ).json();

    fullEventId = singleCapEvent.data._id;

    // Fill the 1 seat
    await fetch(`${BASE_URL}/registrations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        eventId: fullEventId,
        name: 'First Lucky Student',
        email: 'first.seat@college.edu',
        college: 'ABES Engineering College',
        year: '1st Year',
        phone: '9876543210',
      }),
    });

    // Try second registration
    const res = await fetch(`${BASE_URL}/registrations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        eventId: fullEventId,
        name: 'Second Unlucky Student',
        email: 'second.seat@college.edu',
        college: 'ABES Engineering College',
        year: '1st Year',
        phone: '9876543210',
      }),
    });
    assert.strictEqual(res.status, 400);
    const body = await res.json();
    assert.ok(body.message.includes('full') || body.message.includes('capacity'));
  });

  // --- ADMIN SEARCH AND REGISTRATION MANAGEMENT ---
  await test('GET /api/registrations search by special character (e.g. "+91") does not crash', async () => {
    const res = await fetch(`${BASE_URL}/registrations?search=+91`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert.strictEqual(res.status, 200);
    const body = await res.json();
    assert.strictEqual(body.success, true);
    assert.ok(Array.isArray(body.data));
  });

  await test('GET /api/registrations filter by year', async () => {
    const res = await fetch(`${BASE_URL}/registrations?year=3rd+Year`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert.strictEqual(res.status, 200);
    const body = await res.json();
    assert.strictEqual(body.success, true);
  });

  await test('GET /api/registrations/:id returns registration details', async () => {
    const res = await fetch(`${BASE_URL}/registrations/${testRegId}`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert.strictEqual(res.status, 200);
    const body = await res.json();
    assert.strictEqual(body.success, true);
    assert.strictEqual(body.data._id, testRegId);
  });

  await test('DELETE /api/registrations/:id cancels registration and frees seat', async () => {
    const res = await fetch(`${BASE_URL}/registrations/${testRegId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert.strictEqual(res.status, 200);
  });

  // --- CLEAN UP TEST EVENTS ---
  if (testEventId) {
    await fetch(`${BASE_URL}/events/${testEventId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${adminToken}` },
    });
  }
  if (closedEventId) {
    await fetch(`${BASE_URL}/events/${closedEventId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${adminToken}` },
    });
  }
  if (fullEventId) {
    await fetch(`${BASE_URL}/events/${fullEventId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${adminToken}` },
    });
  }

  // --- ERROR HANDLING & MALFORMED PAYLOADS ---
  await test('Request to nonexistent route returns 404', async () => {
    const res = await fetch(`${BASE_URL}/nonexistent-route-pointer`);
    assert.strictEqual(res.status, 404);
  });

  console.log('\n====================================================');
  console.log(`TEST SUITE COMPLETE: ${results.passed} PASSED, ${results.failed} FAILED`);
  console.log('====================================================');

  if (results.failed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
};

runSuite().catch((err) => {
  console.error('Fatal Test Suite Error:', err);
  process.exit(1);
});
