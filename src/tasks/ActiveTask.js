function ActiveTask({ task }) {
  return (
    <div className='current-task-detail'>
      <p>#{task ? task.actAttempts + 1 : 0}</p>
      <p>{task?.title ?? 'Time to focus'}</p>
    </div>
  );
}

export default ActiveTask;