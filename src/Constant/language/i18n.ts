import en from "./en";
import es from "./es";
import fr from "./fr.json";
export type Messages = {
    [key: string]: {
      [key: string]: string;
    };
  };
export const messages:Messages = { en, es, fr };
