import { Link } from "react-router-dom";
import { FaDiscord, FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";
import footerFile from "./files/footer.json";
import globalValues from "./files/global";
function Footer() {
  return (
    <footer>
      <section className="container-footer">
        <div className="container-footer__description">
          <h1>{`${globalValues.GROUP_NAME.toUpperCase()}DEX`}</h1>A fanmade
          website to keep track of your photocard collection.
        </div>
        <div className="container-footer__overview">
          <ul className="container-footer__overview__links-list">
            <li className="navigation-bar__login">
              <Link
                to="/"
                className="nav__listitem"
                aria-label={`Go to Home page`}
              >
                News
              </Link>
            </li>
            <li className="navigation-bar__terms">
              <Link
                to="/terms"
                className="nav__listitem"
                aria-label={`Go to terms and privacy page`}
              >
                Terms and privacy
              </Link>
            </li>
            <li className="navigation-bar__about">
              <Link
                to="/about"
                className="nav__listitem"
                aria-label={`Go to aboutpage`}
              >
                About
              </Link>
            </li>
          </ul>
        </div>

        <div className="container-footer_useful-links">
          <ul className="container-footer_useful-links__links-list">
            <li>
              {" "}
              <Link
                to={footerFile.linkToDiscord}
                target="_blank"
                aria-label={`Go to ${globalValues.GROUP_NAME} discord`}
              >
                <FaDiscord />
              </Link>
            </li>
            <li>
              {" "}
              <Link
                to={footerFile.linkToTwitter}
                target="_blank"
                aria-label={`Go to ${globalValues.GROUP_NAME} twitter`}
              >
                <FaTwitter />
              </Link>
            </li>
            <li>
              {" "}
              <Link
                to={footerFile.linkToYoutube}
                target="_blank"
                aria-label={`Go to ${globalValues.GROUP_NAME} youtube channel`}
              >
                <FaYoutube />
              </Link>
            </li>
            <li>
              {" "}
              <Link
                to={footerFile.linkToInstagram}
                target="_blank"
                aria-label={`Go to ${globalValues.GROUP_NAME} instagram`}
              >
                <FaInstagram />
              </Link>
            </li>
          </ul>
        </div>
      </section>

      <section className="copyright">
        <span>© 2026 {`${globalValues.GROUP_NAME}dex`}</span>
      </section>
    </footer>
  );
}

export default Footer;
