const Dropdown = ({ label, options, onChange }) => {
  return (
    <div className="flex items-center mb-4">
      <label className="mr-2">{label}</label>
      <select className="border rounded px-2 py-1" onChange={onChange}>
        {options.map(option => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
    </div>
  );
};

export default Dropdown;