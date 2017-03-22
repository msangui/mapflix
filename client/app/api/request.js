import Promise from 'promise';
import request from 'superagent';

const get = (url, query) => {
  return new Promise((resolve, reject) => {
    request.get(url)
      .query(query)
      .end((err, res) => {
        if (err) {
          reject(err);
        }

        resolve({data: res.body});
      });
  });
};

const post = (url, data) => {
  return new Promise((resolve, reject) => {
    request.post(url)
      .send(data)
      .end((err, res) => {
        if (err) {
          reject(err);
        }

        resolve({data: res.body});
      });
  });
};

export default {
  get,
  post
};
