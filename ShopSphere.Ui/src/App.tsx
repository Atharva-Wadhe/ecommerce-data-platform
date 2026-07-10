import React from 'react';
import DashboardPage from './pages/DashboardPage';
import ChatWidget from './components/dashboard/ChatWidget';
import './index.css';

function App() {
    return (
        <div className="app-container">
            <DashboardPage />
            <ChatWidget />
        </div>
    );
}

export default App;
