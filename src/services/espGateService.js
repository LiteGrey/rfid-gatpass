/**
 * ESP Gate Control Service
 * Handles communication with ESP32/Arduino device for gate access control
 */

import { APP_CONFIG } from '../config/appConfig';

const { IP_ADDRESS, PORT, TIMEOUT_MS, GATE_CONTROL_ENDPOINT } = APP_CONFIG.ESP;

/**
 * Send access command to ESP device
 * @param {Object} vehicleData - Vehicle information
 * @returns {Promise<Object>} Response from ESP
 */
export const sendGateAccessCommand = async (vehicleData) => {
  try {
    const payload = {
      action: 'open',
      timestamp: new Date().toISOString(),
      vehicle: {
        id: vehicleData.id,
        owner_name: vehicleData.owner_name,
        license_plate: vehicleData.license_plate,
        department: vehicleData.department
      },
      access_type: 'approved'
    };

    console.log('Sending gate access command:', payload);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

    const response = await fetch(
      'http://10.51.14.153/gateopen',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify(payload),
        signal: controller.signal
      }
    );

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`ESP returned status ${response.status}`);
    }

    const data = await response.json();
    console.log('Gate access response:', data);

    return {
      success: true,
      message: 'Gate control signal sent successfully',
      data
    };
  } catch (error) {
    console.error('Error sending gate access command:', error);

    // Determine error type
    let errorMessage = 'Failed to send gate control signal';
    if (error.name === 'AbortError') {
      errorMessage = 'Gate control request timed out';
    } else if (error instanceof TypeError) {
      errorMessage = 'Cannot reach ESP device - check IP address and connection';
    }

    return {
      success: false,
      message: errorMessage,
      error: error.message
    };
  }
};

/**
 * Send access denied command to ESP device (optional lock/alert)
 * @param {Object} vehicleData - Vehicle information
 * @returns {Promise<Object>} Response from ESP
 */
export const sendGateDeniedCommand = async (vehicleData) => {
  try {
    const payload = {
      action: 'deny',
      timestamp: new Date().toISOString(),
      vehicle: {
        id: vehicleData.id,
        owner_name: vehicleData.owner_name,
        license_plate: vehicleData.license_plate,
        department: vehicleData.department
      },
      access_type: 'denied'
    };

    console.log('Sending gate denied command:', payload);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

    const response = await fetch(
      `http://${IP_ADDRESS}:${PORT}${GATE_CONTROL_ENDPOINT}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload),
        signal: controller.signal
      }
    );

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`ESP returned status ${response.status}`);
    }

    const data = await response.json();
    return {
      success: true,
      message: 'Gate denied signal sent',
      data
    };
  } catch (error) {
    console.error('Error sending gate denied command:', error);
    return {
      success: false,
      message: 'Failed to send gate denied signal',
      error: error.message
    };
  }
};

const espGateService = {
  sendGateAccessCommand,
  sendGateDeniedCommand
};

export default espGateService;
