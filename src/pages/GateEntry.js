import React, { useState, useRef } from 'react';
import { useRFID } from '../context/RFIDContext';
import ExpiryWarningModal from '../components/ExpiryWarningModal';
import VehicleInfoDisplay from '../components/VehicleInfoDisplay';
import { sendGateAccessCommand, sendGateDeniedCommand } from '../services/espGateService';
import './GateEntry.css';

const GateEntry = () => {
  const [cardId, setCardId] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [showWarning, setShowWarning] = useState(false);
  const [warningData, setWarningData] = useState(null);
  const [gateStatus, setGateStatus] = useState('');
  const [gateMessage, setGateMessage] = useState('');
  // eslint-disable-next-line no-unused-vars
  const [isProcessing, setIsProcessing] = useState(false);
  const [showVehicleInfo, setShowVehicleInfo] = useState(false);
  const [vehicleInfoData, setVehicleInfoData] = useState(null);
  const { verifyAndEnterCard, allowEntryWithWarning } = useRFID();
  const inputRef = useRef(null);

  // Send gate control command after successful verification
  const triggerGateAccess = async (vehicle) => {
    setIsProcessing(true);
    setGateStatus('opening');
    setGateMessage('🔓 Opening gate...');

    const result = await sendGateAccessCommand(vehicle);

    if (result.success) {
      setGateStatus('active');
      setGateMessage('✓ Gate opened successfully');
      setTimeout(() => {
        setGateStatus('closed');
        setGateMessage('🔒 Gate closed');
      }, 5000);
    } else {
      setGateStatus('error');
      setGateMessage(`⚠️ ${result.message}`);
    }

    setTimeout(() => {
      setGateStatus('');
      setGateMessage('');
    }, 8000);

    setIsProcessing(false);
  };

  // Send gate denied command
  const triggerGateDenied = async (vehicle) => {
    await sendGateDeniedCommand(vehicle);
  };

  const handleVerifyAndEnter = () => {
    if (!cardId.trim()) {
      setMessage('Please enter or scan an RFID card.');
      setMessageType('error');
      return;
    }

    const result = verifyAndEnterCard(cardId);

    // Handle warning scenario
    if (result.showWarning && !result.blocked) {
      setWarningData(result);
      setShowWarning(true);
      setCardId('');
      return;
    }

    // Handle blocked scenario
    if (result.blocked) {
      setMessage(result.message);
      setMessageType('error');
      setCardId('');
      if (result.vehicle) {
        triggerGateDenied(result.vehicle);
      }
      if (inputRef.current) {
        inputRef.current.focus();
      }
      setTimeout(() => {
        setMessage('');
        setMessageType('');
      }, 5000);
      return;
    }

    // Handle normal entry - SUCCESS
    if (result.success) {
      setMessage(result.message);
      setMessageType('success');
      setCardId('');
      
      // Show vehicle info with image and expiry status
      if (result.vehicle) {
        setVehicleInfoData(result.vehicle);
        setShowVehicleInfo(true);
        
        // Trigger gate access
        triggerGateAccess(result.vehicle);
      }
      
      if (inputRef.current) {
        inputRef.current.focus();
      }

      // Clear message after 4 seconds
      setTimeout(() => {
        setMessage('');
        setMessageType('');
      }, 4000);
      return;
    }

    // Handle other error scenarios
    setMessage(result.message);
    setMessageType('error');
    setCardId('');
    if (inputRef.current) {
      inputRef.current.focus();
    }
    setTimeout(() => {
      setMessage('');
      setMessageType('');
    }, 4000);
  };

  const handleAllowEntry = () => {
    if (warningData) {
      allowEntryWithWarning(warningData.vehicle.id);
      setShowWarning(false);
      
      // Show vehicle info with image and expiry status
      setVehicleInfoData(warningData.vehicle);
      setShowVehicleInfo(true);
      
      // Trigger gate access even with warning
      triggerGateAccess(warningData.vehicle);
      
      setMessage(`✓ Entry allowed with ${warningData.expiredDocuments.join(' & ')} expired. ${2 - warningData.warningCount} attempts remaining.`);
      setMessageType('warning');
      setWarningData(null);
      
      if (inputRef.current) {
        inputRef.current.focus();
      }

      setTimeout(() => {
        setMessage('');
        setMessageType('');
      }, 4000);
    }
  };

  const handleDenyEntry = () => {
    if (warningData && warningData.vehicle) {
      triggerGateDenied(warningData.vehicle);
    }
    setShowWarning(false);
    setMessage('✗ Entry denied.');
    setMessageType('error');
    setWarningData(null);

    if (inputRef.current) {
      inputRef.current.focus();
    }

    setTimeout(() => {
      setMessage('');
      setMessageType('');
    }, 3000);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleVerifyAndEnter();
    }
  };

  return (
    <div className="gate-entry-container">
      <ExpiryWarningModal
        isOpen={showWarning}
        vehicle={warningData?.vehicle}
        expiredDocuments={warningData?.expiredDocuments || []}
        warningCount={warningData?.warningCount || 0}
        onAllow={handleAllowEntry}
        onDeny={handleDenyEntry}
      />

      {showVehicleInfo && vehicleInfoData && (
        <div className="vehicle-info-overlay">
          <div className="vehicle-info-card" onClick={e => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setShowVehicleInfo(false)}>✕</button>
            <div className="vehicle-info-header">
              <h3>✓ Access Granted</h3>
            </div>
            {/* Vehicle Image and Basic Info Side by Side */}
            <div className="vehicle-info-main">
              {vehicleInfoData.vehicle_image ? (
                <div className="vehicle-image-section">
                  <img src={vehicleInfoData.vehicle_image} alt={vehicleInfoData.owner_name || 'Vehicle'} className="vehicle-image" />
                </div>
              ) : (
                <div className="vehicle-image-section">
                  <div className="no-image-placeholder">📷 No image available</div>
                </div>
              )}
              <div className="vehicle-basic-info-section">
                <div className="info-item">
                  <label>Owner Name:</label>
                  <span className="owner-name">{vehicleInfoData.owner_name}</span>
                </div>
                <div className="info-item">
                  <label>Department:</label>
                  <span>{vehicleInfoData.department}</span>
                </div>
                <div className="info-item">
                  <label>License Plate:</label>
                  <span className="license-plate">{vehicleInfoData.license_plate}</span>
                </div>
              </div>
            </div>
            {/* Document Status */}
            <VehicleInfoDisplay
              vehicle={vehicleInfoData}
              onClose={() => setShowVehicleInfo(false)}
            />
          </div>
        </div>
      )}

      <div className="gate-entry-content">
        <h2>Card Entry</h2>
        
        <div className="card-input-wrapper">
          <input
            ref={inputRef}
            type="text"
            className="card-input"
            placeholder="Scan RFID card..."
            value={cardId}
            onChange={(e) => setCardId(e.target.value)}
            onKeyPress={handleKeyPress}
            autoFocus
          />
        </div>

        <button 
          className="verify-button"
          onClick={handleVerifyAndEnter}
        >
          Verify & Enter
        </button>

        {message && (
          <div className={`message message-${messageType}`}>
            {messageType === 'success' && <span className="icon">✓</span>}
            {messageType === 'error' && <span className="icon">✗</span>}
            {messageType === 'warning' && <span className="icon">⚠️</span>}
            <span>{message}</span>
          </div>
        )}

        {gateMessage && (
          <div className={`gate-status gate-status-${gateStatus}`}>
            <span className="gate-icon">
              {gateStatus === 'opening' && '🔓'}
              {gateStatus === 'active' && '✓'}
              {gateStatus === 'closed' && '🔒'}
              {gateStatus === 'error' && '⚠️'}
            </span>
            <span className="gate-text">{gateMessage}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default GateEntry;