import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faEllipsisV, faTrash } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';

function ClearTasks(onArchive) {
  const [showToolbox, setShowToolbox] = useState(false);

  const handleToolboxButton = () => {
    setShowToolbox(!showToolbox);
  };

  return (
    <div className="clear-tasks">
      <button className="toolbox-button" onClick={handleToolboxButton}>
        <FontAwesomeIcon icon={faEllipsisV} />
      </button>
      {showToolbox && (
        <div className="clear-tasks-tool-box">
          <div className="toolbox-item" onClick={() => onArchive(true)}>
            <span>
              <FontAwesomeIcon icon={faTrash} />
            </span>
            <span>Clear finished tasks</span>
          </div>
          <div className="toolbox-item">
            <span>
              <FontAwesomeIcon icon={faCheck} />
            </span>
            <span>Clear all tasks</span>
          </div>
        </div>
      )}
    </div>
  );
}

export default ClearTasks;
