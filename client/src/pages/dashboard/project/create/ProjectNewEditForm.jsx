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
import { ProjectRating, ProjectStatus, ProjectType } from "@/enums/enum";
import { ButtonPrimary } from "@/components/Button";
import { apiPost } from "@/utils/axios";
import useConfirm from "@/hooks/useConfirm";
import useNotification from "@/hooks/useNotification";
import useLoading from "@/hooks/useLoading";
import { formatNumber } from "@/utils/formatCurrency";
import { Input } from "@/components/ui/input";

export default function ProjectNewEditForm({ onCloseModal }) {

  const ProjectSchema = Yup.object().shape({
    name: Yup.string().trim().required('Project name is required'),
    status: Yup.string().required('Status is required'),
    type: Yup.string().required('Type is required'),
    rating: Yup.string().required('Rating is required'),
    url_ref: Yup.string().trim().url('Link ref invalid'),
    url: Yup.string().trim().url('Link invalid'),
  });

  const defaultValues = {
    name: '',
    type: '',
    url: '',
    url_ref: '',
    status: '',
    rating: '',
    total_raised: '',
    // tenSanPham: sanPhamHienTai?.tenSanPham || '',
    // maSanPham: sanPhamHienTai?.maSanPham || '',
    // moTa: sanPhamHienTai?.moTa || '',
    // donGia: sanPhamHienTai?.donGia || '',
    // idMauSac: sanPhamHienTai?.idMauSac || null,
    // idThuongHieu: sanPhamHienTai?.idThuongHieu || null,
    // trangThai: chuyenDoiEnumThanhTrangThai(sanPhamHienTai?.trangThai),
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

  useEffect(() => {
    console.log(watch('type'))
  }, [watch('type')]);

  const { showConfirm } = useConfirm();
  const { onOpenSuccessNotify, onOpenErrorNotify } = useNotification();
  const { onOpenLoading, onCloseLoading } = useLoading();

  const onSubmit = async (data) => {
    const body = {
      ...data,
      url: data.url || null,
      url_ref: data.url_ref || null,
      total_raised: data.total_raised || null,
    }
    showConfirm("Confirm creating new project?", () => post(body));
  }

  const post = async (body) => {
    onOpenLoading();
    try {
      const response = await apiPost("/projects", body);
      onOpenSuccessNotify("Create new project successfully!");
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

        <Col span={12}>
          <RHFInput
            label='Name'
            name='name'
            placeholder='Project name'
            required
          />
        </Col>

        <Col span={12}>
          <Controller
            name='type'
            control={control}
            render={({ field, fieldState: { error } }) => (
              <>
                <label className='d-block font-inter fw-500 fs-14'>
                  Type
                  <span className={'required'}></span>
                </label>

                <Select
                  onValueChange={(value) => field.onChange(value)}
                  value={field.value}
                  placeholder='Select type'
                  className='mt-10'
                  items={[ProjectType.TESTNET, ProjectType.DEPIN]}
                />
                {error && <span className='font-inter color-red mt-3 d-block'>{error?.message}</span>}
              </>
            )}
          />
        </Col>

        <Col span={12}>
          <RHFInput
            label='Link'
            name='url'
            placeholder='https://www.airdrophub.dev/example'
          />
        </Col>

        <Col span={12}>
          <RHFInput
            label='Link Ref'
            name='url_ref'
            placeholder='https://www.airdrophub.dev/example/ref'
          />
        </Col>

        <Col span={8}>
          <Controller
            name='total_raised'
            control={control}
            render={({ field, fieldState: { error } }) => (
              <>
                <label className='d-block font-inter fw-500 fs-14'>
                  Total raised
                </label>
                <div className="relative input-adm flex items-center rounded-md mt-10 h-36">
                  <Input
                    {...field}
                    autoComplete='off'
                    placeholder='TBA'
                    className='font-inter custom-input border-0 focus-visible:ring-0 shadow-none'
                    onChange={(e) => {
                      setValue('total_raised', formatNumber(e.target.value));
                    }}
                    value={formatNumber(getValues('total_raised'))}
                  />
                  {error && <span className='font-inter color-red mt-3 d-block'>{error?.message}</span>}
                  <span className="font-inter fs-15 mt-2 pr-2">M$</span>
                </div>
              </>
            )}
          />
        </Col>

        <Col span={8}>
          <Controller
            name='rating'
            control={control}
            render={({ field, fieldState: { error } }) => (
              <>
                <label className='d-block font-inter fw-500 fs-14'>
                  Rating
                  <span className={'required'}></span>
                </label>

                <Select
                  onValueChange={(value) => field.onChange(value)}
                  value={field.value}
                  placeholder='Select rating'
                  className='mt-10'
                  items={[ProjectRating.HIGH, ProjectRating.MEDIUM, ProjectRating.LOW]}
                />
                {error && <span className='font-inter color-red mt-3 d-block'>{error?.message}</span>}
              </>
            )}
          />
        </Col>
        <Col span={8}>
          <Controller
            name='status'
            control={control}
            render={({ field, fieldState: { error } }) => (
              <>
                <label className='d-block font-inter fw-500 fs-14'>
                  Status
                  <span className={'required'}></span>
                </label>

                <Select
                  onValueChange={(value) => field.onChange(value)}
                  value={field.value}
                  placeholder='Select status'
                  className='mt-10'
                  items={[ProjectStatus.DOING, ProjectStatus.PENDING, ProjectStatus.ENDED]}
                />
                {error && <span className='font-inter color-red mt-3 d-block'>{error?.message}</span>}
              </>
            )}
          />
        </Col>

        <Col span={24} className='d-flex justify-content-end pdb-5'>
          <ButtonPrimary type='submit' title={'Save changed'} />
        </Col>
      </Row>
    </FormProvider>

  )
}

