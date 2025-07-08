export const getPatients = () => {
  const data = localStorage.getItem("patients");
  return data ? JSON.parse(data) : [];
};

export const savePatients = (patients) => {
  localStorage.setItem("patients", JSON.stringify(patients));
};

export const getAppointments = () => {
  const data = localStorage.getItem("appointments");
  return data ? JSON.parse(data) : [];
};

export const saveAppointments = (appointments) => {
  localStorage.setItem("appointments", JSON.stringify(appointments));
};