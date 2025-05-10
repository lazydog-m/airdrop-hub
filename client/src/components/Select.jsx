import {
  Select as SelectMain,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function Select({ placeholder, onValueChange, value, items = [], convertItem, ...other }) {
  return (
    <SelectMain
      onValueChange={onValueChange}
      value={value}
      {...other}
    >
      <SelectTrigger className="mt-10 color-white font-inter fs-14 pointer">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent style={{ zIndex: 99999 }} >
        <SelectGroup style={{ padding: '3px' }}>
          {items.map((item) => {
            return (
              <SelectItem value={item} className='pointer text-capitalize' style={{ height: '35px' }}>
                <span className="text-capitalize font-inter">
                  {convertItem ? convertItem(item) : item}
                </span>
              </SelectItem>
            )
          })}
        </SelectGroup>
      </SelectContent>
    </SelectMain>
  )
} 
