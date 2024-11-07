import React from 'react';

const Dropdown = ({ label, options, onChange, className }) => {
  return (
    <div className={`flex items-center cursor-pointer ${className}`}>
      <label htmlFor={label} className="mr-2">{label}:</label>
      <select
        id={label}
        className="border rounded px-2 py-1 w-40" // Limitar el ancho del select
        onChange={onChange}
      >
        <option value="">Select {label}</option> {/* Opción por defecto */}
        {options.map(option => (
          <option
            key={option}
            value={option}
            className="truncate" // Truncar el texto
            title={option} // Mostrar el texto completo en el tooltip
          >
            {option}
          </option>
        ))}
      </select>

    </div>
  );
};

export default Dropdown;
