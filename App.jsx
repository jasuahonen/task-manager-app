import { useState, useEffect } from 'react';
import './App.css';
import Home from './components/Home.jsx';
import Info from './components/Info.jsx';
import AddTask from './components/AddTask.jsx';


const App = () => {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    // Handle URL changes when the browser navigation buttons are used (back/forward)
    const onPopState = () => {
      setCurrentPath(window.location.pathname);
    };

    // Listen for the popstate event (which occurs on back/forward navigation)
    window.addEventListener('popstate', onPopState);

    return () => {
      // Cleanup listener on component unmount
      window.removeEventListener('popstate', onPopState);
    };
  }, []);

  // Custom function to navigate between "routes" by updating the URL
  const navigate = (path) => {
    window.history.pushState({}, '', path); // Update the browser's URL without reloading
    setCurrentPath(path);                   // Update the current path in state to trigger re-render
  };

  // Dynamically render different components based on the current path
  const renderRoute = () => {
    switch (currentPath) {
      case '/':
        return <Home />;
      case '/add-task':
        return <AddTask />;
      case '/info':
        return <Info />;
      default:
        return <h1>404 - Page Not Found</h1>;
    }
  };

  return (
    <div>
      <nav>
        <ul>
          <li><a href="/" onClick={(e) => { e.preventDefault(); navigate('/'); }}>Home</a></li>
          <li><a href="/info" onClick={(e) => { e.preventDefault(); navigate('/info'); }}>Info & Instructions</a></li>
          <li><a href="/add-task" onClick={(e) => { e.preventDefault(); navigate('/add-task'); }}>Manage Tasks & Tags</a></li>
        </ul>
      </nav>

      <div>
        {renderRoute()} {/* Render the component based on the path */}
      </div>
    </div>
  );
};

export default App;
