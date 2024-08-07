import styled from "styled-components";
import { EventWithPlayers, Player } from "../../types/types";
import SignUpForm from "./SignUpForm";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { useUser } from "../../contexts/UserContext";

interface EventDisplayProps {
  event: EventWithPlayers;
}
const EventDisplay = ({ event }: EventDisplayProps) => {
  const [showSignUpForm, setShowSignUpForm] = useState(false);
  const [whiteTeam, setWhiteTeam] = useState<Player[]>();
  const [blackTeam, setBlackTeam] = useState<Player[]>();
  const { user } = useUser();
  console.log("Eventdisplay", event);
  useEffect(() => {
    const setPlayersInTeams = () => {
      const whiteTeamPlayers: Player[] = [];
      const blackTeamPlayers: Player[] = [];
      event.players?.map((p: Player) => {
        if (p.team === "white") whiteTeamPlayers.push(p);
        if (p.team === "black") blackTeamPlayers.push(p);
      });
      setWhiteTeam(whiteTeamPlayers);
      setBlackTeam(blackTeamPlayers);
    };
    setPlayersInTeams();
  }, [event]);

  const isPlayerSignedUp = () => {
    if (user?.id) {
      const player = event.players.find((p: Player) => p.id === user.id);
      if (player) return true;
      return false;
    }
    return false;
  };

  return (
    <Container>
      <Header>{event.title}</Header>
      <SubHeader>
        {format(event.start, "HH:mm d/M")} - {format(event.end, "HH:mm d/M")}
      </SubHeader>
      <InfoText>{event.description}</InfoText>
      <InfoText>{event.location}</InfoText>
      <InfoText>Type: {event.type}</InfoText>
      <InfoText>Cost: {event.price}</InfoText>
      <InfoText>Contact person: {event.contact}</InfoText>
      <InfoText>
        Spots left:{" "}
        {event.players?.length
          ? event.maxParticipants - event.players.length
          : event.maxParticipants}
      </InfoText>
      <SubHeader>Rosters:</SubHeader>
      <Teams>
        <WhiteTeamContainer>
          White team
          {whiteTeam?.map((p: Player) => {
            return (
              <InfoText>
                {p.position}, {p.name}
              </InfoText>
            );
          })}
        </WhiteTeamContainer>
        <BlackTeamContainer>
          Black team
          {blackTeam?.map((p: Player) => {
            return (
              <InfoText>
                {p.position}, {p.name}
              </InfoText>
            );
          })}
        </BlackTeamContainer>
      </Teams>
      {!showSignUpForm && (
        <Button onClick={() => setShowSignUpForm(true)}>
          {isPlayerSignedUp() ? "Update" : "Sign up"}
        </Button>
      )}
      {showSignUpForm && (
        <SignUpForm
          showSignUpModal={setShowSignUpForm}
          eventId={event.id}
          eventTitle={event.title}
          amount={event.price}
          playerIsSignedUp={isPlayerSignedUp()}
        />
      )}
    </Container>
  );
};
export default EventDisplay;

const Container = styled.div`
  padding: 10px;
  display: flex;
  flex-direction: column;
`;
const Teams = styled.div`
  padding: 10px;
  display: flex;
  flex-direction: row;
`;
const WhiteTeamContainer = styled.div`
  padding: 10px;
  display: flex;
  flex-direction: column;
`;
const BlackTeamContainer = styled.div`
  padding: 10px;
  display: flex;
  flex-direction: column;
`;
const Header = styled.h2``;
const SubHeader = styled.h3``;
const InfoText = styled.p``;
const Button = styled.button``;
