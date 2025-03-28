import React, { useState, useEffect } from 'react';
import { ButtonPrimary } from "@/components/Button";
import Container from "@/components/Container";
import { HeaderAction } from "@/components/HeaderSection";
import Page from "@/components/Page";
import { CirclePlus } from 'lucide-react';
import Modal from '@/components/Modal';
import { apiGet } from '@/utils/axios';
import { ProjectStatus } from '@/enums/enum';
import ProfileFilterSearch from './ProfileFilterSearch';
import ProfileDataTable from './ProfileDataTable';
import ProfileNewEditForm from '../create/ProfileNewEditForm';

export default function ProfileList() {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  const handleUpdateData = (isEdit, projectNew) => {
    if (!isEdit) {
      setData((prevData) => [projectNew, ...prevData])
    }
    else {
      setData((prevData) =>
        prevData.map((project) =>
          project.id === projectNew.id ? projectNew : project
        )
      );
    }
  }

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const [selectedStatusItems, setSelectedStatusItems] = useState([ProjectStatus.DOING]);
  const [selectedTypeItems, setSelectedTypeItems] = useState([]);
  const [selectedCostItems, setSelectedCostItems] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedOtherItems, setSelectedOtherItems] = useState([]);

  const handleChangeSearch = (e) => {
    setSearch(e.target.value);
  }

  const handleChangeSelectedStatusItems = (label, isChecked) => {
    setSelectedStatusItems((prev) => {
      if (isChecked) {
        return [...prev, label];
      } else {
        return prev.filter((item) => item !== label);
      }
    });
  };

  const handleChangeSelectedTypeItems = (label, isChecked) => {
    setSelectedTypeItems((prev) => {
      if (isChecked) {
        return [...prev, label];
      } else {
        return prev.filter((item) => item !== label);
      }
    });
  };

  const handleChangeSelectedCostItems = (label, isChecked) => {
    setSelectedCostItems((prev) => {
      if (isChecked) {
        return [...prev, label];
      } else {
        return prev.filter((item) => item !== label);
      }
    });
  };

  const handleChangeSelectedOtherItems = (label, isChecked) => {
    setSelectedOtherItems((prev) => {
      if (isChecked) {
        return [...prev, label];
      } else {
        return prev.filter((item) => item !== label);
      }
    });
  };

  const handleClearAllSelectedItems = () => {
    setSelectedTypeItems([]);
    setSelectedStatusItems([]);
    setSelectedCostItems([]);
    setSelectedOtherItems([]);
    setSearch('');
  }

  useEffect(() => {
    const fetch = async () => {
      const params = {
        selectedCostItems,
        selectedTypeItems,
        selectedOtherItems,
        selectedStatusItems,
      }

      try {
        const response = await apiGet("/projects", params);
        setData(response.data.data || []);
        console.log(response.data);
      } catch (error) {
        console.error(error);
      }
    }

    fetch();
  }, [selectedStatusItems, selectedOtherItems, selectedTypeItems, selectedCostItems])

  useEffect(() => {
    setFilteredData(data);
  }, [data]);

  useEffect(() => {
    if (search) {
      const results = data.filter(item =>
        item.name.toLowerCase().includes(search.toLowerCase())
      );
      setFilteredData(results);
    } else {
      setFilteredData(data);
    }
  }, [search, data])

  return (
    <Page title='Quản lý hồ sơ - AirdropHub'>
      <Container>

        <HeaderAction
          heading='Danh sách hồ sơ'
          action={
            <ButtonPrimary
              icon={<CirclePlus />}
              title='Tạo hồ sơ'
              onClick={handleClickOpen}
            />
          }
        />

        <ProfileFilterSearch
          selectedStatusItems={selectedStatusItems}
          onChangeSelectedStatusItems={handleChangeSelectedStatusItems}
          onClearSelectedStatusItems={() => setSelectedStatusItems([])}

          selectedTypeItems={selectedTypeItems}
          onChangeSelectedTypeItems={handleChangeSelectedTypeItems}
          onClearSelectedTypeItems={() => setSelectedTypeItems([])}

          selectedCostItems={selectedCostItems}
          onChangeSelectedCostItems={handleChangeSelectedCostItems}
          onClearSelectedCostItems={() => setSelectedCostItems([])}

          selectedOtherItems={selectedOtherItems}
          onChangeSelectedOtherItems={handleChangeSelectedOtherItems}
          onClearSelectedOtherItems={() => setSelectedOtherItems([])}

          onClearAllSelectedItems={handleClearAllSelectedItems}
          search={search}
          onChangeSearch={handleChangeSearch}
        />

        <ProfileDataTable
          data={filteredData}
          onUpdateData={handleUpdateData}
        />

        <Modal
          bottom={60}
          isOpen={open}
          onClose={handleClose}
          title={"Tạo mới hồ sơ"}
          content={
            <ProfileNewEditForm
              onCloseModal={handleClose}
              onUpdateData={handleUpdateData}
            />
          }
        />

      </Container>
    </Page>
  )
}


