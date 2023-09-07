import styled from "styled-components";
import { m as Motion } from "framer-motion";

export const Arrow = styled.div`
  &,
  &::before {
    position: absolute;
    width: 10px;
    height: 10px;
    border-radius: 2px;
    z-index: -1;
  }

  &::before {
    content: "";
    transform: rotate(45deg);
    background: ${({ theme }) => theme.tooltip.background};
  }
`;

export const StyledTooltip = styled(Motion.div)`
  padding: 12px;
  font-size: 18px;
  line-height: 130%;
  border-radius: 4px;
  max-width: 350px;
  z-index: 101;
  background: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.text};
  box-shadow:  0 48px 48px #fff, 48px 0 96px #fff, 48px 0px 48px #0154FD, -48px 0px 48px #68B9FF; 
 
  &[data-popper-placement^="top"] > ${Arrow} {
    bottom: -4px;
  }

  &[data-popper-placement^="bottom"] > ${Arrow} {
    top: -4px;
  }

  &[data-popper-placement^="left"] > ${Arrow} {
    right: -4px;
  }

  &[data-popper-placement^="right"] > ${Arrow} {
    left: -4px;
  }
`;
