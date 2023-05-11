import {Component} from 'react'

import Cookies from 'js-cookie'

import Loader from 'react-loader-spinner'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class ProfileDetails extends Component {
  state = {profileDetails: {}}

  componentDidMount() {
    this.getProfileDetails()
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

  renderProfileSectionRespectiveView = () => {
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
    return <>{this.renderProfileSectionRespectiveView()}</>
  }
}

export default ProfileDetails
