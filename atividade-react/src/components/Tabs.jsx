import { useId, useRef, useState } from 'react';
import styled from 'styled-components';

const TabList = styled.div`
  display: flex;
  gap: 0.25rem;
  border-bottom: 2px solid ${({ theme }) => theme.colors.border};
  overflow-x: auto;
`;

const Tab = styled.button`
  background: none;
  border: 0;
  border-bottom: 3px solid ${({ $active, theme }) => ($active ? theme.colors.accent : 'transparent')};
  margin-bottom: -2px;
  padding: 0.6rem 0.9rem;
  white-space: nowrap;
  font-weight: 600;
  color: ${({ $active, theme }) => ($active ? theme.colors.accent : theme.colors.muted)};

  &:hover { color: ${({ $active, theme }) => ($active ? theme.colors.accent : theme.colors.ink)}; }
`;

const Panel = styled.div`
  padding-top: 1rem;
`;

export default function Tabs({ tabs }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const baseId = useId();
  const tabRefs = useRef([]);

  const selectTab = (index) => {
    setActiveIndex(index);
    tabRefs.current[index]?.focus();
  };

  const handleKeyDown = (event, index) => {
    const last = tabs.length - 1;
    if (event.key === 'ArrowRight') selectTab(index === last ? 0 : index + 1);
    else if (event.key === 'ArrowLeft') selectTab(index === 0 ? last : index - 1);
    else if (event.key === 'Home') selectTab(0);
    else if (event.key === 'End') selectTab(last);
    else return;
    event.preventDefault();
  };

  return (
    <div>
      <TabList role="tablist" aria-label="Seções do perfil">
        {tabs.map((tab, index) => {
          const isActive = index === activeIndex;
          return (
            <Tab
              key={tab.id}
              ref={(element) => (tabRefs.current[index] = element)}
              type="button"
              role="tab"
              id={`${baseId}-tab-${tab.id}`}
              $active={isActive}
              aria-selected={isActive}
              aria-controls={`${baseId}-panel-${tab.id}`}
              tabIndex={isActive ? 0 : -1}
              onClick={() => setActiveIndex(index)}
              onKeyDown={(event) => handleKeyDown(event, index)}
            >
              {tab.label}
            </Tab>
          );
        })}
      </TabList>

      {tabs.map((tab, index) => (
        <Panel
          key={tab.id}
          role="tabpanel"
          id={`${baseId}-panel-${tab.id}`}
          aria-labelledby={`${baseId}-tab-${tab.id}`}
          hidden={index !== activeIndex}
          tabIndex={0}
        >
          {tab.content}
        </Panel>
      ))}
    </div>
  );
}
