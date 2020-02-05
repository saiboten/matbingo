import React, { ReactElement } from "react";
import { StyledActionButtonForText } from "../../components/StyledActionButton";

interface Props {
  onClick: () => void;
}

export function WunderlistExportButton({
  onClick
}: Props): ReactElement<Props> {
  return (
    <StyledActionButtonForText onClick={onClick}>
      Lag handleliste i Wunderlist
    </StyledActionButtonForText>
  );
}
