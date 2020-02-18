import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import styled from "styled-components";

interface Props {
  setImage: (image: string) => void;
}

const Wrapper = styled.div`
  margin: 0 auto;
  padding: 1rem;
  border: dotted 1px black;
  text-align: center;
  margin-bottom: 1rem;
`;

export function MyDropzone({ setImage }: Props) {
  const onDrop = useCallback(
    acceptedFiles => {
      acceptedFiles.forEach((file: any) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);

        reader.onabort = () => console.log("file reading was aborted");
        reader.onerror = () => console.log("file reading has failed");
        reader.onload = () => {
          // Do whatever you want with the file contents
          const base64 = reader.result as string;
          setImage(base64);
        };
      });
    },
    [setImage]
  );
  const { getRootProps, getInputProps } = useDropzone({
    onDrop
  });

  return (
    <Wrapper {...getRootProps()}>
      <input {...getInputProps()} />
      <p>Dra bilde/klikk her for å laste opp</p>
    </Wrapper>
  );
}
