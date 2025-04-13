export default function DateInput({
  name,
  value,
  onChange,
  className,
  style,
  inputColor = "rgba(31, 129, 248, 0.52)",
  maxLength = 10,
  ...props
}) {
  // Apply conditional background color
  const computedStyle = {
    ...style,
    backgroundColor: value ? "transparent" : inputColor,
  };

  return (
    <input
      type="text"
      name={name}
      value={value || ""}
      onChange={onChange}
      className={className}
      style={computedStyle}
      maxLength={maxLength}
      inputMode="numeric"
      autoComplete="off"
      {...props}
    />
  );
}
