const axios = require('axios');

// Create axios instance with default headers
const axiosInstance = axios.create({
  headers: {
    'Content-Type': 'application/json'
  }
});

const enqueueMessage = message => {
  return axiosInstance.post('/messages', formatMessage(message));
};

const formatMessage = message => {
  return {
    actor_name: message.actorName ? message.actorName : null,
    delay: message.delay ? message.delay : null,
    args: message.args ? message.args : null,
    kwargs: message.kwargs ? message.kwargs : null,
    options: message.options ? message.options : null
  };
};

const getOptions = () => {
  return axiosInstance.get('/options').then(res => res.data.options);
};

export default {
  enqueueMessage,
  getOptions
};
