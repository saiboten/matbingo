import React, { useState } from "react";
import Cropper from "react-easy-crop";
import { MyDropzone } from "../menu/MyDropzone";
import {
  StyledActionButtonForText,
  StyledSecondaryActionButtonForText
} from "./StyledActionButton";

interface CropType {
  x: number;
  y: number;
}

interface Props {
  storeCroppedImage: (image: any, croppedAreaPixels: any) => void;
}

export const ImageCropper = ({ storeCroppedImage }: Props) => {
  const [image, setImage] = useState<string | undefined>(undefined);
  const [crop, setCrop] = useState<CropType>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);

  const [croppedAreaPixels, setCroppedAreaPixels] = useState({});

  function handleCropComplete(croppedArea: any, croppedAreaPixels: any) {
    setCroppedAreaPixels(croppedAreaPixels);
  }

  function handleCropChange(crop: CropType) {
    setCrop(crop);
  }

  function handleZoomChange(zoom: number) {
    setZoom(zoom);
  }

  return (
    <>
      {!image && <MyDropzone setImage={setImage} />}
      {image && (
        <>
          <div
            style={{
              width: "100%",
              height: "200px",
              position: "relative",
              marginBottom: "1rem"
            }}
          >
            <Cropper
              image={image}
              crop={crop}
              zoom={zoom}
              aspect={373 / 169}
              onCropComplete={handleCropComplete}
              onCropChange={handleCropChange}
              onZoomChange={handleZoomChange}
            />
          </div>
          <div
            style={{
              padding: "1rem"
            }}
          >
            <StyledActionButtonForText
              style={{
                marginRight: "1rem"
              }}
              onClick={() => storeCroppedImage(image, croppedAreaPixels)}
            >
              Lagre
            </StyledActionButtonForText>
            <StyledSecondaryActionButtonForText
              onClick={() => setImage(undefined)}
            >
              Avbryt
            </StyledSecondaryActionButtonForText>
          </div>
        </>
      )}
    </>
  );
};
