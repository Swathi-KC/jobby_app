import './index.css'

import {BsFillBriefcaseFill} from 'react-icons/bs'
import {MdLocationOn} from 'react-icons/md'

const SimilarJobsCard = props => {
  const {jobDetail} = props
  const {
    companyLogoUrl,
    employmentType,
    jobDescription,
    location,
    rating,
    title,
  } = jobDetail
  return (
    <li className="similar-job-details-item">
      <div className="job-logo-title-cont">
        <img
          src={companyLogoUrl}
          alt="similar job company logo"
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

      <div className="job-description-cont">
        <h1 className="job-description-head">Description</h1>
        <p className="job-description">{jobDescription}</p>
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
      </div>
    </li>
  )
}

export default SimilarJobsCard
