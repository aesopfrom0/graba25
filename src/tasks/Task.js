import { useEffect, useState } from 'react';
import { createTask, getTasks, updateTask } from '../api/Graba-api';
import { isEqual } from 'lodash';
import ActiveTask from './ActiveTask';

function Task() {
  const [showInput, setShotInput] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [currentTaskId, setCurrentTaskId] = useState(null);

  useEffect(() => {
    async function fetchTasks() {
      try {
        const { data } = await getTasks();
        if (tasks.length !== data.length) {
          console.log(data);
          setTasks(data);
        } else {
          if (!isEqual(tasks, data)) {
            console.log(data);
            setTasks(data);
          }
        }
      } catch (error) {
        console.error('Failed to get tasks:', error);
      }
    }

    // Fetch tasks only when the component mounts (initial load)
    fetchTasks();
  }, [tasks]);

  useEffect(() => {
    if (tasks.length > 0 && !currentTaskId) {
      const curTask = tasks.find(task => task.isCurrentTask);
      console.log(curTask);
      curTask && setCurrentTaskId(curTask.id);
    }
  });

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

  const handleTaskFinish = async (taskId, event) => {
    event.stopPropagation();

    let isFinished;
    const updatedTasks = tasks.map(task => {
      if (task.id === taskId) {
        isFinished = !task.isFinished;
        return { ...task, isFinished };
      } else {
        return task;
      }
    });

    setTasks(updatedTasks);
    await updateTask(taskId, { isFinished });
  };

  async function handleSetCurrentTask(taskId) {
    if (taskId !== currentTaskId) {
      const prevTaskId = currentTaskId;
      setCurrentTaskId(taskId);

      const updatedTasks = tasks.map(task => {
        if (task.id === prevTaskId) {
          return { ...task, isCurrentTask: false };
        } else if (task.id === taskId) {
          return { ...task, isCurrentTask: true };
        } else {
          return task;
        }
      });

      setTasks(updatedTasks);
      await updateTask(prevTaskId, { isCurrentTask: false });
      await updateTask(taskId, { isCurrentTask: true });
    }
  }


  return (
    <div className={Task.name}>
      {currentTaskId && <ActiveTask {...tasks.find(task => task.id === currentTaskId)} />}
      <header className='Task-header'>
        <p>Tasks</p>
        <hr />
        <ul className='task-list'>
          {tasks.map(task => (
            <li key={task.id}
                className={`task-item ${task.isFinished ? 'finished' : ''} ${task.id === currentTaskId ? 'current-task' : ''}`}
                onClick={(event) => handleSetCurrentTask(task.id, event)}>
              <div
                className={`custom-checkbox ${task.isFinished ? 'finished' : ''}`}
                onClick={(event) => handleTaskFinish(task.id, event)}>{task.isFinished ? '✔️' : ''}
              </div>
              <span>{task.title}</span>
            </li>
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
