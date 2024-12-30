import React, { useState } from 'react';
import { FaUser, FaEnvelope, FaPhone, FaLock, FaIdCard } from 'react-icons/fa';

const Registration = () => {
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    fullName: '',
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
    vehicleAssigned: ''
  });

  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f6f8fb 0%, #e9edf3 100%)',
      padding: '2rem 1rem',
    },
    formCard: {
      maxWidth: '480px',
      margin: '0 auto',
      background: 'white',
      borderRadius: '16px',
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
      padding: '2rem',
    },
    title: {
      color: '#2d3748',
      fontSize: '1.75rem',
      fontWeight: '700',
      textAlign: 'center',
      marginBottom: '2rem',
      position: 'relative',
      paddingBottom: '1rem',
      borderBottom: '3px solid #800000',
      width: 'fit-content',
      margin: '0 auto 2rem',
    },
    formGroup: {
      marginBottom: '1.5rem',
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
      padding: '0.75rem 1rem',
      border: '2px solid #e2e8f0',
      borderRadius: '8px',
      fontSize: '0.875rem',
      transition: 'all 0.2s',
      background: '#f8fafc',
      outline: 'none',
    },
    select: {
      width: '100%',
      padding: '0.75rem 1rem',
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
      marginTop: '2rem',
    },
    button: {
      flex: 1,
      padding: '0.75rem 1.5rem',
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
    }
  };

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validatePhone = (phone) => {
    return /^\d{10}$/.test(phone);
  };

  const validatePassword = (password) => {
    return password.length >= 6;
  };

  const validateStep1 = () => {
    const newErrors = {};
    if (!formData.fullName) newErrors.fullName = 'Full name is required';
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
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    } else if (step === 2 && validateStep2()) {
      console.log('Form submitted:', formData);
    }
  };

  const handleBack = () => {
    setStep(1);
  };

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
      <div style={styles.formCard}>
        <h2 style={styles.title}>Registration Form - Step {step}</h2>
        
        {step === 1 ? (
          <>
            {renderInput('fullName', 'Full Name', 'text', <FaUser />)}
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
              </select>
              {errors.role && <div style={styles.error}>{errors.role}</div>}
            </div>
          </>
        ) : (
          <>
            {formData.role === 'student' && (
              <>
                {renderInput('studentId', 'Student ID', 'text', <FaIdCard />)}
                {renderInput('faculty', 'Faculty')}
                {renderInput('level', 'Level')}
              </>
            )}
            
            {formData.role === 'lecturer' && (
              <>
                {renderInput('staffId', 'Staff ID', 'text', <FaIdCard />)}
                {renderInput('department', 'Department')}
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
                {renderInput('vehicleAssigned', 'Vehicle Assigned (Optional)')}
              </>
            )}
          </>
        )}

        <div style={styles.buttonGroup}>
          {step === 2 && (
            <button
              onClick={handleBack}
              style={{ ...styles.button, ...styles.secondaryButton }}
            >
              Back
            </button>
          )}
          <button
            onClick={handleNext}
            style={{ ...styles.button, ...styles.primaryButton }}
          >
            {step === 1 ? 'Next' : 'Submit'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Registration;