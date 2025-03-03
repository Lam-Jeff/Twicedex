import { Link } from "react-router-dom";

export const Terms = () => {
    const date = '06/02/2025';
    const ERA_DEFAULT_VALUE = "TSB";
    const CATEGORY_DEFAULT_VALUE = "Korean Albums";
    return (
        <div className="terms-container">
            <h2>Terms and privacy</h2>
            <div>
                <p>Last update: {date}</p>
            </div>
            <div className="policy-box">
                <div>
                    <h3>Terms of service</h3>
                    <p>
                        These terms of service govern your use of the website located at <Link to="https://twicedex.netlify.app/">Twicedex</Link> and any related services provided by Twicedex.

                        By accessing <Link to="https://twicedex.netlify.app/">Twicedex</Link>, you agree to abide by these terms of service and to comply with all applicable laws and regulations. If you do not agree with these terms of service, you are prohibited from using or accessing this website or using any other services provided by Twicedex.
                    </p>
                </div>
                <div>
                    <h3>Limitations of use</h3>
                    <p>
                        By using this website, you warrant on behalf of yourself, your users, and other parties you represent that you will not:
                    </p>
                    <ol>
                        <li>
                            Modify, copy, prepare derivative works of, decompile, or reverse engineer any materials and software contained on this website;
                        </li>
                        <li>
                            Remove any copyright or other proprietary notations from any materials and software on this website;
                        </li>
                        <li>Knowingly or negligently use this website or any of its associated services in a way that abuses or disrupts our networks or any other service Twicedex provides;</li>
                        <li>
                            Use this website or its associated services to transmit or publish any harassing, indecent, obscene, fraudulent, or unlawful material;
                        </li>
                        <li>
                            Use this website or its associated services in violation of any applicable laws or regulations;
                        </li>
                        <li>
                            Harvest, collect, or gather user data without the user's consent; or
                        </li>
                        <li>Use this website or its associated services in such a way that may infringe the privacy, intellectual property rights, or other rights of third parties.</li>
                    </ol>
                </div>
                <div>
                    <h3>Cookies</h3>
                    <p>No advertising or tracking cookies are used when you use this website.If cookies are to be added in the future, we will ask for your consent, which you can revoke at any time.</p>
                </div>
                <div>
                    <div>
                        <h3>Data</h3>
                        <p>
                            You will be required to create an account with a valid email in order to save your data in the <Link to={`/collection/${CATEGORY_DEFAULT_VALUE}/${ERA_DEFAULT_VALUE}`} aria-label='Go to Collection page'>Collection</Link> page.This data keep track of your card collection.Data are stored in a FireBase database.Data are not shared.
                        </p>
                    </div>
                    <h3>Links to other websites</h3>
                    <p>
                        The website may contain links to third-party websites. These websites may have different policies and practices. Users should review the policy of each website they visit.
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