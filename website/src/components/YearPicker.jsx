import React, { useEffect, useState } from 'react';
import { useGameListState } from '../contexts/GamesListContext';
import { Select } from 'antd';
import axios from 'axios';
import { useFetchToken } from '../hooks/customHooks';
import { getRequestConfig } from '../helpers/getRequestJwt';

const { Option } = Select;

const YearPicker = ({ user }) => {
  const token = useFetchToken();
  const [years, setYears] = useState([]);
  const { uid } = user;

  const {
    yearState: [currentYear, setCurrentYear]
  } = useGameListState();

  useEffect(() => {
    if (!token) return;

    async function getYearData() {
      try {
        const years = await axios.get(
          `user/years/${uid}`,
          getRequestConfig(token)
        );
        setYears(years.data);
      } catch (error) {
        console.error(error);
      }
    }
    getYearData();
  }, [currentYear, token, uid]);

  function handleChange(value) {
    setCurrentYear(value);
  }

  return (
    <>
      <Select
        defaultValue={new Date().getFullYear()}
        style={{ width: 120 }}
        onChange={handleChange}
      >
        {years.map(attr => (
          <Option
            value={attr.year}
            key={attr.year}
            style={
              attr.hasData
                ? { backgroundColor: 'yellow' }
                : { backgroundColor: 'white' }
            }
          >
            {attr.year}
          </Option>
        ))}
      </Select>
    </>
  );
};

export default YearPicker;
