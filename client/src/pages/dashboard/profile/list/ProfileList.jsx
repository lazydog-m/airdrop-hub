import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ButtonPrimary } from "@/components/Button";
import Container from "@/components/Container";
import { HeaderAction } from "@/components/HeaderSection";
import Page from "@/components/Page";
import { CirclePlus } from 'lucide-react';
import Modal from '@/components/Modal';
import { apiGet } from '@/utils/axios';
import { WalletStatus } from '@/enums/enum';
import useSpinner from '@/hooks/useSpinner';
import ProfileDataTable from './ProfileDataTable';
import ProfileNewEditForm from '../create/ProfileNewEditForm';
import ProfileFilterSearch from './ProfileFilterSearch';
import { convertEmailToEmailUsername } from '@/utils/convertUtil';
import useMessage from '@/hooks/useMessage';

const ProfileDataTableMemo = React.memo(ProfileDataTable);

export default function ProfileList() {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [key, setKey] = useState(0);
  const [pagination, setPagination] = useState({});
  const [message, setMessage] = useState('');
  const { onOpen, onClose } = useSpinner();
  const { onSuccess } = useMessage();
  const previousKey = useRef(key);

  const handleUpdateData = useCallback((isEdit, profileNew, message = '') => {
    if (!isEdit) {
      setKey((key) => (key + 1))
      setMessage(message);
    }
    else {
      setData((prevData) =>
        prevData.map((profile) =>
          profile.id === profileNew.id ? profileNew : profile
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

  const [selectedStatusItems, setSelectedStatusItems] = useState(['']);
  const [search, setSearch] = useState('');

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

  const handleClearAllSelectedItems = () => {
    setSelectedStatusItems([]);
    setSearch('');
    setPage(1);
  }

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

  useEffect(() => {
    const fetch = async () => {
      const params = {
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
        const response = await apiGet("/profiles", params);

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
        // onClose();
      }
    }

    fetch();
  }, [search, page, key])

  return (
    <Page title='Quản lý hồ sơ - AirdropHub'>
      <Container>
        <HeaderAction
          heading='Danh sách hồ sơ'
          action={
            <ButtonPrimary
              icon={<CirclePlus />}
              title='Thêm mới'
              onClick={handleClickOpen}
            />
          }
        />

        <ProfileFilterSearch
          // selectedStatusItems={selectedStatusItems}
          // onChangeSelectedStatusItems={handleChangeSelectedStatusItems}
          // onClearSelectedStatusItems={() => setSelectedStatusItems([])}
          onClearAllSelectedItems={handleClearAllSelectedItems}
          search={search}
          onChangeSearch={handleChangeSearch}
        />

        <ProfileDataTableMemo
          data={data}
          onUpdateData={handleUpdateData}
          onDeleteData={handleDeleteData}
          pagination={pagination}
          onChangePage={handleChangePage}
        />

        <Modal
          isOpen={open}
          onClose={handleClose}
          title={"Thêm mới hồ sơ"}
          content={
            <ProfileNewEditForm
              onCloseModal={handleClose}
              onUpdateData={handleUpdateData}
            />
          }
        />

      </Container>
    </Page>
  )
}
