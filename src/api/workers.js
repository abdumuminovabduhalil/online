import axios from 'axios';

const BASE = 'http://localhost:3001/workers';

export const workerAPI = {
  getAll:   ()       => axios.get(BASE).then(r => r.data),
  create:   (data)   => axios.post(BASE, data).then(r => r.data),
  update:   (id, d)  => axios.patch(`${BASE}/${id}`, d).then(r => r.data),
  remove:   (id)     => axios.delete(`${BASE}/${id}`),
};
