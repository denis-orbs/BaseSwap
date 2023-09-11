import { ElementType, ReactNode } from "react";
import { LayoutProps, SpaceProps } from "styled-system";
import type { PolymorphicComponentProps } from "../../util/polymorphic";

export const scales = {
  MD: "md",
  SM: "sm",
  XS: "xs",
} as const;

export const variants = {
  PRIMARY: "primary",
  PERCENTAGES: "percentages", 
  PLUSMINUS: "plusminus", 
  GASON: "gason", 
  ADDTOMETAMASK: "addtometamask", 
  REVAMP: "revamp", 
  REVAMPREVERSE: "revampreverse", 
  GASOFF: "gasoff", 
  CALCULATOR: "calculator", 
  PRIMARYTWO: "primarytwo", 
  PRIMARYTHREE: "primarythree", 
  MENUCONNECT: "menuconnect", 
  QUAD: "quad", 
  SECONDARY: "secondary",
  MAX: "max", 
  TERTIARY: "tertiary",
  TEXT: "text",
  DANGER: "danger",
  SUBTLE: "subtle",
  SUCCESS: "success",
  LIGHT: "light",
} as const;

export type Scale = typeof scales[keyof typeof scales];
export type Variant = typeof variants[keyof typeof variants];

export interface BaseButtonProps extends LayoutProps, SpaceProps {
  as?: "a" | "button" | ElementType;
  external?: boolean;
  isLoading?: boolean;
  scale?: Scale;
  variant?: Variant;
  disabled?: boolean;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  decorator?: {
    backgroundColor?: string;
    color?: string;
    text: string;
    direction?: "left" | "right";
  };
}

export type ButtonProps<P extends ElementType = "button"> = PolymorphicComponentProps<P, BaseButtonProps>;
