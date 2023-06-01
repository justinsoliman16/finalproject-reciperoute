import styled from "styled-components";

const LoadingPage = () => {
  return (
    <LoadingContainer>
      <LoadingText>Loading...</LoadingText>
    </LoadingContainer>
  );
};

const LoadingContainer = styled.div`
  background-color: #2e8b57;
  color: white;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const LoadingText = styled.h2`
  font-size: 36px;
`;

export default LoadingPage;
