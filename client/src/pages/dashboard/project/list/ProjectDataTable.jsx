import * as React from 'react';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import DataTable from '@/components/DataTable';

function createData(name, calories, fat, carbs, protein) {
  return { name, calories, fat, carbs, protein };
}

const rows = [
  createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
  createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
  createData('Eclair', 262, 16.0, 24, 6.0),
  createData('Cupcake', 305, 3.7, 67, 4.3),
  createData('Gingerbread', 356, 16.0, 49, 3.9),
  createData('Gingerbread', 356, 16.0, 49, 3.9),
  createData('Gingerbread', 356, 16.0, 49, 3.9),
  createData('Gingerbread', 356, 16.0, 49, 3.9),
  createData('Gingerbread', 356, 16.0, 49, 3.9),
  createData('Gingerbread', 356, 16.0, 49, 3.9),
];

const colunms = [
  { header: 'Project name', align: 'left' },
  { header: 'Type', align: 'left' },
  { header: 'Total Raised', align: 'left' },
  { header: 'Status', align: 'left' },
  { header: '', align: 'left' },
]

export default function ProjectDataTable() {
  return (
    <DataTable
      className='mt-15'
      colunms={colunms}
      data={
        rows.map((row) => (
          <TableRow style={{ backgroundColor: row.name === 'Cupcake' ? 'blueviolet' : '' }}
            key={row.name}
          >
            <TableCell align="left">{row.name}</TableCell>
            <TableCell align="left">{row.carbs}</TableCell>
            <TableCell align="left">{row.protein}</TableCell>
            <TableCell align="left">{row.protein}</TableCell>
            <TableCell align="left">icon</TableCell>
          </TableRow>
        ))}
    />
  );
}
