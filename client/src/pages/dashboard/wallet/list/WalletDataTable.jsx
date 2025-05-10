import * as React from 'react';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import DataTable from '@/components/DataTable';
import { ButtonIcon } from '@/components/Button';
import { convertWalletStatusEnumToReverse, convertWalletStatusEnumToTextReverse } from '@/utils/convertUtil';
import { SquarePen, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Color, NOT_AVAILABLE, WalletStatus } from '@/enums/enum';
import Modal from '@/components/Modal';
import useSpinner from '@/hooks/useSpinner';
import { apiDelete, apiPut } from '@/utils/axios';
import useConfirm from '@/hooks/useConfirm';
import useNotification from '@/hooks/useNotification';
import WalletNewEditForm from '../create/WalletNewEditForm';
import SwitchStyle from '@/components/Switch';
import useMessage from '@/hooks/useMessage';
import useCopy from '@/hooks/useCopy';
import CopyButton from '@/components/CopyButton';

const colunms = [
  { header: '#', align: 'left' },
  { header: 'Tên Ví', align: 'left' },
  { header: 'Mật Khẩu Ví', align: 'left' },
  { header: 'Trạng Thái', align: 'left' },
  { header: '', align: 'left' },
]

const DataTableMemo = React.memo(DataTable);

export default function WalletDataTable({ data, onUpdateData, onDeleteData, dataType, pagination, onChangePage }) {
  const [open, setOpen] = React.useState(false);
  const [wallet, setWallet] = React.useState({});
  const { onOpen, onClose } = useSpinner();
  const { showConfirm } = useConfirm();
  const { onSuccess } = useMessage();
  const { onOpenSuccessNotify, onOpenErrorNotify } = useNotification();

  const { copied, handleCopy } = useCopy();

  const handleCopyText = (id, text, type) => {
    navigator.clipboard.writeText(text).then(() => {
      handleCopy(id, type);
      onSuccess('Đã copy!');
    });
  }

  const handleClickOpen = (item) => {
    setOpen(true);
    setWallet(item);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleUpdateWalletStatus = (id, status, stt) => {
    const statusToTextReverse = convertWalletStatusEnumToTextReverse(status);
    const body = {
      id,
      status: convertWalletStatusEnumToReverse(status),
      stt,
    };
    showConfirm(`Xác nhận cập nhật trạng thái của ví thành '${statusToTextReverse?.toUpperCase()}'?`, () => putStatus(body));
  }

  const putStatus = async (body) => {
    console.log(body)
    try {
      onOpen();
      const response = await apiPut(`/wallets/status`, body);
      onUpdateData(true, response.data.data);
      onSuccess("Cập nhật trạng thái của ví thành công!");
    } catch (error) {
      console.error(error);
      onOpenErrorNotify(error.message);
    } finally {
      onClose();
    }
  }

  const handleDelete = (id) => {
    showConfirm("Xác nhận xóa ví?", () => remove(id));
  }

  const remove = async (id) => {
    try {
      onOpen();
      const response = await apiDelete(`/wallets/${id}`);
      onDeleteData("Xóa ví thành công!");
    } catch (error) {
      console.error(error);
      onOpenErrorNotify(error.message);
      onClose();
    } finally {
      // onClose();
    }
  }

  const rows = React.useMemo(() => {
    return data.map((row, index) => (
      <TableRow
        key={row.id}
      >
        <TableCell align="left">
          <span className='font-inter d-flex color-white'>
            {row.stt}
          </span>
        </TableCell>
        <TableCell align="left">
          <span className='font-inter d-flex color-white fw-bold'>
            {row.name}
          </span>
        </TableCell>
        <TableCell align="left">
          <CopyButton
            text={row.password}
            copied={copied.id === row.id}
            onCopy={copied.id !== row.id ? () => handleCopyText(row.id, row.password) : () => { }}
          />
        </TableCell>
        <TableCell align="left">
          <SwitchStyle checked={row.status === WalletStatus.IN_ACTIVE} onClick={() => handleUpdateWalletStatus(row.id, row.status, row.stt)} />
        </TableCell>
        <TableCell align="left">
          <ButtonIcon
            onClick={() => handleClickOpen(row)}
            variant='ghost'
            icon={<SquarePen color={Color.WARNING} />}
          />
          {!row.wallet_id &&
            <ButtonIcon
              onClick={() => handleDelete(row.id)}
              variant='ghost'
              icon={<Trash2 color={Color.DANGER} />}
            />
          }
        </TableCell>
      </TableRow >
    ))
  }, [data, copied]);

  return (
    <>
      <DataTableMemo
        className='mt-15'
        colunms={colunms}
        data={rows}
        onChangePage={onChangePage}
        pagination={pagination}
      />

      <Modal
        size='sm'
        isOpen={open}
        onClose={handleClose}
        title={"Cập nhật ví"}
        content={
          <WalletNewEditForm
            onCloseModal={handleClose}
            currentWallet={wallet}
            isEdit={true}
            onUpdateData={onUpdateData}
          />
        }
      />
    </>
  );
}

