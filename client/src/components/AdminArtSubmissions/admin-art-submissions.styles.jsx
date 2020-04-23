import styled, { css } from "styled-components";
import { Link } from "react-router-dom";

export const SubmissionContainer = styled.div`
  width: 90%;
  margin: 40px auto;
`;

export const TabArea = styled.div`
  box-shadow: 0px 7px 16px 2px rgba(0, 0, 0, 0.2);
  border-radius: 15px;
  padding: 55px;
  min-height: 70vh;
`;

export const FilterHeader = styled.div`
  display: flex;
  justify-content: space-between;
  position: relative;
`;

export const SearchBoxWrapper = styled.div`
  position: relative;
`;

export const SearchBtn = styled.button`
  position: absolute;
  top: 0;
  right: -5px;
  width: 61px;
  background-color: transparent;
  border: none;

  path {
    fill: #1a8488;
  }
`;

export const AdjustableIconWrapper = styled.div`
  width: 30px;
  cursor: pointer;

  path {
    fill: #1a8488;
  }
`;

export const FilterContainer = styled.div`
  position: absolute;
  bottom: -220px;
  right: -20px;
  z-index: 5;
  max-width: 170px;
  padding: 18px 20px 18px 0;
  border-radius: 12px;
  box-shadow: 0px 3px 11px 1px rgba(0, 0, 0, 0.2);
  background-color: #fff;

  .selected {
    background-color: #dedddd;
    border-left: 5px solid #6a6a6a;
    border-radius: 0 12px 12px 0;
    padding-left: 30px;
    box-shadow: 0px 3px 11px 1px rgba(0, 0, 0, 0.2);
  }
`;

export const FilterBtn = styled.button`
  background-color: transparent;
  border: none;
  font-size: 16px;
  font-weight: 700;
  color: #6a6a6a;
  cursor: pointer;
  padding: 11px;
  padding-left: 35px;
  width: 100%;
  text-align: left;
`;

export const ArtCardContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;
`;
