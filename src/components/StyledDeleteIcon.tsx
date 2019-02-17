import styled from "styled-components";
import { ReactComponent as DeleteIcon } from "./svg/trash-2.svg";
import { primaryColor } from "./Constants";

export const StyledDeleteIcon = styled(DeleteIcon)`
  cursor: pointer;
  fill: ${props => (props.color ? props.color : primaryColor)};
`;
