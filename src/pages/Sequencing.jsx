import React, { useState } from 'react';

const Sequencing = () => {
  const [folderId, setFolderId] = useState('');
  const [dataframe, setDataframe] = useState(null);
  const [fileId, setFileId] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false); // State for loading

  const handleInputChange = (event) => {
    setFolderId(event.target.value);
  };

  const handleSubmit = async () => {
    setLoading(true); // Show loading GIF
    try {
      const response = await fetch(`http://37.187.176.243:8001/LAB_sequencing?folder_id=${folderId}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setDataframe(data.dataframe);
      setFileId(data.local_blast_results_file_id);
      setError(null); // Clear any previous errors
    } catch (err) {
      console.error(err);
      setError('Failed to fetch data. Please try again.');
    } finally {
      setLoading(false); // Hide loading GIF
    }
  };

  const renderTable = () => {
    if (!dataframe) return null;

    const headers = Object.keys(dataframe);
    const rows = Object.keys(dataframe[headers[0]]).map((index) => {
      return (
        <tr key={index}>
          {headers.map((header) => (
            <td key={header}>{dataframe[header][index]}</td>
          ))}
        </tr>
      );
    });

    return (
      <div style={{ marginTop: '30px' }}>
        <h2>  Results 🧪 </h2>
        <table border="1" cellPadding="5">
          <thead>
            <tr>
              {headers.map((header) => (
                <th key={header}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="container">
      <div className="content">
        <h2>Lab Sequencing Data 🧬</h2>

        <div class="info-box" style={{ marginLeft: '50px' }}>
          <p>
            Enter the <strong> Google Drive Folder ID </strong> of a folder containing sequencing results which must be 'ab1' format. <br />
            The app generates a <strong> spreadsheet </strong> with BLAST sequencing results showing most accurate matchings. <br />
            <strong> Important☝️</strong> The folder must have accessibility status <em>Everyone with the link</em> can be <em>Editor</em>.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px', marginLeft: '50px' }}>
          <label style={{ fontWeight: 'bold', marginRight: '30px' }}>Folder ID</label>
          <input
            type="text"
            placeholder="Enter folder ID"
            value={folderId}
            onChange={handleInputChange}
            style={{
              padding: '10px', // Increase padding for larger input box
              fontSize: '16px', // Larger text
              width: '350px', // Increase width
            }}
          />

          <div style={{ display: 'flex', alignItems: 'center', marginLeft: '20px' }}>
            {loading ? (
              <img
                src="https://i.gifer.com/ZKZg.gif"
                alt="Loading..."
                style={{ width: '20px' }} // Adjust the size of the GIF as needed
              />
            ) : (
              <button className="btn" style={{ marginLeft: '0px' }} onClick={handleSubmit}>Submit</button>
            )}
          </div>


          {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>

        {renderTable()}

        {fileId && (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '20px' }}>

            <button className="btn" onClick={() => window.open(`https://drive.google.com/drive/folders/${folderId}`, '_blank')} style={{ margin: '20px' }}> Go to Folder  </button>


            <button className="btn" onClick={() => window.open(`https://docs.google.com/spreadsheets/d/${fileId}`, '_blank')} style={{ margin: '20px' }}>
              Go to Spreadsheet
            </button>

          </div>
        )}
      </div>
    </div>
  );
};

export default Sequencing;
