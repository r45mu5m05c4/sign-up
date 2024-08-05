import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useUser } from "../contexts/UserContext";
import { Event, EventWithPlayers } from "../types/types";
import { fetchEvents, saveEventToDatabase } from "./EventHandlingFunctions";

interface CalendarProps {
  setCurrentEvent: React.Dispatch<
    React.SetStateAction<EventWithPlayers | undefined>
  >;
}

export default function Calendar({ setCurrentEvent }: CalendarProps) {
  const [currentEvents, setCurrentEvents] = useState<Event[]>([]);
  const { user } = useUser();

  useEffect(() => {
    const loadEvents = async () => {
      const events = await fetchEvents();
      setCurrentEvents(events);
    };

    loadEvents();
  }, []);

  const handleDateSelect = (selectInfo: any) => {
    const title = prompt("Please enter a new title for your event");
    const calendarApi = selectInfo.view.calendar;

    calendarApi.unselect();

    if (title) {
      const newEvent: Event = {
        id: crypto.randomUUID(),
        title,
        start: new Date(selectInfo.startStr),
        end: new Date(selectInfo.endStr),
        allDay: selectInfo.allDay,
        description: "",
        type: "",
        price: 0,
        location: "",
        contact: "",
        maxParticipants: 0,
      };

      calendarApi.addEvent(newEvent);
      saveEventToDatabase(newEvent, []); // Assuming no players initially
    }
  };

  const handleEventClick = (clickInfo: any) => {
    setCurrentEvent(mapEventApiToEvent(clickInfo.event));
  };

  const handleEvents = (events: any[]) => {
    // Only update state if there is a difference to avoid unnecessary re-renders
    setCurrentEvents((prevEvents) => {
      const newEvents = events.map(mapEventApiToEvent);
      if (JSON.stringify(newEvents) !== JSON.stringify(prevEvents)) {
        return newEvents;
      }
      return prevEvents;
    });
  };

  const mapEventApiToEvent = (eventApi: any): EventWithPlayers => ({
    id: eventApi.id,
    start: eventApi.start,
    end: eventApi.end,
    title: eventApi.title,
    description: eventApi.extendedProps.description || "",
    type: eventApi.extendedProps.type || "",
    price: eventApi.extendedProps.price || 0,
    location: eventApi.extendedProps.location || "",
    contact: eventApi.extendedProps.contact || "",
    allDay: eventApi.allDay,
    maxParticipants: eventApi.maxParticipants,
    players: eventApi.players,
  });

  return (
    <div className="demo-app">
      <div className="demo-app-main">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay",
          }}
          initialView="timeGridWeek"
          editable={user?.admin}
          selectable={true}
          selectMirror={true}
          dayMaxEvents={true}
          weekends={true}
          events={currentEvents}
          select={handleDateSelect}
          eventContent={renderEventContent}
          eventClick={handleEventClick}
          eventsSet={handleEvents}
        />
      </div>
    </div>
  );
}

function renderEventContent(eventInfo: any) {
  return (
    <>
      <b>{eventInfo.timeText}</b>
      <i>{eventInfo.event.title}</i>
    </>
  );
}

function deleteEventFromDatabase(id: any) {
  throw new Error("Function not implemented.");
}
