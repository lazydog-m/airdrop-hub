import React, { useState, useEffect } from 'react';
import { ButtonPrimary } from "@/components/Button";
import Container from "@/components/Container";
import { HeaderAction } from "@/components/HeaderSection";
import Page from "@/components/Page";
import { CirclePlus } from 'lucide-react';
import ProjectFilterSearch from "./ProjectFilterSearch";
import ProjectDataTable from './ProjectDataTable';
import Modal from '@/components/Modal';
import ProjectNewEditForm from '../create/ProjectNewEditForm';
import { apiGet } from '@/utils/axios';

export default function ProjectList() {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState([]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const [selectedStatusItems, setSelectedStatusItems] = useState([]);
  const [selectedTypeItems, setSelectedTypeItems] = useState([]);
  const [selectedRatingItems, setSelectedRatingItems] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedSort, setSelectedSort] = useState('raisedDesc');

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

  const handleChangeSelectedRatingItems = (label, isChecked) => {
    setSelectedRatingItems((prev) => {
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
    setSelectedRatingItems([]);
  }

  useEffect(() => {
    const fetch = async () => {
      const params = {
        page: 1,
        size: 10,
      }

      try {
        const response = await apiGet("/projects", params);
        setData(response.data.data.rows);
      } catch (error) {
        console.error(error);
      } finally {
        // onCloseLoading();
      }
    }

    fetch();
  }, [])

  return (
    <Page title='Projects - AirdropHub'>
      <Container>

        <HeaderAction
          heading='Projects'
          action={
            <ButtonPrimary
              icon={<CirclePlus />}
              title='Add Project'
              onClick={handleClickOpen}
            />
          }
        />

        <ProjectFilterSearch
          selectedStatusItems={selectedStatusItems}
          onChangeSelectedStatusItems={handleChangeSelectedStatusItems}
          onClearSelectedStatusItems={() => setSelectedStatusItems([])}

          selectedTypeItems={selectedTypeItems}
          onChangeSelectedTypeItems={handleChangeSelectedTypeItems}
          onClearSelectedTypeItems={() => setSelectedTypeItems([])}

          selectedRatingItems={selectedRatingItems}
          onChangeSelectedRatingItems={handleChangeSelectedRatingItems}
          onClearSelectedRatingItems={() => setSelectedRatingItems([])}

          onClearAllSelectedItems={handleClearAllSelectedItems}
          search={search}
          onChangeSearch={handleChangeSearch}

          selectedSort={selectedSort}
          onChangeSelectedSort={(selected) => setSelectedSort(selected)}
        />

        <ProjectDataTable
          data={data}
        />

        <Modal
          isOpen={open}
          onClose={handleClose}
          title={"Create new project"}
          content={
            <ProjectNewEditForm
              onCloseModal={handleClose}
            />
          }
        />

      </Container>
    </Page>
  )
}


