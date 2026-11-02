import styled from 'styled-components';

const Nav = styled.nav`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
`;

const List = styled.ul`
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
  justify-content: center;
  align-items: center;
`;

const NavButton = styled.button`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  padding: 0.45rem 0.8rem;

  &:hover:not(:disabled) { background: ${({ theme }) => theme.colors.accentSoft}; }
`;

const PageButton = styled(NavButton)`
  min-width: 2.4rem;
  ${({ $current, theme }) =>
    $current &&
    `
    background: ${theme.colors.accent};
    border-color: ${theme.colors.accent};
    color: #fff;
    font-weight: 700;
    &:hover:not(:disabled) { background: ${theme.colors.accent}; }
  `}
`;

const Ellipsis = styled.li`
  padding-inline: 0.25rem;
  color: ${({ theme }) => theme.colors.muted};
`;

function buildPageList(current, total) {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }
  const pages = [1];
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);
  if (start > 2) pages.push('ellipsis-start');
  for (let page = start; page <= end; page++) pages.push(page);
  if (end < total - 1) pages.push('ellipsis-end');
  pages.push(total);
  return pages;
}

export default function Pagination({ totalPages, currentPage, onPageChange }) {
  const isFirst = currentPage <= 1;
  const isLast = currentPage >= totalPages;

  return (
    <Nav aria-label="Paginação do catálogo">
      <NavButton type="button" onClick={() => onPageChange(currentPage - 1)} disabled={isFirst}>
        Anterior
      </NavButton>

      <List>
        {buildPageList(currentPage, totalPages).map((page) =>
          typeof page === 'string' ? (
            <Ellipsis key={page} aria-hidden="true">…</Ellipsis>
          ) : (
            <li key={page}>
              <PageButton
                type="button"
                $current={page === currentPage}
                onClick={() => onPageChange(page)}
                aria-current={page === currentPage ? 'page' : undefined}
                aria-label={`Página ${page}`}
              >
                {page}
              </PageButton>
            </li>
          )
        )}
      </List>

      <NavButton type="button" onClick={() => onPageChange(currentPage + 1)} disabled={isLast}>
        Próxima
      </NavButton>
    </Nav>
  );
}
