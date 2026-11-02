import { useEffect, useId, useRef, useState } from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  position: relative;
  display: inline-block;
`;

const Trigger = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.ink};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  padding: 0.5rem 0.9rem;
`;

const Arrow = styled.span`
  width: 0.5rem;
  height: 0.5rem;
  border-right: 2px solid currentColor;
  border-bottom: 2px solid currentColor;
  transform: ${({ $open }) => ($open ? 'rotate(-135deg)' : 'rotate(45deg) translateY(-2px)')};
  transition: transform 0.2s ease;
`;

const Menu = styled.ul`
  position: absolute;
  top: calc(100% + 0.35rem);
  ${({ $align }) => ($align === 'right' ? 'right: 0;' : 'left: 0;')}
  z-index: 20;
  min-width: 100%;
  width: max-content;
  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.ink};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  padding: 0.3rem;
  box-shadow: 0 8px 24px rgba(24, 33, 47, 0.15);
`;

const Option = styled.button`
  width: 100%;
  text-align: left;
  background: none;
  border: 0;
  border-radius: 6px;
  padding: 0.5rem 0.75rem;

  &:hover,
  &:focus-visible { background: ${({ theme }) => theme.colors.accentSoft}; }
`;

export default function Dropdown({ label, options, align = 'left' }) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);
  const buttonRef = useRef(null);
  const itemRefs = useRef([]);
  const menuId = useId();

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) itemRefs.current[0]?.focus();
  }, [isOpen]);

  const handleSelect = (option) => {
    option.onSelect?.();
    setIsOpen(false);
    buttonRef.current?.focus();
  };

  const handleMenuKeyDown = (event, index) => {
    const last = options.length - 1;
    if (event.key === 'ArrowDown') itemRefs.current[index === last ? 0 : index + 1]?.focus();
    else if (event.key === 'ArrowUp') itemRefs.current[index === 0 ? last : index - 1]?.focus();
    else if (event.key === 'Escape') {
      setIsOpen(false);
      buttonRef.current?.focus();
    } else return;
    event.preventDefault();
  };

  return (
    <Wrapper ref={containerRef}>
      <Trigger
        ref={buttonRef}
        type="button"
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-controls={menuId}
        onClick={() => setIsOpen((open) => !open)}
      >
        {label}
        <Arrow $open={isOpen} aria-hidden="true" />
      </Trigger>

      {isOpen && (
        <Menu id={menuId} role="menu" $align={align}>
          {options.map((option, index) => (
            <li key={option.label} role="none">
              <Option
                ref={(element) => (itemRefs.current[index] = element)}
                type="button"
                role="menuitem"
                onClick={() => handleSelect(option)}
                onKeyDown={(event) => handleMenuKeyDown(event, index)}
              >
                {option.label}
              </Option>
            </li>
          ))}
        </Menu>
      )}
    </Wrapper>
  );
}
