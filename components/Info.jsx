import './Info.css';

const Info = () => {
return (
    <div>
        <div className="personal-info">
            <h2>Author</h2>
            <p>Created by Jasu Ahonen</p>
            <p>2206645 / Software Engineering / Full Stack Dev / 5G00DM05-3008</p>
            <p>All the images used are created by the author and explicitly used for this application</p>
        </div>
            <div className='info-container'>
                <div className="instructions">
                    <h2>Short Instructions</h2>
                    <p>This is a task manager-app that can be used to track your time spent on different tasks</p>
                    <p>Click on "Home" and start a task. You can stop the task, take a short coffee-break and continue where you left off. </p>
                    <p>The time tracker doesn't zero unless the "delete timestamps"-button is pressed</p>
                    <p>You can navigate to "Manage Tasks & Tags" to control your current tasks and tags. Use that to add, delete and manage your task-elements.</p>
                </div>
                <div className="AI">
                    <h2>AI-tools used</h2>
                    <p>For this project I used an AI tool, specifically OpenAI's ChatGPT3.5 for help with the @media-queries to scale the application for different sized screens and to create the
                        pulsating gradient for ongoing tasks.
                    </p>
                </div>
                <div className="working-hours">
                    <h2>Working hours:</h2>
                    <p className='wh-as-hours'>45</p>
                </div>
                <div className="difficulty">
                    <h2>Most difficult part</h2>
                    <p>
                        For me, the most tedious part to implement was the communication between tasks and tags.
                        I had a problem when adding a new task, all the tags disappeared. Also the tracking of timestamps was
                        kind of a pickle. Overall the implementation of the data was somewhat tricky, since this was the first
                        time working with endpoint that correlate and are very much connected to each other.
                    </p>
                </div>
        </div>
    </div>
);
};

export default Info;