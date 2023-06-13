import { useEffect, useState } from 'react';
import ActiveTask from './ActiveTask';
import TaskDetail from './TaskDetail';
import { GrabaApi } from '../api/Graba-api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisV } from '@fortawesome/free-solid-svg-icons';
import ClearTask from './ClearTask';

function Task({ tasks, onCurrentTask, onSetTasks, onTimeInfo, activeTab }) {
  const [showInput, setShotInput] = useState(false);
  const [currentTaskId, setCurrentTaskId] = useState(null);
  const [taskIdToShowDetail, setTaskIdToShowDetail] = useState(null);

  useEffect(() => {
    if (tasks.length > 0 && !currentTaskId) {
      const curTask = tasks.find((task) => task.isCurrentTask) ?? tasks[0];
      GrabaApi.updateTask(curTask.id, { isCurrentTask: true })
        .then()
        .catch((e) => console.log(e));
      curTask && setCurrentTaskId(curTask.id);
    }
  });

  useEffect(() => {
    onCurrentTask(tasks.find((task) => task.id === currentTaskId));
  }, [currentTaskId]);

  const addTask = () => {
    setShotInput(!showInput); // input 다시 숨기기 위해서
  };
  const handleInputSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const taskInput = {
      title: formData.get('title'),
      userId: 1,
      estAttempts: +formData.get('est-attempts'),
      actAttempts: 0,
    };

    try {
      const { data } = await GrabaApi.createTask(taskInput);
      console.log('Task created:', data.message);
      if (data.ok) {
        setShotInput(!showInput);
        onSetTasks([...tasks, { ...taskInput, id: data.message }]);
      }
    } catch (error) {
      console.error('Failed to create task:', error);
    }
  };

  const handleTaskFinish = async (taskId, event) => {
    event.stopPropagation();

    let isFinished;
    const updatedTasks = tasks.map((task) => {
      if (task.id === taskId) {
        isFinished = !task.isFinished;
        return { ...task, isFinished };
      } else {
        return task;
      }
    });

    onSetTasks(updatedTasks);
    await GrabaApi.updateTask(taskId, { isFinished });
  };

  async function handleSetCurrentTask(taskId) {
    if (taskId === currentTaskId) {
      return;
    }
    const prevTaskId = currentTaskId;
    console.log(`prevTaskId: ${prevTaskId}`);
    setCurrentTaskId(taskId);

    const updatedTasks = tasks.map((task) => {
      if (task.id === prevTaskId) {
        return { ...task, isCurrentTask: false };
      } else if (task.id === taskId) {
        return { ...task, isCurrentTask: true };
      } else {
        return task;
      }
    });

    onSetTasks(updatedTasks);
    prevTaskId && (await GrabaApi.updateTask(prevTaskId, { isCurrentTask: false }));
    await GrabaApi.updateTask(taskId, { isCurrentTask: true });
  }

  async function handleShowTaskDetail(taskId, event) {
    event.stopPropagation();
    taskIdToShowDetail ? setTaskIdToShowDetail(null) : setTaskIdToShowDetail(taskId);
  }

  async function handleDeleteTask(taskId) {
    setTaskIdToShowDetail(null);
    onSetTasks(tasks.filter((task) => task.id !== taskId));

    // target new current task id
    tasks.length === 0 && setCurrentTaskId(null);
    if (currentTaskId === taskId) {
      setCurrentTaskId(tasks.find((task) => !task.isFinished).id);
    }
    await GrabaApi.updateTask(taskId, { isArchived: true });
  }

  async function handleCancelTask() {
    setTaskIdToShowDetail(null);
  }

  async function handleUpdateTask(taskId, event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    const taskInput = {
      title: formData.get('title'),
      estAttempts: +formData.get('est-attempts'),
      actAttempts: +formData.get('act-attempts'),
    };
    if (
      isNeccessaryUpdate(
        taskInput,
        tasks.find((task) => task.id === taskId),
      )
    ) {
      const updatedTasks = tasks.map((task) => {
        if (task.id === taskId) {
          return { ...task, ...taskInput };
        } else {
          return task;
        }
      });
      onSetTasks([...updatedTasks]);
    }
    await GrabaApi.updateTask(taskId, taskInput);
    setTaskIdToShowDetail(null);
  }

  async function archiveTasks(isFinished = true) {
    console.log(`isFinished: ${isFinished}`);
    const newTasks = isFinished
      ? tasks.map((task) => {
          return task.isFinished ? { ...task, isArchived: true } : task;
        })
      : tasks.map((task) => ({ ...task, isArchived: true }));
    const tasksToBeShown = [];
    const tasksToBeArchived = [];
    newTasks.forEach((task) => {
      if (task.isArchived) {
        if (task.isCurrentTask) {
          tasksToBeArchived.push({
            id: task.id,
            isArchived: task.isArchived,
            isCurrentTask: false,
          });
        } else {
          tasksToBeArchived.push({ id: task.id, isArchived: task.isArchived });
        }
      } else {
        tasksToBeShown.push(task);
      }
    });
    setCurrentTaskId(tasksToBeShown[0]?.id ?? null);
    onSetTasks(tasksToBeShown);
    await GrabaApi.archiveTasks(tasksToBeArchived);
  }

  async function handleCancelAddingTask() {
    setShotInput(!setShotInput);
  }

  return (
    <div className="task" id={`task-${activeTab}`}>
      <ActiveTask task={currentTaskId ? tasks.find((task) => task.id === currentTaskId) : null} />
      <header className="task-header">
        <span>Tasks</span>
        <ClearTask onArchive={archiveTasks} />
      </header>
      <hr />
      <ul className="task-list">
        {tasks.map((task) => {
          return task.id === taskIdToShowDetail ? (
            <TaskDetail
              key={task.id}
              task={task}
              onDelete={handleDeleteTask}
              onCancel={handleCancelTask}
              onUpdate={handleUpdateTask}
            />
          ) : (
            <li
              key={task.id}
              className={`task-item ${task.isFinished ? 'finished' : ''} ${
                task.id === currentTaskId ? 'current-task' : ''
              }`}
              onClick={(event) => handleSetCurrentTask(task.id, event)}
            >
              <div
                className={`custom-checkbox ${task.isFinished ? 'finished' : ''}`}
                onClick={(event) => handleTaskFinish(task.id, event)}
              >
                {task.isFinished ? '✔️' : ''}
              </div>
              <div className="task-info">
                <span>
                  {task.title.length > 36 ? task.title.slice(0, 36).concat('...') : task.title}{' '}
                </span>
                <div className="attempts-number">
                  {task.actAttempts}/{task.estAttempts}
                </div>
              </div>
              <button
                className="toolbox-button"
                onClick={(event) => handleShowTaskDetail(task.id, event)}
              >
                <FontAwesomeIcon icon={faEllipsisV} />
              </button>
            </li>
          );
        })}
        {showInput ? (
          <div className="task-detail">
            <form className="edit-task-box" onSubmit={(event) => handleInputSubmit(event)}>
              <input type="text" name="title" placeholder="What are you working on?" />
              <br />
              <p id="est-pomodoros">Est Pomodoros</p>
              <div className="task-number-input-box">
                <input
                  type="number"
                  className="est-attempts-input-box"
                  name="est-attempts"
                  defaultValue="1"
                />
              </div>
              <br />
              <div className="edit-task-detail-action-bar">
                <button className="delete-btn"></button>
                <button className="cancel-btn" onClick={handleCancelAddingTask}>
                  Cancel
                </button>
                <button className="save-btn" type="submit">
                  Save
                </button>
              </div>
            </form>
          </div>
        ) : (
          <button className="add-task-btn" id={`add-task-btn-${activeTab}`} onClick={addTask}>
            ➕ Add Task
          </button>
        )}
      </ul>
      <div className="time-info">
        <div>
          <span>Pomos: </span>
          <span className="number">{onTimeInfo.actAttempts ?? 0}</span>
          <span>/</span>
          <span className="number">{onTimeInfo.estAttempts ?? 0}</span>
          <span>Finish At: </span>
          <span className="number">{onTimeInfo.estFinishAt ?? '--:--'}</span>
          <span>{onTimeInfo.duration ?? '(0h)'}</span>
        </div>
      </div>
    </div>
  );
}

function isNeccessaryUpdate(updateDto, task) {
  for (const [key, value] of Object.entries(updateDto)) {
    if (task[key] !== value) {
      return true;
    }
  }
  return false;
}

export default Task;
