import { useState } from 'react';

function Task() {
	const [showInput, setShotInput] = useState(false);

	const addTask = () => {
		setShotInput(!showInput); // input 다시 숨기기 위해서
	};

	const handleInputChange = (event) => {};

	const handleInputSubmit = (event) => {
		event.preventDefault();
		//todo: 저장 요청
		setShotInput(false);
	};

	return (
		<div className={Task.name}>
			<header className="Task-header">
				<p>Tasks</p>
				<button onClick={addTask}>+</button>
			</header>
			{showInput && (
				<form onSubmit={handleInputSubmit}>
					<input type="text" onChange={handleInputChange} />
				</form>
			)}
		</div>
	);
}

export default Task;
