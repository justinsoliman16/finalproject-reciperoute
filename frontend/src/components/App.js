import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Auth0Provider, withAuthenticationRequired } from "@auth0/auth0-react";
import MainPage from "./MainPage";
import RecipeDetailsPage from "./RecipeDetailsPage";
import Navbar from "./Navbar";
import ProfilePage from "./ProfilePage";

// Wrap the ProfilePage component with withAuthenticationRequired
const ProtectedProfilePage = withAuthenticationRequired(ProfilePage);

const App = () => {
  const apiKey = process.env.REACT_APP_SPOONACULAR_API_KEY;
  const auth0Domain = process.env.REACT_APP_AUTH0_DOMAIN;
  const auth0ClientId = process.env.REACT_APP_AUTH0_CLIENT_ID;

  return (
    <Auth0Provider
      domain={auth0Domain}
      clientId={auth0ClientId}
      redirectUri={window.location.origin}
      // Specify the authorizationParams prop with the redirect_uri
      authorizationParams={{
        redirect_uri: window.location.origin,
      }}
    >
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route
            path="/recipes/:recipeId"
            element={<RecipeDetailsPage apiKey={apiKey} />}
          />
          <Route path="/profile" element={<ProtectedProfilePage />} />
        </Routes>
      </Router>
    </Auth0Provider>
  );
};

export default App;
