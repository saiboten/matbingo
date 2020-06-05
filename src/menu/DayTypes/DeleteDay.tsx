import React from "react";
import {
  StyledSecondaryActionButtonForText,
  StyledActionButtonForText,
  StyledActionButton,
} from "../../components/StyledActionButton";
import DeleteIcon from "@material-ui/icons/Delete";
import { firebase } from "../../firebase/firebase";

export const DeleteDay = ({
  documentId,
  reset,
  showConfirm,
  setConfirmed,
}: {
  documentId: string;
  reset: () => void;
  showConfirm: boolean;
  setConfirmed: (value: boolean) => void;
}) => {
  const deleteDay = () => {
    if (showConfirm) {
      const db = firebase.firestore();
      db.collection("days")
        .doc(documentId)
        .delete()
        .then(() => {
          reset();
        });
    } else {
      setConfirmed(true);
    }
  };

  return (
    <div>
      {showConfirm && (
        <StyledSecondaryActionButtonForText
          style={{ marginRight: "10px" }}
          onClick={() => setConfirmed(false)}
        >
          Avbryt
        </StyledSecondaryActionButtonForText>
      )}

      {showConfirm ? (
        <StyledActionButtonForText onClick={deleteDay}>
          Sikker?
        </StyledActionButtonForText>
      ) : (
        <StyledActionButton onClick={deleteDay}>
          <DeleteIcon fontSize="large" />
        </StyledActionButton>
      )}
    </div>
  );
};
