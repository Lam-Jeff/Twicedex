import { useState, useEffect, useContext } from "react";
import { NavBar } from "./navBar";
import { Link, useLocation } from "react-router-dom";
import { ThemeContext } from "./themeContext";
import {
  MdLightMode,
  MdDarkMode,
  MdOutlineMenu,
  MdClose,
} from "react-icons/md";

export const Header = () => {
  const { isDarkMode, toggleTheme } = useContext(ThemeContext);
  const [isHamburgerOpen, setIsHamburgerOpen] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(
    window.innerWidth >= 768 ? false : true,
  );
  const location = useLocation();

  useEffect(() => {
    window.addEventListener("resize", () => {
      if (window.innerWidth >= 768) {
        setIsHamburgerOpen(false);
        setIsSmallScreen(false);
      } else {
        setIsSmallScreen(true);
      }
    });
  }, []);

  useEffect(() => {
    setIsHamburgerOpen(false);
  }, [location]);

  /**
   * Handle open/close hamburger menu.
   */
  const toggleHamburger = (): void => {
    setIsHamburgerOpen(!isHamburgerOpen);
  };
  return (
    <header>
      <div className="banner" id="banner">
        <div className="banner__logo">
          <h1 className="banner__logo__container">
            <Link to="/" aria-label={`Go to home page`}>
              TWICEDEX
            </Link>
          </h1>
        </div>
        <NavBar
          isHamburgerOpen={isHamburgerOpen}
          isSmallScreen={isSmallScreen}
        />
        <button
          aria-label="Toggle dark mode."
          className="banner__button_dark-mode"
          onClick={toggleTheme}
        >
          {isDarkMode ? (
            <div className="banner__button_dark-mode__container_icon">
              <MdDarkMode />
            </div>
          ) : (
            <div className="banner__button_dark-mode__container_icon">
              <MdLightMode />
            </div>
          )}
        </button>
        <div
          className={`hamburger-container ${isHamburgerOpen ? "close" : "open"}`}
          onClick={toggleHamburger}
          aria-label={isHamburgerOpen ? "Close menu" : "Open menu"}
        >
          {isHamburgerOpen ? <MdClose /> : <MdOutlineMenu />}
        </div>
      </div>
    </header>
  );
};
