import { Link, useLocation } from "react-router-dom";

export const About = () => {
  const date = '23/09/2024'
  const location = useLocation()
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
          <h3>Cookies</h3>
          <p>No advertising or tracking cookies are used when you use this website.If cookies are to be added in the future, we will ask for your consent, which you can revoke at any time.</p>
        </div>
        <div>
          <div>
            <h3>Data</h3>
            <p>
              Personal data is not requested to use this website. The data used on <Link to={{ pathname: `/collection/${location.state.category}/${location.state.era}/`, search: location.search }} aria-label='Go to Collection page'>Collection</Link> are stored directly in your browser. This data keeps track of your card collection. Data is not shared.
            </p>
          </div>
          <h3>Links to other websites</h3>
          <p>
            The website may contain links to third-party websites. These websites may have different policies and practices. Users should review the policy of each website they visit.
          </p>
        </div>
        <div>
          <h3>Copyrights</h3>
          <p>
            Images come from various sources such as Pinterest, Twitter or Google Images. This website brings together all these images.<br />
            Most of the images on <Link to={{ pathname: `/collection/${location.state.category}/${location.state.era}/`, search: location.search }} aria-label='Go to Collection page'>Collection</Link> have been found on this <Link to='https://www.pinterest.fr/Ariririu/' aria-label='Exit website and go to Pinterest'>Pinterest</Link> account.<br />
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
            <li>JYP Entertainment</li>
          </ul>

          <p>
            Given the undetermined origin of some images, you can request the removal of images or the addition of credits via <Link to='mailto:twicedex.contact@gmail.com'>email</Link>.
          </p>
        </div>
        <div>
          <h3>Changes to Policy</h3>
          <p>Policy may be modified at any time. Any changes will be visible on this page. Users may check the Policy as often as possible for further information. By using this website, you agree with the Policy.</p>
        </div>
      </div>
    </div>
  )
}