import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from './ui/button';

export default function DataTable({ colunms, data, hasPagination = true, ...other }) {
  return (
    <div {...other}>
      <TableContainer component={Paper} className='custom-table'>
        <Table>
          <TableHead>
            <TableRow>
              {colunms.map((item) => {
                return (
                  <TableCell key={item.header} align={item.align}>
                    {item.header}
                  </TableCell>
                )
              })}
            </TableRow>
          </TableHead>
          <TableBody>
            {data}
          </TableBody>
        </Table>
      </TableContainer>

      {hasPagination &&
        <div className='pagination d-flex justify-content-end gap-20'>

          <div className='row-per-page mt-15 d-flex align-items-center gap-10'>
            <span className='font-inter fs-14 color-white'>Rows per page</span>
            <Select>
              <SelectTrigger className="w-[70px] color-white font-inter fs-13 pointer">
                <SelectValue defaultValue="10" placeholder='10' />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup style={{ padding: '3px' }}>
                  <SelectItem value="10" className='pointer'>10</SelectItem>
                  <SelectItem value="20" className='pointer'>25</SelectItem>
                  <SelectItem value="50" className='pointer'>50</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className='pagination-redirect mt-16 pe-10 d-flex align-items-center gap-20'>
            <span className='font-inter fs-14 color-white'>1-10 of 20</span>

            <div className='pagination-arrow d-flex gap-8'>
              <Button variant="outline" size="icon" className='color-white font-inter pointer'>
                <ChevronsLeft />
              </Button>
              <Button variant="outline" size="icon" className='color-white font-inter pointer'>
                <ChevronLeft />
              </Button>
              <Button variant="outline" size="icon" className='color-white font-inter pointer'>
                <ChevronRight />
              </Button>
              <Button variant="outline" size="icon" className='color-white font-inter pointer'>
                <ChevronsRight />
              </Button>
            </div>
          </div>
        </div>
      }

    </div>
  );
}
