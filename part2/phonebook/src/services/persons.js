/* eslint-disable import/no-anonymous-default-export */
import axios from "axios";
const baseUrl = "http://localhost:3001/api/persons";

const getAll = () => {
  // returns all data
  const request = axios.get(baseUrl);
  return request.then((response) => response.data);
};

const create = (newObject) => {
  // returns newObject with automatically assigned 'id' attribute
  const request = axios.post(baseUrl, newObject);
  return request.then((response) => response.data);
};

const remove = (id) => {
  const request = axios.delete(`${baseUrl}/${id}`);
  return request.then((response) => response);
};

const update = (id, newObject) => {
  // updates and returns newObject with the given 'id' attribute
  const request = axios.put(`${baseUrl}/${id}`, newObject);
  return request.then((response) => response.data);
};

export default { getAll, create, remove, update };
