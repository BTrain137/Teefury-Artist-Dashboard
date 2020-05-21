import React, { useState } from "react";
import { ButtonSm } from "../Button/button.component";
import { DateRange } from "react-date-range";

import "react-date-range/dist/styles.css"; // main css file
import "react-date-range/dist/theme/default.css"; // theme css f

const TableQueries = ({
  handleDateFilter,
  globalStartDate,
  globalEndDate,
}) => {
  const [dates, setDates] = useState({
    startDate: globalStartDate,
    endDate: globalEndDate,
    key: "selection",
  });

  const [state, setState] = useState({
    isDateOpen: false,
  });

  const { isDateOpen } = state;

  const handleChange = (item) => {
    setDates(item.selection);
  };

  const handleClick = () => {
    const { startDate, endDate } = dates;
    const start = new Date(startDate).toLocaleDateString("en-CA");
    const end = new Date(endDate).toLocaleDateString("en-CA");
    handleDateFilter({ startDate: start, endDate: end });
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-around",
        paddingBottom: "25px",
        borderBottom: "1px solid",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {isDateOpen ? (
          <>
            <DateRange
              editableDateInputs={true}
              onChange={handleChange}
              moveRangeOnFirstSelection={false}
              ranges={[dates]}
            />
            <div>
              <ButtonSm style={{ marginLeft: "20px" }} onClick={handleClick}>
                Filter By Date
              </ButtonSm>
              <ButtonSm
                style={{ marginLeft: "20px" }}
                onClick={() => setState({ ...state, isDateOpen: false })}
              >
                X
              </ButtonSm>
            </div>
          </>
        ) : (
          <ButtonSm onClick={() => setState({ ...state, isDateOpen: true })}>
            Open Calender
          </ButtonSm>
        )}
      </div>
    </div>
  );
};

export default TableQueries;
