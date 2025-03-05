import * as React from 'react';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import DataTable from '@/components/DataTable';
import { ButtonIcon } from '@/components/Button';
import { Check, Ellipsis, EllipsisVertical, SquareArrowOutUpRight, SquarePen, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Color, ProjectRating, ProjectStatus, ProjectType } from '@/enums/enum';
import { Link } from 'react-router-dom';
import { formatDateVN } from '@/utils/formatDate';

const colunms = [
  { header: 'Project Name', align: 'left' },
  { header: 'Type', align: 'left' },
  { header: 'Status', align: 'left' },
  { header: 'Start Date - End Date', align: 'left' },
  { header: 'Daily Tasks', align: 'left' },
  { header: '', align: 'left' },
]

export default function ProjectDataTable({ data }) {
  return (
    <DataTable
      className='mt-15'
      colunms={colunms}
      data={
        data.map((row) => (
          <TableRow style={{ /* backgroundColor: row.name === 'Cupcake' ? 'blueviolet' : '' */ }}
            key={row.id}
          >
            <TableCell align="left">
              <span className='font-inter fs-14 d-flex color-white fw-bold'>
                {row.name}
              </span>
            </TableCell>
            <TableCell align="left">
              <Badge
                // variant='outline'
                className='text-capitalize custom-badge'
                style={{
                  backgroundColor: row.type === ProjectType.TESTNET && Color.SECONDARY,
                  // color: row.type === ProjectType.TESTNET && 'white'
                }}
              >
                {row.type}
              </Badge>
            </TableCell>
            <TableCell align="left">
              <Badge
                className='text-capitalize custom-badge'
                style={{
                  backgroundColor: row.status === ProjectStatus.DOING ? Color.SUCCESS : ProjectStatus.ENDED ? Color.DANGER : Color.WARNING,
                  color: row.status === ProjectStatus.ENDED ? 'white' : 'black',
                }}
              >
                {row.status}
              </Badge>
            </TableCell>
            <TableCell align="left">
              <Badge variant={'outline'} className='custom-badge'>
                {`${formatDateVN(row.createdAt)} - ${!row.end_date ? 'N/A' : formatDateVN(row.end_date)}`}
              </Badge>
            </TableCell>
            <TableCell align="left">
              <Check color={Color.SUCCESS} />
              <X color={Color.DANGER} />
            </TableCell>
            <TableCell align="left">
              <ButtonIcon
                // onClick={onClose}
                variant='ghost'
                icon={<SquareArrowOutUpRight />}
              />
              <ButtonIcon
                // onClick={onClose}
                variant='ghost'
                icon={<SquarePen />}
              />
              <ButtonIcon
                // onClick={onClose}
                variant='ghost'
                icon={<Ellipsis />}
              />
            </TableCell>
          </TableRow >
        ))}
    />
  );
}
