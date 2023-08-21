import { scales, variants } from "./types";

export const scaleVariants = {
  [scales.MD]: {
    height: "28px",
    padding: "0 8px",
    fontSize: "14px",
  },
  [scales.SM]: {
    height: "24px",
    padding: "0 4px",
    fontSize: "12px",
  },
};

export const styleVariants = {
  [variants.PRIMARY]: {
    backgroundColor: "primary",
  },
  [variants.TRANS]: {
    backgroundColor: "transparent",
    boxShadow: "-4px 0 12px #FC8A17, 4px 0 12px #FC8A17, 0 0 36px #FC8A17", 
    borderRadius: "12px", 
  },
  [variants.SECONDARY]: {
    backgroundColor: "background",
  },
  [variants.SUCCESS]: {
    backgroundColor: "success",
  },
  [variants.TEXTDISABLED]: {
    backgroundColor: "textDisabled",
  },
  [variants.TEXTSUBTLE]: {
    backgroundColor: "textSubtle",
  },
  [variants.BINANCE]: {
    backgroundColor: "binance",
  },
  [variants.FAILURE]: {
    backgroundColor: "failure",
  },
  [variants.WARNING]: {
    backgroundColor: "warning",
  },
};
