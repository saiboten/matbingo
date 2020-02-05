import styled from "styled-components";

import { secondaryColor, minBreakPoint } from "./Constants";

import { ReactComponent as PlusCircle } from "./svg/plus-circle.svg";
import { ReactComponent as Dice } from "./svg/dice.svg";
import { ReactComponent as Search } from "./svg/search.svg";
import { ReactComponent as Write } from "./svg/edit.svg";
import { ReactComponent as Next } from "./svg/arrow-right.svg";
import { ReactComponent as Previous } from "./svg/arrow-left.svg";
import { ReactComponent as Back } from "./svg/back.svg";
import { ReactComponent as Check } from "./svg/check.svg";
import { ReactComponent as Rotate } from "./svg/rotate-ccw.svg";
import { ReactComponent as DeleteIcon } from "./svg/trash-2.svg";
import { ReactComponent as LogOutIcon } from "./svg/log-out.svg";
import { ReactComponent as SettingsIcon } from "./svg/settings.svg";
import { ReactComponent as Link } from "./svg/link.svg";
import { ReactComponent as ChefSvg } from "./svg/chef.svg";

export const StyledChef = styled(ChefSvg)`
  height: 40rem;
  width: 40rem;
  color: #e4971a;

  @media screen and (max-width: ${minBreakPoint}px) {
    height: 20rem;
    width: 20rem;
  }
`;

export const BackgroundChef = styled(ChefSvg)`
  height: 40rem;
  width: 40rem;
  color: #e4971a;
  fill: currentColor;
  position: absolute;
  top: 0;
  right: -4rem;
  transform: rotateY(180deg);
  z-index: -1;

  @media screen and (max-width: ${minBreakPoint}px) {
    height: 20rem;
    width: 20rem;
  }
`;

export const StyledSettingsIcon = styled(SettingsIcon)`
  width: 24px;
  height: 24px;
  fill: ${props => (props.color ? props.color : secondaryColor)};
`;

export const StyledPlusCircle = styled(PlusCircle)`
  width: 24px;
  height: 24px;
  fill: white;
`;

export const StyledDice = styled(Dice)`
  width: 24px;
  height: 24px;
  fill: white;
`;

export const StyledSearch = styled(Search)`
  width: 24px;
  height: 24px;
  fill: white;
`;

export const StyledWrite = styled(Write)`
  width: 24px;
  height: 24px;
  fill: white;
`;

export const StyledNext = styled(Next)`
  width: 24px;
  height: 24px;
  fill: white;
`;

export const StyledPrevious = styled(Previous)`
  width: 24px;
  height: 24px;
  fill: white;
`;

export const StyledBack = styled(Back)`
  width: 24px;
  height: 24px;
  fill: ${secondaryColor};
`;

export const StyledCheck = styled(Check)`
  width: 24px;
  height: 24px;
  fill: white;
`;

export const StyledRotate = styled(Rotate)`
  width: 24px;
  height: 24px;
  fill: white;
`;

export const StyledLinkIcon = styled(Link)`
  width: 24px;
  height: 24px;
  fill: white;
`;

export const StyledDeleteIcon = styled(DeleteIcon)`
  cursor: pointer;
  fill: ${props => (props.color ? props.color : secondaryColor)};
`;

export const StyledLogOut = styled(LogOutIcon)`
  width: 24px;
  height: 24px;
  fill: ${secondaryColor};
`;
