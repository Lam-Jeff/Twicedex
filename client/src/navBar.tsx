import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./authProvider";
import global from "./files/global";

interface INavBarProps {
  isHamburgerOpen: boolean;
  isSmallScreen: boolean;
}

export const NavBar = ({ isHamburgerOpen, isSmallScreen }: INavBarProps) => {
  const { user, signOut } = useContext(AuthContext);
  const hamburger: string = isHamburgerOpen
    ? "hamburgerMenuOpen"
    : "hamburgerMenuClose";

  useEffect(() => {
    let resizeTimer: NodeJS.Timeout = setTimeout(() => {}, 0);
    window.addEventListener("resize", () => {
      document.body.classList.add("resize-animation-stopper");
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        document.body.classList.remove("resize-animation-stopper");
      }, 400);
    });
  }, []);

  /**
   * Handle log out.
   */
  const handleLogOut = () => {
    signOut();
  };

  return (
    <div className={`navigation ${isSmallScreen ? hamburger : ""}`}>
      <ul className="nav_bar">
        <li className="navigation-bar__collection">
          <Link
            to={`/collection/${global.CATEGORY_DEFAULT_VALUE}/${global.ERA_DEFAULT_VALUE}`}
            className="nav__listitem"
            aria-label={`Go to collection page`}
          >
            Collection
          </Link>
        </li>
        <li className="navigation-bar__sets">
          <Link
            to="/sets"
            className="nav__listitem"
            aria-label={`Go to Sets page`}
          >
            Sets
          </Link>
        </li>
        <li className="navigation-bar__login">
          {user ? (
            <Link
              to="./profile"
              className="nav__listitem"
              aria-label={`Go to Profile page`}
            >
              Profile
            </Link>
          ) : (
            <Link
              to="./login"
              className="nav__listitem"
              aria-label={`Go to Login page`}
            >
              Login
            </Link>
          )}
        </li>
        <li className="navigation-bar__about">
          <Link
            to="/about"
            className="nav__listitem"
            aria-label={`Go to about page`}
          >
            About
          </Link>
        </li>
        {user ? (
          <li className="navigation-bar__logout">
            <div
              className="nav__listitem"
              aria-label={`Log out`}
              onClick={handleLogOut}
            >
              Log Out
            </div>
          </li>
        ) : null}
      </ul>
    </div>
  );
};

export default NavBar;

