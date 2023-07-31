import styled from "styled-components";
import { space, SpaceProps } from "styled-system";

export type CardFooterProps = SpaceProps;

const CardFooter = styled.div<CardFooterProps>`
  border-right: 4px solid #fff; 
  border-left: 4px solid #fff; 
  border-bottom: 4px solid #fff; 

  ${space}
  bottom-border-radius: 8px;
  background: ${({ theme }) => theme.colors.backgroundAlt};

  padding: 1rem;
`;

CardFooter.defaultProps = {
  p: "0px",
};

export default CardFooter;
