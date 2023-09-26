import React from "react";
import { Drop } from "@phosphor-icons/react";
import { IconType, IconBaseProps } from "react-icons";

const Droplet: IconType = (props: IconBaseProps) => {
  const { size = "24px", color = "#000", ...rest } = props;
  return (
    <Drop width={size} height={size} color={color} {...rest} />
  );
};

export default Droplet;