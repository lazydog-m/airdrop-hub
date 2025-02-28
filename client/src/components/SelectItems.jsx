import { Check } from "lucide-react";
import { useState } from "react";

export const SelectItems = ({
  items,
  selectedItem,
  onChangeSelectedItem,
  ...other
}) => {

  return (
    <div className='dropdown-menu'>
      {items.map((item) => {
        return (
          <div
            className={`w-52 pointer color-white font-inter fs-13 dropdown-menu-item d-flex align-items-center justify-content-between gap-10`}
            onClick={() => onChangeSelectedItem(item.value)}
          >
            <span>
              {item.label}
            </span>
            {item.value === selectedItem && <Check size={17} />}
          </div>
        )
      })}
    </div>
  )
}
