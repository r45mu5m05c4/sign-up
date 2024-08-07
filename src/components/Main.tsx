import styled from "styled-components";
import Calendar from "./Calendar/Calendar";
import { useState } from "react";
import { EventWithPlayers } from "../types/types";
import EventDisplay from "./Event/EventDisplay";
import { LoginModal } from "./Login/LoginModal";

const Main = () => {
  const [currentEvent, setCurrentEvent] = useState<
    EventWithPlayers | undefined
  >();

  return (
    <Container>
      <HeaderBar>
        <HeaderImage
          src="src/assets/Tortugas_for dark backgrounds.svg"
          alt="Folkets Puck"
        />
        <Header>Tortugas Ice Times</Header>
        <LoginModal />
      </HeaderBar>
      <Content>
        <LeftHalf>
          <Calendar setCurrentEvent={setCurrentEvent} />
        </LeftHalf>
        <RightHalf>
          {currentEvent && <EventDisplay event={currentEvent} />}
        </RightHalf>
      </Content>
    </Container>
  );
};
export default Main;

const HeaderImage = styled.img`
  height: 100px;
  width: 100px;
`;
const Container = styled.div`
  display: flex;
  flex-direction: column;
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;
const LeftHalf = styled.div`
  width: 50%;
  display: flex;
  flex-direction: column;
  @media (max-width: 768px) {
    width: 100%;
  }
`;
const RightHalf = styled.div`
  width: 50%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  @media (max-width: 768px) {
    width: 100%;
  }
`;
const Content = styled.div`
  display: flex;
  flex-direction: row;
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;
const HeaderBar = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 54px;
  border-bottom: 1px solid;
  margin-bottom: 10px;
  @media (max-width: 768px) {
  }
`;
const Header = styled.h2`
  color: #15ba83;
`;
