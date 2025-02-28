import FormProvider from "@/components/hook-form/FormProvider"
import RHFInput from "@/components/hook-form/RHFInput"
import { Col, Row } from "antd"
import { useState, useEffect } from 'react';
import * as Yup from 'yup';
import { useNavigate } from "react-router-dom"
// form
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, Controller } from 'react-hook-form';

export default function ProjectNewEditForm({ }) {

  const ProjectSchema = Yup.object().shape({
    name: Yup.string().trim().required('Project name is required!'),
    // maSanPham: Yup.string().trim().required('Mã không được bỏ trống'),
    // donGia: Yup.string().required('Đơn giá không được bỏ trống'),
    // idMauSac: Yup.string().required('Màu không được bỏ trống'),
    // idThuongHieu: Yup.string().required('Thương hiệu không được bỏ trống'),
  });

  const defaultValues = {
    name: '',
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
  } = methods;

  const onSubmit = async (data) => {
    // const body = {
    //   ...data, // giữ các biến cũ trong form data 
    //   donGia: parseInt(formatNumber(data.donGia)), // ghi đè thuộc tính đơn giá trong data, convert thành số
    //   trangThai: chuyenDoiThanhEnum(data.trangThai), // ghi đè thuộc tính trạng thái trong data, convert thành enum
    //   id: sanPhamHienTai?.id,
    // }
    // console.log(body);
    // // hiển thị confirm
    //
    // if (laCapNhat) {
    //   showConfirm("Xác nhận cập nhật sản phẩm?", "Bạn có chắc chắn muốn cập nhật sản phẩm?", () => put(body));
    // }
    // else {
    //   showConfirm("Xác nhận thêm mới sản phẩm?", "Bạn có chắc chắn muốn thêm sản phẩm?", () => post(body));
    // }
  }

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Row className='mt-10' gutter={25} style={{ display: "flex", justifyContent: "center" }}>

        <Col span={9}>
          <RHFInput
            label='Tên'
            name='tenSanPham'
            placeholder='Nhập tên sản phẩm'
            required
          />
        </Col>

        <Col span={9}>
          <RHFInput
            label='Mã'
            name='maSanPham'
            placeholder='Nhập mã sản phẩm'
            required
          />
        </Col>

      </Row>
    </FormProvider>

  )
}
