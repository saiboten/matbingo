import React, { useCallback, useState, useEffect } from "react";
import styled from "styled-components";
import { RecipeType } from "../types";
import { StyledHeaderH1NoMarginTop } from "../components/StyledHeaderH1";
import { Link } from "react-router-dom";
import { SeeIngredients } from "./SeeIngredients";
import Cropper from "react-easy-crop";
import getCroppedImg from "./CropImage";
import { MyDropzone } from "./MyDropzone";
import { firebase } from '../firebase/firebase';

const StyledWrapper = styled.div`
  margin-top: 2.5rem;
  max-width: 480px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
`;

interface Props {
  recipe: RecipeType | undefined;
}

const StyledEmpesizedP = styled.p`
  font-weight: bold;
  margin-top: 1rem;
`;

interface ImageProps {
  src: string;
  blurImage: boolean;
}

const Image = styled.img<ImageProps>`
  width: 100%;
  display: block;
  margin-top: -2.5rem;
  opacity: ${props => props.blurImage ? 0.2 : 1};
`;

interface CropType {
  x: number;
  y: number;
}

export const RecipeDetails = ({ recipe }: Props) => {
  const [image, setImage] = useState<string | undefined>(undefined);
  const [image2, setImage2] = useState<string | undefined>(undefined);
  const [crop, setCrop] = useState<CropType>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);

  const [croppedAreaPixels, setCroppedAreaPixels] = useState({});

  useEffect(() => {
    if(recipe?.image) {
      const storage = firebase.storage();
      const storageRef = storage.ref();
      const recipesRef = storageRef.child('recipes');
      const recipeRef = recipesRef.child(recipe?.id || "");
      recipeRef.getDownloadURL().then(function(url) {
        setImage2(url);
      })
    }
  }, [recipe, image]);

  const storeCroppedImage = useCallback(
    async () => {
      try {
        const croppedImage = await getCroppedImg(image, croppedAreaPixels, 0);
        setImage2(croppedImage);

        // Store file
        const storage = firebase.storage();
        const storageRef = storage.ref();
        const recipesRef = storageRef.child('recipes');
        const recipeRef = recipesRef.child(recipe?.id || "");
        // Base64 formatted string
        recipeRef.putString(croppedImage, 'data_url');
        firebase.firestore().collection("recipes").doc(recipe?.id).update({
          image: true
        })

        // update image location
      } catch (e) {
        console.error(e);
      }
    },
    [croppedAreaPixels, image, recipe]
  );

  if (!recipe) {
    return null;
  }

  const { name, description, ingredients, id } = recipe;

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
    <StyledWrapper>
      <Image blurImage={image2 === undefined} src={image2 ? image2 : "stock2.jpeg"} />
      <StyledHeaderH1NoMarginTop
        style={{ padding: "0 1rem", paddingTop: "1rem", marginBottom: "0" }}
      >
        <Link to={`/recipes/${id}`}>{name}</Link>
      </StyledHeaderH1NoMarginTop>
      <div
        style={{ padding: "0 1rem", paddingBottom: "1rem", textAlign: "left" }}
      >
        {description && (
          <>
            <StyledEmpesizedP>Beskrivelse</StyledEmpesizedP>
            <p>{description}</p>
          </>
        )}
        <SeeIngredients ingredientsIds={ingredients} />
      </div>
      <MyDropzone setImage={setImage} />
      {image && <><div
        style={{
          width: "200px",
          height: "200px",
          position: "relative"
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
      <button onClick={storeCroppedImage}>Lagre</button></>
      }
    </StyledWrapper>
  );
};
