import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import MainPage from "./MainPage";
import RecipeDetailsPage from "./RecipeDetailsPage";
import Navbar from "./Navbar";
import ProfilePage from "./ProfilePage";
import { Auth0Provider } from "@auth0/auth0-react";

const App = () => {
  const apiKey = process.env.REACT_APP_SPOONACULAR_API_KEY;
  const domain = process.env.REACT_APP_AUTH0_DOMAIN;
  const clientId = process.env.REACT_APP_AUTH0_CLIENT_ID;

  console.log(process.env.REACT_APP_AUTH0_DOMAIN, "domain");

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
            element={<RecipeDetailsPage apiKey={apiKey} />}
          />
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
      </Router>
    </Auth0Provider>
  );
};

export default App;
