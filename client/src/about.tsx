import { Link } from "react-router-dom";
import global from "./files/global";
import about from "./files/about.json";

export const About = () => {
  const { copyrights } = about;
  return (
    <div className="about-container">
      <h2>About</h2>
      <div>
        <p>Last update: {about.lastUpdate}</p>
      </div>
      <div className="introduction-box">
        <div>
          <h3>Introduction</h3>
          {about.introduction.map((text) => (
            <p key={text}>{text}</p>
          ))}
        </div>
      </div>
      <div className="policy-box">
        <div>
          <h3>Copyrights</h3>
          <p>
            {copyrights.intro}
            <br />
            Most of the images on{" "}
            <Link
              to={`/collection/${global.CATEGORY_DEFAULT_VALUE}/${global.ERA_DEFAULT_VALUE}`}
              aria-label="Go to Collection page"
            >
              Collection
            </Link>{" "}
            have been found on this{" "}
            <Link
              to={copyrights.mainSource.url}
              aria-label={`Exit website and go to ${copyrights.mainSource.name}`}
            >
              {copyrights.mainSource.name}
            </Link>{" "}
            account.
            <br />
            {copyrights.creditsIntro}
          </p>
          <ul>
            {copyrights.credits.map((credit) => (
              <li key={credit}>{credit}</li>
            ))}
          </ul>
          <p>
            {copyrights.takedownIntro}{" "}
            <Link to={`mailto:${copyrights.contactEmail}`}>email</Link>.
          </p>
        </div>
      </div>
    </div>
  );
};
