import React, { useEffect, useState, useRef } from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { ButtonIcon, ButtonOutline } from './Button';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { parseInt } from 'lodash';

const LIMIT = 12;
export default function DataTable({ colunms, data = [], maxHeight = 650, onChangePage = () => { }, loading, pagination, ...other }) {

  const start = data.length <= 0 ? 0 : (pagination?.page - 1) * LIMIT + 1;
  const end = data.length <= 0 ? 0 : Math.min(start + LIMIT - 1, pagination?.totalItems);
  console.log(data)

  return (
    <div {...other}>
      <TableContainer
        component={Paper}
        // style={{ overflowY: 'scroll' }}
        className='custom-table'
        sx={{
          maxHeight,
        }}
      >
        <Table
          stickyHeader
          className='table-default'
        >
          <TableHead>
            <TableRow>
              {colunms.map((item) => {
                return (
                  <TableCell
                    // width={item.width}
                    key={item.header}
                    align={item.align}
                  >
                    <span className='fw-bold font-inter' style={item.style}>
                      {item.header}
                    </span>
                  </TableCell>
                )
              })}
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.length > 0 ? data :
              <TableRow>
                <TableCell colSpan={8}>
                  <div className='font-inter color-white text-center' style={{ padding: '30px' }}>
                    Chưa có dữ liệu.
                  </div>
                </TableCell>
              </TableRow>
            }
          </TableBody>
        </Table>
      </TableContainer>

      <div className='pagination d-flex justify-content-between mt-20 color-white font-inter'>
        <div className='align-items-center justify-content-center d-flex fs-14 fw-400'>
          {`Trang ${pagination?.page || 0} | Đang xem ${start || 0} - ${end || 0}/${pagination?.totalItems || 0}`}
        </div>

        <div className='d-flex gap-15'>
          <ButtonOutline
            disabled={!pagination?.hasPre}
            onClick={() => onChangePage('prevs')}
            icon={
              <ChevronsLeft />
            }
          />
          <ButtonOutline
            disabled={!pagination?.hasPre}
            onClick={() => onChangePage('prev')}
            icon={
              <ChevronLeft />
            }
          />

          <ButtonOutline
            disabled={!pagination?.hasNext}
            onClick={() => onChangePage('next')}
            isReverse
            icon={
              <ChevronRight />
            }
          />

          <ButtonOutline
            disabled={!pagination?.hasNext}
            onClick={() => onChangePage('nexts')}
            icon={
              <ChevronsRight />
            }
          />
        </div>

      </div>

    </div>
  );
}

