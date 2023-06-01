import React from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";

const RecipeIcons = ({ isFavorite, handleFavorite }) => {
  return (
    <IconContainer onClick={handleFavorite}>
      <FontAwesomeIcon
        icon={faStar}
        size="2x"
        color={isFavorite ? "yellow" : "white"}
      />
    </IconContainer>
  );
};

const IconContainer = styled.div`
  cursor: pointer;
`;

export default RecipeIcons;
