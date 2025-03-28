import FormProvider from "@/components/hook-form/FormProvider"
import RHFInput from "@/components/hook-form/RHFInput"
import { Col, Row } from "antd"
import { useState, useEffect } from 'react';
import * as Yup from 'yup';
import { useNavigate } from "react-router-dom"
// form
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, Controller } from 'react-hook-form';
import Select from "@/components/Select";
import { ProjectCost, ProjectStatus, ProjectType } from "@/enums/enum";
import { ButtonPrimary } from "@/components/Button";
import { apiPost, apiPut } from "@/utils/axios";
import useConfirm from "@/hooks/useConfirm";
import useNotification from "@/hooks/useNotification";
import useLoading from "@/hooks/useLoading";
import { Checkbox } from "@/components/Checkbox";
import { Textarea } from "@/components/ui/textarea";
import { convertProjectStatusEnumToText } from "@/utils/convertUtil";

export default function ProfileNewEditForm({ onCloseModal, isEdit, currentProject, onUpdateData }) {

  const ProjectSchema = Yup.object().shape({
    name: Yup.string()
      .trim().required('Tên dự án không được để trống!'),
  });

  console.log(currentProject)

  const defaultValues = {
    name: currentProject?.name || '',
    type: currentProject?.type || ProjectType.TESTNET,
    status: currentProject?.status || ProjectStatus.DOING,
    cost_type: currentProject?.cost_type || ProjectCost.FREE,
    url: currentProject?.url || '',
    tutorial_url: currentProject?.tutorial_url || '',
    discord_url: currentProject?.discord_url || '',
    funding_rounds_url: currentProject?.funding_rounds_url || '',
    is_cheating: isEdit ? currentProject?.is_cheating : true,
    has_daily_tasks: isEdit ? currentProject?.has_daily_tasks : true,
    note: currentProject?.note || '',
    expected_airdrop_time: currentProject?.expected_airdrop_time || '',
  };

  const methods = useForm({
    resolver: yupResolver(ProjectSchema),
    defaultValues,
  });

  const {
    reset,
    control,
    setValue,
    handleSubmit,
    watch, getValues,
  } = methods;

  const { showConfirm } = useConfirm();
  const { onOpenSuccessNotify, onOpenErrorNotify } = useNotification();
  const { onOpenLoading, onCloseLoading } = useLoading();

  const onSubmit = async (data) => {
    if (isEdit) {
      const body = {
        ...data,
        id: currentProject.id
      }
      showConfirm("Xác nhận cập nhật dự án?", () => put(body));
    }
    else {
      showConfirm("Xác nhận thêm mới dự án?", () => post(data));
    }
  }

  const post = async (body) => {
    onOpenLoading();
    try {
      const response = await apiPost("/projects", body);
      onOpenSuccessNotify("Tạo dự án thành công!");
      onUpdateData(isEdit, response.data.data)
      onCloseModal();
    } catch (error) {
      console.error(error);
      onOpenErrorNotify(error.message);
    } finally {
      onCloseLoading();
    }
  }

  const put = async (body) => {
    onOpenLoading();
    try {
      const response = await apiPut("/projects", body);
      onOpenSuccessNotify("Cập nhật dự án thành công!");
      console.log(response.data)
      onUpdateData(isEdit, response.data.data)
      onCloseModal();
    } catch (error) {
      console.error(error);
      onOpenErrorNotify(error.message);
    } finally {
      onCloseLoading();
    }
  }

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Row className='mt-5' gutter={[25, 20]} >

        <Col span={!isEdit ? 12 : 8}>
          <RHFInput
            label='Tên dự án'
            name='name'
            placeholder='Nhập tên dự án'
            required
          />
        </Col>

        <Col span={!isEdit ? 12 : 8}>
          <Controller
            name='type'
            control={control}
            render={({ field, fieldState: { error } }) => (
              <>
                <label className='d-block font-inter fw-500 fs-14'>
                  Loại dự án
                </label>

                <Select
                  onValueChange={(value) => field.onChange(value)}
                  value={field.value}
                  placeholder='Select type'
                  className='mt-10'
                  items={[ProjectType.TESTNET, ProjectType.WEB, ProjectType.RETROACTIVE, ProjectType.DEPIN, ProjectType.GAME, ProjectType.GALXE]}
                />
                {error && <span className='font-inter color-red mt-3 d-block'>{error?.message}</span>}
              </>
            )}
          />
        </Col>

        {isEdit &&
          <Col span={!isEdit ? 12 : 8}>
            <Controller
              name='status'
              control={control}
              render={({ field, fieldState: { error } }) => (
                <>
                  <label className='d-block font-inter fw-500 fs-14'>
                    Trạng thái
                  </label>

                  <Select
                    onValueChange={(value) => field.onChange(value)}
                    value={field.value}
                    placeholder='Select status'
                    className='mt-10'
                    items={[ProjectStatus.DOING, ProjectStatus.END_PENDING_UPDATE, ProjectStatus.SNAPSHOT, ProjectStatus.TGE, ProjectStatus.END_AIRDROP]}
                    convertItem={convertProjectStatusEnumToText}
                  />
                  {error && <span className='font-inter color-red mt-3 d-block'>{error?.message}</span>}
                </>
              )}
            />
          </Col>
        }

        <Col span={12}>
          <Controller
            name='cost_type'
            control={control}
            render={({ field, fieldState: { error } }) => (
              <>
                <label className='d-block font-inter fw-500 fs-14'>
                  Chi phí
                </label>

                <Select
                  onValueChange={(value) => field.onChange(value)}
                  value={field.value}
                  placeholder='Select cost type'
                  className='mt-10'
                  items={[ProjectCost.FREE, ProjectCost.FEE, ProjectCost.HOLD]}
                />
                {error && <span className='font-inter color-red mt-3 d-block'>{error?.message}</span>}
              </>
            )}
          />
        </Col>

        <Col span={12}>
          <RHFInput
            label='Thời gian dự kiến trả Airdrop'
            name='expected_airdrop_time'
            placeholder='Q1/Năm?'
          />
        </Col>


        <Col span={12}>
          <RHFInput
            label='Link'
            name='url'
            placeholder='https://www.airhub.dev/example'
          />
        </Col>

        <Col span={12}>
          <RHFInput
            label='Link Hướng Dẫn'
            name='tutorial_url'
            placeholder='https://www.airhub.dev/tutorial'
          />
        </Col>

        <Col span={12}>
          <RHFInput
            label='Link Discord'
            name='discord_url'
            placeholder='https://discord.com/channels/123456'
          />
        </Col>

        <Col span={12}>
          <RHFInput
            label='Link Funding Rounds'
            name='funding_rounds_url'
            placeholder='https://cryptorank.io/ico/project'
          />
        </Col>

        <Col span={24}>
          <Controller
            name='note'
            control={control}
            render={({ field }) => (
              <>
                <label className='d-block font-inter fw-500 fs-14'>
                  Ghi chú
                </label>
                <Textarea
                  className='mt-10 font-inter'
                  autoComplete='off'
                  placeholder='Nhập ghi chú ...'
                  {...field}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault(); // Ngăn chặn hành vi mặc định

                      // Lấy vị trí con trỏ
                      const start = e.target.selectionStart;
                      const end = e.target.selectionEnd;

                      // Cập nhật giá trị với ký tự xuống dòng tại vị trí con trỏ
                      const newValue = field.value.substring(0, start) + '\n' + field.value.substring(end);
                      field.onChange(newValue); // Cập nhật giá trị mới

                      // Đặt lại vị trí con trỏ
                      setTimeout(() => {
                        e.target.selectionStart = e.target.selectionEnd = start + 1;
                        e.target.focus(); // Đảm bảo focus vào Textarea
                      }, 0);
                    }
                  }}
                  style={{ minHeight: '80px', maxHeight: '80px' }}
                />
              </>
            )}

          />
        </Col>

        <Col span={24} className='d-flex gap-15 mt-6'>
          <Controller
            name='is_cheating'
            control={control}
            render={({ field }) => (
              <>
                <Checkbox
                  {...field}
                  label='Cheating'
                  checked={field.value}
                />
              </>
            )}
          />

          <Controller
            name='has_daily_tasks'
            control={control}
            render={({ field }) => (
              <>
                <Checkbox
                  {...field}
                  label='Task Hàng Ngày'
                  checked={field.value}
                />
              </>
            )}
          />
        </Col>

        <Col span={24} className='d-flex justify-content-end mb-5'>
          <ButtonPrimary type='submit' title={'Lưu thay đổi'} />
        </Col>
      </Row>
    </FormProvider>

  )
}

