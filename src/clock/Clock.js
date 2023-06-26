import { useEffect, useRef, useState } from 'react';
import { CLOCK_CONFIG } from '../config/config';
import clickSound from '../providers/sounds/click.mp3';
import alarmSound from '../providers/sounds/alarm-01.mp3';

function Clock({ onTimeup, activeTab, onSetActiveTab }) {
  const initialGivenSeconds = CLOCK_CONFIG.pomodoroIntervalSeconds;
  const breakSeconds = CLOCK_CONFIG.breakSeconds;
  const [isStarted, setIsStarted] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(initialGivenSeconds);
  const [showPopup, setShowPopup] = useState(false);

  let audioRef = useRef(null);

  const playAudio = async (audioFile) => {
    audioRef.current = new Audio(audioFile);
    await audioRef.current.play();
  };

  useEffect(() => {
    let timer;
    if (isStarted && timeRemaining > 0) {
      timer = setInterval(() => {
        setTimeRemaining((time) => time - 1);
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [isStarted, timeRemaining]);

  useEffect(() => {
    if (timeRemaining === 0) {
      switch (activeTab) {
        case 'pomodoro':
          setShowPopup(true);
          playAudio(alarmSound).then();
          setIsStarted(!isStarted);
          onTimeup();
          // change active tab
          onSetActiveTab('shortBreak');
          break;
        case 'shortBreak':
          setIsStarted(!isStarted);
          // change active tab
          onSetActiveTab('pomodoro');
      }
    }
  }, [timeRemaining]);

  useEffect(() => {
    switch (activeTab) {
      case 'pomodoro':
        setTimeRemaining(initialGivenSeconds);
        break;
      case 'shortBreak':
        setTimeRemaining(breakSeconds);
    }
  }, [activeTab]);

  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleStart = async () => {
    await playAudio(clickSound);
    setIsStarted(!isStarted);
  };

  const handleTabClick = (tab) => {
    onSetActiveTab(tab);
  };

  const handleTimeUp = async () => {
    switch (activeTab) {
      case 'pomodoro':
        setShowPopup(true);
        await playAudio(alarmSound);
        setTimeRemaining(initialGivenSeconds);
        setIsStarted(!isStarted);
        onTimeup();
        // change active tab
        onSetActiveTab('shortBreak');
        break;
      case 'shortBreak':
        setTimeRemaining(breakSeconds);
        setIsStarted(!isStarted);
        // change active tab
        onSetActiveTab('pomodoro');
    }
  };

  const handleFastForward = async () => {
    await playAudio(clickSound);
    setTimeRemaining(initialGivenSeconds);
    setIsStarted(!isStarted);
    onTimeup();
  };

  const handleConfirm = () => {
    // Stop the alarm sound (you need to implement this logic)
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    // Hide the pop-up message
    setShowPopup(false);
  };

  return (
    <div>
      {showPopup && (
        <div className="popup">
          <p>Time to take a break!</p>
          <button className="confirm-button" onClick={handleConfirm}>
            Ok
          </button>
        </div>
      )}

      <div className={`clock-${activeTab}`}>
        <header className="clock-header" id={`clock-header-${activeTab}`}>
          <a
            className={activeTab === 'pomodoro' ? 'pomodoro' : ''}
            onClick={() => handleTabClick('pomodoro')}
          >
            Pomodoro{' '}
          </a>
          <a
            className={activeTab === 'shortBreak' ? 'short-break' : ''}
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
          <button className="start-button" id={`start-button-${activeTab}`} onClick={handleStart}>
            <span className="start-button-text">{isStarted ? 'Pause' : 'Start'}</span>
            <span>{isStarted ? '🁢🁢' : '▶︎'}</span>
          </button>
          {isStarted && (
            <button
              className="fast-forward-button-icon"
              id={`fast-forward-button-${activeTab}`}
              onClick={handleFastForward}
            >
              ⇥
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Clock;
