import * as React from 'react';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import DataTable from '@/components/DataTable';
import { ButtonIcon } from '@/components/Button';
import { convertProjectCostTypeEnumToColorHex, convertProjectStatusEnumToColorHex, convertProjectStatusEnumToText, convertProjectTypeEnumToColorHex } from '@/utils/convertUtil';
import { Check, CheckCheck, ClockIcon, Ellipsis, Fingerprint, Pickaxe, SquareArrowOutUpRight, SquarePen, Star, Trash2, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Color, DailyTaskRefresh, NOT_AVAILABLE, ProjectStatus } from '@/enums/enum';
import { Link } from 'react-router-dom';
import { formatDateVN } from '@/utils/formatDate';
import Modal from '@/components/Modal';
import ProjectNewEditForm from '../create/ProjectNewEditForm';
import Popover from '@/components/Popover';
import { SelectItems } from '@/components/SelectItems';
import { FaDiscord } from 'react-icons/fa6';
import useSpinner from '@/hooks/useSpinner';
import { apiDelete, apiPost, apiPut } from '@/utils/axios';
import useConfirm from '@/hooks/useConfirm';
import useNotification from '@/hooks/useNotification';
import useMessage from '@/hooks/useMessage';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';

const colunms = [
  { header: '#', align: 'left' },
  { header: 'Tên Dự Án', align: 'left' },
  { header: 'Mảng', align: 'left' },
  { header: 'Trạng Thái', align: 'left' },
  // { header: 'Tài Nguyên', align: 'left' },
  { header: 'Thời Gian', align: 'left' },
  { header: 'Cheat', align: 'left' },
  { header: 'Làm Hằng Ngày', align: 'left' },
  { header: '', align: 'left' },
]

const DataTableMemo = React.memo(DataTable);

export default function ProjectDataTable({ data = [], onUpdateData, onDeleteData, onUpdateMessage, onChangePage, loading, pagination }) {

  console.log(data)
  const [open, setOpen] = React.useState(false);
  const [project, setProject] = React.useState({});
  const { onOpen, onClose } = useSpinner();
  const { showConfirm } = useConfirm();
  const { onOpenSuccessNotify, onOpenErrorNotify } = useNotification();

  const { onSuccess } = useMessage();

  const handleCopyText = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      onSuccess('Đã copy!');
    });
  }

  const handleClick = (event) => {
    const rows = document.querySelectorAll('.table-row');
    rows.forEach((row) => row.classList.remove('active-row'));

    const rowElement = event.target.closest('tr');
    if (rowElement) {
      rowElement.classList.add('active-row');
    }
  };

  const handleClickOpen = (item) => {
    setOpen(true);
    setProject(item);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDelete = (id) => {
    showConfirm("Xác nhận xóa dự án?", () => remove(id));
  }

  const handleUpdateProjectStatus = (id, status, stt) => {
    const body = {
      id,
      status,
      stt,
    };
    showConfirm(`Xác nhận cập nhật trạng thái của dự án thành '${convertProjectStatusEnumToText(status)?.toUpperCase()}'?`, () => putStatus(body));
  }

  const handleUpdateProjectStar = (id, star, stt) => {
    const body = {
      id,
      is_star: !star,
      stt,
    };
    putStar(body);
  }

  const handleCreateDailyTaskComplted = (project_id, stt) => {
    const body = {
      project_id,
      stt,
    };
    showConfirm(`Xác nhận dự án đã hoàn thành nhiệm vụ của ngày hôm nay?`, () => postDailyTasksCompleted(body));
  }

  const postDailyTasksCompleted = async (body) => {
    try {
      onOpen();
      const response = await apiPost(`/projects/daily-tasks-completed`, body);
      onUpdateData(true, response.data.data);
      onSuccess("Đã hoàn thành!");
    } catch (error) {
      console.error(error);
      onOpenErrorNotify(error.message);
    } finally {
      onClose();
    }
  }

  const putStar = async (body) => {
    try {
      onOpen();
      const response = await apiPut(`/projects/star`, body);
      onUpdateData(true, response.data.data);
      onSuccess(body.is_star ? "Đã đánh dấu quan trọng!" : 'Đã bỏ đánh dấu quan trọng!');
    } catch (error) {
      console.error(error);
      onOpenErrorNotify(error.message);
    } finally {
      onClose();
    }
  }

  const putStatus = async (body) => {
    try {
      onOpen();
      const response = await apiPut(`/projects/status`, body);
      onUpdateData(true, response.data.data);
      onSuccess("Cập nhật trạng thái của dự án thành công!");
    } catch (error) {
      console.error(error);
      onOpenErrorNotify(error.message);
    } finally {
      onClose();
    }
  }

  const remove = async (id) => {
    try {
      onOpen();
      const response = await apiDelete(`/projects/${id}`);
      onDeleteData("Xóa dự án thành công!");
      // onSuccess("Xóa dự án thành công!");
      // onClose();
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
        className='table-row'
        key={row.id}
      >
        <TableCell align="left">
          {loading ? <SkeletonTable /> :
            <span className='font-inter color-white'>
              {row.stt}
            </span>
          }
        </TableCell>
        <TableCell align="left">
          {loading ? <SkeletonTable /> :
            <span className='font-inter color-white fw-bold text-too-long'>
              {row.name}
            </span>
          }
        </TableCell>
        <TableCell align="left">
          {loading ? <SkeletonTable /> :
            <div className='d-flex gap-6'>
              <Badge
                className='text-capitalize custom-badge'
                style={{
                  backgroundColor: convertProjectTypeEnumToColorHex(row.type),
                  color: 'black',
                }}
              >
                {row.type}
              </Badge>
              <Badge
                className='text-capitalize custom-badge'
                style={{
                  backgroundColor: convertProjectCostTypeEnumToColorHex(row.cost_type),
                }}
              >
                {row.cost_type}
              </Badge>
            </div>
          }
        </TableCell>
        <TableCell align="left">
          {loading ? <SkeletonTable /> :
            <Popover className='button-dropdown-filter-checkbox pointer'
              trigger={
                <Badge
                  className='text-capitalize custom-badge select-none'
                  style={{
                    backgroundColor: convertProjectStatusEnumToColorHex(row.status),
                    color: 'black',
                  }}
                >
                  {convertProjectStatusEnumToText(row.status)}
                </Badge>
              }
              content={
                <SelectItems
                  items={[
                    {
                      actions: ProjectStatusList.map((item) => {
                        return {
                          disabled: item === row.status,
                          onClick: () => handleUpdateProjectStatus(row.id, item, row.stt),
                          title:
                            <Badge
                              onClick={() => handleUpdateProjectStatus(row.id, row.status)}
                              className='text-capitalize custom-badge select-none'
                              style={{
                                backgroundColor: convertProjectStatusEnumToColorHex(item),
                                color: 'black',
                              }}
                            >
                              {convertProjectStatusEnumToText(item)}
                            </Badge>
                        }
                      })
                    },
                    ,
                  ]}
                />
              }
            />
          }
        </TableCell>
        {/*
        <TableCell align="left">
          {loading ? <SkeletonTable /> :
            <Badge variant={'secondary'} className='custom-badge'>
              {`${formatDateVN(row.createdAt)} - ${!row.end_date ? NOT_AVAILABLE : formatDateVN(row.end_date)}`}
            </Badge>
          }
        </TableCell>
*/}
        <TableCell align="left">
          {loading ? <SkeletonTable /> :
            <Badge variant={'secondary'} className='custom-badge'>
              {`${formatDateVN(row.createdAt)} - ${!row.end_date ? NOT_AVAILABLE : formatDateVN(row.end_date)}`}
            </Badge>
          }
        </TableCell>
        <TableCell align="left">
          {loading ? <SkeletonTable /> :
            <div className='d-flex gap-15'>
              {row.is_cheat ? <Check color={Color.SUCCESS} /> : <X color={Color.DANGER} />}
              {row.is_cheating ? <Fingerprint size={'22px'} color={Color.SECONDARY} /> : null}
            </div>
          }
        </TableCell>
        <TableCell align="left">
          {loading ? <SkeletonTable /> :
            <div className='d-flex gap-6'>
              {row.url_daily_tasks && row.url_daily_tasks?.trim() !== '' && row.daily_tasks && row.daily_tasks?.trim() !== '' ?
                <Link to={row.url_daily_tasks} target='_blank' rel="noopener noreferrer">
                  <Badge className='text-capitalize custom-badge pointer select-none gap-6 justify-content-center d-flex align-items-center'
                    onClick={handleClick}
                    style={{
                      backgroundColor: row.daily_tasks_completed ? Color.SUCCESS : row.daily_tasks_refresh === DailyTaskRefresh.NEW_TASK ? Color.SECONDARY :
                        row.daily_tasks_refresh === DailyTaskRefresh.COUNT_DOWN_TIME_IT_UP ? Color.WARNING : Color.ORANGE,
                      color: 'black',
                    }}
                  >
                    {row.daily_tasks_refresh === DailyTaskRefresh.COUNT_DOWN_TIME_IT_UP && !row.daily_tasks_completed && <ClockIcon size={'15px'} />}
                    {row.daily_tasks}
                    {row.daily_tasks_completed && <CheckCheck size={'15px'} />}
                  </Badge>
                </Link>
                :
                row.daily_tasks && row.daily_tasks?.trim() !== '' ?
                  <Badge className='text-capitalize custom-badge pointer select-none gap-1'
                    style={{
                      backgroundColor: row.daily_tasks_completed ? Color.SUCCESS : row.daily_tasks_refresh === DailyTaskRefresh.NEW_TASK ? Color.SECONDARY :
                        row.daily_tasks_refresh === DailyTaskRefresh.COUNT_DOWN_TIME_IT_UP ? Color.WARNING : Color.ORANGE,
                      color: 'black',
                    }}
                  >
                    {row.daily_tasks_refresh === DailyTaskRefresh.COUNT_DOWN_TIME_IT_UP && !row.daily_tasks_completed && <ClockIcon size={'15px'} />}
                    {row.daily_tasks}
                    {row.daily_tasks_completed && <CheckCheck size={'15px'} />}
                  </Badge>
                  :
                  <X color={Color.DANGER} />
              }
              {row.daily_tasks && row.daily_tasks?.trim() !== '' && !row.daily_tasks_completed && row.status === ProjectStatus.DOING &&
                <Badge className='custom-badge gap-1 select-none pointer'
                  onClick={() => handleCreateDailyTaskComplted(row.id, row.stt)}
                  style={{
                    backgroundColor: Color.SUCCESS,
                    color: 'black',
                  }}
                >
                  <Pickaxe size={'15px'} />
                </Badge>
              }
              {/* row.daily_tasks && row.daily_tasks?.trim() !== '' && row.daily_tasks_completed && !row.daily_tasks_refresh_end_of_day &&
              <Badge className='custom-badge gap-1 select-none'
                style={{
                  backgroundColor: Color.WARNING,
                  color: 'black',
                }}
              >
                <Clock size={'15px'} />
                <span>
                  {formatDateVN(row.task_time_completed)}
                </span>
              </Badge>
            */}
            </div>
          }
        </TableCell>
        <TableCell align="left">
          {loading ? <SkeletonTable /> :
            <div className='d-flex'>
              {row.url &&
                <div className='d-flex me-10 justify-content-center align-items-center'>
                  <Link to={row.url} target='_blank' rel="noopener noreferrer"
                  >
                    <ButtonIcon
                      className='color-white pointer select-none'
                      variant='ghost'
                      icon={<SquareArrowOutUpRight color={Color.PRIMARY} />}
                    />
                  </Link>
                  <Separator orientation="vertical" className='h-4 color-white ms-10' />
                </div>
              }
              <ButtonIcon
                onClick={() => handleClickOpen(row)}
                variant='ghost'
                icon={<SquarePen color={Color.WARNING} />}
              />
              {row.discord_url &&
                <Link to={row.discord_url} target='_blank' rel="noopener noreferrer">
                  <ButtonIcon
                    className='select-none pointer'
                    variant='ghost'
                    icon={<FaDiscord color={Color.SECONDARY} />}
                  />
                </Link>
              }
              <ButtonIcon
                onClick={() => handleDelete(row.id)}
                variant='ghost'
                icon={<Trash2 color={Color.DANGER} />}
              />
              {(row.funding_rounds_url || row.galxe_url || row.zealy_url || row.faucet_url) &&
                <Popover className='button-dropdown-filter-checkbox pointer'
                  trigger={
                    <ButtonIcon
                      variant='ghost'
                      icon={<Ellipsis />}
                    />
                  }
                  content={
                    <SelectItems
                      items={[
                        row.funding_rounds_url ? {
                          url: row.funding_rounds_url,
                          title: `Funding Rounds`,
                        } : null,
                        row.galxe_url ? {
                          url: row.galxe_url,
                          title: `Galxe`,
                        } : null,
                        row.zealy_url ? {
                          url: row.zealy_url,
                          title: `Zealy`,
                        } : null,
                        row.faucet_url ? {
                          url: row.faucet_url,
                          title: `Faucet`,
                        } : null,
                      ]}
                    />
                  }
                />
              }
              <div className='d-flex justify-content-center align-items-center'>
                <ButtonIcon
                  onClick={() => handleUpdateProjectStar(row.id, row.is_star, row.stt)}
                  className='select-none pointer button-icon-star'
                  variant='ghost'
                  icon={
                    <Star className='star' color={row.is_star ? Color.WARNING : 'white'} style={{ fill: row.is_star ? Color.WARNING : 'none' }} />
                  }
                />
              </div>
            </div>
          }
        </TableCell>
      </TableRow >
    ));
  }, [data]);

  return (
    <>
      <DataTableMemo
        className='mt-15'
        colunms={colunms}
        data={
          rows
        }
        onChangePage={onChangePage}
        // loading={loading}
        pagination={pagination}
      />

      <Modal
        isOpen={open}
        onClose={handleClose}
        title={"Cập nhật dự án"}
        content={
          <ProjectNewEditForm
            onUpdateMessage={onUpdateMessage}
            onCloseModal={handleClose}
            currentProject={project}
            isEdit={true}
            onUpdateData={onUpdateData}
          />
        }
      />
    </>
  );
}

const SkeletonTable = () => {
  return <Skeleton className='h-5 w-[150px]' />
}

const ProjectStatusList = [ProjectStatus.DOING, ProjectStatus.END_PENDING_UPDATE, ProjectStatus.TGE, ProjectStatus.SNAPSHOT, ProjectStatus.END_AIRDROP];
