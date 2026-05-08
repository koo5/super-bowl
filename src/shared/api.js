const axios = require('axios');

// Create axios instance with default headers
const axiosInstance = axios.create({
  headers: {
    'Content-Type': 'application/json'
  }
});

const getActors = () => {
  return axiosInstance.get('/actors').then(res => res.data.result.map(parseActor));
};

const parseActor = rawActor => {
  for (const arg of rawActor.args) {
    if (arg.type === undefined) {
      arg.type = 'empty';
    }
  }
  return {
    name: rawActor.name,
    priority: rawActor.priority,
    queueName: rawActor.queue_name,
    args: rawActor.args
  };
};

export default {
  getActors
};
