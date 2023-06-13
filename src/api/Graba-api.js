import { GRABA25_API_INFO } from '../config/dev-config';
import axios from 'axios';

export class GrabaApi {
  static async createTask(dto) {
    try {
      const result = await axios.post(`${GRABA25_API_INFO.address}/tasks`, dto, null);
      return result;
    } catch (e) {
      console.log(e);
      return false;
    }
  }

  static async getTasks() {
    try {
      const result = await axios.get(`${GRABA25_API_INFO.address}/tasks`, null);
      return result;
    } catch (e) {
      console.log(e);
      return false;
    }
  }

  static async updateTask(taskId, updateDto) {
    console.log(`[updateTask] taskId: ${taskId}`);
    try {
      const result = await axios.patch(`${GRABA25_API_INFO.address}/tasks/${taskId}`, updateDto);
      return result;
    } catch (e) {
      console.log(e);
      return false;
    }
  }

  static async archiveTasks(tasksToBeArchived) {
    try {
      const result = await axios.patch(
        `${GRABA25_API_INFO.address}/tasks/archive`,
        tasksToBeArchived,
      );
      return result;
    } catch (e) {
      console.log(e);
      return false;
    }
  }
}
