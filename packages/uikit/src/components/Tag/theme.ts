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
    boxShadow: "0 4px 12px #68B9FF, 0 4px 4px #fff, 4px 0px 12px #0154FD, -4px 0px 12px #68B9FF", 

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
