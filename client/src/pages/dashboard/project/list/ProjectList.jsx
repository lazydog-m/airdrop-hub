import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ButtonPrimary } from "@/components/Button";
import Container from "@/components/Container";
import { HeaderAction } from "@/components/HeaderSection";
import Page from "@/components/Page";
import { CirclePlus } from 'lucide-react';
import ProjectFilterSearch from "./ProjectFilterSearch";
import ProjectDataTable from './ProjectDataTable';
import Modal from '@/components/Modal';
import ProjectNewEditForm from '../create/ProjectNewEditForm';
import { apiGet } from '@/utils/axios';
import { ProjectStatus } from '@/enums/enum';
import useSpinner from '@/hooks/useSpinner';
import useMessage from '@/hooks/useMessage';

const ProjectDataTableMemo = React.memo(ProjectDataTable);

export default function ProjectList() {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [key, setKey] = useState(0);
  const [pagination, setPagination] = useState({});
  const [message, setMessage] = useState('');
  const { onOpen, onClose } = useSpinner();
  const { onSuccess } = useMessage();
  const previousKey = useRef(key);

  const handleChangePage = useCallback((action) => {

    if (action === 'prev') {
      setPage((prev) => prev - 1);
    }
    if (action === 'next') {
      setPage((prev) => prev + 1);
    }

    if (action === 'prevs') {
      setPage(1);
    }
    if (action === 'nexts') {
      console.log(pagination)
      setPage(pagination?.totalPages);
    }

  }, [pagination])

  const handleUpdateData = useCallback((isEdit, projectNew, message = '') => {
    if (!isEdit) {
      setKey((key) => (key + 1))
      setMessage(message);
    }
    else {
      setData((prevData) =>
        prevData.map((project) =>
          project.id === projectNew.id ? projectNew : project
        )
      );
    }
  }, []);

  const handleDeleteData = useCallback((message = '') => {
    setKey((key) => (key + 1))
    setMessage(message);
  }, []);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const [selectedStatusItems, setSelectedStatusItems] = useState([ProjectStatus.DOING]);
  const [selectedTypeItems, setSelectedTypeItems] = useState([]);
  const [selectedCostItems, setSelectedCostItems] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedOtherItems, setSelectedOtherItems] = useState([]);

  const handleChangeSearch = (value) => {
    setSearch(value);
    setPage(1);
  }

  const handleChangeSelectedStatusItems = (label, isChecked) => {
    setSelectedStatusItems((prev) => {
      if (isChecked) {
        return [...prev, label];
      } else {
        return prev.filter((item) => item !== label);
      }
    });
    setPage(1);
  };

  const handleChangeSelectedTypeItems = (label, isChecked) => {
    setSelectedTypeItems((prev) => {
      if (isChecked) {
        return [...prev, label];
      } else {
        return prev.filter((item) => item !== label);
      }
    });
    setPage(1);
  };

  const handleChangeSelectedCostItems = (label, isChecked) => {
    setSelectedCostItems((prev) => {
      if (isChecked) {
        return [...prev, label];
      } else {
        return prev.filter((item) => item !== label);
      }
    });
    setPage(1);
  };

  const handleChangeSelectedOtherItems = (label, isChecked) => {
    setSelectedOtherItems((prev) => {
      if (isChecked) {
        return [...prev, label];
      } else {
        return prev.filter((item) => item !== label);
      }
    });
    setPage(1);
  };

  const handleClearAllSelectedItems = () => {
    setSelectedTypeItems([]);
    setSelectedStatusItems([]);
    setSelectedCostItems([]);
    setSelectedOtherItems([]);
    setSearch('');
    setPage(1);
  }

  useEffect(() => {
    const fetch = async () => {

      const params = {
        selectedCostItems,
        selectedTypeItems,
        selectedOtherItems,
        selectedStatusItems,
        page,
        search,
      }

      try {
        if (previousKey.current !== key) {
          previousKey.current = key;
        }
        else {
          onOpen();
        }
        const response = await apiGet("/projects", params);

        if (message) {
          onSuccess(message);
          setData(response.data.data.data || []);
          setPagination(response.data.data.pagination || {});
          onClose();
          setMessage('');
        }
        else {
          setTimeout(() => {
            setData(response.data.data.data || []);
            setPagination(response.data.data.pagination || {});
            onClose();
          }, 200)
        }

      } catch (error) {
        console.error(error);
        onClose();
      } finally {
      }
    }

    fetch();
  }, [selectedStatusItems, selectedOtherItems, selectedTypeItems, selectedCostItems, search, page, key])

  return (
    <Page title='Quản lý dự án - AirdropHub'>
      <Container>

        <HeaderAction
          heading='Danh sách dự án'
          action={
            <ButtonPrimary
              icon={<CirclePlus />}
              title='Thêm mới'
              onClick={handleClickOpen}
            />
          }
        />

        <ProjectFilterSearch
          selectedStatusItems={selectedStatusItems}
          onChangeSelectedStatusItems={handleChangeSelectedStatusItems}
          onClearSelectedStatusItems={() => setSelectedStatusItems([])}

          selectedTypeItems={selectedTypeItems}
          onChangeSelectedTypeItems={handleChangeSelectedTypeItems}
          onClearSelectedTypeItems={() => setSelectedTypeItems([])}

          selectedCostItems={selectedCostItems}
          onChangeSelectedCostItems={handleChangeSelectedCostItems}
          onClearSelectedCostItems={() => setSelectedCostItems([])}

          selectedOtherItems={selectedOtherItems}
          onChangeSelectedOtherItems={handleChangeSelectedOtherItems}
          onClearSelectedOtherItems={() => setSelectedOtherItems([])}

          onClearAllSelectedItems={handleClearAllSelectedItems}
          search={search}
          onChangeSearch={handleChangeSearch}
        />

        <ProjectDataTableMemo
          pagination={pagination}
          onChangePage={handleChangePage}
          data={data}
          onUpdateData={handleUpdateData}
          onDeleteData={handleDeleteData}
        />

        <Modal
          isOpen={open}
          onClose={handleClose}
          title={"Thêm mới dự án"}
          content={
            <ProjectNewEditForm
              onCloseModal={handleClose}
              onUpdateData={handleUpdateData}
            />
          }
        />

      </Container>
    </Page>
  )
}
