import styled from "styled-components";
import { Event } from "../../types/Event";
import SignUpForm from "./SignUpForm";
import { useState } from "react";

interface EventDisplayProps {
  event: Event;
}
const EventDisplay = ({ event }: EventDisplayProps) => {
  const [showSignUpForm, setShowSignUpForm] = useState(false);
  return (
    <Container>
      <Header>{event.title}</Header>
      <SubHeader>{event.description}</SubHeader>
      <Button onClick={() => setShowSignUpForm(true)}>Sign up</Button>
      {showSignUpForm && <SignUpForm showSignUpModal={() => showSignUpForm} />}
    </Container>
  );
};
export default EventDisplay;

const Container = styled.div`
  width: 50%;
  display: flex;
  flex-direction: column;
`;
const Header = styled.h2``;
const SubHeader = styled.h3``;
const Button = styled.button``;
