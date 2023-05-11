import {Component} from 'react'
import {Link} from 'react-router-dom'

import './index.css'

import Cookies from 'js-cookie'

import Loader from 'react-loader-spinner'

import {BsSearch, BsFillBriefcaseFill} from 'react-icons/bs'

import {MdLocationOn} from 'react-icons/md'

import Header from '../Header'
import ProfileDetails from '../ProfileDetails'

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

    jobDetails: [],
    activeSalaryRangeId: 0,
    activeEmploymentTypeId: [],
  }

  componentDidMount() {
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
      const {activeEmploymentTypeId} = this.state
      const newActiveEmploymentTypeId = activeEmploymentTypeId.filter(
        eachItem => eachItem !== event.target.id,
      )
      this.setState(
        {activeEmploymentTypeId: newActiveEmploymentTypeId},
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

  renderLoadingView = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderJobDetailsView = () => {
    const {jobDetails} = this.state
    const shouldShowJobsList = jobDetails.length > 0
    return shouldShowJobsList ? (
      <div className="jobs-details-container">
        <ul className="job-details-list">
          {jobDetails.map(eachJob => (
            <li key={eachJob.id} className="job-details-item">
              <Link to={`/jobs/${eachJob.id}`} className="link-item">
                <div className="job-logo-title-cont">
                  <img
                    src={eachJob.companyLogoUrl}
                    alt="company logo"
                    className="company-logo-img"
                  />
                  <div className="job-title-cont">
                    <h1 className="job-name">{eachJob.title}</h1>
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
                    <div className="job-location-cont">
                      <MdLocationOn className="location-icon" />
                      <p className="job-location">{eachJob.location}</p>
                    </div>
                    <div className="job-type-cont">
                      <BsFillBriefcaseFill className="briefcase-icon" />
                      <p className="job-type">{eachJob.employmentType}</p>
                    </div>
                  </div>
                  <p className="job-salary">{eachJob.packagePerAnnum}</p>
                </div>
                <hr className="horizontal-line" />
                <div className="job-description-cont">
                  <h1 className="job-description-head">Description</h1>
                  <p className="job-description">{eachJob.jobDescription}</p>
                </div>
              </Link>
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
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png "
        alt="failure view"
        className="jobs-failure-img"
      />
      <h1 className="jobs-failure-heading-text">Oops! Something Went Wrong</h1>
      <p className="jobs-failure-description">
        We cannot seem to find the page you are looking for
      </p>
      <button type="button" className="retry-btn" onClick={this.getJobsDetails}>
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
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  render() {
    const {searchInput, activeSalaryRangeId} = this.state
    return (
      <>
        <Header />
        <div className="jobs-container">
          <div className="jobs-content">
            <div className="profile-search-input-cont">
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
                  className="search-button"
                  onClick={this.onClickSearchInput}
                >
                  <BsSearch className="search-icon" />
                </button>
              </div>
              <ProfileDetails />
            </div>

            <hr className="horizontal-line" />
            <div className="job-info-container">
              <h1 className="job-info-head">Type of Employment</h1>
              <ul className="job-info-list-cont">
                {employmentTypesList.map(eachType => (
                  <li className="job-info-item" key={eachType.employmentTypeId}>
                    <input
                      type="checkbox"
                      className="checkbox"
                      id={eachType.employmentTypeId}
                      onChange={this.onChangeEmploymentTypeId}
                    />
                    <label
                      htmlFor={eachType.employmentTypeId}
                      className="job-info-label-name "
                    >
                      {eachType.label}
                    </label>
                  </li>
                ))}
              </ul>
            </div>
            <hr className="horizontal-line" />
            <div className="job-info-container">
              <h1 className="job-info-head">Salary Range</h1>
              <ul className="job-info-list-cont">
                {salaryRangesList.map(eachRange => (
                  <li className="job-info-item" key={eachRange.salaryRangeId}>
                    <input
                      type="radio"
                      value={eachRange.salaryRangeId}
                      checked={activeSalaryRangeId === eachRange.salaryRangeId}
                      className="radio"
                      id={eachRange.salaryRangeId}
                      onChange={this.onChangeSalaryRangeId}
                    />
                    <label
                      htmlFor={eachRange.salaryRangeId}
                      className="job-info-label-name "
                    >
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
