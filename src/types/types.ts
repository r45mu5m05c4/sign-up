export interface Event {
  id: string;
  start: Date;
  end: Date;
  title: string;
  description: string;
  type: string;
  price: number;
  location: string;
  contact: string;
  allDay: boolean;
  maxParticipants: number;
}
export interface Player {
  id: string;
  name: string;
  position: string;
  team: string;
}
export interface EventWithPlayers extends Event {
  players: Player[];
}
export interface EventPlayerRel {
  event_id: string;
  player_id: string;
}
export interface User {
  id: string;
  email: string;
  name: string;
  phoneNumber: number;
  premium: boolean;
  admin: boolean;
}
