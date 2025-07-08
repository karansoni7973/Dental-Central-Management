import { useEffect, useState } from "react";
import PatientForm from "../components/patients/PatientForm";
import PatientList from "../components/patients/PatientList";
import AppointmentForm from "../components/appointments/AppointmentForm";
import AppointmentList from "../components/appointments/AppointmentList";
import { v4 as uuid } from "uuid";
import { useAuth } from "../auth/AuthContext";

// Utility functions
const getPatients = () => JSON.parse(localStorage.getItem("patients")) || [];
const savePatients = (patients) => localStorage.setItem("patients", JSON.stringify(patients));
const getAppointments = () => {
  try {
    const appointments = JSON.parse(localStorage.getItem("appointments")) || [];
    console.log("Loaded appointments from localStorage:", appointments);
    return appointments;
  } catch (error) {
    console.error("Error loading appointments:", error);
    return [];
  }
};

const saveAppointments = (appointments) => {
  try {
    console.log("Saving appointments:", appointments);
    localStorage.setItem("appointments", JSON.stringify(appointments));
  } catch (error) {
    console.error("Error saving appointments:", error);
  }
};

const AdminDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [showAllAppointments, setShowAllAppointments] = useState(false);
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showPatientForm, setShowPatientForm] = useState(false);
  const [showAppointmentForm, setShowAppointmentForm] = useState(false);
  const [activeTab, setActiveTab] = useState("patients");
  const { user, logout } = useAuth();


  const getPatientNameById = (patientId) => {
    const patient = patients.find(p => p.id === patientId);
    return patient ? patient.name : 'Unknown Patient';
  };

  useEffect(() => {
    const storedAppointments = getAppointments();
    const storedPatients = getPatients();
    console.log("Loaded appointments:", storedAppointments); // Debug log
    console.log("Loaded patients:", storedPatients);
    setAppointments(storedAppointments);
    setPatients(storedPatients);
  }, []);

  const upcoming = appointments
    .filter(appt => new Date(appt.appointmentDate) > new Date())
    .sort((a, b) => new Date(a.appointmentDate) - new Date(b.appointmentDate))
    .slice(0, 10);

  const completed = appointments.filter(appt => appt.status === "Completed").length;
  const pending = appointments.filter(appt => appt.status !== "Completed").length;
  const totalRevenue = appointments.reduce((sum, a) => sum + (a.cost || 0), 0);

  // Patient Handlers
  // In AdminDashboard.jsx
const handleSavePatient = (patient) => {
  let updatedPatients;
  const users = JSON.parse(localStorage.getItem("users")) || [];

  if (patient.id) {
    // Update existing patient
    updatedPatients = patients.map(p => (p.id === patient.id ? patient : p));
  } else {
    // Create new patient with user account
    patient.id = uuid();
    updatedPatients = [...patients, patient];
    
    // Create corresponding user account
    const tempPassword = "12345678"; // This matches what PatientForm generates
    const newUser = {
      id: uuid(),
      role: "Patient",
      email: patient.email, // Make sure this matches the form
      password: tempPassword,
      patientId: patient.id
    };
    
    // Save to localStorage
    localStorage.setItem("users", JSON.stringify([...users, newUser]));
    
    // Show credentials to admin
    alert(`Patient account created!\nEmail: ${patient.email}\nTemporary Password: ${tempPassword}`);
  }

  setPatients(updatedPatients);
  savePatients(updatedPatients);
  setSelectedPatient(null);
  setShowPatientForm(false);
};
  

  const handleDeletePatient = (id) => {
    if (window.confirm("Are you sure you want to delete this patient?")) {
      const updated = patients.filter(p => p.id !== id);
      setPatients(updated);
      savePatients(updated);
    }
  };

  // Appointment Handlers
  const handleSaveAppointment = (appointment) => {
    console.log("Appointment received in AdminDashboard:", appointment);

    if (!appointment.title || !appointment.patientId || !appointment.appointmentDate) {
      alert("Missing required fields");
      return;
    }

    try {
      let updatedAppointments;

      const existingIndex = appointments.findIndex(a => a.id === appointment.id);

      if (existingIndex !== -1) {
        // Update existing
        updatedAppointments = [...appointments];
        updatedAppointments[existingIndex] = appointment;
      } else {
        // Add new
        updatedAppointments = [...appointments, appointment];
      }

      console.log("Updated appointments:", updatedAppointments);
      setAppointments(updatedAppointments);
      saveAppointments(updatedAppointments);
      setSelectedAppointment(null);
      setShowAppointmentForm(false);
    } catch (error) {
      console.error("Error saving appointment:", error);
      alert("Failed to save appointment");
    }
  };


  const handleDeleteAppointment = (id) => {
    if (window.confirm("Are you sure you want to delete this appointment?")) {
      const updated = appointments.filter(a => a.id !== id);
      setAppointments(updated);
      saveAppointments(updated);
    }
  };


  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">Admin Dashboard</h1>
          <button
            onClick={logout}
            className="px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition"
          >
            Logout
          </button>
      </div>
      

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div>
              <h2 className="text-sm text-gray-500 font-medium">Total Patients</h2>
              <p className="text-2xl font-bold text-gray-800">{patients.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 text-yellow-600 mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h2 className="text-sm text-gray-500 font-medium">Pending Treatments</h2>
              <p className="text-2xl font-bold text-gray-800">{pending}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h2 className="text-sm text-gray-500 font-medium">Completed Treatments</h2>
              <p className="text-2xl font-bold text-gray-800">{completed}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 text-purple-600 mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h2 className="text-sm text-gray-500 font-medium">Total Revenue</h2>
              <p className="text-2xl font-bold text-gray-800">₹{totalRevenue.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Upcoming Appointments */}
        <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800">Upcoming Appointments</h2>
            {upcoming.length > 2 && (
              <button 
                onClick={() => setShowAllAppointments(true)}
                className="text-sm text-blue-600 hover:text-blue-800 font-medium"
              >
                View All ({upcoming.length})
              </button>
            )}
          </div>
          
          {upcoming.length === 0 ? (
            <div className="text-center py-8">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <p className="mt-2 text-gray-500">No upcoming appointments</p>
            </div>
          ) : (
            <div className="space-y-4">
              {upcoming.slice(0,2).map(appt => (
                <div key={appt.id} className="flex items-start p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition">
                  <div className="bg-blue-100 text-blue-800 p-2 rounded-lg mr-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-800">{appt.title}</h3>
                    <p className="text-sm text-gray-500">
                      {new Date(appt.appointmentDate).toLocaleString('en-US', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    appt.status === 'Completed' ? 'bg-green-100 text-green-800' :
                    appt.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {appt.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>



        {/* All Appointments Modal */}
        {showAllAppointments && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] flex flex-col">
              <div className="flex justify-between items-center border-b p-4">
                <h3 className="text-lg font-semibold text-gray-800">All Upcoming Appointments</h3>
                <button 
                  onClick={() => setShowAllAppointments(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="overflow-y-auto p-4">
                <div className="space-y-4">
                  {upcoming.map(appt => (
                    <div key={appt.id} className="flex items-start p-4 border border-gray-100 rounded-lg hover:bg-gray-50 transition">
                      <div className="bg-blue-100 text-blue-800 p-2 rounded-lg mr-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium text-gray-800">{appt.title}</h3>
                            <p className="text-sm font-medium text-gray-600">
                              {getPatientNameById(appt.patientId)}
                            </p>
                          </div>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            appt.status === 'Completed' ? 'bg-green-100 text-green-800' :
                            appt.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {appt.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">
                          {new Date(appt.appointmentDate).toLocaleString('en-US', {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                        {appt.treatment && (
                          <p className="text-sm text-gray-600 mt-2">{appt.treatment}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="border-t p-4 flex justify-end">
                <button
                  onClick={() => setShowAllAppointments(false)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Quick Actions</h2>
          <div className="space-y-3">
            <button 
              onClick={() => {
                setSelectedPatient(null);
                setShowPatientForm(true);
              }}
              className="w-full flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add New Patient
            </button>
            <button
             onClick={()=>{
              setSelectedAppointment(null);
              setShowAppointmentForm(true);
             }}
             className="w-full flex items-center justify-center px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Schedule Appointment
            </button>
            
          </div>
        </div>
      </div>

       {/* Tab Navigation */}
      <div className="mt-8">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab("patients")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "patients"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Patients
            </button>
            <button
              onClick={() => setActiveTab("appointments")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "appointments"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Appointments
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="bg-white p-6 rounded-b-lg shadow-sm border border-gray-100 border-t-0">
          {activeTab === "patients" ? (
            <>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-800">Patient Records</h2>
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search patients..."
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    />
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <button 
                    onClick={() => {
                      setSelectedPatient(null);
                      setShowPatientForm(true);
                    }}
                    className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </button>
                </div>
              </div>
              
              <PatientList
                patients={patients}
                onEdit={(patient) => {
                  setSelectedPatient(patient);
                  setShowPatientForm(true);
                }}
                onDelete={handleDeletePatient}
              />
            </>
          ) : (
            <>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-800">Appointment Records</h2>
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search appointments..."
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                    />
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <button 
                    onClick={() => {
                      setSelectedAppointment(null);
                      setShowAppointmentForm(true);
                    }}
                    className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </button>
                </div>
              </div>
              
              <AppointmentList
                appointments={appointments}
                patients={patients}
                onEdit={(appointment) => {
                  setSelectedAppointment(appointment);
                  setShowAppointmentForm(true);
                }}
                onDelete={handleDeleteAppointment}
              />
            </>
          )}
        </div>
      </div>

      {/* Patient Form Modal */}
      {showPatientForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b p-4">
              <h3 className="text-lg font-semibold text-gray-800">
                {selectedPatient ? "Edit Patient" : "Add New Patient"}
              </h3>
              <button 
                onClick={() => {
                  setShowPatientForm(false);
                  setSelectedPatient(null);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <PatientForm
              onSave={handleSavePatient}
              selectedPatient={selectedPatient}
              onCancel={() => {
                setShowPatientForm(false);
                setSelectedPatient(null);
              }}
            />
          </div>
        </div>
      )}

      {/* Appointment Form Modal */}
      {showAppointmentForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b p-4">
              <h3 className="text-lg font-semibold text-gray-800">
                {selectedAppointment ? "Edit Appointment" : "Add New Appointment"}
              </h3>
              <button 
                onClick={() => {
                  setShowAppointmentForm(false);
                  setSelectedAppointment(null);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <AppointmentForm
              patients={patients}
              onSave={handleSaveAppointment}
              selectedAppointment={selectedAppointment}
              onCancel={() => {
                setShowAppointmentForm(false);
                setSelectedAppointment(null);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;