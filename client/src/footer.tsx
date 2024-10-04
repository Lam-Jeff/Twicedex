import { Link, useLocation } from 'react-router-dom';
import { useEffect } from 'react';

function Footer() {
  const location = useLocation()
  location.state = {
    from: '/',
    era: "TSB",
    category: "Korean Albums"
  }
  let albumFromUrl = location.state.era
  let categoryFromUrl = location.state.category
  if (location.pathname.includes('/collection')) {
    albumFromUrl = location.pathname.split('/')[3]
    categoryFromUrl = location.pathname.split('/')[2].replace('&', '/')
  }

  useEffect(() => {
    if (location.state.era) {
      albumFromUrl = location.state.era
    }
    if (location.state.category) {
      categoryFromUrl = location.state.category
    }
  }, [location]);

  return (
    <footer>
      <section className="container-footer">
        <div className='container-footer__description'>
          <h1>TWICEDEX</h1>
          A fanmade website to keep track of your photocard collection.
        </div>

        <div className='container-footer__overview'>
          <span className='container-footer__overview__title'>Overview</span>
          <ul className='container-footer__overview__links'>

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
          </ul>
        </div>

        <div className='container-footer_useful-links'>
          <span className='container-footer_useful-links__title'>Useful Links</span>
          <ul className='container-footer_useful-links__links'>
            <li> <Link to='https://twflix.carrd.co/#' target='_blank' aria-label='Go to Twflix website'>Twflix</Link></li>
            <li> <Link to='https://discord.com/invite/twice' target='_blank' aria-label='Go to Twice discord'>Twice Discord</Link></li>
            <li> <Link to='https://twitter.com/JYPETWICE' target='_blank' aria-label='Go to Twice twitter'>Twitter</Link></li>
            <li> <Link to='https://www.youtube.com/channel/UCzgxx_DM2Dcb9Y1spb9mUJA' target='_blank' aria-label='Go to Twice Youtube channel'>Youtube</Link></li>
            <li> <Link to='https://www.instagram.com/twicetagram/' target='_blank' aria-label='Go to Twice Instagram'>Instagram</Link></li>
          </ul>
        </div>
      </section>

      <section className='copyright'>
        <span>© Twicedex 2023</span>
      </section>
    </footer>
  )
}

export default Footer;