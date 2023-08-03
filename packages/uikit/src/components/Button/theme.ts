import { scales, variants } from "./types";
import { darkColors } from "../../theme";


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
    border: "4px solid", 
    borderColor: "background", 
    ":hover": {
      backgroundColor: "background", 
      borderColor: "text", 
      color: "text", 

    }
  },
  // used for connect wallet 
  [variants.PRIMARYTHREE]: {
    backgroundColor: "#fff",
    color: "background",
    fontWeight: "900", 
    fontSize: "14px", 
    borderRadius: "8px", 
    border: "4px solid", 
    borderColor: "background", 
    ":hover": {
      backgroundColor: "#000", 
      borderColor: "background", 
      color: "text", 

    }
  },
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
    // USED FOR ENABLE FARM 
  },
  [variants.SECONDARY]: {
    backgroundColor: "background",
    border: "2px solid",
    borderColor: "text",

    color: "text",
    ":hover": {
      transform: "translateY(1px)",
    },
    ":disabled": {
      backgroundColor: "transparent",
    },
  },
  [variants.TERTIARY]: {
    backgroundColor: "tertiary",
    boxShadow: "none",
    border: "2px solid", 
    borderColor: "text", 
    color: "text",
   
  },
  [variants.QUAD]: {
    background: `${darkColors.gradients.basedsexgray}`,

    boxShadow: "0px 0px 4px #000",
    border: "2px solid", 
    borderColor: "white", 
    color: "primary",
    fontWeight: "900", 
    ":hover": {
      background: "black", 
      color: "white", 
      transform: "translateY(1px)",

    }
  },
  [variants.SUBTLE]: {
    backgroundColor: "textSubtle",
    color: "backgroundAlt",
  },
  [variants.DANGER]: {
    backgroundColor: "#000",
    color: "white",
  },
  [variants.SUCCESS]: {
    backgroundColor: "success",
    color: "white",
  },
  // used for currency select button 
  [variants.TEXT]: {
    backgroundColor: "transparent",
    color: "text",
    boxShadow: "none",
    border: "0px solid",
    borderColor: "#fff",  
  },
  [variants.LIGHT]: {
    backgroundColor: "white",
    color: "background",
    boxShadow: "none",
  },
};
