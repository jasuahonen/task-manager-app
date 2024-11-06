import { useEffect, useState } from 'react';
import './Home.css';

const API_BASE_URL = 'http://localhost:3010';

function Home() {
    // manage state for tasks, tags, loading, and error handling
    const [tasks, setTasks] = useState([]);
    const [tags, setTags] = useState([]);
    const [fetchError, setFetchError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // fetch tasks and tags when component mounts
    useEffect(() => {
        fetchData();
    }, []);

    // async function to load tasks and tags from the api
    const fetchData = async () => {
        setIsLoading(true); // set loading state
        try {
            const taskResponse = await fetch(`${API_BASE_URL}/tasks`);
            const tagResponse = await fetch(`${API_BASE_URL}/tags`);

            const tasks = await taskResponse.json();
            const tags = await tagResponse.json();

            setTasks(tasks);
            setTags(tags);
            setFetchError(null); // clear any previous error
        } catch (error) {
            console.error('Error fetching data:', error);
            setFetchError('Failed to load data.'); // show error message
        } finally {
            setIsLoading(false); // end loading state
        }
    };

    // delete all timestamps for a specific task
    const deleteTimestamps = async (taskId) => {
        try {
            const response = await fetch(`${API_BASE_URL}/timestamps`);
            if (!response.ok) throw new Error('Failed to fetch timestamps');

            const timestamps = await response.json();
            // filter timestamps related to the task
            const timestampsToDelete = timestamps.filter((timestamp) => timestamp.task === taskId);

            if (timestampsToDelete.length === 0) {
                console.log(`No timestamps found for task ID: ${taskId}`);
                return;
            }

            // delete each timestamp related to the task
            const deletePromises = timestampsToDelete.map((timestamp) => {
                return fetch(`${API_BASE_URL}/timestamps/${timestamp.id}`, {
                    method: 'DELETE',
                });
            });

            await Promise.all(deletePromises);
            console.log(`Deleted all timestamps for task ID: ${taskId}`);
            fetchData(); // refresh tasks and tags
        } catch (error) {
            console.error('Failed to delete timestamps:', error);
        }
    };

    // get tag names associated with a specific task
    const getTagNamesForTask = (tagIds) => {
        const tagIdArray = tagIds.split(',').map((id) => Number(id.trim()));
        return tags
            .filter((tag) => tagIdArray.includes(tag.id))
            .map((tag) => tag.name)
            .join(', ');
    };

    return (
        <div>
            <h2>Task List</h2>
            <p>Here you can use the task selector to start timers and track your progress.</p>
            <p>Go to "Manage Tasks & Tags"-tab to make changes to shown Tasks.</p>

            <div className='container'>
                {isLoading ? (
                    <p>Loading tasks and tags...</p>
                ) : (
                    <>
                        {fetchError && <p className="error">{fetchError}</p>}
                        {tasks.map((task) => (
                            <Task
                                key={task.id}
                                task={task}
                                getTagNames={getTagNamesForTask}
                                onDelete={deleteTimestamps}
                            />
                        ))}
                    </>
                )}
            </div>
        </div>
    );
}


function Task({ task, getTagNames, onDelete }) {
    // manage state for timer, elapsed time, and interval
    const [isTimerRunning, setIsTimerRunning] = useState(false);
    const [elapsedTime, setElapsedTime] = useState(0);
    const [timerInterval, setTimerInterval] = useState(null);

    // load timestamps and calculate elapsed time on component load
    useEffect(() => {
        const fetchTimestamps = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/timestamps`);
                if (!response.ok) throw new Error('Failed to fetch timestamps');

                const timestamps = await response.json();
                // filter timestamps related to the task
                const taskTimestamps = timestamps.filter(ts => ts.task === task.id);

                // calculate total elapsed time based on start and stop timestamps
                let totalElapsedTime = 0;
                let lastStartTime = null;

                taskTimestamps.forEach((ts) => {
                    if (ts.type === 0) {
                        lastStartTime = new Date(ts.timestamp).getTime();
                    } else if (ts.type === 1 && lastStartTime !== null) {
                        const endTime = new Date(ts.timestamp).getTime();
                        totalElapsedTime += endTime - lastStartTime;
                        lastStartTime = null;
                    }
                });

                // add ongoing time if timer is running
                if (lastStartTime !== null) {
                    totalElapsedTime += Date.now() - lastStartTime;
                }

                setElapsedTime(totalElapsedTime);
            } catch (error) {
                console.error('Error fetching timestamps:', error);
            }
        };

        fetchTimestamps();
    }, [task.id]);

    // start the timer and post a start timestamp to the api
    const startTimer = async () => {
        const timestamp = new Date().toISOString().slice(0, 19).replace('T', ' ');
        try {
            const response = await fetch(`${API_BASE_URL}/timestamps`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ timestamp, task: task.id, type: 0 }),
            });

            if (response.ok) {
                setIsTimerRunning(true); // set timer state
                const intervalId = setInterval(() => {
                    setElapsedTime(prevTime => prevTime + 1000);
                }, 1000);
                setTimerInterval(intervalId);
            } else {
                console.error('Failed to start timer');
            }
        } catch (error) {
            console.error('Error starting timer:', error);
        }
    };

    // stop the timer and post a stop timestamp to the api
    const stopTimer = async () => {
        const timestamp = new Date().toISOString().slice(0, 19).replace('T', ' ');
        try {
            const response = await fetch(`${API_BASE_URL}/timestamps`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ timestamp, task: task.id, type: 1 }),
            });

            if (response.ok) {
                setIsTimerRunning(false); // clear timer state
                clearInterval(timerInterval); // stop interval
            } else {
                console.error('Failed to stop timer');
            }
        } catch (error) {
            console.error('Error stopping timer:', error);
        }
    };

    // format elapsed time for display in hh:mm:ss
    const formatElapsedTime = (milliseconds) => {
        const totalSeconds = Math.floor(milliseconds / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        return `${hours}h ${minutes}m ${seconds}s`;
    };

    return (
        <div className={`task ${isTimerRunning ? 'running' : ''}`}>
            <h2>{task.name}</h2>
            <p>Tags: {getTagNames(task.tags)}</p>
            <p>Time Elapsed: {formatElapsedTime(elapsedTime)}</p>
            <button
                onClick={isTimerRunning ? stopTimer : startTimer}
                className={isTimerRunning ? 'stop-timer' : 'start-timer'}
            >
                {isTimerRunning ? 'Stop Timer' : 'Start Timer'}
            </button>
            <button onClick={() => onDelete(task.id)}>Delete Timestamps</button>
        </div>
    );
}

export default Home;
