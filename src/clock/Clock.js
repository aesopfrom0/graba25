import { useEffect, useState } from 'react';
import { CLOCK_CONFIG } from '../config/dev-config';

function Clock({ onTimeup }) {
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
      handleTimeUp();
    }

    return () => clearInterval(timer);
  }, [isStarted, timeRemaining]);

  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleStart = () => {
    setIsStarted(!isStarted);
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const handleTimeUp = () => {
    setTimeRemaining(initialGivenSeconds);
    setIsStarted(!isStarted);
    onTimeup();
  };

  return (
    <div className="clock">
      <header className="clock-header">
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
      <p className="clock-main">{formatTime(timeRemaining)}</p>
      <div className="clock-action">
        <button className="start-button" onClick={handleStart}>
          <span className="start-button-text">{isStarted ? 'Pause' : 'Start'}</span>
          <span>{isStarted ? '🁢🁢' : '▶︎'}</span>
        </button>
        {isStarted && (
          <button className="fast-forward-button-icon" onClick={handleTimeUp}>
            ⇥
          </button>
        )}
      </div>
    </div>
  );
}

export default Clock;
