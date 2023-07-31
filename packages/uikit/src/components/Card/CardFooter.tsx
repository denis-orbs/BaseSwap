import styled from "styled-components";
import { space, SpaceProps } from "styled-system";

export type CardFooterProps = SpaceProps;

const CardFooter = styled.div<CardFooterProps>`
  border-top: 1px solid ${({ theme }) => theme.colors.cardBorder};
  ${space}
  border-radius: 0px; 
  background: transparent; 

  padding: 8px; 
`;

CardFooter.defaultProps = {
  p: "0px",
};

export default CardFooter;
