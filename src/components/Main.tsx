import styled from "styled-components";
import Calendar from "./Calendar";
import { useState } from "react";
import { Event } from "../types/Event";
import EventDisplay from "./Event/EventDisplay";

const Main = () => {
  const [currentEvent, setCurrentEvent] = useState<Event>();

  return (
    <Container>
      <Calendar setCurrentEvent={() => setCurrentEvent} />
      {currentEvent && <EventDisplay event={currentEvent} />}
    </Container>
  );
};
export default Main;

const Container = styled.div`
  display: flex;
  flex-direction: row;
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;
