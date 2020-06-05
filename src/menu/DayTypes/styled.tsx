import styled from "styled-components";
import { secondaryColor } from "../../components/Constants";

interface StyledDayProps {
  active: boolean;
  selected: boolean;
}

export const StyledDay = styled.div<StyledDayProps>`
  position: relative;
  width: 48%;
  display: inline-block;
  text-align: left;
  margin: 5px;
  min-height: 100px;
  color: #000;

  box-shadow: 0px 2px 1px -1px rgba(0, 0, 0, 0.2),
    0px 1px 1px 0px rgba(0, 0, 0, 0.14), 0px 1px 3px 0px rgba(0, 0, 0, 0.12);

  border: ${(props) => (props.active ? `2px solid ${secondaryColor}` : "none")};

  @media screen and (max-width: 530px) {
    width: 100%;
  }
  background-color: ${(props) => (props.selected ? "#e4971a" : "#fff")};
`;

export const StyledDate = styled.div`
  position: absolute;
  left: 2px;
  top: 2px;
  font-size: 1.6rem;
  background: white;
  z-index: 1;
  padding: 0.2rem 0.5rem;
  border-radius: 3px;
`;

export const StyledDayContent = styled.div`
  text-align: center;
  height: 100%;
`;

export const ActionButtons = styled.div`
  position: absolute;
  right: 0;
  top: 0;
  margin-right: 5px;
  margin-top: 5px;
  display: float;
`;
