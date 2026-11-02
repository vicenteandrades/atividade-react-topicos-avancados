import styled from 'styled-components';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.95rem;
`;

const Value = styled.span`
  font-weight: 700;
  font-variant-numeric: tabular-nums;
`;

const Track = styled.div`
  height: 0.9rem;
  background: ${({ theme }) => theme.colors.accentSoft};
  border-radius: 999px;
  overflow: hidden;
`;

const Fill = styled.div`
  height: 100%;
  background: ${({ theme }) => theme.colors.accent};
  border-radius: 999px;
  transition: width 0.3s ease;
`;

export default function ProgressBar({ value, label = 'Progresso' }) {
  const percent = Math.round(Math.min(100, Math.max(0, value)));

  return (
    <Wrapper>
      <Header>
        <span>{label}</span>
        <Value>{percent}%</Value>
      </Header>
      <Track
        role="progressbar"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={percent}
      >
        <Fill style={{ width: `${percent}%` }} />
      </Track>
    </Wrapper>
  );
}
