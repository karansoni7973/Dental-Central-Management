import { useState, useEffect } from "react";
import { v4 as uuid } from "uuid";

const initialState = {
  name: "",
  dob: "",
  contact: "",
  email: "",
  healthInfo: ""
};

const PatientForm = ({ onSave, selectedPatient, onCancel }) => {
  const [form, setForm] = useState(initialState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [showCredentials, setShowCredentials] = useState(false);
  const [generatedCredentials, setGeneratedCredentials] = useState({
    email: "",
    password: ""
  });

  useEffect(() => {
    if (selectedPatient) setForm(selectedPatient);
    else setForm(initialState);
  }, [selectedPatient]);

  const validateForm = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Name is required";
    if (!form.dob) newErrors.dob = "Date of birth is required";
    if (!form.contact.trim()) newErrors.contact = "Contact information is required";
    if (!form.email.trim()) newErrors.email = "Email is required";
    
    // Validate email format
    if (form.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    
    // Validate contact format (phone number)
    if (form.contact.trim() && !/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/.test(form.contact)) {
      newErrors.contact = "Please enter a valid phone number";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const generateTempPassword = () => {
    
    let password = "12345678";
    
    return password;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    try {
      // Generate temporary password
      const tempPassword = generateTempPassword();
      
      // Prepare patient data with credentials
      const patientData = {
        ...form,
        credentials: {
          email: form.email,
          password: tempPassword
        }
      };
      
      await onSave(patientData);
      
      // Show credentials to admin
      setGeneratedCredentials({
        email: form.email,
        password: tempPassword
      });
      setShowCredentials(true);
      
      if (!selectedPatient) {
        setForm(initialState);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        {selectedPatient ? "Edit Patient" : "Add New Patient"}
      </h2>
      
      {showCredentials && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="font-medium text-blue-800 mb-2">Patient Login Credentials</h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>Email:</div>
            <div className="font-mono">{generatedCredentials.email}</div>
            <div>Temporary Password:</div>
            <div className="font-mono">{generatedCredentials.password}</div>
          </div>
          <p className="mt-3 text-xs text-blue-600">
            Please provide these credentials to the patient. They should change their password after first login.
          </p>
          <button
            onClick={() => setShowCredentials(false)}
            className="mt-2 text-sm text-blue-600 hover:text-blue-800"
          >
            Close
          </button>
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Full Name *
          </label>
          <input
            id="name"
            name="name"
            placeholder="John Doe"
            value={form.name}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${
              errors.name ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
        </div>
        
        <div className="mb-4">
          <label htmlFor="dob" className="block text-sm font-medium text-gray-700 mb-1">
            Date of Birth *
          </label>
          <input
            id="dob"
            name="dob"
            type="date"
            value={form.dob}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${
              errors.dob ? "border-red-500" : "border-gray-300"
            }`}
            max={new Date().toISOString().split('T')[0]}
          />
          {errors.dob && <p className="mt-1 text-sm text-red-600">{errors.dob}</p>}
        </div>
        
        <div className="mb-4">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email *
          </label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="patient@example.com"
            value={form.email}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${
              errors.email ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
        </div>
        
        <div className="mb-4">
          <label htmlFor="contact" className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number *
          </label>
          <input
            id="contact"
            name="contact"
            placeholder="123-456-7890"
            value={form.contact}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${
              errors.contact ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.contact && <p className="mt-1 text-sm text-red-600">{errors.contact}</p>}
        </div>
        
        <div className="mb-6">
          <label htmlFor="healthInfo" className="block text-sm font-medium text-gray-700 mb-1">
            Health Information
          </label>
          <textarea
            id="healthInfo"
            name="healthInfo"
            placeholder="Allergies, current medications, etc."
            value={form.healthInfo}
            onChange={handleChange}
            rows="3"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
          />
        </div>
        
        <div className="flex justify-end space-x-3">
          {selectedPatient && (
            <button
              onClick={onCancel}
              type="button"
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition font-medium"
              disabled={isSubmitting}
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            className={`px-4 py-2 rounded-lg transition font-medium ${
              isSubmitting
                ? "bg-blue-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : (
              selectedPatient ? "Update Patient" : "Create Patient"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PatientForm;