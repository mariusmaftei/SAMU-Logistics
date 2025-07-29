import { useState, useRef, useEffect } from "react";
import { User, LogOut, Settings, Shield } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import styles from "./UserMenu.module.css";

export default function UserMenu() {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const buttonRef = useRef(null);

  console.log(user);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuRef.current &&
        buttonRef.current &&
        !menuRef.current.contains(event.target) &&
        !buttonRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleLogout = async () => {
    setIsOpen(false);
    await logout();
  };

  if (!user) return null;

  return (
    <div className={styles.userMenuContainer}>
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className={styles.userButton}
        aria-label="User menu"
      >
        {user.profileImage ? (
          <img
            src={user.profileImage}
            alt={user.name}
            className={styles.userAvatar}
          />
        ) : (
          <div className={styles.userAvatarFallback}>
            <User className={styles.userIcon} />
          </div>
        )}
        <span className={styles.userName}>{user.name}</span>
      </button>

      {isOpen && (
        <div ref={menuRef} className={styles.userMenu}>
          <div className={styles.userInfo}>
            <div className={styles.userDetails}>
              <p className={styles.userNameText}>{user.name}</p>
              <p className={styles.userEmail}>{user.email}</p>
              {user.role === "admin" && (
                <div className={styles.adminBadge}>
                  <Shield className={styles.adminIcon} />
                  <span>Administrator</span>
                </div>
              )}
            </div>
          </div>

          <div className={styles.menuDivider} />

          <div className={styles.menuItems}>
            <button
              className={styles.menuItem}
              onClick={() => setIsOpen(false)}
            >
              <Settings className={styles.menuIcon} />
              <span>Setări</span>
            </button>

            <button className={styles.menuItem} onClick={handleLogout}>
              <LogOut className={styles.menuIcon} />
              <span>Deconectare</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
