import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import styled from "styled-components";
import { useAuth0 } from "@auth0/auth0-react";
import LoadingPage from "./LoadingPage";
import IngredientsList from "./IngredientsList";
import TextContainer from "./TextContainer";
import RecipeIcons from "./RecipeIcons";
import Instructions from "./Instructions";
import axios from "axios";

const RecipeDetailsPage = () => {
  const { recipeId } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const { isAuthenticated, user } = useAuth0();

  const [isFavorite, setIsFavorite] = useState(false);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const fetchRecipeDetails = async () => {
      try {
        const response = await axios.get(
          `https://api.spoonacular.com/recipes/${recipeId}/information?apiKey=${process.env.REACT_APP_SPOONACULAR_API_KEY}`
        );
        setRecipe(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching recipe details:", error);
      }
    };
    fetchRecipeDetails();
  }, [recipeId]);

  useEffect(() => {
    const fetchFavoriteStatus = async () => {
      if (isAuthenticated) {
        try {
          const response = await axios.get(`/api/user/${user.email}/favorites`);
          const favorites = response.data;
          if (favorites.some((fav) => fav.recipeId === recipeId)) {
            setIsFavorite(true);
          }
        } catch (error) {
          console.error("Error fetching favorite status:", error);
        }
      }
    };

    fetchFavoriteStatus();
  }, [isAuthenticated, recipeId, user.email]);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axios.get(`/api/recipes/${recipeId}/comments`);
        setComments(response.data);
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };

    fetchComments();
  }, [recipeId]);

  const handleFavorite = async () => {
    if (isAuthenticated) {
      try {
        if (isFavorite) {
          await axios.delete(`/api/user/${user.email}/favorites/${recipeId}`);
          console.log("Recipe removed from favorites!");
        } else {
          await axios.post(`/api/user/${user.email}/favorites`, {
            recipeId: recipeId,
            title: recipe?.title,
            image: recipe?.image,
          });
          console.log("Recipe added to favorites!");
        }
        setIsFavorite((prevIsFavorite) => !prevIsFavorite);
      } catch (error) {
        console.error("Error updating favorite status:", error);
      }
    } else {
      console.log("Please log in to favorite the recipe.");
    }
  };

  const handleCommentChange = (event) => {
    setComment(event.target.value);
  };

  const handleCommentSubmit = async (event) => {
    event.preventDefault();

    if (!comment) {
      console.log("Please enter a comment.");
      return;
    }

    try {
      console.log("Submitting comment:", comment);

      await axios.post(`/api/recipes/${recipeId}/comments`, {
        email: user.email,
        content: comment,
      });

      console.log("Comment submitted successfully!");

      // Clear comment input field
      setComment("");

      // Fetch updated comments
      const updatedComments = await axios.get(
        `/api/recipes/${recipeId}/comments`
      );
      setComments(updatedComments.data);
    } catch (error) {
      console.error("Error submitting comment:", error);
    }
  };

  const handleCommentDelete = async (commentId) => {
    try {
      await axios.delete(`/api/recipes/${recipeId}/comments/${commentId}`);
      console.log("Comment deleted successfully!");

      // Fetch updated comments
      const updatedComments = await axios.get(
        `/api/recipes/${recipeId}/comments`
      );
      setComments(updatedComments.data);
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  const handleCommentEdit = (commentId) => {
    const updatedComments = comments.map((c) => {
      if (c._id === commentId) {
        return { ...c, isEditing: true, updatedContent: c.content };
      } else {
        return c;
      }
    });
    setComments(updatedComments);
  };

  const handleCommentUpdate = async (commentId, updatedContent) => {
    try {
      await axios.put(`/api/recipes/${recipeId}/comments/${commentId}`, {
        content: updatedContent,
      });
      console.log("Comment updated successfully!");

      // Fetch updated comments
      const updatedComments = await axios.get(
        `/api/recipes/${recipeId}/comments`
      );
      setComments(updatedComments.data);
    } catch (error) {
      console.error("Error updating comment:", error);
    }
  };

  const handleCommentCancel = (commentId) => {
    const updatedComments = comments.map((c) => {
      if (c._id === commentId) {
        return { ...c, isEditing: false, updatedContent: "" };
      } else {
        return c;
      }
    });
    setComments(updatedComments);
  };

  return (
    <Container>
      <RecipeTitle>{recipe?.title}</RecipeTitle>
      <RecipeIcons isFavorite={isFavorite} handleFavorite={handleFavorite} />
      <ContentContainer>
        <TextContainer>
          <SummaryTitle>Summary</SummaryTitle>
          <RecipeSummary
            dangerouslySetInnerHTML={{ __html: recipe?.summary }}
          />
          <IngredientsList ingredients={recipe?.extendedIngredients} />
        </TextContainer>
        <RecipeImageContainer>
          <RecipeImage src={recipe?.image} alt={recipe?.title} />
        </RecipeImageContainer>
      </ContentContainer>
      <Instructions instructions={recipe?.instructions} />
      <CommentSection>
        <CommentForm onSubmit={handleCommentSubmit}>
          <CommentInput
            type="text"
            placeholder="Leave a comment..."
            value={comment}
            onChange={handleCommentChange}
          />
          <CommentButton type="submit">Submit</CommentButton>
        </CommentForm>
        {comments.length > 0 ? (
          <CommentList>
            {comments.map(
              ({ _id, username, content, timestamp, isEditing }) => {
                const updatedContent = comments.find(
                  (c) => c._id === _id
                )?.updatedContent;
                return (
                  <CommentItem key={_id}>
                    <CommentUser>{username}:</CommentUser>
                    {isEditing ? (
                      <>
                        <CommentEditInput
                          type="text"
                          value={updatedContent}
                          onChange={(event) => {
                            const updatedComments = comments.map((c) => {
                              if (c._id === _id) {
                                return {
                                  ...c,
                                  updatedContent: event.target.value,
                                };
                              } else {
                                return c;
                              }
                            });
                            setComments(updatedComments);
                          }}
                        />
                        <CommentUpdateButton
                          onClick={() =>
                            handleCommentUpdate(_id, updatedContent)
                          }
                        >
                          Update
                        </CommentUpdateButton>
                        <CommentCancelButton
                          onClick={() => handleCommentCancel(_id)}
                        >
                          Cancel
                        </CommentCancelButton>
                      </>
                    ) : (
                      <>
                        <CommentContent>{content}</CommentContent>
                        <CommentTimestamp>{timestamp}</CommentTimestamp>
                        {user?.email === username && (
                          <>
                            <CommentEditButton
                              onClick={() => handleCommentEdit(_id)}
                            >
                              Edit
                            </CommentEditButton>
                            <CommentDeleteButton
                              onClick={() => handleCommentDelete(_id)}
                            >
                              Delete
                            </CommentDeleteButton>
                          </>
                        )}
                      </>
                    )}
                  </CommentItem>
                );
              }
            )}
          </CommentList>
        ) : (
          <NoComments>No comments yet.</NoComments>
        )}
      </CommentSection>
      <BackButton to="/">Back</BackButton>
    </Container>
  );
};

// Rest of the code...

const RecipeImageContainer = styled.div`
  width: 800px;
  height: 500px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: -30%;
`;

const RecipeSummary = styled.p`
  font-size: 23px;
  margin-bottom: 30px;
  margin-top: 5%;
`;

const SummaryTitle = styled.h2`
  margin-bottom: 20px;
  margin-top: 10%;
  font-size: 37px;
  border-bottom: 1px solid white;
  padding-bottom: 10px;
`;

const Container = styled.div`
  background-color: #2e8b57;
  color: white;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding: 20px 0;
`;

const ContentContainer = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  width: 90%;
`;

const RecipeTitle = styled.h1`
  font-size: 48px;
  text-align: left;
  flex: 1;
  margin-bottom: 20px;
`;

const RecipeImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 5px;
`;

const BackButton = styled(Link)`
  padding: 12px 20px;
  background-color: #3f704d;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-bottom: 3%;
  text-decoration: none;
`;

const CommentSection = styled.div`
  margin-top: 20px;
  width: 60%;
`;

const CommentForm = styled.form`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
`;

const CommentInput = styled.input`
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 5px;
  flex: 1;
  margin-right: 10px;
`;

const CommentButton = styled.button`
  padding: 8px 20px;
  background-color: #3f704d;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
`;

const CommentList = styled.ul`
  list-style: none;
  padding: 0;
`;

const CommentItem = styled.li`
  background-color: #f8f8f8;
  padding: 10px;
  border-radius: 5px;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
`;

const CommentUser = styled.span`
  font-weight: bold;
  margin-right: 10px;
  color: black;
`;

const CommentContent = styled.span`
  flex: 1;
  color: black;
`;

const CommentTimestamp = styled.span`
  margin-right: 10px;
  color: black;
`;

const CommentEditButton = styled.button`
  padding: 4px 10px;
  background-color: #3f704d;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-right: 5px;
`;

const CommentDeleteButton = styled.button`
  padding: 4px 10px;
  background-color: #d9534f;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-left: 5px;
`;

const CommentEditInput = styled.input`
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 5px;
  flex: 1;
  margin-right: 10px;
`;

const CommentUpdateButton = styled.button`
  padding: 4px 10px;
  background-color: #3f704d;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-right: 5px;
`;

const CommentCancelButton = styled.button`
  padding: 4px 10px;
  background-color: #d9534f;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-left: 5px;
`;

const NoComments = styled.p`
  margin-top: 10px;
`;

export default RecipeDetailsPage;
