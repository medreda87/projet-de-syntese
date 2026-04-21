import Tag from "./Tag"

const TitleSectionText = ({
  tagText,
  titlePart1,
  description,
  descriptionClass
}) => {
  return (
    <div className="space-y-3 my-3">
      {/* Tag */}
      <div>
        {
            tagText && (
                <Tag>{tagText}</Tag>
            )
        }
      </div>
      {/* Headline */}
      <h2 className="text-3xl tracking-[-0.03em] title-section md:text-4xl lg:text-[44px] font-extrabold leading-[1.15]" dangerouslySetInnerHTML={{__html : titlePart1}} />
      {/* Description */}
      <p className={`${descriptionClass} text-base md:text-lg text-[#64748B] leading-relaxed max-w-xl`}>
        {description}
      </p>
    </div>
  )
}

export default TitleSectionText
