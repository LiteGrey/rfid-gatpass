import React from 'react';
import './ExpiryWarningModal.css';

const ExpiryWarningModal = ({ 
  isOpen, 
  vehicle, 
  expiredDocuments, 
  warningCount, 
  onAllow, 
  onDeny 
}) => {
  if (!isOpen || !vehicle) return null;

  const isBlocked = warningCount >= 3;
  const expiredDocs = expiredDocuments.join(' & ');

  return (
    <div className="expiry-warning-overlay">
      <div className={`expiry-warning-modal ${isBlocked ? 'blocked' : 'warning'}`}>
        <div className="warning-header">
          <span className={`warning-icon ${isBlocked ? 'blocked-icon' : ''}`}>
            {isBlocked ? '⛔' : '⚠️'}
          </span>
          <h3>{isBlocked ? 'ACCESS DENIED' : 'DOCUMENT EXPIRY WARNING'}</h3>
        </div>

        <div className="warning-body">
          <p className="warning-message">
            {isBlocked 
              ? `Vehicle has been denied entry. ${expiredDocs} have expired and maximum warning limit reached.`
              : `Vehicle's ${expiredDocs} have expired. This is warning ${warningCount} of 3.`
            }
          </p>

          <div className="vehicle-info">
            <h4>Vehicle Information</h4>
            <div className="info-row">
              <label>Owner:</label>
              <span>{vehicle.owner_name}</span>
            </div>
            <div className="info-row">
              <label>ID Number:</label>
              <span>{vehicle.id}</span>
            </div>
            <div className="info-row">
              <label>License Plate:</label>
              <span className="license-plate">{vehicle.license_plate}</span>
            </div>
            <div className="info-row">
              <label>Department:</label>
              <span>{vehicle.department}</span>
            </div>
          </div>

          <div className="expiry-details">
            <h4>Document Status</h4>
            {expiredDocuments.includes('OR/CR') && (
              <div className="expiry-item expired">
                <span className="doc-name">OR/CR Expiry Date:</span>
                <span className="status">EXPIRED</span>
              </div>
            )}
            {expiredDocuments.includes('Driver License') && (
              <div className="expiry-item expired">
                <span className="doc-name">Driver License Expiry Date:</span>
                <span className="status">EXPIRED</span>
              </div>
            )}
          </div>

          {!isBlocked && (
            <div className="warning-counter">
              <p>Remaining attempts: <strong>{2 - warningCount}</strong></p>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${(warningCount / 2) * 100}%` }}></div>
              </div>
            </div>
          )}
        </div>

        <div className="warning-footer">
          {isBlocked ? (
            <button className="btn-close" onClick={onDeny}>Close</button>
          ) : (
            <>
              <button className="btn-allow" onClick={onAllow}>
                Allow Entry ({2 - warningCount} left)
              </button>
              <button className="btn-deny" onClick={onDeny}>
                Deny Entry
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExpiryWarningModal;
