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
  players: Player[];
}
export interface Player {
  id: string;
  name: string;
  position: string;
  team: string;
}
