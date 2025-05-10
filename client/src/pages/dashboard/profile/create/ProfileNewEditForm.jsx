import FormProvider from "@/components/hook-form/FormProvider"
import RHFInput from "@/components/hook-form/RHFInput"
import { Col, Row } from "antd"
import { useState, useEffect } from 'react';
import * as Yup from 'yup';
import { useNavigate } from "react-router-dom"
// form
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, Controller, useWatch } from 'react-hook-form';
import Select from "@/components/Select";
import { ButtonPrimary } from "@/components/Button";
import { apiPost, apiPut } from "@/utils/axios";
import useConfirm from "@/hooks/useConfirm";
import useNotification from "@/hooks/useNotification";
import { Checkbox } from "@/components/Checkbox";
import { Textarea } from "@/components/ui/textarea";
import useSpinner from "@/hooks/useSpinner";
import useMessage from "@/hooks/useMessage";

export default function ProfileNewEditForm({ onCloseModal, isEdit, currentProfile, onUpdateData }) {

  const ProfileSchema = Yup.object().shape({
    email: Yup.string().email('Email không hợp lệ!')
      .trim().required('Email không được để trống!'),
    email_password: Yup.string()
      .trim().required('Mật khẩu email không được để trống!'),
  });

  const defaultValues = {
    email: currentProfile?.email || '',
    email_password: currentProfile?.email_password || '',
    discord_password: currentProfile?.discord_password || '',
    x_username: currentProfile?.x_username || '',
    discord_username: currentProfile?.discord_username || '',
    telegram_phone: currentProfile?.telegram_phone || '',
    note: currentProfile?.note || '',
  };

  const methods = useForm({
    resolver: yupResolver(ProfileSchema),
    defaultValues,
  });

  const { onSuccess } = useMessage();

  const {
    reset,
    control,
    setValue,
    handleSubmit,
    watch, getValues,
  } = methods;

  const { showConfirm } = useConfirm();
  const { onOpenSuccessNotify, onOpenErrorNotify } = useNotification();
  const { onOpen, onClose } = useSpinner();

  const onSubmit = async (data) => {
    if (isEdit) {
      const body = {
        ...data,
        id: currentProfile.id,
        stt: currentProfile.stt,
      }
      showConfirm("Xác nhận cập nhật hồ sơ?", () => put(body));
    }
    else {
      showConfirm("Xác nhận thêm mới hồ sơ?", () => post(data));
    }
  }

  const post = async (body) => {
    try {
      onOpen();
      const response = await apiPost("/profiles", body);
      onUpdateData(isEdit, response.data.data, "Tạo hồ sơ thành công!")
      onCloseModal();
    } catch (error) {
      console.error(error);
      onOpenErrorNotify(error.message);
      onClose();
    } finally {
      // onClose();
    }
  }

  const put = async (body) => {
    try {
      onOpen();
      const response = await apiPut("/profiles", body);
      onSuccess("Cập nhật hồ sơ thành công!");
      console.log(response.data)
      onUpdateData(isEdit, response.data.data)
      onCloseModal();
    } catch (error) {
      console.error(error);
      onOpenErrorNotify(error.message);
    } finally {
      onClose();
    }
  }

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Row className='mt-5' gutter={[25, 20]} >

        <Col span={12}>
          <RHFInput
            label='Email'
            name='email'
            placeholder='Nhập Email'
            required
          />
        </Col>

        <Col span={12}>
          <RHFInput
            label='Mật khẩu Email'
            name='email_password'
            placeholder='Nhập mật khẩu Email'
            required
          />
        </Col>

        <Col span={12}>
          <RHFInput
            label='Username Discord'
            name='discord_username'
            placeholder='Nhập username Discord'
          />
        </Col>

        <Col span={12}>
          <RHFInput
            label='Mật khẩu Discord'
            name='discord_password'
            placeholder='Nhập mật khẩu Discord'
          />
        </Col>

        <Col span={12}>
          <RHFInput
            label='Username X'
            name='x_username'
            placeholder='Nhập username X'
          />
        </Col>
        <Col span={12}>
          <RHFInput
            label='SĐT Telegram'
            name='telegram_phone'
            placeholder='Nhập SĐT Telegram'
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
                  style={{ minHeight: '170px', maxHeight: '170px' }}
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

