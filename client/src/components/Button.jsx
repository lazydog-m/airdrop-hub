import { Button } from "./ui/button";
import { Badge } from '@/components/ui/badge'
import { Separator } from "./ui/separator";
import { reverse } from "lodash";

export const ButtonPrimary = ({ icon, title, ...other }) => {
  return (
    <Button className='button-primary font-inter pointer color-white h-40 fs-13 d-flex' {...other}>
      {icon} {title}
    </Button>
  )
}

export const ButtonDanger = ({ icon, title, ...other }) => {
  return (
    <Button variant={'destructive'} className='font-inter pointer color-white h-40 fs-13 d-flex' {...other}>
      {icon} {title}
    </Button>
  )
}

export const ButtonOutline = ({ icon, title, isReverse, ...other }) => {

  if (isReverse) {
    return (
      <Button className='button-outlined font-inter pointer color-white h-40 fs-13 d-flex align-items-center justify-content-center select-none' {...other}>
        {title} {icon}
      </Button>
    )
  }

  return (
    <Button className='button-outlined font-inter pointer color-white h-40 fs-13 d-flex  align-items-center justify-content-center  select-none' {...other}>
      {icon} {title}
    </Button>
  )
}

export const ButtonIcon = ({ icon, variant = 'outline', ...other }) => {
  return (
    <Button
      className="pointer"
      variant={variant}
      size='icon'
      {...other}
    >
      {icon}
    </Button>
  )
}

export const ButtonGhost = ({ icon, title, isReverse, ...other }) => {
  if (isReverse) {
    return (
      <Button
        variant='ghost'
        className={`color-white font-inter pointer fs-13 h-40 d-flex align-items-center`}
        {...other}
      >
        {icon} {title}
      </Button>
    )
  }

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

export const ButtonOutlineTags = ({ icon, title, selected = [], tags, ...other }) => {
  return (
    <Button {...other}>

      <div className={`d-flex align-items-center gap-8 ${selected.length > 0 && 'pe-8'}`}>
        {icon} {title}
      </div>

      {selected.length > 0 &&
        <Separator orientation="vertical" className='h-4 color-white' />
      }

      {(selected.length > 0 && selected.length < 3) ?
        <div className="d-flex align-items-center gap-1 ps-8">
          {tags}
        </div>
        : selected.length > 2 ?
          <div className="d-flex align-items-center gap-1 ps-8">
            <Badge className='font-inter fw-400 fs-12'>{`${selected.length} lựa chọn`}</Badge>
          </div>
          : null
      }

    </Button>
  )
}

