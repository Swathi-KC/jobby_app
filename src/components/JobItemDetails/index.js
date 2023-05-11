import {Component} from 'react'

import Cookies from 'js-cookie'

import Loader from 'react-loader-spinner'

import {MdLocationOn} from 'react-icons/md'
import {BsFillBriefcaseFill} from 'react-icons/bs'
import {BiLinkExternal} from 'react-icons/bi'

import Header from '../Header'
import SkillsCard from '../SkillsCard'
import SimilarJobsCard from '../SimilarJobsCard'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class JobItemDetails extends Component {
  state = {
    jobItemDetails: {},
    similarJobs: [],
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getJobItemDetails()
  }

  getFormattedJobItemData = data => ({
    companyLogoUrl: data.company_logo_url,
    companyWebsiteUrl: data.company_website_url,
    employmentType: data.employment_type,
    id: data.id,
    jobDescription: data.job_description,
    skills: data.skills.map(eachSkill => ({
      imageUrl: eachSkill.image_url,
      name: eachSkill.name,
    })),
    lifeAtCompany: {
      description: data.life_at_company.description,
      imageUrl: data.life_at_company.image_url,
    },
    location: data.location,
    packagePerAnnum: data.package_per_annum,
    rating: data.rating,
    title: data.title,
  })

  getFormattedSimilarJobData = data => ({
    companyLogoUrl: data.company_logo_url,
    employmentType: data.employment_type,
    id: data.id,
    jobDescription: data.job_description,
    location: data.location,
    rating: data.rating,
    title: data.title,
  })

  getJobItemDetails = async () => {
    const {match} = this.props
    const {params} = match
    const {id} = params
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = `https://apis.ccbp.in/jobs/${id}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)

    if (response.ok === true) {
      const fetchedData = await response.json()
      const updatedData = this.getFormattedJobItemData(fetchedData.job_details)
      const updatedSimilarJobsData = fetchedData.similar_jobs.map(eachJob =>
        this.getFormattedSimilarJobData(eachJob),
      )

      console.log(updatedData)
      console.log(updatedSimilarJobsData)

      this.setState({
        jobItemDetails: updatedData,
        similarJobs: updatedSimilarJobsData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderLoadingView = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderJobItemsView = () => {
    const {jobItemDetails, similarJobs} = this.state
    const {
      companyLogoUrl,
      companyWebsiteUrl,
      employmentType,
      jobDescription,
      location,
      title,
      rating,
      packagePerAnnum,
      lifeAtCompany,
    } = jobItemDetails
    const {skills} = jobItemDetails
    let descriptionLifeAtCompany
    let imageUrlLifeAtCompany

    if (lifeAtCompany) {
      const {description, imageUrl} = lifeAtCompany
      descriptionLifeAtCompany = description
      imageUrlLifeAtCompany = imageUrl
    }

    return (
      <div className="full-job-details-item-cont">
        <div className="full-job-item-cont">
          <div className="job-item-logo-title-cont">
            <img
              src={companyLogoUrl}
              alt="job details company logo"
              className="company-logo-img"
            />
            <div className="job-title-cont">
              <h1 className="job-name">{title}</h1>
              <div className="ratings-cont">
                <img
                  src="https://assets.ccbp.in/frontend/react-js/star-filled-img.png"
                  alt="star-icon"
                  className="star-img"
                />
                <p className="job-rating">{rating}</p>
              </div>
            </div>
          </div>
          <div className="job-location-type-salary-cont">
            <div className="job-location-type-cont">
              <div className="job-location-cont">
                <MdLocationOn className="location-icon" />
                <p className="job-location">{location}</p>
              </div>
              <div className="job-type-cont">
                <BsFillBriefcaseFill className="briefcase-icon" />
                <p className="job-type">{employmentType}</p>
              </div>
            </div>
            <p className="job-salary">{packagePerAnnum}</p>
          </div>
          <hr className="horizontal-line" />
          <div className="job-description-cont">
            <div className="job-desc-visit-cont">
              <h1 className="job-description-head">Description</h1>
              <a className="job-nav-link" href={companyWebsiteUrl}>
                Visit
                <BiLinkExternal className="link-icon" />
              </a>
            </div>

            <p className="job-description">{jobDescription}</p>
          </div>
          <div className="skills-container">
            <h1 className="skills-cont-heading">Skills</h1>
            <ul className="skills-list-container">
              {skills &&
                skills.map(eachSkill => (
                  <SkillsCard key={eachSkill.name} skillDetails={eachSkill} />
                ))}
            </ul>
          </div>
          <div className="life-at-company-cont">
            <div className="life-at-company-content">
              <h1 className="life-at-company-head">Life at company</h1>
              <p className="life-at-company-desc">{descriptionLifeAtCompany}</p>
            </div>

            <img
              src={imageUrlLifeAtCompany}
              alt="life at company"
              className="company-img"
            />
          </div>
        </div>
        <div className="similar-job-cont">
          <h1 className="similar-jobs-head">Similar Jobs</h1>
          <ul className="similar-jobs-list">
            {similarJobs &&
              similarJobs.map(eachJob => (
                <SimilarJobsCard key={eachJob.id} jobDetail={eachJob} />
              ))}
          </ul>
        </div>
      </div>
    )
  }

  renderJobItemsFailureView = () => (
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
      <button
        type="button"
        className="retry-btn"
        onClick={this.getJobItemDetails}
      >
        Retry
      </button>
    </div>
  )

  renderJobItemsRespectiveView = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderJobItemsView()
      case apiStatusConstants.failure:
        return this.renderJobItemsFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        <div>{this.renderJobItemsRespectiveView()}</div>
      </>
    )
  }
}

export default JobItemDetails
