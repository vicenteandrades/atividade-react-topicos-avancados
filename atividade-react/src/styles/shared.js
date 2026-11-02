import styled from 'styled-components';

export const Button = styled.button`
  background: ${({ theme, $variant }) => ($variant === 'ghost' ? 'transparent' : theme.colors.accent)};
  color: ${({ theme, $variant }) => ($variant === 'ghost' ? theme.colors.accent : '#fff')};
  border: 1px solid ${({ theme }) => theme.colors.accent};
  border-radius: 8px;
  padding: 0.55rem 1rem;
  font-weight: 600;

  &:hover:not(:disabled) {
    background: ${({ theme, $variant }) => ($variant === 'ghost' ? theme.colors.accentSoft : theme.colors.accentDark)};
  }
`;

export const Actions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
`;

export const Muted = styled.p`
  color: ${({ theme }) => theme.colors.muted};
  font-size: 0.95rem;
`;
