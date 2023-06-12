import './App.css';
import Clock from './clock/Clock';
import Task from './tasks/Task';
import { GrabaApi } from './api/Graba-api';
import { useEffect, useState } from 'react';
import { isEqual } from 'lodash';
import { CLOCK_CONFIG } from './config/dev-config';

function App() {
  const initialGivenSeconds = CLOCK_CONFIG.pomodoroIntervalSeconds;
  const [currentTask, setCurrentTask] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [activeTab, setActiveTab] = useState('pomodoro');

  const handleCurrentTask = (task) => {
    setCurrentTask(task);
  };

  const handleTimeUp = async () => {
    console.log('time is up.');
    setTasks(
      tasks.map((task) => {
        return task.id === currentTask.id ? { ...task, actAttempts: task.actAttempts + 1 } : task;
      }),
    );
    setCurrentTask({ ...currentTask, actAttempts: currentTask.actAttempts + 1 });
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

  const timeInfo = () => {
    const pomosInfo = tasks.reduce(
      (acc, cur) => ({
        actPomos: acc.actPomos + cur.actAttempts,
        estPomos: acc.estPomos + cur.estAttempts,
      }),
      { actPomos: 0, estPomos: 0 },
    );
    const duration = (pomosInfo.estPomos - pomosInfo.actPomos) * initialGivenSeconds * 1000; // milliseconds
    const estFinishAt = new Date(Date.now() + duration);

    return {
      ...pomosInfo,
      estFinishAt: `${estFinishAt.getHours()}:${estFinishAt.getMinutes()}`,
      duration: `(${(duration / (1000 * 60 * 60)).toFixed(1)}h)`,
    };
  };

  return (
    <div className='App' id={`app-${activeTab}`}>
      <header className='App-header'>
        {/*<img src={logo} className="App-logo" alt="logo" />*/}
        <p>GRABA 25</p>
        <div className='main-box'>
          <Clock onTimeup={handleTimeUp} activeTab={activeTab} onSetActiveTab={setActiveTab} />
          <Task
            tasks={tasks}
            onCurrentTask={handleCurrentTask}
            onSetTasks={handleSetTasks}
            onTimeInfo={timeInfo()}
            activeTab={activeTab}
          />
        </div>
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
