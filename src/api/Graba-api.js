import { GRABA25_API_INFO } from '../config/dev-config';
import axios from 'axios';

export async function createTask(dto) {
  try {
    const result = await axios.post(`${GRABA25_API_INFO.address}/tasks`, dto, null);
    return result;
  } catch (e) {
    console.log(e);
    return false;
  }
}

export async function getTasks() {
  try {
    const result = await axios.get(`${GRABA25_API_INFO.address}/tasks`, null);
    return result;
  } catch (e) {
    console.log(e);
    return false;
  }
}

export async function updateTask(taskId, isFinished) {
  try {
    const result = await axios.patch(`${GRABA25_API_INFO.address}/tasks/${taskId}`, { isFinished });
    return result;
  } catch (e) {
    console.log(e);
    return false;
  }
}
