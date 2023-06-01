import React, { useEffect, useState, useCallback } from "react";
import styled from "styled-components";
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
import LoadingPage from "./LoadingPage";

const ProfilePage = () => {
  const { user, isLoading } = useAuth0();
  const [favorites, setFavorites] = useState([]);

  const fetchFavorites = useCallback(async () => {
    try {
      const response = await axios.get(`/api/user/${user.email}/favorites`);
      if (response.status === 200) {
        setFavorites(response.data);
      } else {
        console.error("Error fetching favorites:", response.status);
      }
    } catch (error) {
      console.error("Error fetching favorites:", error);
    }
  }, [user.email]);

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  async function removeFavorite(recipeId) {
    try {
      const response = await axios.delete(
        `/api/user/${user.email}/favorites/${recipeId}`
      );
      if (response.status === 200) {
        setFavorites(
          favorites.filter((favorite) => favorite.recipeId !== recipeId)
        );
      } else {
        console.error("Error removing favorite:", response.status);
      }
    } catch (error) {
      console.error("Error removing favorite:", error);
    }
  }

  if (isLoading) {
    return <LoadingPage />;
  }

  return (
    <MainContainer>
      <ProfilePicture src={user.picture} alt="Profile" />
      <ProfileInfo>
        <h2>Username: {user.name}</h2>
        <p>Email: {user.email}</p>
      </ProfileInfo>
      <FavoritesContainer>
        <h3>Your Favorite Recipes:</h3>
        {favorites.length > 0 ? (
          <FavoriteList>
            {favorites.map(({ recipeId, title, image }) => (
              <FavoriteRecipe key={recipeId}>
                <RecipeImageContainer>
                  <RecipeImage src={image} alt={title} />
                </RecipeImageContainer>
                <RecipeDetails>
                  <RecipeTitle>{title}</RecipeTitle>
                  <RemoveButton onClick={() => removeFavorite(recipeId)}>
                    Remove
                  </RemoveButton>
                </RecipeDetails>
              </FavoriteRecipe>
            ))}
          </FavoriteList>
        ) : (
          <NoFavorites>No favorite recipes yet.</NoFavorites>
        )}
      </FavoritesContainer>
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

const ProfilePicture = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  margin-right: 10px;
`;

const ProfileInfo = styled.div`
  display: flex;
  flex-direction: column;
`;

const FavoritesContainer = styled.div`
  margin-top: 20px;
`;

const FavoriteList = styled.ul`
  list-style-type: none;
  padding: 0;
`;

const FavoriteRecipe = styled.li`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
`;

const RecipeImageContainer = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  border: 2px solid white;
  overflow: hidden;
`;

const RecipeImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const RecipeDetails = styled.div`
  display: flex;
  align-items: center;
  margin-left: 20px;
`;

const RecipeTitle = styled.p`
  margin-bottom: 0;
  font-size: 16px;
`;

const RemoveButton = styled.button`
  background-color: red;
  color: white;
  padding: 5px;
  font-size: 12px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-left: 10px;
`;

const NoFavorites = styled.p`
  margin-top: 10px;
`;

export default ProfilePage;
