import './App.css';
import Clock from './clock/Clock';
import Task from './tasks/Task';
import { GrabaApi } from './api/Graba-api';
import { useEffect, useState } from 'react';
import { isEqual } from 'lodash';

function App() {
  const [currentTask, setCurrentTask] = useState(null);
  const [tasks, setTasks] = useState([]);

  const handleCurrentTask = (task) => {
    setCurrentTask(task);
  };

  const handleTimeUp = async () => {
    console.log('time is up.');
    setTasks(tasks.map(task => {
      return task.id === currentTask.id ? { ...task, actAttempts: task.actAttempts + 1 } : task;
    }));
    await GrabaApi.updateTask(currentTask.id, { actAttempts: currentTask.actAttempts + 1 });
  };

  const handleSetTasks = (tasks) => {
    setTasks(tasks);
  };

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

  return (
    <div className='App'>
      <header className='App-header'>
        {/*<img src={logo} className="App-logo" alt="logo" />*/}
        <p>GRABA 25</p>
        <Clock onTimeup={handleTimeUp} />
        <Task tasks={tasks} onCurrentTask={handleCurrentTask} onSetTasks={handleSetTasks} />
        <a
          className='App-link'
          href='https://aesop.oopy.io'
          target='_blank'
          rel='noopener noreferrer'
        >
          개발자 블로그
        </a>
      </header>
    </div>
  );
}

export default App;
