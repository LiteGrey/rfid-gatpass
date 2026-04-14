import React from 'react';
import { useRFID } from '../context/RFIDContext';
import './Dashboard.css';

const Dashboard = () => {
  const { todaysPasses, vehicles, passes, systemStatus } = useRFID();
  
  const activeVehicles = vehicles.filter(v => v.status === 'Active').length;

  return (
    <div className="dashboard-container">
      <div className="dashboard-stats">
        <div className="stat-card">
          <div className="stat-icon">📷</div>
          <div className="stat-content">
            <p className="stat-label">Today's Passes</p>
            <p className="stat-value">{todaysPasses}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🚙</div>
          <div className="stat-content">
            <p className="stat-label">Active Vehicles</p>
            <p className="stat-value">{activeVehicles}</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon status-icon">●</div>
          <div className="stat-content">
            <p className="stat-label">System Status</p>
            <p className="stat-value status-live">{systemStatus}</p>
          </div>
        </div>
      </div>

      <div className="recent-passes-section">
        <h3>Recent Vehicle Passes</h3>
        <div className="table-wrapper">
          <table className="passes-table">
            <thead>
              <tr>
                <th>Time</th>
                <th>ID Number</th>
                <th>Owner Name</th>
                <th>Department</th>
                <th>License Plate</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {passes.length > 0 ? (
                passes.map((pass, index) => (
                  <tr key={index}>
                    <td>{pass.time}</td>
                    <td>{pass.id_number}</td>
                    <td>{pass.owner_name}</td>
                    <td>{pass.department}</td>
                    <td className="license-plate">{pass.license_plate}</td>
                    <td>{pass.status}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="no-data">No passes recorded yet</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
