import React from "react";
import styled from "styled-components";
import { useAuth0 } from "@auth0/auth0-react";

const ProfilePage = () => {
  const { user, isAuthenticated, isLoading } = useAuth0();

  if (isLoading) {
    return <div>Loading...</div>; // Shows loading state while authentication is in progress
  }

  if (!isAuthenticated) {
    return <div>Please log in</div>; // This will be shown if the user is not authenticated
  }

  return (
    <Container>
      <ProfilePicture src={user.picture} alt="Profile" />
      <ProfileInfo>
        <h2>{user.name}</h2>
        <p>Email: {user.email}</p>
      </ProfileInfo>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  align-items: center;
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

export default ProfilePage;
