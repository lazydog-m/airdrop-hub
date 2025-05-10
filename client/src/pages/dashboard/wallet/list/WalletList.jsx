import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ButtonDanger, ButtonPrimary } from "@/components/Button";
import Container from "@/components/Container";
import { HeaderAction } from "@/components/HeaderSection";
import Page from "@/components/Page";
import { CirclePlus, DatabaseZap, Trash2Icon } from 'lucide-react';
import Modal from '@/components/Modal';
import { apiGet } from '@/utils/axios';
import { CURRENT_DATA_TYPE, TRASH_DATA_TYPE, WalletStatus } from '@/enums/enum';
import useSpinner from '@/hooks/useSpinner';
import WalletNewEditForm from '../create/WalletNewEditForm';
import WalletDataTable from './WalletDataTable';
import WalletFilterSearch from './WalletFilterSearch';
import useMessage from '@/hooks/useMessage';

const WalletDataTableMemo = React.memo(WalletDataTable);

export default function WalletList() {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState([]);
  // const [dataType, setDataType] = useState(CURRENT_DATA_TYPE);
  const [page, setPage] = useState(1);
  const [key, setKey] = useState(0);
  const [pagination, setPagination] = useState({});
  const [message, setMessage] = useState('');
  const { onOpen, onClose } = useSpinner();
  const { onSuccess } = useMessage();
  const previousKey = useRef(key);

  const handleUpdateData = useCallback((isEdit, walletNew, message = '') => {
    if (!isEdit) {
      setKey((key) => (key + 1))
      setMessage(message);
    }
    else {
      setData((prevData) =>
        prevData.map((wallet) =>
          wallet.id === walletNew.id ? walletNew : wallet
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

  const [selectedStatusItems, setSelectedStatusItems] = useState([WalletStatus.IN_ACTIVE]);
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
        selectedStatusItems,
        // dataType,
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
        const response = await apiGet("/wallets", params);
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
  }, [selectedStatusItems,/*  dataType, */ search, page, key])

  return (
    <Page title='Quản lý ví - AirdropHub'>
      <Container>

        <HeaderAction
          heading='Danh sách ví'
          action={
            <ButtonPrimary
              icon={<CirclePlus />}
              title='Thêm mới'
              onClick={handleClickOpen}
            />
          }
        />

        <WalletFilterSearch
          selectedStatusItems={selectedStatusItems}
          onChangeSelectedStatusItems={handleChangeSelectedStatusItems}
          onClearSelectedStatusItems={() => setSelectedStatusItems([])}
          onClearAllSelectedItems={handleClearAllSelectedItems}
          onChangeSearch={handleChangeSearch}
          search={search}
        />

        <WalletDataTableMemo
          // dataType={dataType}
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
          title={"Thêm mới ví"}
          content={
            <WalletNewEditForm
              onCloseModal={handleClose}
              onUpdateData={handleUpdateData}
            />
          }
        />

      </Container>
    </Page>
  )
}
{/*
            <div className='d-flex gap-10'>
              <ButtonDanger
                icon={dataType === TRASH_DATA_TYPE ? <DatabaseZap /> : <Trash2Icon />}
                title={dataType === TRASH_DATA_TYPE ? 'Data hiện tại' : 'Thùng rác'}
                onClick={() => setDataType((prev) => prev === TRASH_DATA_TYPE ? CURRENT_DATA_TYPE : TRASH_DATA_TYPE)}
              />
            </div>
*/}
