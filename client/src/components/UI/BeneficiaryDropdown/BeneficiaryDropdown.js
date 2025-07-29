import { useState, useEffect, useRef } from "react";
import { Search, Check } from "lucide-react";
import styles from "./BeneficiaryDropdown.module.css";
export default function BeneficiaryDropdown({
  value,
  onChange,
  onPaste,
  name,
  className,
  style,
  beneficiaries = [],
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredBeneficiaries, setFilteredBeneficiaries] =
    useState(beneficiaries);
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (!searchTerm) {
      setFilteredBeneficiaries(beneficiaries);
    } else {
      const filtered = beneficiaries.filter((beneficiary) =>
        beneficiary.Nume_Furnizor.toLowerCase().includes(
          searchTerm.toLowerCase()
        )
      );
      setFilteredBeneficiaries(filtered);
    }
  }, [searchTerm, beneficiaries]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSelect = (beneficiaryName) => {
    onChange({ target: { name, value: beneficiaryName } });
    setSearchTerm("");
    setIsOpen(false);
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    onChange({ target: { name, value } });

    if (!isOpen && value) {
      setIsOpen(true);
    }
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
    if (!isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div ref={dropdownRef} style={style} className={styles.dropdownWrapper}>
      <div className={styles.inputContainer}>
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleInputChange}
          onPaste={onPaste}
          name={name}
          className={`${className} ${styles.dropdownInput}`}
          style={{
            backgroundColor: value ? "transparent" : "rgba(33, 196, 112, 0.5)",
          }}
          onClick={() => setIsOpen(true)}
          autoComplete="off"
          placeholder="Selectati optiunea"
          data-print-value={value}
        />
        <button
          type="button"
          onClick={toggleDropdown}
          className={styles.dropdownToggle}
        ></button>
      </div>

      {isOpen && (
        <div className={styles.dropdownMenu}>
          <div className={styles.searchContainer}>
            <div className={styles.searchInputWrapper}>
              <Search className={styles.searchIcon} size={16} />
              <input
                type="text"
                placeholder="Search beneficiaries..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={styles.searchInput}
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </div>

          <div>
            {filteredBeneficiaries.length > 0 ? (
              filteredBeneficiaries.map((beneficiary) => (
                <div
                  key={beneficiary.id}
                  className={`${styles.dropdownItem} ${
                    value === beneficiary.Nume_Furnizor
                      ? styles.selectedItem
                      : ""
                  }`}
                  onClick={() => handleSelect(beneficiary.Nume_Furnizor)}
                >
                  <span>{beneficiary.Nume_Furnizor}</span>
                  {value === beneficiary.Nume_Furnizor && (
                    <Check size={16} className="text-green-500" />
                  )}
                </div>
              ))
            ) : (
              <div className={styles.noResults}>No beneficiaries found</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
