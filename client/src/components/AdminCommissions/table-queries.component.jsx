import React, { useState } from "react";
import { ButtonSm } from "../Button/button.component";
import { DateRange } from "react-date-range";

import "react-date-range/dist/styles.css"; // main css file
import "react-date-range/dist/theme/default.css"; // theme css f

const TableQueries = ({ handleDateFilter }) => {
  const [dates, setDates] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);

  const [state, setState] = useState({ isDateOpen: false });
  const { isDateOpen } = state;

  const handleChange = (item) => {
    console.log(item);
    setDates([item.selection]);
  };

  const handleClick = () => {
    const { startDate, endDate } = dates[0];
    const start = new Date(startDate).toLocaleDateString("en-CA");
    const end = new Date(endDate).toLocaleDateString("en-CA");
    handleDateFilter({ startDate: start, endDate: end });
  };

  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          paddingBottom: "25px",
          borderBottom: "1px solid",
        }}
      >
        {isDateOpen ? (
          <>
            <DateRange
              editableDateInputs={true}
              onChange={handleChange}
              moveRangeOnFirstSelection={false}
              ranges={dates}
            />
            <ButtonSm style={{ marginLeft: "20px" }} onClick={handleClick}>
              Filter By Date
            </ButtonSm>
          </>
        ) : (
          <ButtonSm
            onClick={() => setState({ ...state, isDateOpen: !isDateOpen })}
          >
            Open Calender
          </ButtonSm>
        )}
      </div>
    </>
  );
};

export default TableQueries;
