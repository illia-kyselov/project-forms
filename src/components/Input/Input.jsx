import React from "react";
import ErrorMessage from "../ErrorMessage/ErrorMessage";

const Input = ({
  className,
  type,
  name,
  value,
  placeholder,
  isRequired,
  errorMessage,
  hasError,
  onChange,
}) => {
  return (
    <div>
      <input
        type={type}
        name={name}
        value={value}
        className={className}
        required={isRequired}
        placeholder={placeholder}
        onChange={onChange}
      />
      {hasError && errorMessage && <ErrorMessage errorMessage={errorMessage} />}
    </div>
  );
};

export default Input;
