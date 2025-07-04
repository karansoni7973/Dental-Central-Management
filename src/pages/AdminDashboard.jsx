// AdminDashboard.jsx (Updated with KPI UI)
import { useEffect, useState } from "react";

const AdminDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    const storedAppointments = JSON.parse(localStorage.getItem("incidents")) || [];
    const storedPatients = JSON.parse(localStorage.getItem("patients")) || [];
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

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-sm text-gray-500">Total Patients</h2>
          <p className="text-2xl font-bold">{patients.length}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-sm text-gray-500">Pending Treatments</h2>
          <p className="text-2xl font-bold">{pending}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-sm text-gray-500">Completed Treatments</h2>
          <p className="text-2xl font-bold">{completed}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-sm text-gray-500">Total Revenue</h2>
          <p className="text-2xl font-bold">₹{totalRevenue}</p>
        </div>
      </div>

      {/* Upcoming Appointments */}
      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-lg font-semibold mb-4">Next 10 Appointments</h2>
        {upcoming.length === 0 ? (
          <p className="text-gray-500">No upcoming appointments.</p>
        ) : (
          <ul className="space-y-2">
            {upcoming.map(appt => (
              <li key={appt.id} className="border-b pb-2">
                <p className="font-medium">{appt.title}</p>
                <p className="text-sm text-gray-500">
                  Date: {new Date(appt.appointmentDate).toLocaleString()}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
