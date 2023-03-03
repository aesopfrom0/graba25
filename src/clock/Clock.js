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
		}

		return () => clearInterval(timer);
	}, [isStarted, timeRemaining]);

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
			<p className="Clock-main">{timeRemaining}</p>
			<button onClick={handleStart}>Start</button>
		</div>
	);
}

export default Clock;
