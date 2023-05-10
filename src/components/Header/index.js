import {withRouter} from 'react-router-dom'

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
    <div className="nav-header">
      <div className="nav-content">
        <div className="logo-container">
          <img
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            alt="website logo"
            className="logo-img"
          />
        </div>
        <div className="nav-menu-mobile">
          <ul className="nav-bar-menu-mobile-list">
            <li className="nav-mobile-item">
              <AiFillHome className="home-icon" />
            </li>
            <li className="nav-mobile-item">
              <BsBriefcaseFill className="brief-case-icon" />
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
            <li className="nav-menu-item-large-screen">Home</li>
            <li className="nav-menu-item-large-screen">Jobs</li>
          </ul>

          <button type="button" className="logout-btn" onClick={onClickLogout}>
            Logout
          </button>
        </div>
      </div>
    </div>
  )
}

export default withRouter(Header)
