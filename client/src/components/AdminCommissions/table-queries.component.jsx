import React, { useState } from "react";
import { ButtonSm } from "../Button/button.component";
import { DateRange } from "react-date-range";

import "react-date-range/dist/styles.css"; // main css file
import "react-date-range/dist/theme/default.css"; // theme css f

const TableQueries = ({
  handleDateFilter,
  handleMaxDisplay,
  handlePagDBNext,
  globalStartDate,
  globalEndDate,
  globalMaxDisplay,
}) => {
  const [dates, setDates] = useState({
    startDate: globalStartDate,
    endDate: globalEndDate,
    key: "selection",
  });

  const [state, setState] = useState({
    isDateOpen: false,
    isMaxDisplay: false,
    maxDisplay: globalMaxDisplay,
  });

  const { isDateOpen, isMaxDisplay, maxDisplay } = state;

  const handleChange = (item) => {
    setDates(item.selection);
  };

  const handleClick = () => {
    const { startDate, endDate } = dates;
    const start = new Date(startDate).toLocaleDateString("en-CA");
    const end = new Date(endDate).toLocaleDateString("en-CA");
    handleDateFilter({ startDate: start, endDate: end });
  };

  const handleMaxDisplayChange = (event) => {
    setState({ ...state, maxDisplay: event.currentTarget.value });
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
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        {isMaxDisplay ? (
          <>
            <input
              type="number"
              onChange={handleMaxDisplayChange}
              value={maxDisplay}
            />
            <div style={{ paddingTop: "30px" }}>
              <ButtonSm onClick={() => handleMaxDisplay(maxDisplay)}>
                Update
              </ButtonSm>
              <ButtonSm
                style={{ marginLeft: "20px" }}
                onClick={() => setState({ ...state, isMaxDisplay: false })}
              >
                X
              </ButtonSm>
            </div>
          </>
        ) : (
          <ButtonSm onClick={() => setState({ ...state, isMaxDisplay: true })}>
            Edit Max Display
          </ButtonSm>
        )}
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
          <ButtonSm
            onClick={() => handlePagDBNext(true)}
          >
            Get Next {maxDisplay}
          </ButtonSm>
      </div>
    </div>
  );
};

export default TableQueries;
