import './index.css'

const SkillsCard = props => {
  const {skillDetails} = props
  console.log(skillDetails)
  const {imageUrl, name} = skillDetails
  return (
    <li className="skill-item-cont">
      <div className="skills-item-cont">
        <img src={imageUrl} alt={name} className="skills-img" />
        <p className="skills-name">{name}</p>
      </div>
    </li>
  )
}

export default SkillsCard
