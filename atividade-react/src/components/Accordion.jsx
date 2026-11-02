import { useId, useState } from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  overflow: hidden;
`;

const Item = styled.div`
  & + & { border-top: 1px solid ${({ theme }) => theme.colors.border}; }
`;

const Heading = styled.h3`
  font-size: 1rem;
`;

const Trigger = styled.button`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: ${({ theme }) => theme.colors.surface};
  border: 0;
  text-align: left;
  font-weight: 600;
  font-size: 1rem;

  &:hover { background: ${({ theme }) => theme.colors.accentSoft}; }
`;

const Icon = styled.span`
  width: 0.6rem;
  height: 0.6rem;
  flex-shrink: 0;
  border-right: 2px solid currentColor;
  border-bottom: 2px solid currentColor;
  transform: ${({ $open }) => ($open ? 'rotate(-135deg)' : 'rotate(45deg)')};
  transition: transform 0.25s ease;
`;

const Panel = styled.div`
  display: grid;
  grid-template-rows: ${({ $open }) => ($open ? '1fr' : '0fr')};
  visibility: ${({ $open }) => ($open ? 'visible' : 'hidden')};
  transition: grid-template-rows 0.25s ease, visibility 0.25s;
`;

const Inner = styled.div`
  overflow: hidden;
  min-height: 0;

  p {
    padding: 0 1rem 1rem;
    color: ${({ theme }) => theme.colors.muted};
  }
`;

export default function Accordion({ items, allowMultiple = false }) {
  const [openIndexes, setOpenIndexes] = useState([]);
  const baseId = useId();

  const toggleItem = (index) => {
    setOpenIndexes((current) => {
      if (current.includes(index)) {
        return current.filter((i) => i !== index);
      }
      return allowMultiple ? [...current, index] : [index];
    });
  };

  return (
    <Wrapper>
      {items.map((item, index) => {
        const isOpen = openIndexes.includes(index);
        const buttonId = `${baseId}-button-${index}`;
        const panelId = `${baseId}-panel-${index}`;

        return (
          <Item key={item.title}>
            <Heading>
              <Trigger
                type="button"
                id={buttonId}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => toggleItem(index)}
              >
                <span>{item.title}</span>
                <Icon $open={isOpen} aria-hidden="true" />
              </Trigger>
            </Heading>
            <Panel id={panelId} role="region" aria-labelledby={buttonId} $open={isOpen}>
              <Inner>
                <p>{item.content}</p>
              </Inner>
            </Panel>
          </Item>
        );
      })}
    </Wrapper>
  );
}
