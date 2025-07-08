import PatientCard from "./PatientCard";

const PatientList = ({ patients, onEdit, onDelete }) => {
  return (
    <div className="grid gap-4 mt-4">
      {patients.map((p) => (
        <PatientCard
          key={p.id}
          patient={p}
          onEdit={() => onEdit(p)}
          onDelete={() => onDelete(p.id)}
        />
      ))}
    </div>
  );
};

export default PatientList;
