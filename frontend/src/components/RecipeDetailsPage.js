import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import styled from "styled-components";

const RecipeDetailsPage = ({ apiKey }) => {
  console.log(apiKey);
  const { recipeId } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [selectedSection, setSelectedSection] = useState(null);
  const [nutritionInfo, setNutritionInfo] = useState(null);

  useEffect(() => {
    const fetchRecipeDetails = async () => {
      try {
        const response = await fetch(
          `https://api.spoonacular.com/recipes/${recipeId}/information?apiKey=${apiKey}`
        );
        const data = await response.json();
        setRecipe(data);
      } catch (error) {
        console.error("Error fetching recipe details:", error);
      }
    };

    fetchRecipeDetails();
  }, [recipeId, apiKey]);

  const handleSectionClick = (section) => {
    setSelectedSection(section);
  };

  const fetchNutritionInfo = async () => {
    try {
      const response = await fetch(
        `https://api.spoonacular.com/recipes/${recipeId}/nutritionWidget.json?apiKey=${apiKey}`
      );
      const data = await response.json();
      setNutritionInfo(data);
    } catch (error) {
      console.error("Error fetching nutrition information:", error);
    }
  };

  useEffect(() => {
    if (selectedSection === "nutrition") {
      fetchNutritionInfo();
    }
  }, [selectedSection, recipeId, apiKey]);

  if (!recipe) {
    return <div>Loading...</div>;
  }

  const { title, image, summary, analyzedInstructions } = recipe;

  const parseHTMLString = (htmlString) => {
    const parser = new DOMParser();
    const parsedDOM = parser.parseFromString(htmlString, "text/html");
    return parsedDOM.body.textContent || "";
  };

  const formattedSummary = parseHTMLString(summary);

  return (
    <Container>
      <HeaderText>Recipe Details</HeaderText>
      <RecipeTitle>{title}</RecipeTitle>
      <RecipeImage src={image} alt={title} />
      <ButtonsContainer>
        <SummaryButton
          onClick={() => handleSectionClick("summary")}
          isActive={selectedSection === "summary"}
        >
          Summary
        </SummaryButton>
        <SummaryButton
          onClick={() => handleSectionClick("instructions")}
          isActive={selectedSection === "instructions"}
        >
          Instructions
        </SummaryButton>
        <SummaryButton
          onClick={() => handleSectionClick("nutrition")}
          isActive={selectedSection === "nutrition"}
        >
          Nutrition
        </SummaryButton>
      </ButtonsContainer>
      <ContentContainer>
        {selectedSection === "summary" && (
          <>
            <ContentTitle>Summary:</ContentTitle>
            <CenteredText>{formattedSummary}</CenteredText>
          </>
        )}
        {selectedSection === "instructions" && (
          <>
            <ContentTitle>Instructions:</ContentTitle>
            <InstructionsList>
              {analyzedInstructions &&
                analyzedInstructions[0].steps.map((step) => (
                  <InstructionStep key={step.number}>
                    <StepNumber>{step.number}.</StepNumber> {step.step}
                  </InstructionStep>
                ))}
            </InstructionsList>
          </>
        )}
        {selectedSection === "nutrition" && nutritionInfo && (
          <>
            <ContentTitle>Nutritional Information:</ContentTitle>
            <NutritionalInfo>
              <InfoItem>
                <InfoLabel>Calories:</InfoLabel>
                <InfoValue>{nutritionInfo.calories}</InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>Protein:</InfoLabel>
                <InfoValue>{nutritionInfo.protein}</InfoValue>
              </InfoItem>
              <InfoItem>
                <InfoLabel>Fat:</InfoLabel>
                <InfoValue>{nutritionInfo.fat}</InfoValue>
              </InfoItem>
              {/* if spoontacular isn't heavy at this point add more details */}
            </NutritionalInfo>
          </>
        )}
      </ContentContainer>
      <BackButton to="/">Back</BackButton>
    </Container>
  );
};

const Container = styled.div`
  background-color: #2e8b57;
  color: white;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const HeaderText = styled.h2`
  font-size: 36px;
  margin-bottom: 20px;
`;

const RecipeTitle = styled.h3`
  font-size: 24px;
  margin-bottom: 30px;
`;

const RecipeImage = styled.img`
  width: 300px;
  height: 200px;
  object-fit: cover;
  border-radius: 5px;
  margin-bottom: 20px;
`;

const ButtonsContainer = styled.div`
  display: flex;
  justify-content: center;
`;

const SummaryButton = styled.button`
  padding: 8px 14px;
  background-color: ${(props) => (props.isActive ? "#3f704d" : "#3f704d")};
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-right: 10px;
  transition: background-color 0.3s ease-in-out;

  &:hover {
    background-color: #3f704d;
    border: white 1px solid;
  }
`;

const ContentContainer = styled.div`
  width: 30%;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
`;

const ContentTitle = styled.h4`
  font-size: 20px;
  margin-bottom: 10px;
`;

const CenteredText = styled.div`
  font-size: 18px;
  margin-bottom: 20px;
`;

const InstructionsList = styled.ul`
  list-style-type: none;
  padding: 0;
  margin: 0;
`;

const InstructionStep = styled.li`
  margin-bottom: 10px;
`;

const StepNumber = styled.span`
  font-weight: bold;
  margin-right: 5px;
`;

const NutritionalInfo = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const InfoItem = styled.div`
  margin-bottom: 10px;
`;

const InfoLabel = styled.span`
  font-weight: bold;
`;

const InfoValue = styled.span`
  margin-left: 5px;
`;

const BackButton = styled(Link)`
  padding: 12px 20px;
  background-color: #3f704d;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 10px;
  text-decoration: none;
`;

export default RecipeDetailsPage;
