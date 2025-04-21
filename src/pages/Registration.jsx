import React, { useState, useEffect } from 'react';
import { FaUser, FaEnvelope, FaPhone, FaLock, FaIdCard, FaCar } from 'react-icons/fa';
import axios from 'axios';
import Alert from '../components/Alert';

const Registration = () => {
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: '',
    studentId: '',
    faculty: '',
    level: '',
    staffId: '',
    department: '',
    position: '',
    licenseNumber: '',
    vehicleAssigned: '',
  });
  const [vehicles, setVehicles] = useState([]);


  const faculties = [
    "Science",
    "Humanities & Social Sciences",
    "Management",
    "Fisheries",
    "Medicine",
    "Engineering"
  ];
  
  const levels = ["1", "2", "3", "4"];


  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alert, setAlert] = useState({ visible: false, title: '', message: '' });

  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f6f8fb 0%, #e9edf3 100%)',
      padding: '0.5rem 1rem',
      marginTop: '4rem',
    },
    formCard: {
      maxWidth: '400px',
      margin: '0 auto',
      background: 'white',
      borderRadius: '16px',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
      padding: '1.3rem',
    },
    title: {
      color: '#2d3748',
      fontSize: '1.5rem',
      fontWeight: '700',
      textAlign: 'center',
      marginBottom: '1.5rem',
      position: 'relative',
      paddingBottom: '1rem',
      borderBottom: '3px solid #800000',
      width: 'fit-content',
      margin: '0 auto 1.5rem',
    },
    formGroup: {
      marginBottom: '0.65rem',
    },
    label: {
      display: 'block',
      color: '#4a5568',
      fontSize: '0.875rem',
      fontWeight: '500',
      marginBottom: '0.5rem',
    },
    input: {
      width: '100%',
      padding: '0.4rem 0.65rem',
      border: '2px solid #e2e8f0',
      borderRadius: '8px',
      fontSize: '0.875rem',
      transition: 'all 0.2s',
      background: '#f8fafc',
      outline: 'none',
    },
    select: {
      width: '100%',
      padding: '0.4rem 0.65rem',
      border: '2px solid #e2e8f0',
      borderRadius: '8px',
      fontSize: '0.875rem',
      background: '#f8fafc',
      outline: 'none',
    },
    error: {
      color: '#e53e3e',
      fontSize: '0.75rem',
      marginTop: '0.25rem',
    },
    buttonGroup: {
      display: 'flex',
      gap: '1rem',
      marginTop: '0.8rem',
    },
    button: {
      flex: 1,
      padding: '0.4rem 1rem',
      borderRadius: '8px',
      border: 'none',
      fontSize: '0.875rem',
      fontWeight: '500',
      cursor: 'pointer',
      transition: 'background-color 0.2s',
    },
    primaryButton: {
      backgroundColor: '#800000',
      color: 'white',
    },
    secondaryButton: {
      backgroundColor: '#de9e28',
      color: 'white',
    },
    iconWrapper: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.5rem',
      marginRight: '0.5rem',
    },
  };

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePhone = (phone) => /^\d{10}$/.test(phone);
  const validatePassword = (password) => password.length >= 6;

  const validateStep1 = () => {
    const newErrors = {};
    if (!formData.full_name) newErrors.full_name = 'Full name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!validateEmail(formData.email)) newErrors.email = 'Invalid email format';
    if (!formData.phone) newErrors.phone = 'Phone number is required';
    else if (!validatePhone(formData.phone)) newErrors.phone = 'Invalid phone number';
    if (!formData.password) newErrors.password = 'Password is required';
    else if (!validatePassword(formData.password)) newErrors.password = 'Password must be at least 6 characters';
    if (!formData.confirmPassword) newErrors.confirmPassword = 'Confirm password is required';
    else if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    if (!formData.role) newErrors.role = 'Role is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors = {};
    switch (formData.role) {
      case 'student':
        if (!formData.studentId) newErrors.studentId = 'Student ID is required';
        if (!formData.faculty) newErrors.faculty = 'Faculty is required';
        if (!formData.level) newErrors.level = 'Level is required';
        break;
      case 'lecturer':
        if (!formData.staffId) newErrors.staffId = 'Staff ID is required';
        if (!formData.department) newErrors.department = 'Department is required';
        break;
      case 'nonAcademic':
        if (!formData.staffId) newErrors.staffId = 'Staff ID is required';
        if (!formData.position) newErrors.position = 'Position is required';
        break;
      case 'driver':
        if (!formData.licenseNumber) newErrors.licenseNumber = 'License number is required';
        break;
      case 'guard':
        if (!formData.staffId) newErrors.staffId = 'Staff ID is required';
        if (!formData.position) newErrors.position = 'Position is required';
        break;

      default:
        break;
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    } else if (step === 2 && validateStep2()) {
      handleSubmit();
    }
  };

  const handleBack = () => {
    setStep(1);
  };

  const handleSubmit = async (e) => {
    setIsSubmitting(true);

    try {
      const response = await axios.post('https://urban-space-fiesta-pjg55v44qp6gfr96v-5000.app.github.dev/api/auth/register', formData);
      setAlert({ visible: true, title: 'Success', message: response.data.message });
      setFormData({
        full_name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        role: '',
        studentId: '',
        faculty: '',
        level: '',
        staffId: '',
        department: '',
        position: '',
        licenseNumber: '',
        vehicleAssigned: '',
      });
      setStep(1);
    } catch (error) {
      const errorMessage = error.response.data.error ;
      setAlert({ visible: true, title: 'Error', message: `Registration failed: ${errorMessage}` });
    } finally {
      setIsSubmitting(false);
    }
  };


// Fetch vehicles from backend
useEffect(() => {
  const fetchVehicles = async () => {
    try {
      const response = await fetch('https://urban-space-fiesta-pjg55v44qp6gfr96v-5000.app.github.dev/api/auth/getvehicles'); // Replace with your API endpoint
      const data = await response.json();
      setVehicles(data);
    } catch (error) {
      console.error('Error fetching vehicles:', error);
    }
  };

  if (formData.role === 'driver') {
    fetchVehicles();
  }
}, [formData.role]);

// Create a renderDropdown function
const renderDropdown = (name, label, icon, options) => (
  <div className="form-group">
    <label htmlFor={name}>{label}</label>
    <div className="input-group">
      {icon && (
        <div className="input-group-prepend">
          <span className="input-group-text">{icon}</span>
        </div>
      )}
      <select
        className="form-control"
        id={name}
        name={name}
        value={formData[name] || ''}
        onChange={handleChange}
      >
        <option value="">Select a vehicle</option>
        {options.map((vehicle) => (
          <option key={vehicle.id} value={vehicle.id}>
            {vehicle.make} {vehicle.model} {vehicle.registrationNumber}
          </option>
        ))}
      </select>
    </div>
  </div>
);


  const renderInput = (name, label, type = 'text', icon = null) => (
    <div style={styles.formGroup}>
      <label style={styles.label}>
        {icon && <span style={styles.iconWrapper}>{icon}</span>}
        {label}
      </label>
      <input
        type={type}
        name={name}
        value={formData[name]}
        onChange={handleChange}
        style={{
          ...styles.input,
          borderColor: errors[name] ? '#e53e3e' : '#e2e8f0',
        }}
        placeholder={`Enter your ${label.toLowerCase()}`}
      />
      {errors[name] && <div style={styles.error}>{errors[name]}</div>}
    </div>
  );

  return (
    <div style={styles.container}>
      {alert.visible && (
        <Alert
          title={alert.title}
          message={alert.message}
          setAlertVisible={(visible) => setAlert((prev) => ({ ...prev, visible }))}
        />
      )}
      <div style={styles.formCard}>
        <h2 style={styles.title}>Registration Form - Step {step}</h2>

        {step === 1 ? (
          <>
            {renderInput('full_name', 'Full Name', 'text', <FaUser />)}
            {renderInput('email', 'Email', 'email', <FaEnvelope />)}
            {renderInput('phone', 'Phone Number', 'tel', <FaPhone />)}
            {renderInput('password', 'Password', 'password', <FaLock />)}
            {renderInput('confirmPassword', 'Confirm Password', 'password', <FaLock />)}

            <div style={styles.formGroup}>
              <label style={styles.label}>Role</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                style={styles.select}
              >
                <option value="">Select Role</option>
                <option value="student">Student</option>
                <option value="lecturer">Lecturer</option>
                <option value="nonAcademic">Non Academic</option>
                <option value="driver">Driver</option>
                <option value="guard">Guard</option>
              </select>
              {errors.role && <div style={styles.error}>{errors.role}</div>}
            </div>
          </>
        ) : (
          <>
{formData.role === 'student' && (
  <>
    {renderInput('studentId', 'Student ID', 'text', <FaIdCard />)}
    <div className="mb-4">
      <label htmlFor="faculty" className="block text-sm font-medium text-gray-700">
        Faculty *
      </label>
      <select
        id="faculty"
        name="faculty"
        value={formData.faculty}
        onChange={handleChange}
        className="w-full p-2 mt-1 rounded-lg border border-gray-300 focus:outline-none focus:ring focus:ring-blue-300"
        required
      >
        <option value="" disabled>Select Faculty</option>
        {faculties.map(faculty => (
          <option key={faculty} value={faculty}>{faculty}</option>
        ))}
      </select>
    </div>
    <div className="mb-4">
      <label htmlFor="level" className="block text-sm font-medium text-gray-700">
        Level *
      </label>
      <select
        id="level"
        name="level"
        value={formData.level}
        onChange={handleChange}
        className="w-full p-2 mt-1 rounded-lg border border-gray-300 focus:outline-none focus:ring focus:ring-blue-300"
        required
      >
        <option value="" disabled>Select Level</option>
        {levels.map(level => (
          <option key={level} value={level}>{level}</option>
        ))}
      </select>
    </div>
  </>
)}

{formData.role === 'lecturer' && (
  <>
    {renderInput('staffId', 'Staff ID', 'text', <FaIdCard />)}
    <div className="mb-4">
      <label htmlFor="faculty" className="block text-sm font-medium text-gray-700">
        Faculty *
      </label>
      <select
        id="faculty"
        name="faculty"
        value={formData.faculty}
        onChange={handleChange}
        className="w-full p-2 mt-1 rounded-lg border border-gray-300 focus:outline-none focus:ring focus:ring-blue-300"
        required
      >
        <option value="" disabled>Select Faculty</option>
        {faculties.map(faculty => (
          <option key={faculty} value={faculty}>{faculty}</option>
        ))}
      </select>
    </div>
  </>
)}

            {formData.role === 'nonAcademic' && (
              <>
                {renderInput('staffId', 'Staff ID', 'text', <FaIdCard />)}
                {renderInput('position', 'Position')}
              </>
            )}

{formData.role === 'driver' && (
  <>
    {renderInput('licenseNumber', 'License Number', 'text', <FaIdCard />)}
    {renderDropdown(
      'vehicleAssigned', 
      'Vehicle Assigned (Optional)', 
      <FaCar />,
      vehicles
    )}
  </>
)}

{formData.role === 'guard' && (
              <>
                {renderInput('staffId', 'Staff ID', 'text', <FaIdCard />)}
                {renderInput('position', 'Position')}
              </>
            )}
          </>
        )}

        <div style={styles.buttonGroup}>
          {step === 2 && (
            <button
              onClick={handleBack}
              style={{ ...styles.button, ...styles.secondaryButton }}
              disabled={isSubmitting}
            >
              Back
            </button>
          )}

          <button
            onClick={handleNext}
            style={{ ...styles.button, ...styles.primaryButton }}
            disabled={isSubmitting}
          >
            {step === 1 ? 'Next' : 'Submit'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Registration;
