require("dotenv").config();
const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");
const { MONGO_URI } = process.env;
const morgan = require("morgan");

const app = express();
const port = 8000;

app.use(express.json());
app.use(morgan("tiny"));

// MongoDB connection setup
const client = new MongoClient(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Handle POST request for user registration
app.post("/api/register", async (req, res) => {
  const { email, name } = req.body;

  try {
    await client.connect();

    const usersCollection = client.db("RecipeRoute").collection("users");

    const existingUser = await usersCollection.findOne({ email });

    if (existingUser) {
      res.sendStatus(200);
    } else {
      await usersCollection.insertOne(
        { email, name, favorites: [], comments: [] },
        (err, result) => {
          if (err) {
            console.error("Error creating new user:", err);
            res.sendStatus(500);
          } else {
            console.log("New user created successfully");
            res.sendStatus(200);
          }
        }
      );
    }
  } catch (error) {
    console.error("Error checking for existing user:", error);
    res.sendStatus(500);
  }
});

// Handle POST request to add a favorite recipe
app.post("/api/user/:userId/favorites", async (req, res) => {
  const { recipeId, title, image } = req.body;
  const { userId } = req.params;

  try {
    await client.connect();

    const usersCollection = client.db("RecipeRoute").collection("users");

    const addToFavorite = await usersCollection.updateOne(
      { email: userId },
      { $push: { favorites: { recipeId, title, image, comments: [] } } }
    );

    if (addToFavorite.modifiedCount === 1) {
      console.log("Recipe added to favorites successfully");
      res.sendStatus(200);
    } else {
      console.error("Error adding favorite recipe");
      res.sendStatus(500);
    }
  } catch (error) {
    console.error("Error adding favorite recipe:", error);
    res.sendStatus(500);
  }
});

// Handle DELETE request to remove a favorite recipe
app.delete("/api/user/:userId/favorites/:recipeId", async (req, res) => {
  const { userId, recipeId } = req.params;

  try {
    await client.connect();

    const usersCollection = client.db("RecipeRoute").collection("users");

    const removeFromFavorites = await usersCollection.updateOne(
      { email: userId },
      { $pull: { favorites: { recipeId } } }
    );

    if (removeFromFavorites.modifiedCount === 1) {
      console.log("Recipe removed from favorites successfully");
      res.sendStatus(200);
    } else {
      console.error("Error removing favorite recipe");
      res.sendStatus(500);
    }
  } catch (error) {
    console.error("Error removing favorite recipe:", error);
    res.sendStatus(500);
  }
});

// Handle GET request to fetch a user's favorite recipes
app.get("/api/user/:userId/favorites", async (req, res) => {
  const { userId } = req.params;

  try {
    await client.connect();

    const usersCollection = client.db("RecipeRoute").collection("users");

    const user = await usersCollection.findOne({ email: userId });

    if (user) {
      res.json(user.favorites);
    } else {
      res.sendStatus(404);
    }
  } catch (error) {
    console.error("Error fetching user's favorites:", error);
    res.sendStatus(500);
  }
});

// Handle POST request to add a comment to a recipe
app.post("/api/recipes/:recipeId/comments", async (req, res) => {
  const { recipeId } = req.params;
  const { email, content } = req.body;

  try {
    await client.connect();

    const commentsCollection = client.db("RecipeRoute").collection("comments");

    const comment = {
      recipeId: recipeId,
      userId: email,
      username: email,
      content: content,
      timestamp: new Date().toISOString(),
    };

    const result = await commentsCollection.insertOne(comment);

    if (result.insertedCount === 1) {
      console.log("Comment added successfully");
      res.sendStatus(200);
    } else {
      console.error("Error adding comment");
      res.sendStatus(500);
    }
  } catch (error) {
    console.error("Error adding comment:", error);
    res.sendStatus(500);
  }
});

// Handle GET request to fetch comments for a recipe
app.get("/api/recipes/:recipeId/comments", async (req, res) => {
  const { recipeId } = req.params;

  try {
    await client.connect();

    const commentsCollection = client.db("RecipeRoute").collection("comments");

    const comments = await commentsCollection
      .find({ recipeId: recipeId })
      .toArray();

    res.json(comments);
  } catch (error) {
    console.error("Error fetching comments:", error);
    res.sendStatus(500);
  }
});

// Handle DELETE request to remove a comment
app.delete("/api/recipes/:recipeId/comments/:commentId", async (req, res) => {
  const { recipeId, commentId } = req.params;

  try {
    await client.connect();

    const commentsCollection = client.db("RecipeRoute").collection("comments");

    const removeComment = await commentsCollection.updateOne(
      { recipeId: recipeId },
      { $pull: { comments: { _id: new ObjectId(commentId) } } }
    );

    if (removeComment.modifiedCount === 1) {
      console.log("Comment removed successfully");
      res.sendStatus(200);
    } else {
      console.error("Error removing comment");
      res.sendStatus(500);
    }
  } catch (error) {
    console.error("Error removing comment:", error);
    res.sendStatus(500);
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
