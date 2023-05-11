import {Link, withRouter} from 'react-router-dom'

import Cookies from 'js-cookie'

import {AiFillHome} from 'react-icons/ai'
import {BsBriefcaseFill} from 'react-icons/bs'
import {FiLogOut} from 'react-icons/fi'

import './index.css'

const Header = props => {
  const onClickLogout = () => {
    const {history} = props
    Cookies.remove('jwt_token')
    history.replace('/login')
  }

  return (
    <nav className="nav-header">
      <div className="nav-content">
        <div className="logo-container">
          <Link to="/">
            <img
              src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
              alt="website logo"
              className="logo-img"
            />
          </Link>
        </div>
        <div className="nav-menu-mobile">
          <ul className="nav-bar-menu-mobile-list">
            <li className="nav-mobile-item">
              <Link to="/" className="nav-link">
                <AiFillHome className="home-icon" />
              </Link>
            </li>

            <li className="nav-mobile-item">
              <Link to="/jobs" className="nav-link">
                <BsBriefcaseFill className="brief-case-icon" />
              </Link>
            </li>
          </ul>

          <button
            type="button"
            className="nav-mobile-logout-btn"
            onClick={onClickLogout}
          >
            <FiLogOut className="logout-icon" />
          </button>
        </div>
        <div className="nav-menu-large-screen">
          <ul className="nav-menu-list-large-screen">
            <li className="nav-menu-item-large-screen">
              <Link to="/" className="nav-link">
                Home
              </Link>
            </li>
            <li className="nav-menu-item-large-screen">
              <Link to="/jobs" className="nav-link">
                Jobs
              </Link>
            </li>
          </ul>

          <button type="button" className="logout-btn" onClick={onClickLogout}>
            Logout
          </button>
        </div>
      </div>
    </nav>
  )
}

export default withRouter(Header)
