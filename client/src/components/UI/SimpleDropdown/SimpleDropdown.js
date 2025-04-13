export default function SimpleDropdown({
  name,
  value,
  onChange,
  options,
  className,
  style,
  placeholder,
  ...props
}) {
  return (
    <select
      name={name}
      value={value || ""}
      onChange={onChange}
      className={className}
      style={style}
      {...props}
    >
      <option value="" disabled>
        {placeholder || "Select an option"}
      </option>
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
}
