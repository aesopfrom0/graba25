function ActiveTask(task) {
  return (
    <div className='current-task-detail'>
      <p>#{task.actAttempts + 1}</p>
      <p>{task.title}</p>
    </div>
  );
}

export default ActiveTask;