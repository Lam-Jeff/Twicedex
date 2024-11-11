import { useState, useEffect } from 'react';
import { NavBar } from './navBar';
import { Link, useLocation } from 'react-router-dom';

export const Header = () => {
  const [isHamburgerOpen, setIsHamburgerOpen] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth >= 768 ? false: true);
  const location = useLocation()

  useEffect(() => {
    window.addEventListener('resize', () => {
      if (window.innerWidth >= 768) {
        setIsHamburgerOpen(false);
        setIsSmallScreen(false);
      } else {
        setIsSmallScreen(true)
      }
    })

  }, [])

  useEffect(() => {
    setIsHamburgerOpen(false);
  }, [location])
  
  /**
   * Handle open/close hamburger menu.
   */
  const toggleHamburger = (): void => {
    setIsHamburgerOpen(!isHamburgerOpen);
  }
  return (
    <header>
      <div className="banner">
        <div className="banner__logo">
          <h1 className='banner__logo__container'>
            <Link to="/" aria-label={`Go to home page`}
              state={{
                ...location.state,
                from: location.pathname
              }}>
              TWICEDEX
            </Link>
          </h1>
        </div>
        <NavBar isHamburgerOpen={isHamburgerOpen} isSmallScreen={isSmallScreen} />
      </div>
      <div className={`hamburger-container ${isHamburgerOpen ? "close": "open"}`} onClick={toggleHamburger} aria-label={isHamburgerOpen ? 'Close menu' : 'Open menu'}>
        <span></span>
        <span></span>
        <span></span>
      </div>
    </header>

  )
}
