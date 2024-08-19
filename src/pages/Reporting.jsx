import React, { useState, useEffect } from 'react';
import { GridComponent, ColumnsDirective, ColumnDirective, Resize, Sort, ContextMenu, Filter, Page, ExcelExport, PdfExport, Edit, Inject } from '@syncfusion/ej2-react-grids';

import { ordersData, contextMenuItems, ordersGrid } from '../data/dummy';
import { Header } from '../components';

function Reporting() {
  const [apiResponse, setApiResponse] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [loading, setLoading] = useState(false);


  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch('http://37.187.176.243:8001/AA_outputs_and_emails_tables_optimized');
      const data = await response.json();
      setApiResponse(data);
      setIsLoading(false); // Set loading to false once data is fetched
    } catch (error) {
      console.error('Error fetching data:', error);
      setIsLoading(false); // Set loading to false in case of error
    }
  };

  const generateOutputsData = apiResponse[0];
  const sendEmailsData = apiResponse[1];

  const getUniqueMachines = (data) => {if (!data || !Array.isArray(data)) {
    return [];
  }
  return [...new Set(data.map(item => item.Machine))].sort();
};

  const uniqueMachines = getUniqueMachines(generateOutputsData);
  const [selectedMachines, setSelectedMachines] = useState(uniqueMachines);
  const [generateOutputsDataFiltered, setFilteredData] = useState(generateOutputsData);

  const handleMachineChange = (event) => {
    const { value, checked } = event.target;
    const updatedMachines = checked 
      ? [...selectedMachines, value]
      : selectedMachines.filter(machine => machine !== value);

    setSelectedMachines(updatedMachines);
    setFilteredData(generateOutputsData.filter(item => updatedMachines.includes(item.Machine)));
  };


  const generateOutputsTable = (
    <div class="container">
    <div class="content">
      <h2 style={{ fontWeight: 'bold' }}> Generate Outputs 📊</h2>

      <div className="checkbox-container">
          {uniqueMachines.map(machine => (
            <label key={machine} className="checkbox-label">
              <input
                type="checkbox"
                value={machine}
                checked={selectedMachines.includes(machine)}
                onChange={handleMachineChange}
              />
              {machine}
            </label>
          ))}
        </div>

      {generateOutputsDataFiltered && generateOutputsDataFiltered.length > 0 ? (
      <table>
        <thead>
          <tr>
            {generateOutputsDataFiltered && Object.keys(generateOutputsDataFiltered[0]).map(key => (
              <th key={key}>{key}</th>
            ))}
          <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {generateOutputsDataFiltered && generateOutputsDataFiltered.map((item, index) => (
            <tr key={index}>
              {Object.entries(item).map(([key,value]) => (
                <td key={key}>
                  {key === "Folder ID" ? (
                    <button class = "btn" onClick={() => window.open(value, '_blank')}>
                      Go to Folder
                    </button>
                ) : (
                  value
                )}
                  </td>
              ))}
              <td>
              {loading ? (
                  <img src="https://i.gifer.com/ZKZg.gif" alt="Loading..." style={{ width: '20px', height: '20px' }}/>
                ) : (
                  <button class = "btn" onClick={() => handleOutputsButtonClick(item['Machine'], item['Cycle Start'], item['Folder ID'].split("/").pop())}>
                    Generate Output
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      ) : uniqueMachines && uniqueMachines.length === 0 ? (
        <p style={{ textAlign: 'center' }}>Everything is up to date! ✅ 🫡</p>
      ) : (
        <p style={{ textAlign: 'center' }}>Select some machine ⚙️ ⬆️</p>
      )}
    </div>
    </div>
  );

  const sendEmailsTable = (
    <div class="container">
    <div class="content">      
    <h2>Send Emails 📧</h2>
      {sendEmailsData && sendEmailsData.length > 0 ? (
        <table>
          <thead>
            <tr>
              {Object.keys(sendEmailsData[0]).map(key => (
                <th key={key}>{key}</th>
              ))}
              <th>Test Mail</th>
              <th>Report Mail</th>
            </tr>
          </thead>
          <tbody>
            {sendEmailsData.map((item, index) => (
              <tr key={index}>
                {Object.entries(item).map(([key, value]) => (
                  <td key={key}>
                    {key === "Folder ID" ? (
                      <button class = "btn" onClick={() => window.open(value, '_blank')}>
                        Go to Folder
                      </button>
                    ) : (
                      value
                    )}
                  </td>
                ))}
                {/* This generates the Send Mail button (only if HC is true) */}
                <td>
                    <button class = "btn" onClick={() => handleEmailsButtonClick(item['Machine'], item['Cycle Start'], item['Folder ID'].split("/").pop(), true)}>
                      Send
                    </button>
                </td>
                <td>
                    <button class = "btn" onClick={() => handleEmailsButtonClick(item['Machine'], item['Cycle Start'], item['Folder ID'].split("/").pop(), false)}>
                      Send
                    </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p style={{ textAlign: 'center' }}>Everything is up to date! ✅ 🫡</p>
      )}
    </div>
    </div>
  );
  
  async function handleOutputsButtonClick(machine, cycleStart, experiment_folder_id) {
    const url = `http://37.187.176.243:8001/AA_generate_outputs?serial_num=${machine}&cycle_start=${cycleStart}&experiment_folder_id=${experiment_folder_id}`;
    try {
      setLoading(true); // Set loading state to true when the button is clicked
      const response = await fetch(url);
      if (response.ok) {
        window.open(url, '_blank');
        window.location.reload(); // Reload the entire page after opening the window
      } else {
        console.error('Failed to fetch data:', response.status);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false); // Reset loading state after the API call completes
    }
  }

  async function handleEmailsButtonClick(machine, cycleStart, experiment_folder_id, isTest) {
    const url = `http://37.187.176.243:8001/AA_send_emails?serial_num=${machine}&cycle_start=${cycleStart}&experiment_folder_id=${experiment_folder_id}&test=${isTest}`;
    window.open(url, '_blank');
    window.location.reload(); // Refresh the entire page
  }

  if (isLoading) {
    return (
        <div style={{ textAlign: 'center' }}>
        {/* Loading message */}
        <h2>Loading...</h2>
        {/* Animated gif */}
        <img src="https://i.pinimg.com/originals/aa/77/d9/aa77d976114e57a093118db5b3508f0d.gif" alt="Loading animation" style={{ display: 'block', margin: '0 auto' }} />
      </div>
    );
  }

  return (
    <div>
      <main className="main-content">
        {generateOutputsTable}
        {sendEmailsTable}
      </main>
    </div>
  );


}

export default Reporting;
