import axios from 'axios';

const testRaceCondition = async () => {
  const url = 'http://localhost:3000/findusersversion'; // Replace with actual URL

  const requests = [];
  const concurrency = 10; // Number of concurrent requests

  for (let i = 0; i < concurrency; i++) {
    const payload = {
      username: 'Roshan5',
      password: `newpassword${i + 1}`,
    };
    requests.push(
      axios.post(url, payload).catch(error => {
        console.error(
          `Request ${i + 1} failed:`,
          error.response?.data || error.message,
        );
      }),
    );
  }

  const results = await Promise.all(requests);
  results.forEach((response, index) => {
    console.log(`Response ${index + 1}:`, response?.data || 'Failed');
  });
};

testRaceCondition();
