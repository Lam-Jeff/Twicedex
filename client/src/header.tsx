import { useState, useEffect } from 'react';
import { NavBar } from './navBar';
import { Link, useLocation } from 'react-router-dom';

export const Header = () => {
  const [hamburgerOpen, setHamburgerOpen] = useState(false);
  const location = useLocation()

  useEffect(() => {
    window.addEventListener('resize', () => {
      if (window.innerWidth >= 768) {
        setHamburgerOpen(false);
      }
    })

  }, [])

  useEffect(() => {
    setHamburgerOpen(false);
  }, [location])
  
  /**
   * Handle open/close hamburger menu.
   */
  const toggleHamburger = (): void => {
    setHamburgerOpen(!hamburgerOpen);
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
        <NavBar />
      </div>
      <div className="hamburger-container" onClick={toggleHamburger} aria-label={hamburgerOpen ? 'Close menu' : 'Open menu'}>
        <span></span>
        <span></span>
        <span></span>
      </div>
      <style>{`
                @media screen and (max-width: 768px){
                    .navigation{
                      max-height: ${hamburgerOpen ? '10em' : '0'};
                    }

                    .hamburger-container span:nth-child(2) {
                      opacity : ${hamburgerOpen ? '0' : '1'};
                      width : ${hamburgerOpen ? '0' : '100%'};
                    }
                    .hamburger-container span:nth-child(1) {
                      transform : ${hamburgerOpen ? 'rotate(45deg)' : 'rotate(0deg)'};
                      width : ${hamburgerOpen ? 'calc((3*5px + 0.3rem*2) * 1.414213562)' : '32px'};
                      translate: ${hamburgerOpen ? '0 calc(5px / -2)' : '0 0'};
                    }
                    .hamburger-container span:nth-child(3) {
                      transform : ${hamburgerOpen ? 'rotate(-45deg)' : 'rotate(0deg)'};
                      width : ${hamburgerOpen ? 'calc((3*5px + 0.3rem*2) * 1.414213562)' : '32px'};
                      translate: ${hamburgerOpen ? '0 calc(5px / 2)' : '0 0'};
                    }

                }          
            `}</style>
    </header>

  )
}
