import http from 'k6/http';

export default function () {
  const url = 'http://localhost:3000/reviews/71690';
  // const payload = JSON.stringify({
  //   email: 'johndoe@example.com',
  //   password: 'PASSWORD',
  // });
  const payload = {};

  // const params = {
  //   headers: {
  //     'Content-Type': 'application/json',
  //   },
  // };

  http.get(url);
}