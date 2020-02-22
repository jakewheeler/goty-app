import React from 'react';
import { useGameListState } from '../contexts/GamesListContext';
import { Select } from 'antd';
import axios from 'axios';

const { Option } = Select;

const YearPicker = () => {
  const {
    yearState: [, setCurrentYear]
  } = useGameListState();

  function handleChange(value) {
    setCurrentYear(value);
  }

  const years = (() => {
    const currentYear = new Date().getFullYear();
    const yearArr = [];
    for (let i = currentYear; i >= 2000; i--) {
      yearArr.push(i);
    }
    return yearArr;
  })();

  return (
    <>
      <Select
        defaultValue={new Date().getFullYear()}
        style={{ width: 120 }}
        onChange={handleChange}
      >
        {years.map(year => (
          <Option value={year} key={year}>
            {year}
          </Option>
        ))}
      </Select>
    </>
  );
};

export default YearPicker;
