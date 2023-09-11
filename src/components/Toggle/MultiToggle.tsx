import styled from 'styled-components'

export const ToggleWrapper = styled.button<{ width?: string }>`
  display: flex;
  align-items: center;
  width: ${({ width }) => width ?? '100%'};
  padding: 1px;
  background: ${({ theme }) => theme.colors.backgroundAlt};
  border-radius: 8px;
  border: ${({ theme }) => '1px solid ' + theme.colors.backgroundAlt2};
  cursor: pointer;
  outline: none;
`

export const ToggleElement = styled.span<{ isActive?: boolean; fontSize?: string }>`
  display: flex;
  align-items: center;
  width: 100%;
  padding: 4px 0.5rem;
  border-radius: 6px;
  justify-content: center;
  height: 100%;
  background: ${({ theme, isActive }) => (isActive ? theme.colors.backgroundAlt : 'none')};
  color: ${({ theme, isActive }) => (isActive ? theme.colors.primary : theme.colors.tertiary)};
  font-size: ${({ fontSize }) => fontSize ?? '1rem'};
  font-weight: 500;
  white-space: nowrap;
  :hover {
    user-select: initial;
    color: ${({ theme, isActive }) => (isActive ? theme.colors.secondary : theme.colors.tertiary)};
  }
`
