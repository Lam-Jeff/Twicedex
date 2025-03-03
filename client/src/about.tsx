import { Link } from "react-router-dom";
import global from "./files/global";

export const About = () => {
  const date = '06/02/2025';
  return (
    <div className="about-container">
      <h2>About</h2>
      <div>
        <p>Last update: {date}</p>
      </div>
      <div className="introduction-box">
        <div>
          <h3>Introduction</h3>
          <p>
            Twicedex is a website based on the k-pop group Twice created by JYP Entertainment.<br />
            It is a fanmade website. No profit made. <br />
          </p>
        </div>
      </div>
      <div className="policy-box">
        <div>
          <h3>Copyrights</h3>
          <p>
            Images come from various sources such as Pinterest, Twitter or Google Images. This website brings together all these images.<br />
            Most of the images on <Link to={`/collection/${global.CATEGORY_DEFAULT_VALUE}/${global.ERA_DEFAULT_VALUE}`} aria-label='Go to Collection page'>Collection</Link> have been found on this <Link to='https://www.pinterest.fr/Ariririu/' aria-label='Exit website and go to Pinterest'>Pinterest</Link> account.<br />
            Credits whenever it is possible:
          </p>
          <ul>
            <li>@Ariririu</li>
            <li>@njmsjmdct2</li>
            <li>@momosunrise</li>
            <li>@jy_pikachu</li>
            <li>@sweet9_venus</li>
            <li>@twcslov</li>
            <li>@osw8282</li>
            <li>@tbzcardsale</li>
            <li>@shot2natheheart</li>
            <li>@Chesekimbap</li>
            <li>@twicetsam</li>
            <li>@jeongjeongieee1</li>
            <li>@chaeyoungteamo</li>
            <li>@mogingbest</li>
            <li>@naybuns</li>
            <li>@s_ana09</li>
            <li>@miapcscans</li>
            <li>@chio_tw</li>
            <li>@jong7in</li>
            <li>@Chaeoncetwice</li>
            <li>@Minayayayaya</li>
            <li>@Under_The_S2a_</li>
            <li>@tradeabbey</li>
            <li>@trodriguezredal</li>
            <li>@IRIS__WOON</li>
            <li>@njbily</li>
            <li>JYP Entertainment</li>
          </ul>
          <p>All icons in <Link to='/profile' aria-label='Go to Profile page'>Profile</Link> are designed by <Link to='https://www.freepik.com/' aria-label='Exit website and Go to Freepik'>Freepik</Link></p>
          <p>
            Given the undetermined origin of some images, you can request the removal of images or the addition of credits via <Link to='mailto:twicedex.contact@gmail.com'>email</Link>.
          </p>
        </div>
      </div>
    </div>
  )
}