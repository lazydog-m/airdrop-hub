import { Button } from "./ui/button";
import { Badge } from '@/components/ui/badge'
import { Separator } from "./ui/separator";

export const ButtonPrimary = ({ icon, title, ...other }) => {
  return (
    <Button className='button-primary font-inter pointer color-white h-40 fs-13 d-flex' {...other}>
      {icon} {title}
    </Button>
  )
}

export const ButtonOutline = ({ icon, title, ...other }) => {
  return (
    <Button className='button-outlined font-inter pointer color-white h-40 fs-13 d-flex' {...other}>
      {icon} {title}
    </Button>
  )
}

export const ButtonGhost = ({ icon, title, ...other }) => {
  return (
    <Button
      variant='ghost'
      className={`color-white font-inter pointer fs-13 h-40 d-flex align-items-center`}
      {...other}
    >
      {title} {icon}
    </Button>
  )
}

export const ButtonOutlineTags = ({ icon, title, tags = [], ...other }) => {
  return (
    <Button {...other}>

      <div className={`d-flex align-items-center gap-8 ${tags.length > 0 && 'pe-8'}`}>
        {icon} {title}
      </div>

      {tags.length > 0 &&
        <Separator orientation="vertical" className='h-4 color-white' />
      }

      {(tags.length > 0 && tags.length < 3) ?
        <div className="d-flex align-items-center gap-1 ps-8">
          {tags.map((title) => {
            return (
              <Badge className='color-primary color-white font-inter fw-400 fs-12'>{title}</Badge>
            )
          })}
        </div>
        : tags.length > 2 ?
          <div className="d-flex align-items-center gap-1 ps-8">
            <Badge className='color-primary color-white font-inter fw-400 fs-12'>{`${tags.length} selected`}</Badge>
          </div>
          : null
      }

    </Button>
  )
}

