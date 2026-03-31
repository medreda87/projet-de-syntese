import Tag from "./Tag"

const TitleSectionText = ({
  tagText,
  titlePart1,
  description,
  descriptionClass
}) => {
  return (
    <div className="space-y-6">
      {/* Tag */}
      <div>
        {
            tagText && (
                <Tag>{tagText}</Tag>
            )
        }
      </div>
      {/* Headline */}
      <h2 className="text-3xl tracking-[-2px] title-section md:text-4xl lg:text-5xl font-semibold leading-tight" dangerouslySetInnerHTML={{__html : titlePart1}} />
      {/* Description */}
      <p className={`${descriptionClass} text-lg text-[#62707D] leading-relaxed max-w-xl`}>
        {description}
      </p>
    </div>
  )
}

export default TitleSectionText
