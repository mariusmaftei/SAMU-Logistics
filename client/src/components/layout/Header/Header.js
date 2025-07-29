import { useState, useRef, useEffect } from "react";
import { Menu, X, FileText, Database, LogOut, User } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import styles from "./Header.module.css";
import { useAuth } from "../../../context/AuthContext";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const buttonRef = useRef(null);
  const location = useLocation();
  const { isAuthenticated, logout, user } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

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

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  // Don't show header on auth page
  if (location.pathname === "/auth") {
    return null;
  }

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
        {/* User section with profile */}
        {isAuthenticated && user && (
          <div className={styles.userSection}>
            <div className={styles.userProfile}>
              <div className={styles.userAvatar}>
                {user.profileImage ? (
                  <img
                    src={user.profileImage || "/placeholder.svg"}
                    alt={user.name}
                    className={styles.avatarImage}
                  />
                ) : (
                  <User className={styles.avatarIcon} />
                )}
              </div>
              <div className={styles.userInfo}>
                <span className={styles.userName}>{user.name}</span>
                <span className={styles.userEmail}>{user.email}</span>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className={styles.logoutButton}
              aria-label="Deconectare"
            >
              <LogOut className={styles.logoutIcon} />
              <span className={styles.logoutText}>Deconectare</span>
            </button>
          </div>
        )}

        <div className={styles.divider} />

        {/* Show navigation only if authenticated */}
        {isAuthenticated && (
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
          </ul>
        )}

        {/* Remove the UserMenu since we're handling it in the userSection now */}
      </nav>

      {isMenuOpen && <div className={styles.overlay} onClick={closeMenu} />}
    </>
  );
}
