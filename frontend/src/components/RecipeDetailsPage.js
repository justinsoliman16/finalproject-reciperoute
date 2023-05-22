import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import styled from "styled-components";
import { useAuth0 } from "@auth0/auth0-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar as emptyStar } from "@fortawesome/free-regular-svg-icons";
import { faStar as filledStar } from "@fortawesome/free-solid-svg-icons";

const RecipeDetailsPage = ({ apiKey }) => {
  const { recipeId } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [selectedSection, setSelectedSection] = useState(null);
  const [nutritionInfo, setNutritionInfo] = useState(null);
  const { isAuthenticated } = useAuth0();
  const [isFavorite, setIsFavorite] = useState(false);

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

  useEffect(() => {
    // Simulating favorite state retrieval from backend
    const fetchFavoriteState = async () => {
      try {
        // Make an API call to retrieve the favorite state for the current user and recipeId
        // Replace the API call with your backend implementation
        const response = await fetch(`/api/favorites/${recipeId}`);
        const data = await response.json();
        setIsFavorite(data.isFavorite);
      } catch (error) {
        console.error("Error fetching favorite state:", error);
      }
    };

    if (isAuthenticated) {
      fetchFavoriteState();
    }
  }, [isAuthenticated, recipeId]);

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

  const handleFavoriteClick = () => {
    if (isAuthenticated) {
      // Update the favorite state in the backend
      // Replace the API call with your backend implementation
      fetch(`/api/favorites/${recipeId}`, {
        method: isFavorite ? "DELETE" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          recipeId: recipeId,
          isFavorite: !isFavorite,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          setIsFavorite(data.isFavorite);
        })
        .catch((error) => {
          console.error("Error updating favorite state:", error);
        });
    }
  };

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
      <FavoriteButton onClick={handleFavoriteClick} isFavorite={isFavorite}>
        <FontAwesomeIcon icon={isFavorite ? filledStar : emptyStar} />
      </FavoriteButton>
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

const FavoriteButton = styled.button`
  background-color: transparent;
  border: none;
  cursor: pointer;
  color: white;
  font-size: 24px;
  margin-bottom: 10px;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:focus {
    outline: none;
  }

  svg {
    color: ${(props) => (props.isFavorite ? "#ffc107" : "white")};
  }
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
