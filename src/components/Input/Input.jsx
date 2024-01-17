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
  disabled,
  style,
  autoComplete,
  min,
  max,
  pattern,
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
        disabled={disabled}
        style={style}
        autoComplete={autoComplete}
        min={min}
        max={max}
        pattern={pattern}
      />
      {hasError && errorMessage && <ErrorMessage errorMessage={errorMessage} />}
    </div>
  );
};

export default Input;