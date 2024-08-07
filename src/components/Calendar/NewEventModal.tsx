import React, { useState } from "react";
import { Event } from "../../types/types";
import { saveEventToDatabase } from "./EventHandlingFunctions";
import styled from "styled-components";
import { DateSelectArg } from "@fullcalendar/core/index.js";
import { format } from "date-fns";

interface SignUpProps {
  showNewEventModal: React.Dispatch<React.SetStateAction<boolean>>;
  addToCalendar: DateSelectArg;
}

const NewEventModal = ({ showNewEventModal, addToCalendar }: SignUpProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("");
  const [price, setPrice] = useState(0);
  const [location, setLocation] = useState("");
  const [contact, setContact] = useState("");
  const [maxParticipants, setMaxParticipants] = useState(20);
  const calendarApi = addToCalendar.view.calendar;

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    if (title) {
      const newEvent: Event = {
        id: crypto.randomUUID(),
        title: title,
        start: addToCalendar.start,
        end: addToCalendar.end,
        allDay: addToCalendar.allDay,
        description: description,
        type: type,
        price: price,
        location: location,
        contact: contact,
        maxParticipants: maxParticipants,
      };

      // calendarApi.addEvent(newEvent);
      calendarApi.addEvent(newEvent);
      saveEventToDatabase(newEvent, []); // Assuming no players initially
    }
  };
  return (
    <Modal>
      <form onSubmit={handleSubmit}>
        <Container>
          <Header>Adding new event at</Header>
          <Label>{format(addToCalendar.start, "HH:mm MMMM d")}</Label>
          <Input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            placeholder="Title"
          />
          <BigTextInput
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            placeholder="Description"
          />
          <Input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
            placeholder="Location"
          />
          <Select
            value={type}
            onChange={(e) => setType(e.target.value)}
            required
          >
            <option key={1} value="practice">
              Practice
            </option>
            <option key={2} value="game">
              Game
            </option>
            <option key={3} value="civilwar">
              Civil War
            </option>
            <option key={4} value="tournament">
              Tournament
            </option>
            <option key={5} value="other">
              Other
            </option>
          </Select>
          <Select
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            required
          >
            <option key={1} value="peter">
              Peter Eriksson
            </option>
            <option key={2} value="evan">
              Evan Farbstein
            </option>
            <option key={3} value="lee">
              Lee Ruttle
            </option>
            <option key={4} value="karl">
              Karl Söderby O'Kane
            </option>
            <option key={5} value="lucas">
              Lucas Stenberg
            </option>
            <option key={6} value="rasmus">
              Rasmus Mosca
            </option>
            <option key={7} value="martin">
              Martin Ollinen
            </option>
          </Select>
          <Label>Price in SEK</Label>
          <Input
            type="number"
            value={price}
            onChange={(e) => setPrice(parseInt(e.target.value))}
            required
            placeholder="Price"
          />
          <Label>Max Players</Label>
          <Input
            type="number"
            value={maxParticipants}
            onChange={(e) => setMaxParticipants(parseInt(e.target.value))}
            required
            placeholder="Max participants"
          />
          <SubmitButton type="submit">Add event</SubmitButton>
          <Button onClick={() => showNewEventModal(false)}>Cancel</Button>
        </Container>
      </form>
    </Modal>
  );
};

export default NewEventModal;

const Label = styled.label`
  color: #fff;
`;
const Input = styled.input`
  height: 40%;
  width: 30%;
  margin: auto;
  background-color: #fff;
  border-radius: 4px;
  border: 1px solid transparent;
  @media (max-width: 768px) {
    width: 80%;
    height: 50px;
  }
`;
const Select = styled.select`
  height: 10%;
  width: 30%;
  margin: auto;
  background-color: #fff;
  border-radius: 4px;
  border: 1px solid transparent;
  @media (max-width: 768px) {
    width: 80%;
  }
`;
const BigTextInput = styled.textarea`
  width: 30%;
  min-height: 100px;
  margin: auto;
  background-color: #fff;
  border-radius: 4px;
  border: 1px solid transparent;
  @media (max-width: 768px) {
    width: 80%;
  }
`;
const Button = styled.button`
  margin: 14px;
  color: #15ba83;
`;
const SubmitButton = styled.button`
  margin: 14px;
  background-color: #15ba83;
  color: #fff;
`;
const Container = styled.div`
  margin: auto;
  height: 70%;
  width: 50%;
  display: flex;
  flex-direction: column;
  gap: 14px;
  @media (max-width: 768px) {
    width: 100%;
    height: 100%;
  }
`;

const Modal = styled.div`
  z-index: 100;
  position: absolute;
  display: flex;
  flex-direction: column;
  padding: 24px;
  top: 12.5%;
  left: 12.5%;
  height: 75%;
  width: 75%;
  border-radius: 8px;
  box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.4);
  background-color: #03161b;
  @media (max-width: 768px) {
    width: 100%;
    height: 100%;
    inset: 0;
    overflow: auto;
  }
`;
const Header = styled.h2`
  color: #15ba83;
`;
