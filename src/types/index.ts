export type GameStatus = "playing" | "cleared" | "failed" | "given_up";

export interface Country {
  id: string; // ISO 3166-1 alpha-3
  a2Code: string; // ISO 3166-1 alpha-2
  name: string; // Japanese name
  flag: string; // Flag emoji
}
