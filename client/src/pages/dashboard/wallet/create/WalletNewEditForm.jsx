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
import { PATH_DASHBOARD } from "@/routes/path";
import useMessage from "@/hooks/useMessage";

export default function WalletNewEditForm({ onCloseModal, isEdit, currentWallet, onUpdateData }) {

  const WalletSchema = Yup.object().shape({
    name: Yup.string()
      .trim().required('Tên ví không được để trống!'),
    password: Yup.string()
      .trim().required('Mật khẩu ví không được để trống!'),
  });

  const defaultValues = {
    name: currentWallet?.name || '',
    password: currentWallet?.password || '',
  };

  const methods = useForm({
    resolver: yupResolver(WalletSchema),
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
  const { onOpen, onClose } = useSpinner();
  const { onSuccess } = useMessage();

  const onSubmit = async (data) => {
    if (isEdit) {
      const body = {
        ...data,
        id: currentWallet.id,
        stt: currentWallet.stt,
      }
      showConfirm("Xác nhận cập nhật ví?", () => put(body));
    }
    else {
      showConfirm("Xác nhận thêm mới ví?", () => post(data));
    }
  }

  const post = async (body) => {
    try {
      onOpen();
      const response = await apiPost("/wallets", body);
      onUpdateData(isEdit, response.data.data, "Tạo ví thành công!")
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
      const response = await apiPut("/wallets", body);
      onSuccess("Cập nhật ví thành công!");
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

        <Col span={24}>
          <RHFInput
            label='Tên ví'
            name='name'
            placeholder='Nhập tên ví'
            required
          />
        </Col>

        <Col span={24}>
          <RHFInput
            label='Mật khẩu ví'
            name='password'
            placeholder='Nhập mật khẩu ví'
            required
          />
        </Col>

        <Col span={24} className='d-flex justify-content-end mb-5'>
          <ButtonPrimary type='submit' title={'Lưu thay đổi'} />
        </Col>
      </Row>
    </FormProvider>

  )
}

