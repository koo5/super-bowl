import api from '@/schedule/api';

const moduleSchedule = {
  state: {
    jobs: [],
    saveError: null
  },
  mutations: {
    setJobs(state, jobs) {
      state.jobs = jobs;
    },
    setError(state, error) {
      state.saveError = error;
    }
  },
  actions: {
    getJobs(context) {
      context.commit('setLoading', true);
      api.getJobs().then(jobs => {
        setTimeout(() => {
          context.commit('setLoading', false);
        }, 500);
        context.commit('setJobs', jobs);
      });
    },
    saveJobs(context, jobs) {
      context.commit('setLoading', true);
      api
        .updateJobs(jobs)
        .then(result => {
          context.commit('setJobs', result);
          setTimeout(() => {
            context.commit('setLoading', false);
          }, 500);
        })
        .catch(err => {
          const error = err.response.data.error.jobs;
          context.commit(
            'setError',
            'Invalid ' + Object.keys(error[Object.keys(error)[0]].value)[0]
          );
          setTimeout(() => {
            context.commit('setError', null);
          }, 3000);
          setTimeout(() => {
            context.commit('setLoading', false);
          }, 500);
        });
    }
  }
};

export default moduleSchedule;
