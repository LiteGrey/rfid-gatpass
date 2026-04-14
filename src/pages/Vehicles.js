import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRFID } from '../context/RFIDContext';
import AddVehicleForm from '../components/AddVehicleForm';
import EditVehicleForm from '../components/EditVehicleForm';
import VehicleDetailModal from '../components/VehicleDetailModal';
import './Vehicles.css';

const Vehicles = () => {
  // eslint-disable-next-line no-unused-vars
  const navigate = useNavigate();
  const { vehicles, addVehicle, updateVehicle, deleteVehicle, importVehiclesFromCSV } = useRFID();
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [viewingVehicle, setViewingVehicle] = useState(null);
  const [csvMessage, setCsvMessage] = useState('');

  const handleAddVehicle = (vehicleData) => {
    addVehicle(vehicleData);
    // Form will handle navigation automatically
  };

  const handleFormCancel = () => {
    setShowAddForm(false);
  };

  const handleViewVehicle = (vehicle) => {
    setViewingVehicle(vehicle);
  };

  const handleEditVehicle = (vehicle) => {
    setSelectedVehicle(vehicle);
    setShowEditForm(true);
  };

  const handleEditSubmit = (vehicleData) => {
    updateVehicle(selectedVehicle.id, {
      owner_name: vehicleData.owner_name,
      department: vehicleData.department,
      license_plate: vehicleData.license_plate,
      sticker_number: vehicleData.sticker_number,
      or_cr_expiry: vehicleData.or_cr_expiry_date,
      driver_license_expiry: vehicleData.driver_license_expiry_date,
      vehicle_type: vehicleData.vehicle_type,
      vehicle_color: vehicleData.vehicle_color,
      rfid_tag: vehicleData.rfid_tag,
      notes: vehicleData.notes,
      status: vehicleData.status,
      vehicle_image: vehicleData.vehicle_image
    });
    setShowEditForm(false);
    setSelectedVehicle(null);
  };

  const handleEditCancel = () => {
    setShowEditForm(false);
    setSelectedVehicle(null);
  };

  const handleCSVImport = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const csv = e.target.result;
        const lines = csv.split('\n');
        const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
        
        const csvData = lines.slice(1)
          .filter(line => line.trim())
          .map(line => {
            const values = line.split(',').map(v => v.trim());
            const row = {};
            headers.forEach((header, index) => {
              row[header] = values[index];
            });
            return row;
          });

        importVehiclesFromCSV(csvData);
        setCsvMessage(`Successfully imported ${csvData.length} vehicle(s)`);
        setTimeout(() => setCsvMessage(''), 3000);
        event.target.value = '';
      } catch (error) {
        setCsvMessage('Error importing CSV file. Please check the format.');
        setTimeout(() => setCsvMessage(''), 3000);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="vehicles-container">
      <div className="vehicles-header">
        <h2>Vehicle Management</h2>
        <button 
          className="add-vehicle-btn"
          onClick={() => setShowAddForm(!showAddForm)}
        >
          + Add Vehicle
        </button>
      </div>

      {showAddForm && (
        <AddVehicleForm 
          onSubmit={handleAddVehicle}
          onCancel={handleFormCancel}
        />
      )}

      {showEditForm && selectedVehicle && (
        <EditVehicleForm
          vehicle={selectedVehicle}
          onSubmit={handleEditSubmit}
          onCancel={handleEditCancel}
        />
      )}

      {viewingVehicle && (
        <VehicleDetailModal
          vehicle={viewingVehicle}
          onClose={() => setViewingVehicle(null)}
          onEdit={handleEditVehicle}
        />
      )}

      <div className="csv-import-section">
        <h3>Import Vehicles from CSV</h3>
        <p className="csv-help">
          Columns required: id_number, owner_name, department, sticker_number, license_plate (optional: or_cr_expiry_date, driver_license_expiry_date, vehicle_type, vehicle_color, notes)
        </p>
        <label className="csv-input-wrapper">
          <input 
            type="file" 
            accept=".csv"
            onChange={handleCSVImport}
            style={{ display: 'none' }}
          />
          <span className="csv-button">Choose File</span>
          <span className="csv-filename">No file chosen</span>
        </label>
        {csvMessage && <div className="csv-message">{csvMessage}</div>}
      </div>

      <div className="vehicles-table-wrapper">
        <table className="vehicles-table">
          <thead>
            <tr>
              <th>ID Number</th>
              <th>Owner Name</th>
              <th>Department</th>
              <th>License Plate</th>
              <th>RFID Tags</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {vehicles.length > 0 ? (
              vehicles.map((vehicle) => (
                <tr key={vehicle.id}>
                  <td>{vehicle.id}</td>
                  <td>{vehicle.owner_name}</td>
                  <td>{vehicle.department}</td>
                  <td className="license-plate">{vehicle.license_plate}</td>
                  <td className="rfid-tag">{vehicle.rfid_tag?.substring(0, 8)}...</td>
                  <td>{vehicle.status}</td>
                  <td className="actions">
                    <button 
                      className="btn-view"
                      onClick={() => handleViewVehicle(vehicle)}
                    >
                      View
                    </button>
                    <button 
                      className="btn-edit"
                      onClick={() => handleEditVehicle(vehicle)}
                    >
                      Edit
                    </button>
                    <button 
                      className="btn-delete"
                      onClick={() => {
                        if (window.confirm(`Are you sure you want to delete ${vehicle.owner_name}'s vehicle?`)) {
                          deleteVehicle(vehicle.id);
                        }
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="no-data">No vehicles registered yet</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Vehicles;
