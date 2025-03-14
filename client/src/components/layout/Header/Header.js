import { useState, useRef, useEffect } from "react";
import {
  Menu,
  X,
  FileText,
  Package,
  LogOut,
  User,
  Database,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import styles from "./Header.module.css";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const buttonRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuRef.current &&
        buttonRef.current &&
        !menuRef.current.contains(event.target) &&
        !buttonRef.current.contains(event.target)
      ) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleSignOut = () => {
    console.log("Signing out...");
    // Add your sign out logic here
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <>
      <button
        ref={buttonRef}
        onClick={toggleMenu}
        className={styles.burgerButton}
        aria-label="Toggle menu"
      >
        {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>

      <nav
        ref={menuRef}
        className={`${styles.nav} ${isMenuOpen ? styles.navOpen : ""}`}
      >
        <div className={styles.userSection}>
          <div className={styles.userIcon}>
            <User className={styles.navIcon} />
          </div>
          <span className={styles.username}>Marius Maftei</span>
        </div>

        <div className={styles.divider} />

        <ul className={styles.navList}>
          <li>
            <Link
              to="/form"
              className={`${styles.navLink} ${
                location.pathname === "/form" || location.pathname === "/"
                  ? styles.active
                  : ""
              }`}
              onClick={closeMenu}
            >
              <FileText className={styles.navIcon} />
              <span>Formular</span>
            </Link>
          </li>
          <li>
            <Link
              to="/entries"
              className={`${styles.navLink} ${
                location.pathname === "/entries" ? styles.active : ""
              }`}
              onClick={closeMenu}
            >
              <Database className={styles.navIcon} />
              <span>Intrări Formular</span>
            </Link>
          </li>
          <li>
            <Link
              to="/inventory"
              className={`${styles.navLink} ${
                location.pathname === "/inventory" ? styles.active : ""
              }`}
              onClick={closeMenu}
            >
              <Package className={styles.navIcon} />
              <span>Deconectare</span>
            </Link>
          </li>
          <li>
            <button onClick={handleSignOut} className={styles.navLink}>
              <LogOut className={styles.navIcon} />
              <span>Sign Out</span>
            </button>
          </li>
        </ul>
      </nav>

      {isMenuOpen && <div className={styles.overlay} onClick={closeMenu} />}
    </>
  );
}
