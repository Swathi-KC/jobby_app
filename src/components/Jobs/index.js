import {Component} from 'react'

import './index.css'

import Cookies from 'js-cookie'

import Loader from 'react-loader-spinner'

import {BsSearch, BsFillBriefcaseFill} from 'react-icons/bs'

import {MdLocationOn} from 'react-icons/md'

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

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
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
    jobDetails: [],
    activeSalaryRangeId: 0,
    activeEmploymentTypeId: [],
  }

  componentDidMount() {
    this.getProfileDetails()
    this.getJobsDetails()
  }

  onChangeEmploymentTypeId = event => {
    if (event.target.checked) {
      this.setState(
        prevState => ({
          activeEmploymentTypeId: [
            ...prevState.activeEmploymentTypeId,
            event.target.id,
          ],
        }),
        this.getJobsDetails,
      )
    } else {
      this.setState(
        prevState => ({
          activeEmploymentTypeId: [...prevState.activeEmploymentTypeId],
        }),
        this.getJobsDetails,
      )
    }
  }

  onChangeSalaryRangeId = event => {
    if (event.target.checked) {
      this.setState({activeSalaryRangeId: event.target.id}, this.getJobsDetails)
    } else {
      this.setState({activeSalaryRangeId: ''}, this.getJobsDetails)
    }
  }

  onClickSearchInput = () => {
    this.getJobsDetails()
  }

  getJobsDetails = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const {
      activeEmploymentTypeId,
      activeSalaryRangeId,
      searchInput,
    } = this.state

    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = `https://apis.ccbp.in/jobs?employment_type=${activeEmploymentTypeId.join()}&minimum_package=${activeSalaryRangeId}&search=${searchInput}`
    console.log(apiUrl)
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    console.log(response)
    if (response.ok === true) {
      const fetchedData = await response.json()
      const updatedData = fetchedData.jobs.map(eachJob => ({
        companyLogoUrl: eachJob.company_logo_url,
        employmentType: eachJob.employment_type,
        id: eachJob.id,
        jobDescription: eachJob.job_description,
        location: eachJob.location,
        packagePerAnnum: eachJob.package_per_annum,
        rating: eachJob.rating,
        title: eachJob.title,
      }))
      this.setState({
        jobDetails: updatedData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
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

  onClickGetJobsRetryBtn = () => {
    this.getJobsDetails()
  }

  renderJobDetailsView = () => {
    const {jobDetails} = this.state
    const shouldShowJobsList = jobDetails.length > 0
    return shouldShowJobsList ? (
      <div className="jobs-details-container">
        <ul className="job-details-list">
          {jobDetails.map(eachJob => (
            <li key={eachJob.id} className="job-details-item">
              <div className="job-logo-title-cont">
                <img
                  src={eachJob.companyLogoUrl}
                  alt="company logo"
                  className="company-logo-img"
                />
                <div className="job-title-cont">
                  <p className="job-name">{eachJob.title}</p>
                  <div className="ratings-cont">
                    <img
                      src="https://assets.ccbp.in/frontend/react-js/star-filled-img.png"
                      alt="star-icon"
                      className="star-img"
                    />
                    <p className="job-rating">{eachJob.rating}</p>
                  </div>
                </div>
              </div>
              <div className="job-location-type-salary-cont">
                <div className="job-location-type-cont">
                  <div className="job-type-location-cont">
                    <MdLocationOn className="location-icon" />
                    <p className="job-location">{eachJob.location}</p>
                  </div>
                  <div className="job-type-location-cont">
                    <BsFillBriefcaseFill className="location-icon" />
                    <p className="job-type">{eachJob.employmentType}</p>
                  </div>
                </div>
                <p className="job-salary">{eachJob.packagePerAnnum}</p>
              </div>
              <hr className="horizontal-line" />
              <div className="job-description-cont">
                <p className="job-description-head">Description</p>
                <p className="job-description">{eachJob.jobDescription}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    ) : (
      <div className="no-jobs-view">
        <img
          src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
          className="no-jobs-img"
          alt="no jobs"
        />
        <h1 className="no-jobs-heading">No Jobs Found</h1>
        <p className="no-jobs-description">
          We could not find any Jobs. Try other filters.
        </p>
      </div>
    )
  }

  renderJobsDetailsFailureView = () => (
    <div className="job-details-failure-cont">
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz/nxt-trendz-products-error-view.png"
        alt="products failure"
        className="products-failure-img"
      />
      <h1 className="product-failure-heading-text">
        Oops! Something Went Wrong
      </h1>
      <p className="products-failure-description">
        We cannot seem to find the page your looking for.
      </p>
      <button
        type="button"
        className="retry-btn"
        onClick={this.onClickGetJobsRetryBtn}
      >
        Retry
      </button>
    </div>
  )

  renderJobDetailsRespectiveView = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderJobDetailsView()
      case apiStatusConstants.failure:
        return this.renderJobsDetailsFailureView()
      default:
        return this.renderLoadingView()
    }
  }

  render() {
    const {searchInput} = this.state
    return (
      <>
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
              <button
                type="button"
                data-testid="searchButton"
                onClick={this.onClickSearchInput}
              >
                <BsSearch className="search-icon" />
              </button>
            </div>
            {this.renderProfileSection()}
            <hr className="horizontal-line" />
            <div className="job-info-container">
              <p className="job-info-head">Type of Employment</p>
              <ul className="job-info-list">
                {employmentTypesList.map(eachType => (
                  <li className="job-info-item" key={eachType.employmentTypeId}>
                    <input
                      type="checkbox"
                      className="checkbox"
                      id={eachType.employmentTypeId}
                      onChange={this.onChangeEmploymentTypeId}
                    />
                    <label htmlFor={eachType.employmentTypeId}>
                      {eachType.label}
                    </label>
                  </li>
                ))}
              </ul>
            </div>
            <hr className="horizontal-line" />
            <div className="job-info-container">
              <p className="job-info-head">Salary Range</p>
              <ul className="job-info-list">
                {salaryRangesList.map(eachRange => (
                  <li className="job-info-item" key={eachRange.salaryRangeId}>
                    <input
                      type="radio"
                      className="radio"
                      id={eachRange.salaryRangeId}
                      onChange={this.onChangeSalaryRangeId}
                    />
                    <label htmlFor={eachRange.salaryRangeId}>
                      {eachRange.label}
                    </label>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          {this.renderJobDetailsRespectiveView()}
        </div>
      </>
    )
  }
}

export default Jobs
