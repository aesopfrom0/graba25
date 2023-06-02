function TaskDetail(task) {
  console.log(task);
  return (
    <div className='edit-task-box'>
      <p>{task.title ?? ''}</p>
      <p id='act-est-pomodoros'>Act/Est Pomodoros</p>
      <div className='task-number-input-box'>
        <input type='number' className='est-attempts-input-box' name='act-attempts' defaultValue={task.actAttempts} />
        <span>  /  </span>
        <input type='number' name='est-attempts' defaultValue={task.estAttempts} />
      </div>
      <div className='edit-task-detail-action-bar'>
        <button className='delete-btn'>Delete</button>
        <button className='cancel-btn'>Cancel</button>
        <button className='save-btn'>Save</button>
      </div>
    </div>
  );
}

export default TaskDetail;