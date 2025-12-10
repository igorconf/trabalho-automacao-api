import http from 'k6/http';
import { check, group, sleep } from 'k6';
import { Trend, Counter } from 'k6/metrics';
import { SharedArray } from 'k6/data';
import { randomUsername, randomPassword, fakerName } from './helpers.js';

// Load fixture data once and share between VUs
const users = new SharedArray('users', function () {
  return JSON.parse(open('./data/users.json'));
});

// Metrics
const loginTrend = new Trend('login_duration');
const rateTrend = new Trend('rate_duration');
const successfulLogins = new Counter('successful_logins');

export const options = {
  stages: [
    { duration: '10s', target: 5 },
    { duration: '20s', target: 10 },
    { duration: '10s', target: 0 },
  ],
  thresholds: {
    // At least 95% of requests should pass the defined checks
    'checks': ['rate>0.95'],
    // Average HTTP request duration should be less than 1s
    'http_req_duration': ['p(95)<1000'],
  },
};

// Base URL from environment variable
const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';

export default function () {
  // Pick a random fixture user (data-driven)
  const fixture = users[Math.floor(Math.random() * users.length)];
  let token = null;

  group('Auth - Register/Login/Reuse Token', function () {
    // Reuse response: try to register (may fail if already exists), then login and reuse token
    const registerRes = http.post(`${BASE_URL}/register`, JSON.stringify({ username: fixture.username, password: fixture.password }), { headers: { 'Content-Type': 'application/json' } });

    const loginStart = Date.now();
    const loginRes = http.post(`${BASE_URL}/login`, JSON.stringify({ username: fixture.username, password: fixture.password }), { headers: { 'Content-Type': 'application/json' } });
    loginTrend.add(Date.now() - loginStart);

    const loginCheck = check(loginRes, {
      'login status 200': (r) => r.status === 200,
      'login has token': (r) => r.json('token') !== undefined,
    });

    if (loginCheck) {
      successfulLogins.add(1);
      token = loginRes.json('token');
    }
  });

  group('Get Users', function () {
    if (!token) {
      // fail early if no token
      check(null, { 'skipped due to no token': () => false });
    } else {
      const usersRes = http.get(`${BASE_URL}/users`, { headers: { Authorization: `Bearer ${token}` } });
      check(usersRes, {
        'get users status 200': (r) => r.status === 200,
        'response is array': (r) => Array.isArray(r.json())
      });
    }
  });

  group('Rate User Data Driven', function () {
    // Data-driven: select random target
    const toUser = fakerName();
    const fromUser = fixture.username;
    const payload = { fromUsername: fromUser, toUsername: toUser, score: Math.floor(Math.random() * 5) + 1 };

    const rateStart = Date.now();
    const rateRes = http.post(`${BASE_URL}/rate`, JSON.stringify(payload), { headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` } });
    rateTrend.add(Date.now() - rateStart);

    check(rateRes, {
      'rate status 201 or 404 or 400': (r) => [201, 404, 400].includes(r.status),
    });
  });

  sleep(1);
}
