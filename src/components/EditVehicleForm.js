import React, { useState, useEffect, useRef } from 'react';
import './EditVehicleForm.css';

// Helper function to format date to YYYY-MM-DD for date input
const formatDateForInput = (dateString) => {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return ''; // Invalid date
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  } catch (e) {
    return '';
  }
};

const EditVehicleForm = ({ vehicle, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    id_number: '',
    sticker_number: '',
    owner_name: '',
    department: '',
    license_plate: '',
    or_cr_expiry_date: '',
    driver_license_expiry_date: '',
    vehicle_type: '',
    vehicle_color: '',
    rfid_tag: '',
    notes: '',
    status: 'Active',
    vehicle_image: ''
  });
  const [imagePreview, setImagePreview] = useState('');
  const imageInputRef = useRef(null);

  // Populate form data when vehicle prop changes
  useEffect(() => {
    if (vehicle) {
      setFormData({
        id_number: vehicle.id || '',
        sticker_number: vehicle.sticker_number || '',
        owner_name: vehicle.owner_name || '',
        department: vehicle.department || '',
        license_plate: vehicle.license_plate || '',
        or_cr_expiry_date: formatDateForInput(vehicle.or_cr_expiry),
        driver_license_expiry_date: formatDateForInput(vehicle.driver_license_expiry),
        vehicle_type: vehicle.vehicle_type || '',
        vehicle_color: vehicle.vehicle_color || '',
        rfid_tag: vehicle.rfid_tag || '',
        notes: vehicle.notes || '',
        status: vehicle.status || 'Active',
        vehicle_image: vehicle.vehicle_image || ''
      });
      setImagePreview(vehicle.vehicle_image || '');
    }
  }, [vehicle]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/') && file.size <= 5 * 1024 * 1024) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData(prev => ({ ...prev, vehicle_image: event.target.result }));
        setImagePreview(event.target.result);
      };
      reader.readAsDataURL(file);
    } else {
      alert('Please select a valid image file (max 5MB)');
    }
  };

  const removeImage = () => {
    setFormData(prev => ({ ...prev, vehicle_image: '' }));
    setImagePreview('');
    if (imageInputRef.current) {
      imageInputRef.current.value = '';
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation
    if (!formData.owner_name.trim() || !formData.department.trim() ||
        !formData.license_plate.trim() || !formData.sticker_number.trim() ||
        !formData.or_cr_expiry_date.trim() || !formData.driver_license_expiry_date.trim()) {
      alert('Please fill in all required fields, including expiry dates');
      return;
    }

    // Ensure expiry dates are preserved - they should not be cleared
    const submitData = {
      ...formData,
      // Explicitly preserve expiry dates from original vehicle if editing
      or_cr_expiry_date: formData.or_cr_expiry_date || vehicle?.or_cr_expiry || '',
      driver_license_expiry_date: formData.driver_license_expiry_date || vehicle?.driver_license_expiry || ''
    };

    onSubmit(submitData);
  };

  return (
    <div className="edit-vehicle-form-wrapper">
      <div className="edit-vehicle-form">
        <h3>Edit Vehicle</h3>
        <div className="form-info-note">
          ℹ️ Expiry warning count is independent and will NOT be reset by editing vehicle information.
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>OR/CR Expiry <span className="required">*</span></label>
              <input
                type="date"
                name="or_cr_expiry_date"
                value={formData.or_cr_expiry_date}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Driver License Expiry <span className="required">*</span></label>
              <input
                type="date"
                name="driver_license_expiry_date"
                value={formData.driver_license_expiry_date}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Sticker Number <span className="required">*</span></label>
              <input 
                type="text" 
                name="sticker_number"
                value={formData.sticker_number}
                onChange={handleChange}
                placeholder=""
              />
            </div>
            <div className="form-group">
              <label>Status</label>
              <select 
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
                <option value="Pending">Pending</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Owner Name <span className="required">*</span></label>
              <input 
                type="text" 
                name="owner_name"
                value={formData.owner_name}
                onChange={handleChange}
                placeholder=""
              />
            </div>
            <div className="form-group">
              <label>ID Number <span className="required">*</span></label>
              <input 
                type="text" 
                name="id_number"
                value={formData.id_number}
                disabled
                placeholder=""
              />
              <small>ID cannot be changed</small>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Department <span className="required">*</span></label>
              <input 
                type="text" 
                name="department"
                value={formData.department}
                onChange={handleChange}
                placeholder=""
              />
            </div>
            <div className="form-group">
              <label>License Plate <span className="required">*</span></label>
              <input 
                type="text" 
                name="license_plate"
                value={formData.license_plate}
                onChange={handleChange}
                placeholder=""
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Vehicle Type</label>
              <input 
                type="text" 
                name="vehicle_type"
                value={formData.vehicle_type}
                onChange={handleChange}
                placeholder="e.g., SUV, Sedan"
              />
            </div>
            <div className="form-group">
              <label>Vehicle Color</label>
              <input 
                type="text" 
                name="vehicle_color"
                value={formData.vehicle_color}
                onChange={handleChange}
                placeholder=""
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>RFID Tag ID</label>
              <input 
                type="text" 
                name="rfid_tag"
                value={formData.rfid_tag}
                onChange={handleChange}
                placeholder="RFID tag"
              />
            </div>
          </div>

          <div className="form-group full-width">
            <label>Notes (Optional)</label>
            <textarea 
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows="3"
              placeholder="Any additional notes about this vehicle"
            ></textarea>
          </div>

          <div className="image-upload-section">
            <input
              ref={imageInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              style={{ display: 'none' }}
            />
            <button
              type="button"
              className="btn-upload-image"
              onClick={() => imageInputRef.current?.click()}
            >
              📷 {imagePreview ? 'Change Image' : 'Upload Vehicle Image'}
            </button>
            {imagePreview && (
              <div className="image-preview">
                <img src={imagePreview} alt="Vehicle preview" />
                <button
                  type="button"
                  className="btn-remove-image"
                  onClick={() => removeImage()}
                >
                  ✕
                </button>
              </div>
            )}
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-submit">Save Changes</button>
            <button type="button" className="btn-cancel" onClick={onCancel}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditVehicleForm;
