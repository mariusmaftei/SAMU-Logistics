"use client";

import { useState } from "react";
import styles from "./InputNumber.module.css";

export default function InputNumber({
  name,
  value,
  onChange,
  onFocus,
  onBlur,
  className,
  style,
  inputColor = "rgba(31, 129, 248, 0.52)",
  placeholder = "0.00",
  maxLength,
  fillDateFieldsOnInput,
  ...props
}) {
  const [isFocused, setIsFocused] = useState(false);

  // Handle numeric input validation
  const handleNumericInput = (e) => {
    const { value } = e.target;
    // Allow numbers, dots, spaces, and slashes
    if (!/^[0-9.\s/]*$/.test(value)) {
      e.preventDefault();
      return;
    }

    // Call the parent onChange handler
    onChange(e);

    // Call the fillDateFieldsOnInput function if provided
    if (fillDateFieldsOnInput) {
      fillDateFieldsOnInput(e.target.name, e.target.value, value);
    }
  };

  // Handle focus events
  const handleFocus = (e) => {
    setIsFocused(true);
    if (onFocus) onFocus(e);
  };

  // Handle blur events
  const handleBlur = (e) => {
    setIsFocused(false);
    if (onBlur) onBlur(e);
  };

  // Compute background color based on value and focus state
  const computedStyle = {
    ...style,
    backgroundColor: value ? "transparent" : inputColor,
  };

  return (
    <input
      type="text"
      name={name}
      value={value || ""}
      onChange={handleNumericInput}
      onFocus={handleFocus}
      onBlur={handleBlur}
      className={`${styles.inputNumber} ${className || ""}`}
      style={computedStyle}
      inputMode="decimal"
      placeholder={placeholder}
      maxLength={maxLength || 12}
      autoComplete="off"
      {...props}
    />
  );
}
