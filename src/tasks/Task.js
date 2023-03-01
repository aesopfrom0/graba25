function Task() {
    const addTask = () => {
        console.log('input 창 생겨야함');
    }

    return (
        <div className={Task.name}>
            <header className="Task-header">
                <p>Tasks</p>
                <button onClick={addTask}>+</button>
            </header>
        </div>
    )
}

export default Task;