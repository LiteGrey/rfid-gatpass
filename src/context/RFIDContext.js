import React, { createContext, useState, useCallback, useEffect } from 'react';

export const RFIDContext = createContext();

// Default vehicles
const DEFAULT_VEHICLES = [
  {
    id: '25-123456',
    owner_name: 'as',
    department: 'asg',
    license_plate: '123mwg',
    sticker_number: '',
    rfid_tag: '00006465',
    status: 'Active',
    vehicle_type: 'Motorcycle',
    vehicle_color: 'Black',
    or_cr_expiry: '',
    driver_license_expiry: '',
    notes: '',
    vehicle_image: ''
  }
];

// Helper to load vehicles from localStorage or use defaults
const loadVehicles = () => {
  try {
    const stored = localStorage.getItem('rfid_vehicles');
    return stored ? JSON.parse(stored) : DEFAULT_VEHICLES;
  } catch (e) {
    console.error('Error loading vehicles from localStorage:', e);
    return DEFAULT_VEHICLES;
  }
};

// Helper to save vehicles to localStorage
const saveVehicles = (data) => {
  try {
    localStorage.setItem('rfid_vehicles', JSON.stringify(data));
  } catch (e) {
    console.error('Error saving vehicles to localStorage:', e);
  }
};

export const RFIDProvider = ({ children }) => {
  const [vehicles, setVehicles] = useState(loadVehicles());

  const [passes, setPasses] = useState([
    {
      time: '08:29:35',
      id_number: '25-123456',
      owner_name: 'as',
      department: 'asg',
      license_plate: '123mwg',
      status: 'Recognized'
    },
    {
      time: '08:26:17',
      id_number: '25-123456',
      owner_name: 'as',
      department: 'asg',
      license_plate: '123mwg',
      status: 'Recognized'
    },
    {
      time: '08:25:47',
      id_number: '25-123456',
      owner_name: 'as',
      department: 'asg',
      license_plate: '123mwg',
      status: 'Recognized'
    },
    {
      time: '08:25:17',
      id_number: '25-123456',
      owner_name: 'as',
      department: 'asg',
      license_plate: '123mwg',
      status: 'Recognized'
    },
    {
      time: '08:24:51',
      id_number: '25-123456',
      owner_name: 'as',
      department: 'asg',
      license_plate: '123mwg',
      status: 'Recognized'
    },
    {
      time: '08:21:27',
      id_number: '25-123456',
      owner_name: 'as',
      department: 'asg',
      license_plate: '123mwg',
      status: 'Recognized'
    }
  ]);

  const [systemStatus] = useState('Live');
  const [todaysPasses, setTodaysPasses] = useState(0);
  
  // Track expiry warnings per vehicle (resets daily)
  const [expiryWarnings, setExpiryWarnings] = useState({});

  // Save vehicles to localStorage whenever they change
  useEffect(() => {
    saveVehicles(vehicles);
  }, [vehicles]);

  // Helper function to check if date is expired
  const isDateExpired = useCallback((dateString) => {
    if (!dateString) return false;
    const expiryDate = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    expiryDate.setHours(0, 0, 0, 0);
    return expiryDate < today;
  }, []);

  // Helper function to get expired documents
  const getExpiredDocuments = useCallback((vehicle) => {
    const expired = [];
    if (isDateExpired(vehicle.or_cr_expiry)) {
      expired.push('OR/CR');
    }
    if (isDateExpired(vehicle.driver_license_expiry)) {
      expired.push('Driver License');
    }
    return expired;
  }, [isDateExpired]);

  // Helper function to get warning count for a vehicle (independent of vehicle updates)
  const getWarningCount = useCallback((vehicleId) => {
    const today = new Date().toDateString();
    const key = `${vehicleId}-${today}`;
    return expiryWarnings[key] || 0;
  }, [expiryWarnings]);

  // Helper function to increment warning for a vehicle (independent of vehicle updates)
  const incrementWarning = useCallback((vehicleId) => {
    const today = new Date().toDateString();
    const key = `${vehicleId}-${today}`;
    setExpiryWarnings(prev => {
      const newCount = (prev[key] || 0) + 1;
      return {
        ...prev,
        [key]: newCount
      };
    });
  }, []);

  const verifyAndEnterCard = useCallback((rfidTag) => {
    const vehicle = vehicles.find(v => v.rfid_tag.toLowerCase() === rfidTag.toLowerCase());
    
    if (!vehicle) {
      return {
        success: false,
        message: 'RFID tag not recognized. Access denied.',
        vehicle: null,
        hasExpired: false,
        expiredDocuments: [],
        warningCount: 0
      };
    }

    // Check for expired documents - use current vehicle data
    const expiredDocuments = getExpiredDocuments(vehicle);
    // Get current warning count - this uses the expiryWarnings state
    const warningCount = getWarningCount(vehicle.id);

    // If documents are expired
    if (expiredDocuments.length > 0) {
      const newWarningCount = warningCount + 1;

      // Block entry on 3rd attempt (newWarningCount > 2 means 3rd scan and beyond)
      if (newWarningCount > 2) {
        return {
          success: false,
          message: `Access DENIED. ${expiredDocuments.join(' & ')} expired. You have exceeded the maximum allowed entries. Please renew your documents.`,
          vehicle,
          hasExpired: true,
          expiredDocuments,
          warningCount: newWarningCount,
          blocked: true
        };
      }

      // Allow entry on 1st and 2nd attempt with warning
      return {
        success: false, // Don't auto-enter, show warning instead
        message: `Warning: ${expiredDocuments.join(' & ')} expired. Warning ${newWarningCount} of 2.`,
        vehicle,
        hasExpired: true,
        expiredDocuments,
        warningCount: newWarningCount,
        blocked: false,
        showWarning: true
      };
    }

    // Normal entry - no expired documents
    const newPass = {
      time: new Date().toLocaleTimeString('en-US', { hour12: false }),
      id_number: vehicle.id,
      owner_name: vehicle.owner_name,
      department: vehicle.department,
      license_plate: vehicle.license_plate,
      status: 'Recognized'
    };
    
    setPasses(prev => [newPass, ...prev]);
    setTodaysPasses(prev => prev + 1);
    
    return {
      success: true,
      message: `Welcome ${vehicle.owner_name}! Vehicle recognized.`,
      vehicle,
      hasExpired: false,
      expiredDocuments: [],
      warningCount: 0,
      blocked: false
    };
  }, [vehicles, getExpiredDocuments, getWarningCount]);

  const allowEntryWithWarning = useCallback((vehicleId) => {
    // Increment the warning counter - independent operation
    incrementWarning(vehicleId);

    // Add pass record
    const vehicle = vehicles.find(v => v.id === vehicleId);
    if (vehicle) {
      const newPass = {
        time: new Date().toLocaleTimeString('en-US', { hour12: false }),
        id_number: vehicle.id,
        owner_name: vehicle.owner_name,
        department: vehicle.department,
        license_plate: vehicle.license_plate,
        status: 'Recognized (With Warning)'
      };
      
      setPasses(prev => [newPass, ...prev]);
      setTodaysPasses(prev => prev + 1);
    }

    // Get current warning count after increment
    const today = new Date().toDateString();
    const key = `${vehicleId}-${today}`;
    const currentCount = expiryWarnings[key] || 0;
    const remaining = Math.max(0, 2 - currentCount);

    return {
      success: true,
      message: `Entry allowed. ${remaining} attempts remaining.`
    };
  }, [vehicles, incrementWarning, expiryWarnings]);

  const addVehicle = useCallback((vehicleData) => {
    const newVehicle = {
      id: vehicleData.id_number,
      owner_name: vehicleData.owner_name,
      department: vehicleData.department,
      license_plate: vehicleData.license_plate,
      sticker_number: vehicleData.sticker_number || '',
      rfid_tag: vehicleData.rfid_tag || '',
      status: 'Active',
      vehicle_type: vehicleData.vehicle_type || '',
      vehicle_color: vehicleData.vehicle_color || '',
      or_cr_expiry: vehicleData.or_cr_expiry_date || '',
      driver_license_expiry: vehicleData.driver_license_expiry_date || '',
      notes: vehicleData.notes || '',
      vehicle_image: vehicleData.vehicle_image || ''
    };
    
    setVehicles(prev => [...prev, newVehicle]);
    return newVehicle;
  }, []);

  const updateVehicle = useCallback((id, vehicleData) => {
    setVehicles(prev => 
      prev.map(v => v.id === id ? { ...v, ...vehicleData } : v)
    );
  }, []);

  const deleteVehicle = useCallback((id) => {
    setVehicles(prev => prev.filter(v => v.id !== id));
  }, []);

  const importVehiclesFromCSV = useCallback((csvData) => {
    const newVehicles = csvData.map(row => ({
      id: row.id_number,
      owner_name: row.owner_name,
      department: row.department,
      license_plate: row.license_plate,
      sticker_number: row.sticker_number || '',
      rfid_tag: row.rfid_tag || row.sticker_number || '',
      status: 'Active',
      vehicle_type: row.vehicle_type || '',
      vehicle_color: row.vehicle_color || '',
      or_cr_expiry: row.or_cr_expiry_date || '',
      driver_license_expiry: row.driver_license_expiry_date || '',
      notes: row.notes || '',
      vehicle_image: row.vehicle_image || ''
    }));
    
    setVehicles(prev => [...prev, ...newVehicles]);
    return newVehicles;
  }, []);

  const value = {
    vehicles,
    passes,
    systemStatus,
    todaysPasses,
    verifyAndEnterCard,
    allowEntryWithWarning,
    addVehicle,
    updateVehicle,
    deleteVehicle,
    importVehiclesFromCSV,
    setTodaysPasses,
    getWarningCount
  };

  return <RFIDContext.Provider value={value}>{children}</RFIDContext.Provider>;
};

export const useRFID = () => {
  const context = React.useContext(RFIDContext);
  if (!context) {
    throw new Error('useRFID must be used within RFIDProvider');
  }
  return context;
};
