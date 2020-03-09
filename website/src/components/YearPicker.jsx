import React, { useEffect } from 'react';
import { useGameListState, getYearData } from '../contexts/GamesListContext';
import { Select } from 'antd';
import { useFetchToken } from '../hooks/customHooks';

const { Option } = Select;

const YearPicker = ({ user }) => {
  const token = useFetchToken();
  const { uid } = user;

  const {
    yearState: [currentYear, setCurrentYear],
    yearListState: [years, setYears]
  } = useGameListState();

  useEffect(() => {
    let subscribed = true;
    if (!token) return;

    const fetchData = async () => {
      let yearData = await getYearData(token, uid);
      setYears(yearData);
    };
    if (subscribed) {
      fetchData();
    }

    return () => (subscribed = false);
  }, [currentYear, token, uid, setYears]);

  function handleChange(value) {
    setCurrentYear(value);
  }

  return (
    <>
      <Select
        defaultValue={currentYear || new Date().getFullYear()}
        style={{ width: 120 }}
        onChange={handleChange}
      >
        {years.map(attr => (
          <Option
            value={attr.year}
            key={attr.year}
            style={
              attr.hasData
                ? { backgroundColor: '#EAEAEA' }
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
