import { useState } from 'react';
import { gql, useMutation } from '@apollo/client';

const CREATE_TASK_QUERY = gql`
    mutation CreateTask($task: CreateTaskInput!) {
        createTask(task: $task) {
            title
        }
    }
`;

function Task() {
  const [showInput, setShotInput] = useState(false);
  const [createTask] = useMutation(CREATE_TASK_QUERY);
  const addTask = () => {
    setShotInput(!showInput); // input 다시 숨기기 위해서
  };
  const handleInputSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const taskInput = {
      title: formData.get('title'),
      userId: 1,
    };

    try {
      const { data } = await createTask({ variables: { task: taskInput } });
      console.log('Task created:', data);
    } catch (error) {
      console.error('Failed to create task:', error);
    }
  };

  return (
    <div className={Task.name}>
      <header className='Task-header'>
        <p>Tasks</p>
        <button onClick={addTask}>+</button>
      </header>
      {showInput && (<form onSubmit={handleInputSubmit}>
        <input type='text' name='title' />
      </form>)}
    </div>
  );
}

export default Task;
