import React, { useState, useEffect } from 'react';
import './App.css';

interface DataRow {
  [key: string]: string;
}

const App: React.FC = () => {
  const [data, setData] = useState<DataRow[]>([]);
  const [appids, setAppids] = useState<string>('');
  const [filteredEnvironments, setFilteredEnvironments] = useState<string[]>([]);
  const [expandedEnvironment, setExpandedEnvironment] = useState<string | null>(null);
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    console.log('fetchData called');
    try {
      const response = await fetch('/src/assets/vaish.csv');
      
      if (!response.ok) {
        console.log('Network response was not ok');
        return;
      }

      const text = await response.text();
      const rows = text.split('\n').map(row => row.split(','));
      
      // Log the first row of the CSV file
      if (rows.length > 0) {
        console.log('First row:', rows[0]);
      }

      const headers = rows[0];
      const dataRows = rows.slice(1).map(row => {
        const rowData: DataRow = {};
        headers.forEach((header, index) => {
          rowData[header] = row[index];
        });
        return rowData;
      });
      setData(dataRows);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    }
  };

  const handleSearch = () => {
    const appidList = appids.split(',').map(id => id.trim());
    const matchingRows = data.filter(row => appidList.includes(row.appid));
    
    // Extract unique environments
    const uniqueEnvironments = Array.from(new Set(matchingRows.map(row => row.environment)));

    setFilteredEnvironments(uniqueEnvironments);
    if (uniqueEnvironments.length === 0) {
      setMessage('No environments exist for the given App ID(s).');
    } else {
      setMessage('');
    }
  };

  const handleEnvironmentClick = (environment: string) => {
    if (expandedEnvironment === environment) {
      setExpandedEnvironment(null); // Collapse if already expanded
    } else {
      setExpandedEnvironment(environment); // Expand the clicked environment
    }
  };

  const getRowsForEnvironment = (environment: string) => {
    const appidList = appids.split(',').map(id => id.trim());
    return data.filter(row => appidList.includes(row.appid) && row.environment === environment);
  };

  // Define the columns you want to display in the collapsible table
  const columnsToDisplay = ['appid', 'appname', 'memory', 'storage', 'cpu'];

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="app">
      <h1>Search App IDs</h1>
      <input
        type="text"
        value={appids}
        onChange={(e) => setAppids(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder="Enter App IDs separated by commas"
        className="appid-input"
      />
      <button onClick={handleSearch} className="search-button">Search</button>

      {message && <p className="message">{message}</p>}

      {filteredEnvironments.length > 0 && (
        <div className="result-table">
          {filteredEnvironments.map((environment, index) => (
            <div key={index}>
              <h2 onClick={() => handleEnvironmentClick(environment)} className="environment-header">
                {environment}
              </h2>
              {expandedEnvironment === environment && (
                <div className="collapsible-content">
                  <table>
                    <thead>
                      <tr>
                        {columnsToDisplay.map(key => (
                          <th key={key}>{key}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {getRowsForEnvironment(environment).map((row, idx) => (
                        <tr key={idx}>
                          {columnsToDisplay.map((key, i) => (
                            <td key={i}>{row[key]}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default App;






html, body {
  height: 100%;
  margin: 0;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  background-color: #f4f4f4;
  font-family: Arial, sans-serif;
}

.app {
  width: 100%;
  max-width: 1200px;
  margin: 20px;
  background-color: white;
  padding: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
}

h1 {
  margin-bottom: 20px;
  color: #333;
  text-align: center;
}

.file-input, .appid-input, .search-button {
  margin: 10px 0;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.file-input {
  margin-bottom: 20px;
}

.appid-input {
  width: 300px;
}

.search-button {
  background-color: #007bff;
  color: white;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s ease;
  border-radius: 4px;
}

.search-button:hover {
  background-color: #0056b3;
}

.result-table {
  margin-top: 20px;
  border-collapse: collapse;
  width: 100%;
}

.result-table th, .result-table td {
  border: 1px solid #ddd;
  padding: 12px;
  text-align: left;
  color: black;
}

.result-table th {
  background-color: #007bff;
  color: white;
}

.result-table tr:nth-child(even) {
  background-color: #f9f9f9;
}

.result-table tr:hover {
  background-color: #f1f1f1;
}

.environment-header {
  cursor: pointer;
  padding: 10px;
  background-color: #007bff;
  color: white;
  border-radius: 4px;
  margin-bottom: 5px;
  transition: background-color 0.3s ease;
  text-align: left;
  width: 100%;
}

.environment-header:hover {
  background-color: #0056b3;
}

.collapsible-content {
  overflow: hidden;
  transition: max-height 0.2s ease-out;
  width: 100%;
}

.message {
  color: #333;
  font-size: 16px;
  margin-top: 20px;
  text-align: center;
}

