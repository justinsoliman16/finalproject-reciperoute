import React from "react";
import styled from "styled-components";

const IngredientsList = ({ ingredients }) => {
  return (
    <IngredientsContainer>
      <IngredientsTitle>Ingredients</IngredientsTitle>
      {ingredients.map((ingredient, index) => (
        <Ingredient key={index}>
          {ingredient.amount} {ingredient.unit} - {ingredient.name}
        </Ingredient>
      ))}
    </IngredientsContainer>
  );
};

const IngredientsContainer = styled.div``;

const IngredientsTitle = styled.h2`
  margin-bottom: 10px;
  font-size: 37px;
  margin-top: 10%;
  border-bottom: 1px solid white;
  padding-bottom: 10px;
`;

const Ingredient = styled.p`
  font-size: 23px;
`;

export default IngredientsList;
