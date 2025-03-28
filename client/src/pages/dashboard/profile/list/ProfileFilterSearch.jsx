import React, { useState, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { CirclePlus, ListFilter } from 'lucide-react';
import { CheckboxItems } from '@/components/Checkbox';
import Popover from "@/components/Popover";
import { ButtonGhost, ButtonOutlineTags } from '@/components/Button';
import { Color, ProjectCost, ProjectStatus, ProjectType } from '@/enums/enum';
import { Badge } from '@/components/ui/badge';
import { convertProjectCostTypeEnumToColorHex, convertProjectFilterOtherToColorHex, convertProjectStatusEnumToColorHex, convertProjectStatusEnumToText, convertProjectTypeEnumToColorHex } from '@/utils/convertUtil';

export default function ProfileFilterSearch({
  selectedStatusItems,
  onChangeSelectedStatusItems,
  onClearSelectedStatusItems,

  selectedTypeItems,
  onChangeSelectedTypeItems,
  onClearSelectedTypeItems,

  selectedCostItems,
  onChangeSelectedCostItems,
  onClearSelectedCostItems,

  selectedOtherItems,
  onChangeSelectedOtherItems,
  onClearSelectedOtherItems,

  onClearAllSelectedItems,
  search,
  onChangeSearch,
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
          placeholder='Tìm kiếm dự án ...'
          style={{ width: '200px' }}
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
                selected={selectedTypeItems}
                tags={
                  <Tags selectedItems={selectedTypeItems} style={convertProjectTypeEnumToColorHex} />
                }
              />
            }
            content={
              <CheckboxItems
                minWidth={180}
                items={typeFilters.items}
                selectedItems={selectedTypeItems}
                onChangeSelectedItems={onChangeSelectedTypeItems}
                onClearSelectedItems={onClearSelectedTypeItems}
              />
            }
          />

          <Popover className='button-dropdown-filter-checkbox'
            trigger={
              <ButtonOutlineTags
                title={costFilters.name}
                icon={<CirclePlus />}
                className='button-outlined font-inter pointer color-white h-40 fs-13 d-flex'
                selected={selectedCostItems}
                tags={
                  <Tags selectedItems={selectedCostItems} style={convertProjectCostTypeEnumToColorHex} />

                }
              />
            }
            content={
              <CheckboxItems
                minWidth={150}
                items={costFilters.items}
                selectedItems={selectedCostItems}
                onChangeSelectedItems={onChangeSelectedCostItems}
                onClearSelectedItems={onClearSelectedCostItems}
              />
            }
          />

          <Popover className='button-dropdown-filter-checkbox'
            trigger={
              <ButtonOutlineTags
                title={statusFilters.name}
                icon={<CirclePlus />}
                className='button-outlined font-inter pointer color-white h-40 fs-13 d-flex'
                selected={selectedStatusItems}
                tags={
                  <Tags selectedItems={selectedStatusItems} style={convertProjectStatusEnumToColorHex} convert={convertProjectStatusEnumToText} />

                }
              />
            }
            content={
              <CheckboxItems
                convert={convertProjectStatusEnumToText}
                items={statusFilters.items}
                selectedItems={selectedStatusItems}
                onChangeSelectedItems={onChangeSelectedStatusItems}
                onClearSelectedItems={onClearSelectedStatusItems}
              />
            }
          />

          <Popover className='button-dropdown-filter-checkbox'
            trigger={
              <ButtonOutlineTags
                title={otherFilters.name}
                icon={<CirclePlus />}
                className='button-outlined font-inter pointer color-white h-40 fs-13 d-flex'
                selected={selectedOtherItems}
                tags={
                  <Tags selectedItems={selectedOtherItems} style={convertProjectFilterOtherToColorHex} />
                }
              />
            }
            content={
              <CheckboxItems
                items={otherFilters.items}
                selectedItems={selectedOtherItems}
                onChangeSelectedItems={onChangeSelectedOtherItems}
                onClearSelectedItems={onClearSelectedOtherItems}
              />
            }
          />

          {(selectedStatusItems.length > 0 || selectedTypeItems.length > 0) &&
            <ButtonGhost
              icon={<ListFilter color={Color.ORANGE} />}
              onClick={onClearAllSelectedItems}
              title={
                <span style={{ color: Color.ORANGE }}>Làm mới</span>
              }
            />
          }
        </div>
      </div>
    </div>
  )
}

const statusFilters = {
  name: 'Trạng thái',
  items: [
    ProjectStatus.DOING,
    ProjectStatus.END_PENDING_UPDATE,
    ProjectStatus.TGE,
    ProjectStatus.SNAPSHOT,
    ProjectStatus.END_AIRDROP
  ],
};

const otherFilters = {
  name: 'Khác',
  items: [
    'Cheating',
    'Tasks Hàng Ngày'
  ],
};

const typeFilters = {
  name: 'Mảng',
  items: [ProjectType.WEB, ProjectType.TESTNET, ProjectType.DEPIN, ProjectType.RETROACTIVE, ProjectType.GAME, ProjectType.GALXE],
};

const costFilters = {
  name: 'Chi phí',
  items: [ProjectCost.FREE, ProjectCost.FEE, ProjectCost.HOLD],
};

const Tags = ({ selectedItems, style = () => { }, convert }) => {
  return (
    selectedItems.map((item) => {
      return (
        <Badge
          style={{ backgroundColor: style(item) }}
          className='text-capitalize font-inter fw-400 fs-12'
        >
          {convert ? convert(item) : item}
        </Badge>
      )
    })
  )
}
