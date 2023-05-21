import React, { useState } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { handleSearch, handlePreviousPage, handleNextPage } from "./Handlers";

const MainPage = () => {
  const [keyword, setKeyword] = useState("");
  const [recipes, setRecipes] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const handleSearchClick = () => {
    handleSearch(keyword, currentPage, setRecipes, setTotalPages);
  };

  const handlePreviousPageClick = () => {
    if (currentPage > 1) {
      const newPage = currentPage - 1;
      setCurrentPage(newPage);
      handleSearch(keyword, newPage, setRecipes, setTotalPages);
    }
  };

  const handleNextPageClick = () => {
    if (currentPage < totalPages) {
      const newPage = currentPage + 1;
      setCurrentPage(newPage);
      handleSearch(keyword, newPage, setRecipes, setTotalPages);
    }
  };

  const handleRecipeClick = (recipeId) => {
    // Implement the logic to navigate or display more information about the recipe
    console.log(`Clicked on recipe with ID ${recipeId}`);
  };

  return (
    <MainContainer>
      <HeaderText>Recipe Route</HeaderText>
      <SubText>Type in keyword(s) to find matching recipes!</SubText>
      <SearchBarContainer>
        <SearchInput
          type="text"
          placeholder="Search recipes..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
        <SearchButton onClick={handleSearchClick}>Search</SearchButton>
      </SearchBarContainer>
      <RecipeResults>
        <RecipeCardContainer>
          {recipes.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              onClick={() => handleRecipeClick(recipe.id)}
            >
              <Link to={`/recipes/${recipe.id}`}>
                <img src={recipe.image} alt={recipe.title} />
                <RecipeTitle>{recipe.title}</RecipeTitle>
                {/* Display other recipe details */}
              </Link>
            </RecipeCard>
          ))}
        </RecipeCardContainer>
      </RecipeResults>
      <Pagination>
        <PageButton
          onClick={handlePreviousPageClick}
          disabled={currentPage === 1}
        >
          Previous
        </PageButton>
        <PageNumber>{currentPage}</PageNumber>
        <PageButton
          onClick={handleNextPageClick}
          disabled={currentPage === totalPages}
        >
          Next
        </PageButton>
      </Pagination>
    </MainContainer>
  );
};

const MainContainer = styled.div`
  background-color: #2e8b57;
  color: white;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  text-align: center;
  padding-top: 20px;
`;

const HeaderText = styled.h1`
  font-size: 36px;
  margin-bottom: 20px;
`;

const SubText = styled.p`
  font-size: 18px;
  margin-bottom: 40px;
`;

const SearchBarContainer = styled.div`
  margin-top: 20px;
`;

const SearchInput = styled.input`
  padding: 12px;
  width: 400px;
  border-radius: 5px;
  border: none;
  margin-right: 10px;
`;

const SearchButton = styled.button`
  padding: 12px 20px;
  background-color: #3f704d;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
`;

const RecipeResults = styled.div`
  margin-top: 40px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
`;

const RecipeCardContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 20px;
`;

const RecipeCard = styled.div`
  position: relative;
  background-color: #fff;
  color: #333;
  padding: 20px;
  border-radius: 5px;
  margin-bottom: 10px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #f5f5f5;
  }

  img {
    width: 100%;
    height: 200px; /* Adjust the height as needed */
    object-fit: cover;
    border-radius: 5px;
  }
`;

const RecipeTitle = styled.h3`
  font-size: 18px;
  margin-bottom: 10px;
  color: black;
  text-decoration: none;
`;

const Pagination = styled.div`
  margin-top: 20px;
  display: flex;
  align-items: center;
`;

const PageButton = styled.button`
  padding: 8px 14px;
  background-color: #3f704d;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-right: 10px;
  width: 100px;
`;

const PageNumber = styled.span`
  font-size: 16px;
  margin-right: 10px;
  width: 30px;
`;

export default MainPage;
