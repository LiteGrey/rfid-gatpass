import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AddVehicleForm.css';

const AddVehicleForm = ({ onSubmit, onCancel }) => {
  const navigate = useNavigate();
  const stickerInputRef = useRef(null);
  const imageInputRef = useRef(null);
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
    vehicle_image: '' // Base64 image data
  });

  const [rfidDetected, setRfidDetected] = useState(false);
  const [imagePreview, setImagePreview] = useState('');

  // Auto-focus sticker input for RFID scanning on mount
  useEffect(() => {
    if (stickerInputRef.current) {
      stickerInputRef.current.focus();
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setRfidDetected(false);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size must be less than 5MB');
        return;
      }

      // Convert to base64
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64Image = event.target.result;
        setFormData(prev => ({
          ...prev,
          vehicle_image: base64Image
        }));
        setImagePreview(base64Image);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setFormData(prev => ({
      ...prev,
      vehicle_image: ''
    }));
    setImagePreview('');
    if (imageInputRef.current) {
      imageInputRef.current.value = '';
    }
  };

  const handleStickerInput = (e) => {
    const value = e.target.value;
    setFormData(prev => ({
      ...prev,
      sticker_number: value
    }));
    
    // Detect RFID scan (typically ends with Enter key)
    if (e.key === 'Enter' && value.trim()) {
      setRfidDetected(true);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validation
    if (!formData.id_number.trim() || !formData.sticker_number.trim() ||
        !formData.owner_name.trim() || !formData.department.trim() ||
        !formData.license_plate.trim() ||
        !formData.or_cr_expiry_date.trim() || !formData.driver_license_expiry_date.trim()) {
      alert('Please fill in all required fields, including expiry dates');
      return;
    }

    onSubmit(formData);

    // Reset form
    setFormData({
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
      vehicle_image: ''
    });
    removeImage();
    setRfidDetected(false);
    // Navigate back to vehicles page
    navigate('/vehicles');
  };

  return (
    <div className="add-vehicle-form-wrapper">
      <div className="add-vehicle-form">
        <h3>Add New Vehicle</h3>
        
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Sticker Number <span className="required">*</span></label>
              <input 
                ref={stickerInputRef}
                type="text" 
                name="sticker_number"
                value={formData.sticker_number}
                onChange={handleChange}
                onKeyDown={handleStickerInput}
                placeholder="Scan RFID or enter sticker number"
                className={rfidDetected ? 'rfid-detected' : ''}
              />
            </div>
            <div className="form-group">
              <label>ID Number <span className="required">*</span></label>
              <input 
                type="text" 
                name="id_number"
                value={formData.id_number}
                onChange={handleChange}
                placeholder=""
              />
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
              <label>Department <span className="required">*</span></label>
              <input 
                type="text" 
                name="department"
                value={formData.department}
                onChange={handleChange}
                placeholder=""
              />
            </div>
          </div>

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
              <label>License Plate <span className="required">*</span></label>
              <input 
                type="text" 
                name="license_plate"
                value={formData.license_plate}
                onChange={handleChange}
                placeholder=""
              />
            </div>
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
          </div>

          <div className="form-row">
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

          <div className="form-group">
            <label>RFID Tag ID</label>
            <input 
              type="text" 
              name="rfid_tag"
              value={formData.rfid_tag}
              onChange={handleChange}
              placeholder="Enter RFID tag ID for this vehicle"
            />
          </div>

          <div className="form-group full-width">
            <label>Vehicle Image (Optional)</label>
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
                📷 Upload Image
              </button>
              {imagePreview && (
                <div className="image-preview">
                  <img src={imagePreview} alt="Vehicle preview" />
                  <button 
                    type="button"
                    className="btn-remove-image"
                    onClick={removeImage}
                  >
                    ✕ Remove
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="form-group full-width">
            <label>Notes (Optional)</label>
            <textarea 
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows="4"
            ></textarea>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn-submit">Create Vehicle</button>
            <button 
              type="button" 
              className="btn-cancel" 
              onClick={() => {
                onCancel();
                navigate('/vehicles');
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddVehicleForm;
