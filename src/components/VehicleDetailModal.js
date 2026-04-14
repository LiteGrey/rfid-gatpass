import React from 'react';
import './VehicleDetailModal.css';

const VehicleDetailModal = ({ vehicle, onClose, onEdit }) => {
  if (!vehicle) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Vehicle Details</h3>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <div className="modal-body">
          <div className="detail-section">
            <div className="detail-row">
              <label>ID Number:</label>
              <span>{vehicle.id}</span>
            </div>
            <div className="detail-row">
              <label>Owner Name:</label>
              <span>{vehicle.owner_name}</span>
            </div>
            <div className="detail-row">
              <label>Department:</label>
              <span>{vehicle.department}</span>
            </div>
            <div className="detail-row">
              <label>License Plate:</label>
              <span className="license-plate-value">{vehicle.license_plate}</span>
            </div>
          </div>

          <div className="detail-section">
            <h4>Vehicle Information</h4>
            <div className="detail-row">
              <label>Vehicle Type:</label>
              <span>{vehicle.vehicle_type || 'N/A'}</span>
            </div>
            <div className="detail-row">
              <label>Vehicle Color:</label>
              <span>{vehicle.vehicle_color || 'N/A'}</span>
            </div>
            <div className="detail-row">
              <label>RFID Tag:</label>
              <span className="rfid-value">{vehicle.rfid_tag}</span>
            </div>
            <div className="detail-row">
              <label>Status:</label>
              <span className={`status-badge status-${vehicle.status?.toLowerCase()}`}>
                {vehicle.status}
              </span>
            </div>
          </div>

          {vehicle.vehicle_image && (
            <div className="detail-section vehicle-image-section">
              <h4>Vehicle Image</h4>
              <img src={vehicle.vehicle_image} alt="Vehicle" className="vehicle-detail-image" />
            </div>
          )}

          <div className="detail-section">
            <h4>Expiry Dates</h4>
            <div className="detail-row">
              <label>OR/CR Expiry:</label>
              <span>{vehicle.or_cr_expiry ? new Date(vehicle.or_cr_expiry).toLocaleDateString() : 'Not set'}</span>
            </div>
            <div className="detail-row">
              <label>Driver License Expiry:</label>
              <span>{vehicle.driver_license_expiry ? new Date(vehicle.driver_license_expiry).toLocaleDateString() : 'Not set'}</span>
            </div>
          </div>

          {vehicle.notes && (
            <div className="detail-section">
              <h4>Notes</h4>
              <p className="notes-text">{vehicle.notes}</p>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn-edit-modal" onClick={() => {
            onEdit(vehicle);
            onClose();
          }}>
            Edit Vehicle
          </button>
          <button className="btn-close-modal" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default VehicleDetailModal;
