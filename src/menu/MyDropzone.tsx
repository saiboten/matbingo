import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";

interface Props {
  setImage: (image: string) => void;
}

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
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      <p>Last opp</p>
    </div>
  );
}
