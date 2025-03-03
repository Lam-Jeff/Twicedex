import { NavLink } from 'react-router-dom';

export function PageNotFound() {
  return (
    <div className="content"
        style={{
          height:"100vh"
        }}>
      <h2>404 Error</h2>
      <p>We cannot find that page!</p>
      <NavLink to='/home' aria-label={`Go to home page`}>Take me back to Home</NavLink>
    </div>
  )
}