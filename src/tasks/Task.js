import { useEffect, useState } from 'react';

import { isEqual } from 'lodash';
import ActiveTask from './ActiveTask';
import TaskDetail from './TaskDetail';
import { GrabaApi } from '../api/Graba-api';

function Task() {
  const [showInput, setShotInput] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [currentTaskId, setCurrentTaskId] = useState(null);
  const [taskIdToShowDetail, setTaskIdToShowDetail] = useState(null);

  useEffect(() => {
    async function fetchTasks() {
      try {
        const { data } = await GrabaApi.getTasks();
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
  }, []);

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
      const { data } = await GrabaApi.createTask(taskInput);
      console.log('Task created:', data.message);
      if (data.ok) {
        setShotInput(!showInput);
        setTasks([...tasks, { ...taskInput, id: data.message }]);
      }
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
    await GrabaApi.updateTask(taskId, { isFinished });
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
      await GrabaApi.updateTask(prevTaskId, { isCurrentTask: false });
      await GrabaApi.updateTask(taskId, { isCurrentTask: true });
    }
  }

  async function handleShowTaskDetail(taskId, event) {
    event.stopPropagation();
    taskIdToShowDetail ? setTaskIdToShowDetail(null) : setTaskIdToShowDetail(taskId);
  }

  async function handleDeleteTask(taskId) {
    setTaskIdToShowDetail(null);
    setTasks(tasks.filter(task => task.id !== taskId));

    // target new current task id
    (tasks.length) === 0 && setCurrentTaskId(null);
    if (currentTaskId === taskId) {
      setCurrentTaskId(tasks.find(task => !task.isFinished).id);
    }
    await GrabaApi.updateTask(taskId, { isArchived: true });
  }

  async function handleCancelTask() {
    setTaskIdToShowDetail(null);
  }

  async function handleUpdateTask(taskId, event) {
    const formData = new FormData(event.target);
    console.log(formData);
    const taskInput = {};
    formData.get('title') && (taskInput.title = formData.get('title'));
    formData.get('est-attempts') && (taskInput.estAttempts = +formData.get('est-attempts'));
    formData.get('act-attempts') && (taskInput.actAttempts = +formData.get('act-attempts'));
    if (isNeccessaryUpdate(taskInput, tasks.find(task => task.id = taskId))) {
      const updatedTasks = tasks.map(task => {
        if (task.id === taskId) {
          return { ...task, ...taskInput };
        } else {
          return task;
        }
      });
      setTasks(updatedTasks);
      await GrabaApi.updateTask(taskId, taskInput);
    }
    setTaskIdToShowDetail(null);
  }


  return (
    <div className='task'>
      {currentTaskId && <ActiveTask {...tasks.find(task => task.id === currentTaskId)} />}
      <header className='task-header'>
        <span>Tasks</span>
        <hr />
      </header>
      <ul className='task-list'>
        {tasks.map(task => {
            return task.id === taskIdToShowDetail ?
              <TaskDetail key={task.id} task={task} onDelete={handleDeleteTask} onCancel={handleCancelTask}
                          onUpdate={handleUpdateTask} /> :
              (
                <li key={task.id}
                    className={`task-item ${task.isFinished ? 'finished' : ''} ${task.id === currentTaskId ? 'current-task' : ''}`}
                    onClick={(event) => handleSetCurrentTask(task.id, event)}>
                  <div
                    className={`custom-checkbox ${task.isFinished ? 'finished' : ''}`}
                    onClick={(event) => handleTaskFinish(task.id, event)}>{task.isFinished ? '✔️' : ''}
                  </div>
                  <div className='task-info'>
                    <span>{task.title.length > 32 ? task.title.slice(0, 32).concat('...') : task.title}</span>
                    <div className='attempts-number'>{task.actAttempts}/{task.estAttempts}</div>
                  </div>
                  <button onClick={(event) => handleShowTaskDetail(task.id, event)}>•••</button>
                </li>
              );
          },
        )}
        <button onClick={addTask}>➕ Add Task</button>
      </ul>
      {showInput && (<form className='edit-task-box' onSubmit={(event) => handleInputSubmit(event)}>
        <input type='text' name='title' placeholder='What are you working on?' />
        <br />
        <input type='number' name='est-attempts' defaultValue='1' />
        <br />
        <button type='submit'>Save</button>
      </form>)}
    </div>
  );
}

function isNeccessaryUpdate(updateDto, task) {
  console.log('-----------------------');
  console.log(task);
  console.log('-----------------------');
  for (const [key, value] of updateDto.entries()) {
    if (task[key] !== value) {
      return false;
    }
  }
  return true;
}

export default Task;
