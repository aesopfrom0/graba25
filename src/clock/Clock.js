import { useEffect, useState } from 'react';

function Clock() {
	const initialGivenSeconds = 5;
	const [isStarted, setIsStarted] = useState(false);
	const [timeRemaining, setTimeRemaining] = useState(initialGivenSeconds);

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

	const handleStart = (event) => {
		setIsStarted(true);
	};

	return (
		<div className={Clock.name}>
			<header className="Clock-header">
				<a>Pomodoro </a>
				<a>Short Break </a>
				<a>Long Break</a>
			</header>
			<p className="Clock-main">{formatTime(timeRemaining)}</p>
			<button onClick={handleStart}>Start</button>
		</div>
	);
}

export default Clock;
