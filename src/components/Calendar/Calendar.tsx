import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import "./calendarStyles.css";
import { useUser } from "../../contexts/UserContext";
import { Event, EventWithPlayers } from "../../types/types";
import { fetchEvents, updateEventInDatabase } from "./EventHandlingFunctions";
import {
  DateSelectArg,
  EventApi,
  EventClickArg,
  EventDropArg,
  EventInput,
} from "@fullcalendar/core/index.js";
import NewEventModal from "./NewEventModal";

interface CalendarProps {
  setCurrentEvent: React.Dispatch<
    React.SetStateAction<EventWithPlayers | undefined>
  >;
}

export default function Calendar({ setCurrentEvent }: CalendarProps) {
  const [currentEvents, setCurrentEvents] = useState<Event[]>([]);
  const [showNewEventModal, setShowNewEventModal] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<DateSelectArg>();
  const { user } = useUser();

  useEffect(() => {
    const loadEvents = async () => {
      const events = await fetchEvents();
      setCurrentEvents(events);
    };

    loadEvents();
  }, [user]);

  const handleDateSelect = (selectInfo: DateSelectArg) => {
    const calendarApi = selectInfo.view.calendar;

    calendarApi.unselect();
    setSelectedSlot(selectInfo);
    setShowNewEventModal(true);
  };

  const handleEventClick = (clickInfo: EventClickArg) => {
    setCurrentEvent(mapEventApiToEvent(clickInfo.event));
  };

  const handleEventDrop = async (eventDropInfo: EventDropArg) => {
    const updatedEvent: Event = {
      id: eventDropInfo.event.id,
      start: eventDropInfo.event.start
        ? new Date(eventDropInfo.event.start)
        : new Date(),
      end: eventDropInfo.event.end
        ? new Date(eventDropInfo.event.end)
        : new Date(),
      title: eventDropInfo.event.title,
      description: eventDropInfo.event.extendedProps.description || "",
      type: eventDropInfo.event.extendedProps.type || "",
      price: eventDropInfo.event.extendedProps.price || 0,
      location: eventDropInfo.event.extendedProps.location || "",
      contact: eventDropInfo.event.extendedProps.contact || "",
      allDay: eventDropInfo.event.allDay,
      maxParticipants: eventDropInfo.event.extendedProps.maxParticipants,
    };

    // Update the event in the state
    setCurrentEvents((prevEvents) =>
      prevEvents.map((event) =>
        event.id === updatedEvent.id ? updatedEvent : event
      )
    );

    // Update the event in the database
    await updateEventInDatabase(updatedEvent);
  };

  const handleEvents = (events: EventApi[]) => {
    // Only update state if there is a difference to avoid unnecessary re-renders
    setCurrentEvents((prevEvents) => {
      const newEvents = events.map(mapEventApiToEvent);
      if (JSON.stringify(newEvents) !== JSON.stringify(prevEvents)) {
        return newEvents;
      }
      return prevEvents;
    });
  };

  const mapEventApiToEvent = (eventApi: EventApi): EventWithPlayers => {
    return {
      id: eventApi.id,
      start: eventApi.start || new Date(),
      end: eventApi.end || new Date(),
      title: eventApi.title,
      description: eventApi.extendedProps.description || "",
      type: eventApi.extendedProps.type || "",
      price: eventApi.extendedProps.price || 0,
      location: eventApi.extendedProps.location || "",
      contact: eventApi.extendedProps.contact || "",
      allDay: eventApi.allDay,
      maxParticipants: eventApi.extendedProps.maxParticipants,
      players: eventApi.extendedProps.players,
    };
  };

  return (
    <div className="demo-app">
      {showNewEventModal && selectedSlot && (
        <NewEventModal
          showNewEventModal={setShowNewEventModal}
          addToCalendar={selectedSlot}
        />
      )}
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
          eventDrop={handleEventDrop}
          slotLabelFormat={{
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          }}
          eventTimeFormat={{
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          }}
        />
      </div>
    </div>
  );
}

function renderEventContent(eventInfo: EventInput) {
  return (
    <>
      <b>{eventInfo.event.title}</b>
      <br />
      <i>{eventInfo.timeText}</i>
    </>
  );
}
