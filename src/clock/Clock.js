import { useEffect, useState } from 'react';
import { CLOCK_CONFIG } from '../config/dev-config';

function Clock() {
  const initialGivenSeconds = CLOCK_CONFIG.pomodoroIntervalSeconds;
  const [isStarted, setIsStarted] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(initialGivenSeconds);
  const [activeTab, setActiveTab] = useState('pomodoro');

  useEffect(() => {
    let timer;
    if (isStarted && timeRemaining > 0) {
      timer = setInterval(() => {
        setTimeRemaining((time) => time - 1);
      }, 1000);
    }

    if (timeRemaining === 0) {
      setTimeRemaining(initialGivenSeconds);
      setIsStarted(false);
    }

    return () => clearInterval(timer);
  }, [isStarted, timeRemaining]);

  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleStart = () => {
    setIsStarted(true);
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className={Clock.name}>
      <header className='Clock-header'>
        <a
          className={activeTab === 'pomodoro' ? 'active' : ''}
          onClick={() => handleTabClick('pomodoro')}
        >
          Pomodoro{' '}
        </a>
        <a
          className={activeTab === 'shortBreak' ? 'active' : ''}
          onClick={() => handleTabClick('shortBreak')}
        >
          Short Break{' '}
        </a>
        <a
          className={activeTab === 'longBreak' ? 'active' : ''}
          onClick={() => handleTabClick('longBreak')}
        >
          Long Break
        </a>
      </header>
      <p className='Clock-main'>{formatTime(timeRemaining)}</p>
      <button onClick={handleStart}>Start</button>
    </div>
  );
}

export default Clock;
