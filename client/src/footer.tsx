import { Link } from 'react-router-dom';
import { FaDiscord, FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";
function Footer() {

  return (
    <footer>
      <section className="container-footer">
        <div className='container-footer__description'>
          <h1>TWICEDEX</h1>
          A fanmade website to keep track of your photocard collection.
        </div>
        <div className='container-footer__overview'>
          <ul className='container-footer__overview__links-list'>
            <li className='navigation-bar__login'>
              <Link to="/"
                className='nav__listitem'
                aria-label={`Go to Home page`}>
                News
              </Link>
            </li>
            <li className='navigation-bar__terms'>
              <Link to="/terms"
                className='nav__listitem'

                aria-label={`Go to terms and privacy page`}>
                Terms and privacy
              </Link>
            </li>
            <li className='navigation-bar__about'>
              <Link to="/about"
                className='nav__listitem'
                aria-label={`Go to aboutpage`}>
                About
              </Link>
            </li>
          </ul>
        </div>

        <div className='container-footer_useful-links'>
          <ul className='container-footer_useful-links__links-list'>
            <li> <Link to='https://discord.com/invite/twice' target='_blank' aria-label='Go to Twice discord'><FaDiscord /></Link></li>
            <li> <Link to='https://twitter.com/JYPETWICE' target='_blank' aria-label='Go to Twice twitter'><FaTwitter /></Link></li>
            <li> <Link to='https://www.youtube.com/channel/UCzgxx_DM2Dcb9Y1spb9mUJA' target='_blank' aria-label='Go to Twice Youtube channel'><FaYoutube /></Link></li>
            <li> <Link to='https://www.instagram.com/twicetagram/' target='_blank' aria-label='Go to Twice Instagram'><FaInstagram /></Link></li>
          </ul>
        </div>
      </section>

      <section className='copyright'>
        <span>© 2025 Twicedex </span>
      </section>
    </footer>
  )
}

export default Footer;