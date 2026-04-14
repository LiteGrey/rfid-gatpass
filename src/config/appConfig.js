/**
 * System Configuration
 * Centralizes all configurable system settings
 */

export const APP_CONFIG = {
  // ESP32/Arduino Gate Control Settings
  ESP: {
    // IP Address of the ESP device on the network
    IP_ADDRESS: '10.219.112.163',
    // Port number for ESP device (default HTTP)
    PORT: 80,
    // Request timeout in milliseconds
    TIMEOUT_MS: 5000,
    // API endpoint for gate control
    GATE_CONTROL_ENDPOINT: '/api/gate/access'
  },

  // Gate Control Settings
  GATE: {
    // Time gate stays open (milliseconds) before auto-closing
    OPEN_DURATION_MS: 5000,
    // Retry attempts for gate control
    RETRY_ATTEMPTS: 2,
    // Retry delay (milliseconds)
    RETRY_DELAY_MS: 1000
  },

  // RFID System Settings
  RFID: {
    // Max warning count before blocking
    MAX_WARNINGS: 3,
    // Warning reset time (hours) - 0 means daily reset at midnight
    WARNING_RESET_HOURS: 24
  },

  // UI Settings
  UI: {
    // Message display duration (milliseconds)
    MESSAGE_DURATION_MS: 4000,
    // Gate status display duration (milliseconds)
    GATE_STATUS_DURATION_MS: 8000,
    // Animation duration (milliseconds)
    ANIMATION_DURATION_MS: 300
  }
};

export default APP_CONFIG;
