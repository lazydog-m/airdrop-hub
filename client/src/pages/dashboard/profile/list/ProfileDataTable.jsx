import * as React from 'react';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import DataTable from '@/components/DataTable';
import { ButtonIcon } from '@/components/Button';
import { SquarePen, Trash2, WalletIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Color, NOT_AVAILABLE } from '@/enums/enum';
import Modal from '@/components/Modal';
import useSpinner from '@/hooks/useSpinner';
import { apiDelete, apiPut } from '@/utils/axios';
import useConfirm from '@/hooks/useConfirm';
import useNotification from '@/hooks/useNotification';
import SwitchStyle from '@/components/Switch';
import ProfileNewEditForm from '../create/ProfileNewEditForm';
import { convertEmailToEmailUsername, getMasked } from '@/utils/convertUtil';
import ProfileWalletList from './profile-wallet/ProfileWalletList';
import useCopy from '@/hooks/useCopy';
import CopyButton from '@/components/CopyButton';
import useMessage from '@/hooks/useMessage';

const colunms = [
  { header: '#', align: 'left' },
  { header: 'Tên Hồ Sơ', align: 'left' },
  { header: 'Email', align: 'left' },
  { header: 'Mật Khẩu Email', align: 'left' },
  { header: 'Username X', align: 'left' },
  { header: 'Username Discord', align: 'left' },
  { header: 'Mật Khẩu Discord', align: 'left' },
  { header: 'SĐT Telegram', align: 'left' },
  { header: '', align: 'left' },
]

const DataTableMemo = React.memo(DataTable);

export default function ProfileDataTable({ data = [], onUpdateData, onDeleteData, pagination, onChangePage }) {
  console.log(data)
  const [open, setOpen] = React.useState(false);
  const [openProfile, setOpenProfile] = React.useState(false);
  const [profile, setProfile] = React.useState({});
  const { onOpen, onClose } = useSpinner();
  const { showConfirm } = useConfirm();
  const { onOpenSuccessNotify, onOpenErrorNotify } = useNotification();
  const { copied, handleCopy } = useCopy();
  const { onSuccess } = useMessage();

  const handleCopyText = (id, text, type) => {
    navigator.clipboard.writeText(text).then(() => {
      handleCopy(id, type);
      onSuccess('Đã copy!');
    });
  }

  const handleClickOpen = (item) => {
    setOpen(true);
    setProfile(item);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleClickOpenWallet = (item) => {
    setOpenProfile(true);
    setProfile(item);
  };

  const handleCloseWallet = () => {
    setOpenProfile(false);
  };

  // const handleUpdateWalletStatus = (id, status) => {
  //   const statusToTextReverse = convertWalletStatusEnumToTextReverse(status);
  //   const body = {
  //     id,
  //     status: convertWalletStatusEnumToReverse(status),
  //   };
  //   showConfirm(`Xác nhận cập nhật trạng thái của ví thành '${statusToTextReverse?.toUpperCase()}'?`, () => putStatus(body));
  // }
  //
  // const putStatus = async (body) => {
  //   onOpen();
  //   console.log(body)
  //   try {
  //     const response = await apiPut(`/wallets/status`, body);
  //     onUpdateData(true, response.data.data);
  //     onOpenSuccessNotify("Cập nhật trạng thái của ví thành công!");
  //   } catch (error) {
  //     console.error(error);
  //     onOpenErrorNotify(error.message);
  //   } finally {
  //     onClose();
  //   }
  // }

  const handleDelete = (id) => {
    showConfirm("Xác nhận xóa hồ sơ?", () => remove(id));
  }

  const remove = async (id) => {
    try {
      onOpen();
      const response = await apiDelete(`/profiles/${id}`);
      onDeleteData("Xóa hồ sơ thành công!");
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
          <span>
            {convertEmailToEmailUsername(row.email)}
          </span>
        </TableCell>
        <TableCell align="left">
          <CopyButton
            text={row.email}
            copied={copied.id === row.id && copied.type === EMAIL_TYPE}
            onCopy={(copied.id !== row.id || copied.type !== EMAIL_TYPE) ? () => handleCopyText(row.id, row.email, EMAIL_TYPE) : () => { }}
          />
        </TableCell>
        <TableCell align="left">
          <CopyButton
            text={!row.email_password ? NOT_AVAILABLE : (copied.id === row.id && copied.type === EMAIL_PASSWORD_TYPE) ? row.email_password : getMasked(row.email_password)}
            copied={copied.id === row.id && copied.type === EMAIL_PASSWORD_TYPE}
            onCopy={(copied.id !== row.id || copied.type !== EMAIL_PASSWORD_TYPE) ? () => handleCopyText(row.id, row.email_password, EMAIL_PASSWORD_TYPE) : () => { }}
          />
        </TableCell>
        <TableCell align="left">
          <CopyButton
            text={row.x_username || NOT_AVAILABLE}
            copied={copied.id === row.id && copied.type === USERNAME_X_TYPE}
            onCopy={(copied.id !== row.id || copied.type !== USERNAME_X_TYPE) ? () => handleCopyText(row.id, row.x_username, USERNAME_X_TYPE) : () => { }}
          />
        </TableCell>
        <TableCell align="left">
          <CopyButton
            text={row.discord_username || NOT_AVAILABLE}
            copied={copied.id === row.id && copied.type === USERNAME_DISCORD_TYPE}
            onCopy={(copied.id !== row.id || copied.type !== USERNAME_DISCORD_TYPE) ? () => handleCopyText(row.id, row.discord_username, USERNAME_DISCORD_TYPE) : () => { }}
          />
        </TableCell>
        <TableCell align="left">
          <CopyButton
            text={!row.discord_password ? NOT_AVAILABLE : (copied.id === row.id && copied.type === DISCORD_PASSWORD_TYPE) ? row.discord_password : getMasked(row.discord_password)}
            copied={copied.id === row.id && copied.type === DISCORD_PASSWORD_TYPE}
            onCopy={(copied.id !== row.id || copied.type !== DISCORD_PASSWORD_TYPE) ? () => handleCopyText(row.id, row.discord_password, DISCORD_PASSWORD_TYPE) : () => { }}
          />
        </TableCell>
        <TableCell align="left">
          <CopyButton
            text={row.telegram_phone || NOT_AVAILABLE}
            copied={copied.id === row.id && copied.type === TELEGRAM_PHONE_TYPE}
            onCopy={(copied.id !== row.id || copied.type !== TELEGRAM_PHONE_TYPE) ? () => handleCopyText(row.id, row.telegram_phone, TELEGRAM_PHONE_TYPE) : () => { }}
          />
        </TableCell>
        {/*
              <TableCell align="left">
                <SwitchStyle checked={row.status === WalletStatus.IN_ACTIVE} onClick={() => handleUpdateWalletStatus(row.id, row.status)} />
              </TableCell>
*/}
        <TableCell align="left">
          <ButtonIcon
            onClick={() => handleClickOpen(row)}
            variant='ghost'
            icon={<SquarePen color={Color.WARNING} />}
          />
          <ButtonIcon
            onClick={() => handleClickOpenWallet(row)}
            variant='ghost'
            icon={<WalletIcon color={Color.SECONDARY} />}
          />
          <ButtonIcon
            onClick={() => handleDelete(row.id)}
            variant='ghost'
            icon={<Trash2 color={Color.DANGER} />}
          />
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
        isOpen={open}
        onClose={handleClose}
        title={"Cập nhật ví"}
        content={
          <ProfileNewEditForm
            onCloseModal={handleClose}
            currentProfile={profile}
            isEdit={true}
            onUpdateData={onUpdateData}
          />
        }
      />

      <Modal
        // minH={'500px'}
        size='xl'
        isOpen={openProfile}
        onClose={handleCloseWallet}
        title={"Danh sách địa chỉ ví"}
        content={
          <ProfileWalletList id={profile.id} />
        }
      />

    </>
  );
}

const EMAIL_TYPE = 'EMAIL_TYPE';
const EMAIL_PASSWORD_TYPE = 'EMAIL_PASSWORD_TYPE';
const USERNAME_X_TYPE = 'USERNAME_X_TYPE';
const USERNAME_DISCORD_TYPE = 'USERNAME_DISCORD_TYPE';
const DISCORD_PASSWORD_TYPE = 'DISCORD_PASSWORD_TYPE';
const TELEGRAM_PHONE_TYPE = 'TELEGRAM_PHONE_TYPE';
