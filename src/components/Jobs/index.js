import {Component} from 'react'

import Cookies from 'js-cookie'

import Loader from 'react-loader-spinner'

import {BsSearch} from 'react-icons/bs'

import Header from '../Header'

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class Jobs extends Component {
  state = {
    searchInput: '',
    apiStatus: apiStatusConstants.initial,
    profileDetails: {},
  }

  componentDidMount() {
    this.getProfileDetails()
  }

  onChangeSearchInput = event => {
    this.setState({searchInput: event.target.value})
  }

  getProfileDetails = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})

    const jwtToken = Cookies.get('jwt_token')

    const apiUrl = 'https://apis.ccbp.in/profile'

    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)

    if (response.ok === true) {
      const fetchedData = await response.json()
      console.log(fetchedData)
      const updatedData = {
        name: fetchedData.profile_details.name,
        profileImageUrl: fetchedData.profile_details.profile_image_url,
        shortBio: fetchedData.profile_details.short_bio,
      }
      console.log(updatedData)

      this.setState({
        profileDetails: updatedData,
        apiStatus: apiStatusConstants.success,
      })
    }
    if (response.status === 401) {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

  renderProfileDetailsView = () => {
    const {profileDetails} = this.state

    return (
      <div className="profile-details-cont">
        <img
          src={profileDetails.profileImageUrl}
          alt="profile"
          className="profile-image"
        />
        <p className="profile-name">{profileDetails.name}</p>
        <p className="profile-bio">{profileDetails.shortBio}</p>
      </div>
    )
  }

  renderLoadingView = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  onClickRetryBtn = () => {
    this.getProfileDetails()
  }

  renderProfileFailureView = () => (
    <div className="profile-failure-view">
      <button
        type="button"
        className="retry-btn"
        onClick={this.onClickRetryBtn}
      >
        Retry
      </button>
    </div>
  )

  renderProfileSection = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderProfileDetailsView()
      case apiStatusConstants.failure:
        return this.renderProfileFailureView()
      default:
        return this.renderLoadingView()
    }
  }

  render() {
    const {searchInput} = this.state

    return (
      <div>
        <Header />
        <div className="jobs-container">
          <div className="jobs-content">
            <div className="search-container">
              <input
                type="search"
                className="search-input"
                value={searchInput}
                onChange={this.onChangeSearchInput}
                placeholder="Search"
              />
              <button type="button" data-testid="searchButton">
                <BsSearch className="search-icon" />
              </button>
            </div>
            {this.renderProfileSection()}
            <hr className="horizontal-line" />
            <div className="employment-type-container">
              <p className="employment-type-head">Type of Employment</p>
              <ul className="employment-type-list">
                {employmentTypesList.map(eachType => (
                  <li
                    className="employment-type-item"
                    key={eachType.employmentTypeId}
                  >
                    <input
                      type="checkbox"
                      className="checkbox"
                      id={eachType.employmentTypeId}
                    />
                    <label htmlFor={eachType.employmentTypeId}>
                      {eachType.label}
                    </label>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Jobs
