import supabase from "../../supabase/server";
import {
  Event,
  EventPlayerRel,
  EventWithPlayers,
  Player,
} from "../../types/types";

// Function to fetch events with their associated players
export const fetchEvents = async (): Promise<EventWithPlayers[]> => {
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
  console.log("fetch events", data);
  return data.map((event: any) => ({
    ...event,
    players: event.event_player.map((ep: any) => ({
      id: ep.player.id,
      name: ep.player.name,
      position: ep.player.position,
      team: ep.player.team,
    })),
  }));
};

// Function to fetch players in a specific event
export const fetchPlayersInEvent = async (
  eventId: string,
): Promise<Player[]> => {
  const { data, error } = await supabase
    .from("event_player")
    .select(`
      player:player (
        id,
        name,
        position,
        team
      )
    `)
    .eq("event_id", eventId);

  if (error) {
    console.error("Error fetching players in event:", error);
    return [];
  }
  console.log("players in event", data);
  return data.map((ep: any) => ({
    id: ep.player.id,
    name: ep.player.name,
    position: ep.player.position,
    team: ep.player.team,
  }));
};

// Function to save an event with players to the database
export const saveEventToDatabase = async (
  event: Event,
  players: Player[],
): Promise<void> => {
  const { data: eventData, error: eventError } = await supabase
    .from("event")
    .insert([event])
    .select();

  if (eventError) {
    console.error("Error adding event to database:", eventError);
    return;
  }

  if (players.length) {
    const eventId = eventData[0].id;

    const playerInserts: EventPlayerRel[] = players.map((player) => ({
      event_id: eventId,
      player_id: player.id,
      payment_confirmation: false, // Assuming default value for payment_confirmation
    }));

    const { data: playerData, error: playerError } = await supabase
      .from("event_player")
      .insert(playerInserts);

    if (playerError) {
      console.error("Error adding players to event:", playerError);
    } else {
      console.log("Players added to event:", playerData);
    }
  }
};
// Function to add or update a player in the player table
export const upsertPlayerInPlayerTable = async (
  player: Player,
): Promise<Player> => {
  const { data, error } = await supabase
    .from("player")
    .upsert([player], { onConflict: "id" }) // Use upsert with conflict resolution
    .select()
    .single(); // Use single() to expect a single row

  if (error) {
    console.error("Error adding or updating player in player table:", error);
    throw error; // Rethrow to handle in calling function
  }

  return data as Player; // Type assertion to ensure return type
};
// Updated function to add a player to an existing event
export const addPlayerToEvent = async (
  eventId: string,
  player: Player,
): Promise<void> => {
  try {
    // Ensure the player is added or updated in the player table
    await upsertPlayerInPlayerTable(player);

    // Then, add the player to the event
    const playerInsert: EventPlayerRel = {
      event_id: eventId,
      player_id: player.id,
      payment_confirmation: false, // Assuming default value for payment_confirmation
    };

    const { data, error } = await supabase
      .from("event_player")
      .insert([playerInsert]); // This will ensure no duplicate entries

    if (error) {
      console.error("Error adding player to event:", error);
    } else {
      console.log("Player added to event:", data);
    }
  } catch (error) {
    console.error("Error adding player to event:", error);
  }
};
export const updateEventInDatabase = async (
  updatedEvent: Event,
): Promise<void> => {
  const { data, error } = await supabase
    .from("event")
    .update({
      start: updatedEvent.start,
      end: updatedEvent.end,
      title: updatedEvent.title,
      description: updatedEvent.description,
      type: updatedEvent.type,
      price: updatedEvent.price,
      location: updatedEvent.location,
      contact: updatedEvent.contact,
      allDay: updatedEvent.allDay,
      maxParticipants: updatedEvent.maxParticipants,
    })
    .eq("id", updatedEvent.id);

  if (error) {
    console.error("Error updating event in database:", error);
  } else {
    console.log("Event updated in database:", data);
  }
};
