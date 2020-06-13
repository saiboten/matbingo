import React, { useCallback } from "react";
import styled from "styled-components";
import { RecipeType } from "../types";
import { StyledHeaderH1NoMarginTop } from "../components/StyledHeaderH1";
import { Link } from "react-router-dom";
import { SeeIngredients } from "./SeeIngredients";
import getCroppedImg from "../components/CropImage";
import { firebase } from "../firebase/firebase";
import { ImageCropper } from "../components/ImageCropper";
import { StyledLocalLoader } from "../components/StyledLocalLoader";
import { useRecipeImage } from "../hooks/useRecipeImage";

const StyledWrapper = styled.div`
  margin-top: 2.5rem;
  max-width: 510px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
`;

interface Props {
  recipe: RecipeType | undefined;
  showImageUpload: boolean;
  setShowImageUpload?: (val: boolean) => void;
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
  opacity: ${(props) => (props.blurImage ? 0.2 : 1)};
`;

const ImagePlaceHolder = styled.div`
  width: 100%;
  height: 171px;
  margin-top: -2.5rem;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const RecipeDetails = ({
  recipe,
  showImageUpload,
  setShowImageUpload,
}: Props) => {
  const { image, setImage } = useRecipeImage(recipe);

  const storeCroppedImage = useCallback(
    async (image, croppedAreaPixels) => {
      try {
        const croppedImage = await getCroppedImg(image, croppedAreaPixels, 0);
        // Store file
        const storage = firebase.storage();
        const storageRef = storage.ref();
        const recipesRef = storageRef.child("recipes");
        const recipeRef = recipesRef.child(recipe?.id || "");
        // Base64 formatted string
        recipeRef.putString(croppedImage, "data_url").then(() => {
          setImage(croppedImage);
          if (setShowImageUpload) {
            setShowImageUpload(false);
          }
        });
        firebase.firestore().collection("recipes").doc(recipe?.id).update({
          image: true,
        });

        // update image location
      } catch (e) {
        console.error(e);
      }
    },
    [recipe, setShowImageUpload, setImage]
  );

  if (!recipe) {
    return null;
  }

  const { name, description, ingredients, id, link } = recipe;

  return (
    <StyledWrapper>
      {image ? (
        <Image blurImage={image === "stock2.jpeg"} src={image || ""} />
      ) : (
        <ImagePlaceHolder>
          <StyledLocalLoader />
        </ImagePlaceHolder>
      )}
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
        {link && (
          <>
            <StyledEmpesizedP>
              {<a href={link}>Lenke til oppskrift</a>}
            </StyledEmpesizedP>
          </>
        )}
        <SeeIngredients ingredientsIds={ingredients} />
      </div>
      {showImageUpload && (
        <ImageCropper storeCroppedImage={storeCroppedImage} />
      )}
    </StyledWrapper>
  );
};
