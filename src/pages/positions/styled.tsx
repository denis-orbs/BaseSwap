import { LoadingRows as BaseLoadingRows } from 'components/Loader/styled'
import styled from 'styled-components'

export const Wrapper = styled.div`
  position: relative;
  padding: 20px;
`

export const MaxButton = styled.button<{ width: string }>`
  padding: 0.5rem 1rem;
  background: ${({ theme }) => theme.colors.gradients.based69};
  border: 1px solid ${({ theme }) => theme.colors.cardBorder};
  border-radius: 0.5rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  margin: 0.25rem;
  overflow: hidden;
  color: ${({ theme }) => theme.colors.text};
  :hover {
    border: 1px solid ${({ theme }) => theme.colors.cardBorder};
    opacity: 0.8;
  }
  :focus {
    border: 1px solid ${({ theme }) => theme.colors.text};
    outline: none;
  }
`

export const Dots = styled.span`
  &::after {
    display: inline-block;
    animation: ellipsis 1.25s infinite;
    content: '.';
    width: 1em;
    text-align: left;
  }
  @keyframes ellipsis {
    0% {
      content: '.';
    }
    33% {
      content: '..';
    }
    66% {
      content: '...';
    }
  }
`

export const LoadingRows = styled(BaseLoadingRows)`
  padding-top: 36px;
  min-width: 75%;
  max-width: 960px;
  grid-column-gap: 0.5em;
  grid-row-gap: 0.8em;
  grid-template-columns: repeat(3, 1fr);
  padding: 8px;

  & > div:nth-child(4n + 1) {
    grid-column: 1 / 3;
  }
  & > div:nth-child(4n) {
    grid-column: 3 / 4;
    margin-bottom: 2em;
  }
`

export default Wrapper
