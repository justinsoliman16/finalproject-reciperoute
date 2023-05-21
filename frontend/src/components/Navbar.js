import React from "react";
import styled from "styled-components";
import LoginButton from "./LoginButton";
import LogoutButton from "./LogoutButton";

const Navbar = () => {
  return (
    <StyledNav>
      <NavLink href="/">Recipe Route</NavLink>
      <NavLinks>
        <NavLink href="/">Home</NavLink>
        <NavLink href="/categories">Categories</NavLink>
        <NavLink href="/profile">Profile</NavLink>
        <LoginButton />
        <LogoutButton />
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

const NavLink = styled.a`
  margin-right: 10px;
  color: white;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

export default Navbar;
