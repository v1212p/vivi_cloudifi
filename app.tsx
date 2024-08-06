import React, { useState } from 'react';
import axios from 'axios';
import EnvironmentsTable from './components/EnvironmentsTable';
import AppDetailsTable from './components/AppDetailsTable';

const App: React.FC = () => {
    const [appid, setAppid] = useState('');
    const [environments, setEnvironments] = useState<string[]>([]);
    const [selectedEnvironment, setSelectedEnvironment] = useState('');
    const [appDetails, setAppDetails] = useState<any[]>([]);

    const fetchEnvironments = () => {
        axios.get(`http://127.0.0.1:5000/api/environments/${appid}`)
            .then(response => setEnvironments(response.data))
            .catch(error => console.error('Error fetching environments:', error));
    };

    const fetchAppDetails = (environment: string) => {
        axios.get(`http://127.0.0.1:5000/api/appdetails`, {
            params: { appid, environment }
        })
            .then(response => setAppDetails(response.data))
            .catch(error => console.error('Error fetching app details:', error));
    };

    return (
        <div>
            <input 
                type="text" 
                value={appid} 
                onChange={e => setAppid(e.target.value)} 
                placeholder="Enter App ID" 
            />
            <button onClick={fetchEnvironments}>Fetch Environments</button>
            <EnvironmentsTable 
                environments={environments} 
                onSelectEnvironment={env => {
                    setSelectedEnvironment(env);
                    fetchAppDetails(env);
                }}
            />
            {selectedEnvironment && <AppDetailsTable appDetails={appDetails} />}
        </div>
    );
};

export default App;
