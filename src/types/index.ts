export type GameStatus = "playing" | "cleared" | "failed" | "given_up";

export interface Country {
  id: string; // ISO 3166-1 alpha-3
  name: string; // Japanese name
}
