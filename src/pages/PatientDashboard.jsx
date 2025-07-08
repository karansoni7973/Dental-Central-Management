import { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { getPatients, getAppointments } from "../utils/localStorageUtils";
import { motion } from "framer-motion";

const PatientDashboard = () => {
  const { user, logout } = useAuth();
  const [patient, setPatient] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user || user.role !== "Patient") return;

    const loadData = () => {
      setIsLoading(true);
      
      // Get patient data
      const patients = getPatients();
      const patientData = patients.find(p => p.id === user.patientId);
      setPatient(patientData);

      // Get patient's appointments
      const allAppointments = getAppointments();
      const patientAppointments = allAppointments.filter(
        appt => appt.patientId === user.patientId
      );
      setAppointments(patientAppointments);
      
      setIsLoading(false);
    };

    loadData();
  }, [user]);

  const upcomingAppointments = appointments
    .filter(appt => new Date(appt.appointmentDate) > new Date())
    .sort((a, b) => new Date(a.appointmentDate) - new Date(b.appointmentDate));

  const pastAppointments = appointments
    .filter(appt => new Date(appt.appointmentDate) <= new Date())
    .sort((a, b) => new Date(b.appointmentDate) - new Date(a.appointmentDate));

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-800">Patient not found</h2>
          <p className="text-gray-600 mt-2">Please contact support</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-8 w-8 text-blue-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            <h1 className="text-xl font-bold text-gray-800">ENTNT Dental Center</h1>
          </div>
          <button
            onClick={logout}
            className="px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Patient Profile Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-sm p-6 mb-8"
        >
          <div className="flex items-center space-x-4">
            <div className="bg-blue-100 text-blue-800 rounded-full p-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-800">{patient.name}</h2>
              <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-sm text-gray-600">
                <span>DOB: {patient.dob}</span>
                <span>Contact: {patient.contact}</span>
                {patient.healthInfo && <span>Health: {patient.healthInfo}</span>}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Upcoming Appointments */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-sm p-6 mb-8"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-gray-800">Upcoming Appointments</h2>
            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
              {upcomingAppointments.length}
            </span>
          </div>

          {upcomingAppointments.length === 0 ? (
            <div className="text-center py-8">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 mx-auto text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
              <p className="mt-2 text-gray-500">No upcoming appointments</p>
            </div>
          ) : (
            <div className="space-y-4">
              {upcomingAppointments.map((appt) => (
                <AppointmentCard key={appt.id} appointment={appt} />
              ))}
            </div>
          )}
        </motion.div>

        {/* Past Appointments */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl shadow-sm p-6"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-gray-800">Treatment History</h2>
            <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">
              {pastAppointments.length}
            </span>
          </div>

          {pastAppointments.length === 0 ? (
            <div className="text-center py-8">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 mx-auto text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
              <p className="mt-2 text-gray-500">No past appointments</p>
            </div>
          ) : (
            <div className="space-y-4">
              {pastAppointments.map((appt) => (
                <AppointmentCard key={appt.id} appointment={appt} />
              ))}
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
};

const AppointmentCard = ({ appointment }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-medium text-gray-800">{appointment.title}</h3>
          <p className="text-sm text-gray-500 mt-1">
            {new Date(appointment.appointmentDate).toLocaleString("en-US", {
              weekday: "short",
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
          {appointment.description && (
            <p className="text-sm text-gray-600 mt-2">{appointment.description}</p>
          )}
          {appointment.treatment && (
            <div className="mt-2">
              <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                Treatment
              </h4>
              <p className="text-sm text-gray-700 mt-1">{appointment.treatment}</p>
            </div>
          )}
          {appointment.cost && (
            <div className="mt-2">
              <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                Cost
              </h4>
              <p className="text-sm font-medium text-gray-800">
                ₹{appointment.cost.toLocaleString()}
              </p>
            </div>
          )}
        </div>
        <span
          className={`px-2 py-1 text-xs rounded-full ${
            appointment.status === "Completed"
              ? "bg-green-100 text-green-800"
              : appointment.status === "Cancelled"
              ? "bg-red-100 text-red-800"
              : "bg-yellow-100 text-yellow-800"
          }`}
        >
          {appointment.status}
        </span>
      </div>

      {/* File Attachments */}
      {appointment.files && appointment.files.length > 0 && (
        <div className="mt-4">
          <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
            Attachments
          </h4>
          <div className="flex flex-wrap gap-2">
            {appointment.files.map((file, index) => (
              <a
                key={index}
                href={file.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center px-3 py-1 bg-gray-100 rounded-md hover:bg-gray-200 transition text-sm"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-2 text-gray-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                {file.name}
              </a>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default PatientDashboard;