import "./Task.scss";

export const Task = ({ task }) => {
  return (
    <div className="Task-container">
      <div className="task-details">
        <h1>{task.title}</h1>
        <p>{task.description}</p>
      </div>
      <a href={task.link} target="_blank">
        {task.actionText}
      </a>
    </div>
  );
};

export default Task;
