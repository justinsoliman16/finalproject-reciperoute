import React from "react";
import styled from "styled-components";
import LoginButton from "./LoginButton";
import LogoutButton from "./LogoutButton";
import { NavLink as RouterNavLink } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";

const Navbar = () => {
  const { isAuthenticated, user } = useAuth0();

  // Added console.log() statements for testing on navbar
  //console.log("Authentication status:", isAuthenticated);
  //console.log("User data:", user);

  return (
    <StyledNav>
      <NavLink to="/">Recipe Route</NavLink>
      <NavLinks>
        <NavLink to="/">Home</NavLink>
        <NavLink to="/profile">Profile</NavLink>
        {isAuthenticated ? (
          <>
            <WelcomeMessage>Welcome, {user.nickname}!</WelcomeMessage>
            {user.picture && (
              <ProfilePicture src={user.picture} alt="Profile" />
            )}
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
  padding: 10px;
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

const ProfilePicture = styled.img`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  margin-right: 10px;
`;

export default Navbar;
