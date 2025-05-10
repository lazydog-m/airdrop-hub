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
import ProfileWalletFilterSearch from './ProfileWalletFilterSearch';
import ProfileWalletDataTable from './ProfileWalletDataTable';
import ProfileWalletNewEditForm from '../../create/ProfileWalletNewEditForm';
import useMessage from '@/hooks/useMessage';

const ProfileWalletDataTableMemo = React.memo(ProfileWalletDataTable);

export default function ProfileWalletList({ id }) {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [key, setKey] = useState(0);
  const [pagination, setPagination] = useState({});
  const [message, setMessage] = useState('');
  const { onOpen, onClose } = useSpinner();
  const { onSuccess } = useMessage();
  const previousKey = useRef(key);

  const handleUpdateData = useCallback((isEdit, profileWalletNew, message = '') => {
    if (!isEdit) {
      setKey((key) => (key + 1))
      setMessage(message);
    }
    else {
      setData((prevData) =>
        prevData.map((profileWallet) =>
          profileWallet.id === profileWalletNew.id ? profileWalletNew : profileWallet
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

  const [search, setSearch] = useState('');

  const handleChangeSearch = (value) => {
    setSearch(value);
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

  const handleClearAllSelectedItems = () => {
    setSearch('');
    setPage(1);
  }

  useEffect(() => {
    const fetch = async () => {
      const params = {
        id,
        search,
        page,
      }

      try {
        if (previousKey.current !== key) {
          previousKey.current = key;
        }
        else {
          onOpen();
        }
        const response = await apiGet("/profile-wallets", params);
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
            console.log(response.data.data.data)
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
    <div style={{ maxHeight: '600px', minHeight: '600px', minWidth: '1365px', maxWidth: '1365px', overflow: 'hidden', padding: '1px' }}>
      <ProfileWalletFilterSearch
        action={
          <ButtonPrimary
            icon={<CirclePlus />}
            title='Thêm mới'
            onClick={handleClickOpen}
          />
        }
        onClearAllSelectedItems={handleClearAllSelectedItems}
        onChangeSearch={handleChangeSearch}
        search={search}
      />

      <ProfileWalletDataTableMemo
        data={data}
        onUpdateData={handleUpdateData}
        onDeleteData={handleDeleteData}
        pagination={pagination}
        onChangePage={handleChangePage}
      />

      <Modal
        size='sm'
        isOpen={open}
        onClose={handleClose}
        title={"Thêm mới địa chỉ ví"}
        content={
          <ProfileWalletNewEditForm
            profileId={id}
            onCloseModal={handleClose}
            onUpdateData={handleUpdateData}
          />
        }
      />

    </div>
  )
}
