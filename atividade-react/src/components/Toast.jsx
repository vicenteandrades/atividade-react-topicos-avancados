import { useEffect } from 'react';
import styled, { keyframes } from 'styled-components';

const slideIn = keyframes`
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: none; }
`;

const Container = styled.div`
  position: fixed;
  z-index: 50;
  left: 1rem;
  right: 1rem;
  bottom: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  pointer-events: none;

  ${({ theme }) => theme.media.tablet} {
    left: auto;
    right: 1.5rem;
    bottom: 1.5rem;
    width: 24rem;
  }
`;

const Box = styled.div`
  pointer-events: auto;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 0.75rem;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-left: 6px solid
    ${({ $type, theme }) =>
      $type === 'success' ? theme.colors.success : $type === 'error' ? theme.colors.error : theme.colors.accent};
  border-radius: 8px;
  padding: 0.8rem 1rem;
  box-shadow: 0 8px 24px rgba(24, 33, 47, 0.18);
  animation: ${slideIn} 0.25s ease;
`;

const CloseButton = styled.button`
  background: none;
  border: 0;
  font-size: 1.4rem;
  line-height: 1;
  padding: 0 0.25rem;
  color: ${({ theme }) => theme.colors.muted};

  &:hover { color: ${({ theme }) => theme.colors.ink}; }
`;

const TYPE_LABEL = { success: 'Sucesso', error: 'Erro', info: 'Informação' };

export default function Toast({ id, message, type = 'info', duration = 4000, onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => onClose(id), duration);
    return () => clearTimeout(timer);
  }, [id, duration, onClose]);

  return (
    <Box
      $type={type}
      role={type === 'error' ? 'alert' : 'status'}
    >
      <p>
        <strong>{TYPE_LABEL[type]}:</strong> {message}
      </p>
      <CloseButton type="button" onClick={() => onClose(id)} aria-label="Fechar notificação">
        ×
      </CloseButton>
    </Box>
  );
}

export function ToastContainer({ toasts, onClose }) {
  return (
    <Container aria-label="Notificações">
      {toasts.map((toast) => (
        <Toast key={toast.id} {...toast} onClose={onClose} />
      ))}
    </Container>
  );
}
