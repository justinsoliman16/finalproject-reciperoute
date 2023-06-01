import React, { useEffect } from "react";
import styled from "styled-components";
import { NavLink as RouterNavLink } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import LoginButton from "./LoginButton";
import LogoutButton from "./LogoutButton";
import axios from "axios";

const Navbar = () => {
  const { isAuthenticated, user } = useAuth0();

  useEffect(() => {
    // Function to register user upon app load
    const registerUser = async () => {
      try {
        // Make a POST request to the registration endpoint
        await axios.post("/api/register", {
          email: user.email,
          name: user.name,
        });
        console.log("User registered successfully!");
      } catch (error) {
        console.error("Error registering user:", error);
      }
    };

    // Check if user is authenticated and register if true
    if (isAuthenticated && user) {
      registerUser();
    }
  }, [isAuthenticated, user]);

  return (
    <StyledNav>
      <NavLink to="/">Recipe Route</NavLink>
      <NavLinks>
        <NavLink to="/">Home</NavLink>
        {isAuthenticated ? (
          <>
            <NavLink to="/profile">Profile</NavLink>
            <WelcomeMessage>Welcome, {user.nickname}!</WelcomeMessage>
            <LogoutButton />
          </>
        ) : (
          <LoginButton />
        )}
      </NavLinks>
    </StyledNav>
  );
};

const StyledNav = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #3f704d;
  color: white;
  padding: 20px;
`;

const NavLinks = styled.div`
  display: flex;
  margin-left: auto;
`;

const NavLink = styled(RouterNavLink)`
  margin-right: 10px;
  color: white;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

const WelcomeMessage = styled.span`
  margin-right: 10px;
  font-weight: bold;
`;

export default Navbar;
