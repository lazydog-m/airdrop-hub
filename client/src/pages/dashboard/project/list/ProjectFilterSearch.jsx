import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { ArrowDown01, ArrowUp10, ArrowDown10, ArrowDownUp, ArrowDownZa, ArrowUpDown, CirclePlus } from 'lucide-react';
import { CheckboxItems } from '@/components/Checkbox';
import { Button } from "@/components/ui/button";
import Popover from "@/components/Popover";
import { ButtonGhost, ButtonOutline, ButtonOutlineTags } from '@/components/Button';
import { SelectItems } from '@/components/SelectItems';

export default function ProjectFilterSearch({
  selectedStatusItems,
  onChangeSelectedStatusItems,
  onClearSelectedStatusItems,

  selectedTypeItems,
  onChangeSelectedTypeItems,
  onClearSelectedTypeItems,

  selectedRatingItems,
  onChangeSelectedRatingItems,
  onClearSelectedRatingItems,

  onClearAllSelectedItems,
  search,
  onChangeSearch,

  selectedSort,
  onChangeSelectedSort,
}) {

  const [openSort, setOpenSort] = useState(false);

  const handleChangeSelectedSort = (selected) => {
    onChangeSelectedSort(selected);

    setTimeout(() => {
      setOpenSort(false);
    }, 50);
  }

  return (
    <div className="d-flex mt-20 justify-content-between align-items-center">
      <div className="filter-search d-flex gap-10">
        <Input
          placeholder='Search projects...'
          style={{ width: '250px' }}
          className='color-white font-inter h-40 fs-13'
          value={search}
          onChange={onChangeSearch}
        />

        <div className="filters-button d-flex gap-10">
          <Popover className='button-dropdown-filter-checkbox'
            trigger={
              <ButtonOutlineTags
                title={typeFilters.name}
                icon={<CirclePlus />}
                className='button-outlined font-inter pointer color-white h-40 fs-13 d-flex'
                tags={selectedTypeItems}
              />
            }
            content={
              <CheckboxItems
                items={typeFilters.items}
                selectedItems={selectedTypeItems}
                onChangeSelectedItems={onChangeSelectedTypeItems}
                onClearSelectedItems={onClearSelectedTypeItems}
                count
              />
            }
          />

          <Popover className='button-dropdown-filter-checkbox'
            trigger={
              <ButtonOutlineTags
                title={ratingFilters.name}
                icon={<CirclePlus />}
                className='button-outlined font-inter pointer color-white h-40 fs-13 d-flex'
                tags={selectedRatingItems}
              />
            }
            content={
              <CheckboxItems
                items={ratingFilters.items}
                selectedItems={selectedRatingItems}
                onChangeSelectedItems={onChangeSelectedRatingItems}
                onClearSelectedItems={onClearSelectedRatingItems}
                count
              />
            }
          />

          <Popover className='button-dropdown-filter-checkbox'
            trigger={
              <ButtonOutlineTags
                title={statusFilters.name}
                icon={<CirclePlus />}
                className='button-outlined font-inter pointer color-white h-40 fs-13 d-flex'
                tags={selectedStatusItems}
              />
            }
            content={
              <CheckboxItems
                items={statusFilters.items}
                selectedItems={selectedStatusItems}
                onChangeSelectedItems={onChangeSelectedStatusItems}
                onClearSelectedItems={onClearSelectedStatusItems}
                count
              />
            }
          />

          {(selectedStatusItems.length > 0 || selectedTypeItems.length > 0) &&
            <ButtonGhost
              onClick={onClearAllSelectedItems}
              title={'Reset filters'}
            />
          }
        </div>
      </div>

      <div className="filter-sort">
        <div className="sort-button d-flex gap-10">
          <Popover className='button-dropdown-filter-select'
            visible={openSort}
            onVisibleChange={setOpenSort}
            trigger={
              <ButtonOutline
                onClick={() => setOpenSort(!openSort)}
                title='Sort'
                icon={<ArrowUpDown />}
                className='button-outlined font-inter pointer color-white h-40 fs-13 d-flex gap-9'
              />
            }
            content={
              <SelectItems
                items={sortItems}
                selectedItem={selectedSort}
                onChangeSelectedItem={handleChangeSelectedSort}
              />
            }
          />
        </div>
      </div>
    </div>
  )
}

const sortItems = [
  {
    value: 'raisedDesc',
    label: <span className='d-flex align-items-center gap-10'>
      <ArrowUp10 size={15} />
      By Total Raised DESC
    </span>,
  },
  {
    value: 'raisedAsc',
    label:
      <span className='d-flex align-items-center gap-10'>
        <ArrowDown01 size={15} />
        By Total Raised ASC
      </span>,
  },
]

const statusFilters = {
  name: 'Status',
  items: ['Active', 'Inactive'],
};

const typeFilters = {
  name: 'Type',
  items: ['Testnet', 'Web', 'Depin'],
};

const ratingFilters = {
  name: 'Rating',
  items: ['High', 'Medium', 'Low'],
};
