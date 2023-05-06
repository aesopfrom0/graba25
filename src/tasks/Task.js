import { useEffect, useState } from 'react';
import { createTask, getTasks } from '../api/Graba-api';

function Task() {
  const [showInput, setShotInput] = useState(false);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    async function fetchTasks() {
      try {
        const { data } = await getTasks();
        setTasks(data);
      } catch (error) {
        console.error('Failed to get tasks:', error);
      }
    }

    fetchTasks();
  }, []);

  const addTask = () => {
    setShotInput(!showInput); // input 다시 숨기기 위해서
  };
  const handleInputSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const taskInput = {
      title: formData.get('title'),
      userId: 1,
      estAttempts: +formData.get('est-attempts'),
      actAttempts: 0,
    };

    try {
      const { data } = await createTask(taskInput);
      console.log('Task created:', data);
      setShotInput(!showInput);
      setTasks([...tasks, data]);
    } catch (error) {
      console.error('Failed to create task:', error);
    }
  };

  return (
    <div className={Task.name}>
      <header className='Task-header'>
        <p>Tasks</p>
        <hr />
        <ul>
          {tasks.map(task => (
            <li key={task.id}>{task.title}</li>
          ))}
        </ul>
        <button onClick={addTask}>+</button>
      </header>
      {showInput && (<form onSubmit={handleInputSubmit}>
        <input type='text' name='title' placeholder='What are you working on?' />
        <br />
        <input type='number' name='est-attempts' defaultValue='1' />
        <br />
        <button type={'submit'}>Save</button>
      </form>)}
    </div>
  );
}

export default Task;
