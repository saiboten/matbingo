import React from "react";
import styled from "styled-components";
import { primaryColor } from "./Constants";

interface Props {
  active: boolean;
}

const StyledNotificationBar = styled.div<Props>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  border: 1px solid ${primaryColor};
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  background-color: white;

  transition: all 0.5s;
  transform: ${props => (props.active ? `translateY(0)` : `translateY(-50px)`)};
`;

export const StyledNotification = ({
  text,
  active
}: {
  text: string;
  active: boolean;
}) => <StyledNotificationBar active={active}>{text}</StyledNotificationBar>;
