import { useState } from "react";

const useTable = () => {

  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);

  const handleChangePage = (currentPage) => {
    setPage(currentPage);
  }

  const handleChangeSize = (pageSize) => {
    setSize(pageSize);
  }

  return { page, size, handleChangePage, handleChangeSize };
}
export default useTable;
