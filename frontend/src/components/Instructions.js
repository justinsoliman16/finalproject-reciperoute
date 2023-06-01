import React from "react";
import styled from "styled-components";

const Instructions = ({ instructions }) => {
  return (
    <InstructionsContainer>
      <InstructionsTitle>Instructions</InstructionsTitle>
      <RecipeInstructions dangerouslySetInnerHTML={{ __html: instructions }} />
    </InstructionsContainer>
  );
};

const InstructionsContainer = styled.div`
  padding: 10px;
  margin: 4%;
  margin-top: -7%;
`;

const InstructionsTitle = styled.h2`
  margin-bottom: 10px;
  font-size: 37px;
  margin-top: 10%;
  border-bottom: 1px solid white;
  padding-bottom: 10px;
`;

const RecipeInstructions = styled.div`
  font-size: 23px;
`;

export default Instructions;
