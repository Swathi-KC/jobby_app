import Header from '../Header'

import './index.css'

const Home = () => (
  <>
    <Header />
    <div className="home-container">
      <div className="home-content">
        <h1 className="home-heading">Find The Job That Fits Your Life</h1>
        <p className="home-description">
          Millions of people are searching for jobs,salary information and
          company reviews.Find the job that fits your ability and potential.
        </p>
        <button type="button" className="find-jobs-btn">
          Find Jobs
        </button>
      </div>
    </div>
  </>
)

export default Home
