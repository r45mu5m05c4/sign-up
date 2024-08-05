import supabase from "../supabase/server";
import { Player, Event, EventPlayerRel } from "../types/types";

// Function to fetch events with their associated players
export const fetchEvents = async (): Promise<Event[]> => {
  const { data, error } = await supabase.from("event").select(`
      *,
      event_player (
        player:player (
          id,
          name,
          position,
          team
        )
      )
    `);

  if (error) {
    console.error("Error fetching events:", error);
    return [];
  }

  return data.map((event: any) => ({
    ...event,
    players: event.event_player.map((ep: any) => ep.player),
  }));
};

// Function to save an event with players to the database
export const saveEventToDatabase = async (event: Event, players: Player[]) => {
  const { data: eventData, error: eventError } = await supabase
    .from("event")
    .insert([event])
    .select();

  if (eventError) {
    console.error("Error adding event to database:", eventError);
    return;
  }

  const eventId = eventData[0].id;

  const playerInserts = players.map((player) => ({
    event_id: eventId,
    player_id: player.id,
  }));

  const { data: playerData, error: playerError } = await supabase
    .from("event_player")
    .insert(playerInserts);

  if (playerError) {
    console.error("Error adding players to event:", playerError);
  } else {
    console.log("Players added to event:", playerData);
  }
};
