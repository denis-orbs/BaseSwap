import { scales, variants } from "./types";

export const scaleVariants = {
  [scales.MD]: {
    height: "48px",
    padding: "0 24px",
  },
  [scales.SM]: {
    height: "32px",
    padding: "0 16px",
  },
  [scales.XS]: {
    height: "20px",
    fontSize: "12px",
    padding: "0 8px",
  },
};

export const styleVariants = {
  [variants.PRIMARY]: {
    backgroundColor: "#fff",
    color: "background",
    fontWeight: "900", 
    borderRadius: "8px", 
    border: "8px solid", 
    borderColor: "background", 
    ":hover": {
      backgroundColor: "background", 
      borderColor: "text", 
      color: "text", 

    }
  },
  // used for connect wallet 
  [variants.PRIMARYTWO]: {
    backgroundColor: "#fff",
    color: "background",
    fontWeight: "900", 
    fontSize: "1.1rem", 
    borderRadius: "8px", 
    border: "4px solid", 
    borderColor: "background", 
    ":hover": {
      backgroundColor: "#000", 
      borderColor: "background", 
      color: "text", 

    }
  },
  [variants.SECONDARY]: {
    backgroundColor: "background",
    border: "2px solid",
    borderColor: "text",
    boxShadow: "none",
    color: "text",
    ":disabled": {
      backgroundColor: "transparent",
    },
  },
  [variants.TERTIARY]: {
    backgroundColor: "tertiary",
    boxShadow: "none",
    color: "primary",
  },
  [variants.SUBTLE]: {
    backgroundColor: "textSubtle",
    color: "backgroundAlt",
  },
  [variants.DANGER]: {
    backgroundColor: "failure",
    color: "white",
  },
  [variants.SUCCESS]: {
    backgroundColor: "success",
    color: "white",
  },
  [variants.TEXT]: {
    backgroundColor: "transparent",
    color: "primary",
    boxShadow: "none",
  },
  [variants.LIGHT]: {
    backgroundColor: "white",
    color: "textSubtle",
    boxShadow: "none",
  },
};
