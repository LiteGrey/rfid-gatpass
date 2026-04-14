import React from 'react';
import './VehicleInfoDisplay.css';

// Helper to format dates
const formatDate = (dateString) => {
  if (!dateString) return 'Not set';
  try {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  } catch (e) {
    return 'Invalid date';
  }
};

// Helper to check if date is expired
const isDateExpired = (dateString) => {
  if (!dateString) return false;
  const expiryDate = new Date(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  expiryDate.setHours(0, 0, 0, 0);
  return expiryDate < today;
};

const VehicleInfoDisplay = ({ vehicle, onClose }) => {
  if (!vehicle) return null;

  const orCrExpired = isDateExpired(vehicle.or_cr_expiry);
  const driverLicExpired = isDateExpired(vehicle.driver_license_expiry);

  return (
    <div className="vehicle-info-overlay" onClick={onClose}>
      <div className="vehicle-info-card" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>✕</button>

        <div className="vehicle-info-header">
          <h3>✓ Access Granted</h3>
        </div>

        {/* Vehicle Image */}
        {vehicle.vehicle_image && (
          <div className="vehicle-image-section">
            <img src={vehicle.vehicle_image} alt={vehicle.owner_name} />
          </div>
        )}

        {/* Vehicle Owner Info */}
        <div className="vehicle-info-section">
          <div className="info-item">
            <label>Owner Name:</label>
            <span className="owner-name">{vehicle.owner_name}</span>
          </div>
          <div className="info-item">
            <label>Department:</label>
            <span>{vehicle.department}</span>
          </div>
          <div className="info-item">
            <label>License Plate:</label>
            <span className="license-plate">{vehicle.license_plate}</span>
          </div>
        </div>

        {/* Expiry Information */}
        <div className="vehicle-info-section expiry-section">
          <h4>Document Status</h4>
          
          <div className={`expiry-item ${orCrExpired ? 'expired' : 'valid'}`}>
            <div className="expiry-label">
              <span className={`status-icon ${orCrExpired ? 'icon-expired' : 'icon-valid'}`}>
                {orCrExpired ? '⚠️' : '✓'}
              </span>
              <span>OR/CR</span>
            </div>
            <span className="expiry-date">{formatDate(vehicle.or_cr_expiry)}</span>
          </div>

          <div className={`expiry-item ${driverLicExpired ? 'expired' : 'valid'}`}>
            <div className="expiry-label">
              <span className={`status-icon ${driverLicExpired ? 'icon-expired' : 'icon-valid'}`}>
                {driverLicExpired ? '⚠️' : '✓'}
              </span>
              <span>Driver License</span>
            </div>
            <span className="expiry-date">{formatDate(vehicle.driver_license_expiry)}</span>
          </div>
        </div>

        <button className="close-info-btn" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

export default VehicleInfoDisplay;
