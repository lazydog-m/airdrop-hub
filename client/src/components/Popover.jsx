import { Popover as PopoverAntd } from 'antd';

export default function Popover({ trigger, content, ...other }) {

  return (
    <PopoverAntd
      color={'#09090B'}
      content={content}
      trigger='click'
      placement='bottomLeft'
      {...other}
    >
      {trigger}
    </PopoverAntd>
  )

}
