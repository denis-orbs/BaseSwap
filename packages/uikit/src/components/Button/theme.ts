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
    background: `${darkColors.background}`,
    color: "text",
    fontWeight: "500", 
    textTransform: "uppercase", 
    borderRadius: "2px", 
    border: "4px solid", 
    borderColor: "background", 
    ":hover": {
      borderColor:"background", 
      backgroundColor:"#111",
      color: "background", 
      transform: "translateY(1px)",
    },
  },

  [variants.PLUSMINUS]: {
    background: "#000",
    color: "text",
    fontWeight: "500", 
    textTransform: "uppercase", 
    borderRadius: "4px", 
    border: "2px solid", 
    borderColor: "#0154FE", 
    ":hover": {
      borderColor: "#fff", 
      backgroundColor: "#0154FE", 
      boxShadow: "none", 
      color: "background", 
      transform: "translateY(1px)",
    },
  },
  [variants.GASON]: {
    background: "#0154FE",
    color: "#000",
    fontWeight: "500", 
    textTransform: "uppercase", 
    borderRadius: "8px", 
    border: "2px solid", 
    borderColor: "#fff", 
    ":hover": {
      borderColor: "#fff", 
      backgroundColor: "#0154FE", 
      color: "#fff", 
      boxShadow: "none", 
      transform: "translateY(1px)",
    },
  },
  [variants.GASOFF]: {
    background: "#000",
    color: "text",
    fontWeight: "500", 
    textTransform: "uppercase", 
    borderRadius: "8px", 
    border: "2px solid", 
    borderColor: "#0154FE", 
    ":hover": {
      borderColor: "#fff", 
      backgroundColor: "#0154FE", 
      boxShadow: "none", 
      color: "#000", 
      transform: "translateY(1px)",
    },
  },
  [variants.ADDTOMETAMASK]: {
    background: "#000",
    color: "#fff",
    fontWeight: "500", 
    textTransform: "uppercase", 
    borderRadius: "8px", 
    border: "2px solid", 
    borderColor: "#0154FE", 
    ":hover": {
      borderColor: "#fff", 
      backgroundColor: "#0154FE", 
      color: "#fff", 
      boxShadow: "none", 
      transform: "translateY(1px)",
    },
  },
  [variants.REVAMP]: {
    background: `${darkColors.gradients.violet}`,
    color: "#fff",
    fontWeight: "500", 
    textTransform: "uppercase", 
    borderRadius: "8px", 
    border: "1px solid", 
    borderColor: "#fff", 
    ":hover": {
      borderColor: "#fff",
      borderWidth: "2px",  
      background: "none",
      color: "#fff", 
      boxShadow: "0 0 12px #0154FE", 
      transform: "translateY(1px)",
    },
  },
  [variants.REVAMPREVERSE]: {
    background: `${darkColors.gradients.violetAlt}`,
    color: "#fff",
    fontWeight: "500", 
    textTransform: "uppercase", 
    borderRadius: "8px", 
    height: "40px", 
    border: "1px solid", 
    borderColor: "#fff", 
    ":hover": {
      borderColor: "#fff",
      borderWidth: "2px",  
      background: "none",
      color: "#fff", 
      boxShadow: "0 0 12px #0154FE", 
      transform: "translateY(1px)",
    },
  },
  [variants.MENUCONNECT]: {
    background: `${darkColors.background}`,
    color: "text",
    fontSize: '1rem', 
    fontWeight: "500", 
    textTransform: "uppercase", 
    borderRadius: "2px", 
    border: "4px solid", 
    borderColor: "background", 
    ":hover": {
      borderColor:"background", 
      backgroundColor:"#111",
      color: "background", 
      transform: "translateY(1px)",
    },
  },
  [variants.CALCULATOR]: {
    backgroundColor: "#fff",
    color: "background",
    fontWeight: "500", 
    borderRadius: "2px", 
    boxShadow: "inset 0 0 2px #000", 
    border: "2px solid", 
    borderColor: "text", 
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
    fontWeight: "500", 
    textTransform: "uppercase", 
    fontSize: "24px", 
    borderRadius: "2px", 
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
    fontWeight: "500", 
    fontSize: "1.1rem", 
    borderRadius: "2px", 
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
    backgroundColor: "text",
    border: "4px solid",
    borderColor: "background",
    borderRadius: "2px", 
    textTransform: "uppercase" , 
    padding: "8px", 

    color: "background",
    ":hover": {
      transform: "translateY(1px)",
    },
    ":disabled": {
      backgroundColor: "transparent",
    },
  },
  [variants.MAX]: {
  //   background: `${darkColors.background}`,
  //   color: "backgroundAlt",
  //   fontWeight: "500", 
  //   borderRadius: "2px", 
  //   border: "4px solid", 
  //   borderColor: "background", 
  //   ":hover": {
  //     backgroundColor: "background", 
  //     borderColor: "text", 
  //     color: "text", 

  //   }
  // },
    backgroundColor: "background",
    padding: "4px", 
    borderRadius: "2px", 
    height: "70%", 
    border: "2px solid",
    borderColor: "background",

    color: "backgroundAlt",
    ":hover": {
      borderColor:"background", 
      backgroundColor:"#111",
      color: "background", 
      transform: "translateY(1px)",
    },
    ":disabled": {
      backgroundColor: "transparent",
    },
  },
  [variants.TERTIARY]: {
    backgroundColor: "text",
    boxShadow: "inset 0 0 2px #000", 
    border: "2px solid", 
    borderColor: "text", 
    color: "background",
    borderRadius: "2px", 
   
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
    color: "background",

    boxShadow: "none",
    border: "0px solid",
    borderColor: "#fff",  
  },
  [variants.LIGHT]: {
    backgroundColor: "white",
    color: "background",
    borderRadius: "2px", 
    boxShadow: "none",
  },
};
