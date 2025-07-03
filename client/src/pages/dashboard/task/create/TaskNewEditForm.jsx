import FormProvider from "@/components/hook-form/FormProvider"
import RHFInput from "@/components/hook-form/RHFInput"
import { Col, Row } from "antd"
import { useState, useEffect, useMemo } from 'react';
import * as Yup from 'yup';
import { Link, useNavigate, useParams } from "react-router-dom"
// form
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, Controller, useWatch } from 'react-hook-form';
import Select from "@/components/Select";
import { ButtonPrimary } from "@/components/Button";
import { apiPost, apiPut } from "@/utils/axios";
import useConfirm from "@/hooks/useConfirm";
import useNotification from "@/hooks/useNotification";
import useSpinner from "@/hooks/useSpinner";
import Editor from "@/components/Editor";
import { TaskRank, TaskStatus } from "@/enums/enum";
import { PATH_DASHBOARD } from "@/routes/path";
import useMessage from "@/hooks/useMessage";
import { format } from "date-fns"
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';
import dayjs from 'dayjs';
import 'dayjs/locale/vi'; // 👈
dayjs.locale('vi'); // 👈 set global
import { viVN } from '@mui/x-date-pickers/locales';
import Popover from "@/components/Popover";
import { Badge } from "@/components/ui/badge";
import { SelectItems } from "@/components/SelectItems";
import { convertTaskStatusEnumToColorHex, convertTaskStatusEnumToText } from "@/utils/convertUtil";

export default function TaskNewEditForm({ isEdit, currentTask, onUpdateData }) {


  const { id } = useParams();

  const navigate = useNavigate();
  const { onSuccess } = useMessage();

  const TaskSchema = Yup.object().shape({
    task_name: Yup.string()
      .trim().required('Tên công việc không được để trống!'),
    // due_date: currentTask?.status || ProjectCost.FREE,
  });

  const defaultValues = {
    task_name: currentTask?.task_name || '',
    // status: currentTask?.status || '',
    due_date: currentTask?.due_date ? dayjs(currentTask.due_date) : null,
    description: currentTask?.description || '',
    status: currentTask?.status || TaskStatus.TO_DO,
  };

  const methods = useForm({
    resolver: yupResolver(TaskSchema),
    defaultValues,
  });

  const {
    reset,
    formState,
    control,
    setValue,
    handleSubmit,
    watch, getValues,
  } = methods;

  useEffect(() => {
    if (isEdit && currentTask) {
      reset(defaultValues);
    }
    if (!isEdit) {
      reset(defaultValues);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, currentTask]);

  const { showConfirm } = useConfirm();
  const { onOpenSuccessNotify, onOpenErrorNotify } = useNotification();
  const { onOpen, onClose } = useSpinner();

  const onSubmit = async (data) => {
    if (isEdit) {
      const body = {
        ...data,
        id,
        due_date: data.due_date ? dayjs(data.due_date).format('YYYY-MM-DD') : null,
      }
      console.log(body)
      showConfirm("Xác nhận cập nhật công việc?", () => put(body));
    }
    else {
      const body = {
        ...data,
        due_date: dayjs(data.due_date).format('YYYY-MM-DD'),
      }
      console.log(body)
      showConfirm("Xác nhận thêm mới công việc?", () => post(data));
    }
  }

  const post = async (body) => {
    try {
      onOpen();
      const response = await apiPost("/tasks", body);
      console.log(response.data.data)
      onSuccess("Tạo công việc thành công!");
      navigate(PATH_DASHBOARD.task.list)
    } catch (error) {
      console.error(error);
      onOpenErrorNotify(error.message);
    } finally {
      onClose();
    }
  }

  const put = async (body) => {
    try {
      onOpen();
      const response = await apiPut("/tasks", body);
      onSuccess("Cập nhật công việc thành công!");
      console.log(response.data.data)
      onUpdateData(response.data.data);
      // navigate(PATH_DASHBOARD.task.edit(response.data.data.id))
    } catch (error) {
      console.error(error);
      onOpenErrorNotify(error.message);
    } finally {
      onClose();
    }
  }

  const customLocaleText = {
    ...viVN.components.MuiLocalizationProvider.defaultProps.localeText,
    toolbarTitle: <span className="font-inter fw-500 fs-14 d-block" style={{ width: '200px' }}>Chọn ngày hết hạn</span>, // ← Đây là dòng đổi "text Select date"
    cancelButtonLabel: 'Làm mới',
  };

  return (

    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Row className='d-flex justify-content-center mt-20 pt-5' gutter={[25, 20]} style={{ width: '65%', margin: '0 auto' }}>

        <Col span={24}>
          <RHFInput
            label='Tên công việc'
            name='task_name'
            placeholder='Nhập tên công việc'
            required
            style={{ height: '45px', fontSize: '15px' }}
          />
        </Col>

        <Col span={24}>
          <Controller
            name='status'
            control={control}
            render={({ field, fieldState: { error } }) => (
              <>
                <label className='d-block font-inter fw-500 fs-14'>
                  Trạng thái
                </label>
                <Popover className='button-dropdown-filter-checkbox pointer mt-10'
                  trigger={
                    <Badge
                      className='text-capitalize custom-badge select-none pointer h-9'
                      style={{
                        backgroundColor: convertTaskStatusEnumToColorHex(field.value),
                        color: 'black',
                        paddingInline: '15px',
                        borderRadius: '9px'
                      }}
                    >
                      <span className="fs-14">
                        {convertTaskStatusEnumToText(field.value)}
                      </span>
                    </Badge>
                  }
                  content={
                    <SelectItems
                      items={[
                        {
                          actions: TaskStatusList.map((item) => {
                            return {
                              disabled: item === field.value,
                              onClick: () => field.onChange(item),
                              title:
                                <Badge
                                  onClick={() => field.onChange(item)}
                                  className='text-capitalize custom-badge select-none'
                                  style={{
                                    backgroundColor: convertTaskStatusEnumToColorHex(item),
                                    color: 'black',
                                  }}
                                >
                                  {convertTaskStatusEnumToText(item)}
                                </Badge>
                            }
                          })
                        },
                        ,
                      ]}
                    />
                  }
                />
              </>
            )}
          />

        </Col>


        <Col span={24} className='color-white'>
          <Controller
            name='due_date'
            control={control}
            render={({ field, fieldState: { error } }) => (
              <>
                <label className='d-block font-inter fw-500 fs-14'>
                  Ngày hết hạn
                </label>
                <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="vi">
                  <StaticDatePicker
                    onChange={(date) => field.onChange(date)}
                    onClose={() => field.onChange(null)}
                    value={field.value}
                    disablePast
                    // orientation="landscape"
                    className="mt-10 font-inter"
                    localeText={customLocaleText}
                    dayOfWeekFormatter={(date) => date.format("dd")}
                    sx={{
                      backgroundColor: '#09090B',
                      border: '1px solid #27272A',
                      borderRadius: '6px',
                      maxHeight: '550px',
                      '& .MuiPickersDay-today': {
                        // backgroundColor: '#FF5733',  // Màu nền ngày hiện tại
                        color: '#fff !important',    // Màu chữ của ngày hiện tại
                        borderColor: '#585858 !important'
                      },
                      '& .MuiButton-root': {
                        marginBottom: '20px',
                        marginRight: '15px',
                        borderRadius: '6px',
                        height: '40px',
                        width: '100px',
                        backgroundColor: '#585858',
                        color: '#fff',
                        '&:hover': {
                          backgroundColor: '#444',
                        },
                      },
                    }}
                    slotProps={{
                      actionBar: {
                        actions: ['cancel'], // Chỉ hiển thị nút "Cancel" (mà ta rename thành "Clear")
                        onCalcel: () => field.onChange(null), // Xử lý "Clear"
                      },
                      toolbar: {
                        toolbarFormat: 'Ngày D [tháng] M',
                      },
                      day: {
                        sx: {
                          color: '#fff !important',            // chữ trắng
                          '&.Mui-selected': {
                            backgroundColor: '#666 !important',  // chọn -> xám
                            color: '#fff !important',            // chữ trắng
                          },
                          '&.Mui-selected:hover': {
                            backgroundColor: '#777 !important',  // hover khi đã chọn
                          },
                          '&:hover': {
                            backgroundColor: '#444',             // hover khi chưa chọn
                            color: '#fff !important',            // chữ trắng
                          },
                        },
                      },
                    }}
                  />
                </LocalizationProvider>
                {error && <span className='font-inter color-red mt-3 d-block'>{error?.message}</span>}
              </>
            )}
          />
        </Col>

        <Col span={24}>
          <div>
            <Controller
              name='description'
              control={control}
              render={({ field, fieldState: { error } }) => (
                <>
                  <label className='d-block font-inter fw-500 fs-14'>
                    Mô tả công việc
                  </label>

                  <Editor
                    value={field.value}
                    onChange={(value) => field.onChange(value)}
                  />
                  {error && <span className='font-inter color-red mt-3 d-block'>{error?.message}</span>}
                </>
              )}
            />
          </div>
        </Col>

        <Col span={24} className='d-flex justify-content-end mb-20 mt-10'>
          <ButtonPrimary type='submit' title={'Lưu thay đổi'} />
        </Col>

      </Row>
    </FormProvider>
  )
}

const TaskStatusList = [TaskStatus.TO_DO, TaskStatus.IN_PROGRESS, TaskStatus.TO_REVIEW, TaskStatus.COMPLETED];
