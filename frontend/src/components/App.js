// App.js
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Auth0Provider } from "@auth0/auth0-react";
import MainPage from "./MainPage";
import RecipeDetailsPage from "./RecipeDetailsPage";
import Navbar from "./Navbar";

const App = () => {
  const apiKey = process.env.REACT_APP_SPOONACULAR_API_KEY;

  return (
    <Auth0Provider
      domain={process.env.REACT_APP_AUTH0_DOMAIN}
      clientId={process.env.REACT_APP_AUTH0_CLIENT_ID}
      redirectUri={window.location.origin}
    >
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route
            path="/recipes/:recipeId"
            element={<RecipeDetailsPage apiKey={apiKey} />} // Pass the apiKey prop here
          />
        </Routes>
      </Router>
    </Auth0Provider>
  );
};

export default App;
