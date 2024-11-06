import { useEffect, useState } from "react";
import './AddTask.css';

const BASE_URL = "http://localhost:3010";

const AddTask = () => {
    const [tasks, setTasks] = useState([]);
    const [tags, setTags] = useState([]);
    const [newTaskName, setNewTaskName] = useState("");
    const [selectedTags, setSelectedTags] = useState([]);
    const [newTagName, setNewTagName] = useState("");

    // Fetch tasks and tags when the component mounts
    useEffect(() => {
        fetchTasks();
        fetchTags();
    }, []);

    // Fetch all tasks
    const fetchTasks = async () => {
        try {
            const response = await fetch(`${BASE_URL}/tasks`);
            const data = await response.json();
            setTasks(data);
        } catch (error) {
            console.error("Error fetching tasks:", error);
        }
    };

    // Fetch all tags
    const fetchTags = async () => {
        try {
            const response = await fetch(`${BASE_URL}/tags`);
            const data = await response.json();
            setTags(data);
        } catch (error) {
            console.error("Error fetching tags:", error);
        }
    };

    // Handle adding a new task
    const addTask = async () => {
        if (!newTaskName || selectedTags.length === 0) {
            alert("Please enter a task name and select at least one tag.");
            return;
        }

        const tagIds = selectedTags.join(",");

        try {
            const response = await fetch(`${BASE_URL}/tasks`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: newTaskName, tags: tagIds }),
            });
            if (response.ok) {
                setNewTaskName(""); // Clear input after adding
                setSelectedTags([]); // Clear selected tags
                fetchTasks(); // Refresh tasks
            }
        } catch (error) {
            console.error("Error adding task:", error);
        }
    };

    // Handle adding a new tag
    const addTag = async () => {
        if (!newTagName) {
            alert("Please enter a tag name.");
            return;
        }

        try {
            const response = await fetch(`${BASE_URL}/tags`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: newTagName }),
            });
            if (response.ok) {
                setNewTagName(""); // Clear input after adding
                fetchTags(); // Refresh tags
            }
        } catch (error) {
            console.error("Error adding tag:", error);
        }
    };

    // Handle modifying an existing task name
    const modifyTaskName = async (taskId, newName) => {
        if (!newName) {
            alert("Task name cannot be empty.");
            return;
        }

        try {
            const response = await fetch(`${BASE_URL}/tasks/${taskId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: newName }),
            });
            if (response.ok) {
                fetchTasks(); // Refresh tasks
            }
        } catch (error) {
            console.error("Error modifying task name:", error);
        }
    };

    // Handle modifying an existing tag name
    const modifyTagName = async (tagId, newName) => {
        if (!newName) {
            alert("Tag name cannot be empty.");
            return;
        }

        try {
            const response = await fetch(`${BASE_URL}/tags/${tagId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: newName }),
            });
            if (response.ok) {
                fetchTags(); // Refresh tags after
            }
        } catch (error) {
            console.error("Error modifying tag name:", error);
        }
    };

    // Handle deleting a task
    const deleteTask = async (taskId) => {
        try {
            const response = await fetch(`${BASE_URL}/tasks/${taskId}`, {
                method: "DELETE",
            });
            if (response.ok) {
                fetchTasks(); // Refresh tasks after deleting
            }
        } catch (error) {
            console.error("Error deleting task:", error);
        }
    };

    // Handle deleting a tag
    const deleteTag = async (tagId) => {
        try {
            const response = await fetch(`${BASE_URL}/tags/${tagId}`, {
                method: "DELETE",
            });
            if (response.ok) {
                fetchTags(); // Refresh tags after deleting
            }
        } catch (error) {
            console.error("Error deleting tag:", error);
        }
    };

    // Handle selecting/deselecting tags for the new task
    const handleTagSelection = (tagId) => {
        setSelectedTags((prevSelectedTags) =>
            prevSelectedTags.includes(tagId)
                ? prevSelectedTags.filter((id) => id !== tagId)
                : [...prevSelectedTags, tagId]
        );
    };

    return (
        <div>
            <h1>Task Manager</h1>

            <div className="add-task-container">
                {/* Display Current Tasks */}
                <div className="tasks">
                    <h2>Tasks</h2>
                    <ul>
                        {tasks.map((task) => (
                            <li key={task.id}>
                                <input
                                    type="text"
                                    defaultValue={task.name}
                                    onBlur={(e) => modifyTaskName(task.id, e.target.value)}
                                />
                                <button className="delete-task-button" onClick={() => deleteTask(task.id)}>Delete Task</button>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Display Current Tags */}
                <div className="tags">
                    <h2>Tags</h2>
                    <span>You can also edit tags by modifying the tag-name in the text field</span>
                    <ul>
                        {tags.map((tag) => (
                            <li key={tag.id}>
                                <input
                                    type="text"
                                    defaultValue={tag.name}
                                    onBlur={(e) => modifyTagName(tag.id, e.target.value)}
                                />
                                <button className="delete-tag-button" onClick={() => deleteTag(tag.id)}>Delete Tag</button>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Add New Task Form */}
                <div className="addTasks">
                    <h2>Add New Task</h2>
                    <label>
                        Task Name:
                        <input
                            type="text"
                            value={newTaskName}
                            onChange={(e) => setNewTaskName(e.target.value)}
                            placeholder="Enter task name"
                        />
                    </label>
                    <h3>Select existing tags</h3>
                    {tags.map((tag) => (
                        <div key={tag.id}>
                            <label>
                                <input
                                    type="checkbox"
                                    checked={selectedTags.includes(tag.id)}
                                    onChange={() => handleTagSelection(tag.id)}
                                />
                                {tag.name}
                            </label>
                        </div>
                    ))}
                    <br></br>
                    <button className="add-a-task" onClick={addTask}>Add Task</button>
                </div>

                {/* Add New Tag Form */}
                <div className="addTags">
                    <h2>Add New Tag</h2>
                    <label>
                        Tag Name:
                        <input
                            type="text"
                            value={newTagName}
                            onChange={(e) => setNewTagName(e.target.value)}
                            placeholder="Enter tag name"
                        />
                    </label>
                    <button className="add-a-tag" onClick={addTag}>Add Tag</button>
                </div>
            </div>
        </div>
    );
};

export default AddTask;
