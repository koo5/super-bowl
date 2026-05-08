import { parseMessages } from '@/messages/parsing';
import axiosInstance from '@/api/axios-config';

const getArgsKwargs = id => {
  const url = '/messages/states/' + id;
  return axiosInstance.get(url).then(res => parseArgs(res.data));
};

const parseArgs = rawMessage => {
  return {
    args: rawMessage.args,
    kwargs: rawMessage.kwargs,
    options: rawMessage.options
  };
};

const getMessages = args => {
  const url = '/messages/states';
  return axiosInstance
    .post(url, args)
    .then(res => ({ ...parseMessages(res.data.data), count: res.data.count }));
};

const cancelMessage = messageId => {
  return axiosInstance.post('/messages/cancel/' + messageId, {});
};

const requeue = messageId => {
  const url = '/messages/requeue/' + messageId;
  return axiosInstance.post(url, {});
};

const getResult = messageId => {
  const url = '/messages/result/' + messageId;
  return axiosInstance.get(url).then(res => res.data.result);
};

const cleanStates = args => {
  const url = '/messages/states/';
  return axiosInstance.delete(url, { data: args });
};

export default {
  cleanStates,
  getResult,
  requeue,
  getArgsKwargs,
  getMessages,
  cancelMessage
};
