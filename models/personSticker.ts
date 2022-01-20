import { Person } from "./person";
import { Sticker } from "./sticker";

export type PersonSticker = {
  id: number;
  year: number;
  week: number;
  people: Person;
  stickers: Sticker;
};
