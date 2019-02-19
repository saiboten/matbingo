import styled from "styled-components";
import { Field } from "react-final-form";

export const StyledRadioLabel = styled.label`
  position: relative;
  padding: 10px 20px;
  padding-left: 30px;
  margin-right: 10px;

  &:after {
    position: absolute;
    left: 0;
    top: 7px;
    content: "";
    height: 24px;
    width: 24px;
    border: 1px solid blue;
    border-radius: 50%;
  }

  &:before {
    position: absolute;
    left: 3px;
    top: 10px;
    content: "";
    height: 18px;
    width: 18px;
    background-color: blue;
    border-radius: 50%;
    opacity: 0;
    transition: all 0.2s ease-in;
  }
`;

export const StyledRadio = styled(Field)`
  display: none;

  &:checked + ${StyledRadioLabel}::before {
    opacity: 1;
  }
`;
