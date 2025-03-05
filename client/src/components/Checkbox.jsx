import React, { useState } from 'react';
import { Checkbox as CheckboxAntd } from 'antd';
import { ButtonOutline } from './Button';
import { toString } from 'lodash';

export const Checkbox = ({ label, checked, onChange = () => { }, ...other }) => {
  return (
    <CheckboxAntd
      className='checkbox-default'
      {...other}
      id={label}
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
    >
      <span className='color-white fs-13 font-inter'>{label}</span>
    </CheckboxAntd>
  );
}

export const CheckboxItems = ({
  items,
  selectedItems,
  onChangeSelectedItems,
  onClearSelectedItems,
  count,
  ...other
}) => {

  return (
    <div className='dropdown-menu'>
      {items.map((item) => {
        const isChecked = selectedItems.includes(item);
        return (
          <div
            className='pointer dropdown-menu-item d-flex align-items-center justify-content-between'
            onClick={() => onChangeSelectedItems(item, !isChecked)}
          >
            <Checkbox
              {...other}
              label={
                <span className='text-capitalize'>
                  {item}
                </span>
              }
              checked={selectedItems.includes(item)}
            />
            {count &&
              <span className='font-inter color-white fs-13'>{50}</span>
            }
          </div>
        )
      })}
      {selectedItems.length > 0 &&
        <ButtonOutline
          onClick={onClearSelectedItems}
          className='button-outlined w-full mt-5 font-inter pointer color-white h-35 fs-13 d-flex'
          title='Clear filters'
        />
      }
    </div>
  )
}
