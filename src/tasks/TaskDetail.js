function TaskDetail({ task, onDelete, onCancel, onUpdate }) {
  console.log(task);
  return (
    <div className='edit-task-box'>
      <form onSubmit={(event) => onUpdate(task.id, event)}>
        <input type='text' name='title' defaultValue={task.title ?? ''} />
        <p id='act-est-pomodoros'>Act/Est Pomodoros</p>
        <div className='task-number-input-box'>
          <input type='number' className='est-attempts-input-box' name='act-attempts' defaultValue={task.actAttempts} />
          <span>  /  </span>
          <input type='number' name='est-attempts' defaultValue={task.estAttempts} />
        </div>
        <div className='edit-task-detail-action-bar'>
          <button className='delete-btn' onClick={() => onDelete(task.id)}>Delete</button>
          <button className='cancel-btn' onClick={onCancel}>Cancel</button>
          <button className='save-btn' type='submit'>Save</button>
        </div>
      </form>
    </div>
  );
}

export default TaskDetail;