import React, { useState } from "react";
import { ButtonSm } from "../Button/button.component";
import {useEffect} from "react";

const TableQueries = ({ handleDateFilter }) => {
  const [dates, setDates] = useState({ startDate: "", endDate: "" });
  const today = new Date().toLocaleDateString('en-CA');

  useEffect(() => {
    setDates({ startDate: today, endDate: today })
  }, [today])

  const handleChangeStart = (event) => {
    setDates({ ...dates, startDate: event.target.value });
  };

  const handleChangeEnd = (event) => {
    setDates({ ...dates, endDate: event.target.value });
  };

  const handleClick = () => {
    handleDateFilter(dates);
  }

  return (
    <>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          paddingBottom: "25px",
          borderBottom: "1px solid",
        }}
      >
        <div>
          Start Date <input type="date" onChange={handleChangeStart} value={dates.startDate} />
          <br />
          <br />
          End Date <input type="date" onChange={handleChangeEnd} value={dates.endDate} />
        </div>
        <ButtonSm style={{ marginLeft: "20px" }} onClick={handleClick}>
          Filter By Date
        </ButtonSm>
      </div>
    </>
  );
};

export default TableQueries;
