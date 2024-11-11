import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useContext } from "react";
import { AuthContext } from "./authProvider";

interface INavBarProps {
  isHamburgerOpen: boolean;
  isSmallScreen: boolean;
}

export const NavBar = ({ isHamburgerOpen, isSmallScreen }: INavBarProps) => {
  const { user, signOut } = useContext(AuthContext);
  const hamburger : string = isHamburgerOpen ? "hamburgerMenuOpen" : "hamburgerMenuClose";
  const location = useLocation();
  location.state = {
    from: '/',
    era: "TSB",
    category: "Korean Albums"
  }
  let albumFromUrl = location.state.era;
  let categoryFromUrl = location.state.category;
  if (location.pathname.includes('/collection')) {
    albumFromUrl = location.pathname.split('/')[3];
    categoryFromUrl = location.pathname.split('/')[2].replace('&', '/');
  }

  /**
 * Handle log out.
 */
  const handleLogOut = () => {
    signOut();
  }

  useEffect(() => {
    let resizeTimer: NodeJS.Timeout = setTimeout(() => { }, 0);
    window.addEventListener("resize", () => {
      document.body.classList.add("resize-animation-stopper");
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        document.body.classList.remove("resize-animation-stopper");
      }, 400);
    });
  }, []);

  useEffect(() => {
    if (location.state.era) {
      albumFromUrl = location.state.era
    }
    if (location.state.category) {
      categoryFromUrl = location.state.category
    }
  }, [location]);


  return (
    <div className={`navigation ${isSmallScreen ? hamburger : ""}`}>
      <ul className='nav_bar'>
        <li className='navigation-bar__collection'>
          <Link to={{ pathname: `/collection/${categoryFromUrl}/${albumFromUrl}`, search: location.search }}
            state={{
              ...location.state,
              from: location.pathname
            }}
            className='nav__listitem'
            aria-label={`Go to collection page`}>
            Collection
          </Link>
        </li>
        <li className='navigation-bar__login'>
          {user ? <Link to="./profile"
            state={{
              ...location.state,
              from: location.pathname
            }}
            className='nav__listitem'
            aria-label={`Go to Profile page`}>
            Profile
          </Link> :
            <Link to="./login"
              state={{
                ...location.state,
                from: location.pathname
              }}
              className='nav__listitem'
              aria-label={`Go to Login page`}>
              Login
            </Link>}
        </li>
        <li className='navigation-bar__about'>
          <Link to="/about"
            className='nav__listitem'
            state={{
              ...location.state,
              from: location.pathname
            }}
            aria-label={`Go to about page`}>
            About
          </Link>
        </li>
        {user ? <li className='navigation-bar__logout'>
          <div
            className='nav__listitem'
            aria-label={`Log out`}
            onClick={handleLogOut}>
            Log Out
          </div>
        </li> : null}
      </ul>
    </div>
  )

}

export default NavBar;