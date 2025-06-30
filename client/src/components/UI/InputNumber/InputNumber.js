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
  const handleNumericInput = (e) => {
    const { value } = e.target;
    if (!/^[0-9.\s/]*$/.test(value)) {
      e.preventDefault();
      return;
    }

    onChange(e);

    if (fillDateFieldsOnInput) {
      fillDateFieldsOnInput(e.target.name, e.target.value, value);
    }
  };

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
      onFocus={onFocus}
      onBlur={onBlur}
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
