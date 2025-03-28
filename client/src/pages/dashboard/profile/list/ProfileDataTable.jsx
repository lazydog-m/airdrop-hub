import * as React from 'react';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import DataTable from '@/components/DataTable';
import { ButtonIcon } from '@/components/Button';
import { convertProjectCostTypeEnumToColorHex, convertProjectStatusEnumToColorHex, convertProjectStatusEnumToText, convertProjectTypeEnumToColorHex } from '@/utils/convertUtil';
import { Check, Ellipsis, SquareArrowOutUpRight, SquarePen, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Color } from '@/enums/enum';
import { Link } from 'react-router-dom';
import { formatDateVN } from '@/utils/formatDate';
import Modal from '@/components/Modal';
import ProfileNewEditForm from '../create/ProfileNewEditForm';
import Popover from '@/components/Popover';
import { SelectItems } from '@/components/SelectItems';
import { FaDiscord } from 'react-icons/fa6';

const colunms = [
  { header: '#', align: 'left' },
  { header: 'Tên Dự án', align: 'left' },
  { header: 'Mảng', align: 'left' },
  { header: 'Trạng thái', align: 'left' },
  { header: 'Ngày Bắt Đầu - Ngày Kết Thúc', align: 'left' },
  { header: 'Airdrop Dự Kiến ', align: 'left' },
  { header: 'Cheating', align: 'left' },
  { header: 'Task Hàng Ngày', align: 'left' },
  { header: '', align: 'left' },
]

export default function ProfileDataTable({ data, onUpdateData }) {
  const [open, setOpen] = React.useState(false);
  const [project, setProject] = React.useState({});

  const handleClickOpen = (item) => {
    setOpen(true);
    setProject(item);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <DataTable
        hasPagination={false}
        className='mt-15'
        colunms={colunms}
        data={
          data.map((row, index) => (
            <TableRow
              key={row.id}
            >
              <TableCell align="left">
                <span className='font-inter d-flex color-white'>
                  {index + 1}
                </span>
              </TableCell>
              <TableCell align="left">
                <span className='font-inter d-flex color-white fw-bold'>
                  {row.name}
                </span>
              </TableCell>
              <TableCell align="left">
                <div className='d-flex gap-6'>
                  <Badge
                    className='text-capitalize custom-badge'
                    style={{
                      backgroundColor: convertProjectTypeEnumToColorHex(row.type),
                      color: 'black',
                    }}
                  >
                    {row.type}
                  </Badge>
                  <Badge
                    className='text-capitalize custom-badge'
                    style={{
                      backgroundColor: convertProjectCostTypeEnumToColorHex(row.cost_type),
                    }}
                  >
                    {row.cost_type}
                  </Badge>
                </div>
              </TableCell>
              <TableCell align="left">
                <Badge
                  className='text-capitalize custom-badge'
                  style={{
                    backgroundColor: convertProjectStatusEnumToColorHex(row.status),
                    color: 'black',
                  }}
                >
                  {convertProjectStatusEnumToText(row.status)}
                </Badge>
              </TableCell>
              <TableCell align="left">
                <Badge variant={'secondary'} className='custom-badge'>
                  {`${formatDateVN(row.createdAt)} - ${!row.end_date ? 'N/A' : formatDateVN(row.end_date)}`}
                </Badge>
              </TableCell>
              <TableCell align="left">
                <Badge variant={'secondary'} className='custom-badge'>
                  {row.expected_airdrop_time ? row.expected_airdrop_time : 'TBA'}
                </Badge>
              </TableCell>
              <TableCell align="left">
                {row.is_cheating ? <Check color={Color.SUCCESS} /> : <X color={Color.DANGER} />}
              </TableCell>
              <TableCell align="left">
                {row.has_daily_tasks ? <Check color={Color.SUCCESS} /> : <X color={Color.DANGER} />}
              </TableCell>
              <TableCell align="left">
                <Link to={row.url} target='_blank' rel="noopener noreferrer">
                  <ButtonIcon
                    className='color-white pointer'
                    variant='ghost'
                    icon={<SquareArrowOutUpRight color={Color.PRIMARY} />}
                  />
                </Link>
                <ButtonIcon
                  onClick={() => handleClickOpen(row)}
                  variant='ghost'
                  icon={<SquarePen color={Color.WARNING} />}
                />
                {row.discord_url &&
                  <Link to={row.discord_url} target='_blank' rel="noopener noreferrer">
                    <ButtonIcon
                      // onClick={onClose}
                      variant='ghost'
                      icon={<FaDiscord color={Color.SECONDARY} />}
                    />
                  </Link>
                }
                {/*
              <ButtonIcon
                // onClick={onClose}
                variant='ghost'
                icon={<Trash2 color={Color.DANGER} />}
              />
*/}
                <Popover className='button-dropdown-filter-checkbox pointer'
                  trigger={
                    <ButtonIcon
                      // onClick={onClose}
                      variant='ghost'
                      icon={<Ellipsis />}
                    />
                  }
                  content={
                    <SelectItems
                      items={[
                        {
                          url: row.funding_rounds_url,
                          title: 'Các Vòng Gọi Vốn',
                        },
                        {
                          url: row.tutorial_url,
                          title: 'Hướng Dẫn Cách Làm',
                        }
                        ,
                      ]}
                    />
                  }
                />
              </TableCell>
            </TableRow >
          ))}

      />

      <Modal
        bottom={60}
        isOpen={open}
        onClose={handleClose}
        title={"Cập nhật dự án"}
        content={
          <ProfileNewEditForm
            onCloseModal={handleClose}
            currentProject={project}
            isEdit={true}
            onUpdateData={onUpdateData}
          />
        }
      />
    </>
  );
}
