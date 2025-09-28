import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  scenarios: {
    stress_request_rate: {
      executor: 'constant-arrival-rate',
      rate: 7000,
      timeUnit: '1s',
      duration: '1m',
      preAllocatedVUs: 500,
      maxVUs: 25000,
    },
  },
};

export default function getQuestions() {
  const res = http.get('http://localhost:3001/qa/questions/:product_id', {
    product_id: 71699
  });

  check(res, {
    'status was 200': (r) => r.status == 200
  });

  sleep(1);
};

