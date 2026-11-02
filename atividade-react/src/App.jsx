import { useEffect, useMemo, useState } from 'react';
import styled, { css } from 'styled-components';
import Accordion from './components/Accordion.jsx';
import Pagination from './components/Pagination.jsx';
import ProgressBar from './components/ProgressBar.jsx';
import Tabs from './components/Tabs.jsx';
import Dropdown from './components/Dropdown.jsx';
import { useToast } from './context/ToastContext.jsx';
import { Actions, Button, Muted } from './styles/shared.js';

const FAQ_ITEMS = [
  {
    title: 'Como acesso o material da disciplina?',
    content: 'Todo o material fica disponível no ambiente virtual, na aba de conteúdos. Slides, listas de exercícios e vídeos são publicados a cada semana.',
  },
  {
    title: 'Qual é o prazo para entregar as atividades?',
    content: 'Cada atividade informa o prazo no enunciado. Envios fora do prazo perdem pontos de forma proporcional ao atraso.',
  },
  {
    title: 'Posso refazer uma atividade já entregue?',
    content: 'Sim, desde que o prazo ainda esteja aberto. Apenas a última versão enviada será corrigida.',
  },
  {
    title: 'Como falo com o professor?',
    content: 'Use o fórum da disciplina para dúvidas gerais e o e-mail institucional para assuntos individuais. As respostas chegam em até dois dias úteis.',
  },
];

const TOPICS = [
  'Algoritmos', 'Estruturas de Dados', 'Banco de Dados', 'Engenharia de Requisitos',
  'Redes de Computadores', 'Sistemas Operacionais', 'Programação Web', 'Teste de Software',
  'Arquitetura de Software', 'Interface Humano-Computador', 'Segurança da Informação', 'Computação em Nuvem',
];

const COURSES = TOPICS.flatMap((topic, index) => [
  { id: `${index}-1`, name: `${topic} I`, hours: 40 + (index % 3) * 20 },
  { id: `${index}-2`, name: `${topic} II`, hours: 60 + (index % 3) * 20 },
]);

const PAGE_SIZE = 4;

const SORT_OPTIONS = {
  nameAsc: 'Nome (A–Z)',
  nameDesc: 'Nome (Z–A)',
  hours: 'Carga horária',
};

const LANGUAGES = ['Português', 'English', 'Español'];

const Container = styled.div`
  width: 100%;
  max-width: 1080px;
  margin-inline: auto;
  padding-inline: 1rem;

  ${({ theme }) => theme.media.tablet} { padding-inline: 1.5rem; }
`;

const SkipLink = styled.a`
  position: absolute;
  left: 1rem;
  top: -4rem;
  z-index: 100;
  background: ${({ theme }) => theme.colors.ink};
  color: #fff;
  padding: 0.5rem 1rem;
  border-radius: 6px;

  &:focus { top: 0.5rem; }
`;

const Header = styled.header`
  background: ${({ theme }) => theme.colors.ink};
  color: #fff;
  padding-block: 1.25rem;
`;

const HeaderInner = styled(Container)`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: flex-start;

  ${({ theme }) => theme.media.tablet} {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
`;

const Kicker = styled.p`
  font-size: 0.85rem;
  color: #aebbd2;
`;

const Title = styled.h1`
  font-size: 1.6rem;
  line-height: 1.2;

  ${({ theme }) => theme.media.tablet} { font-size: 2rem; }
`;

const Layout = styled(Container).attrs({ as: 'main' })`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
  padding-block: 1.5rem;

  ${({ theme }) => theme.media.desktop} {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.25rem;
  }
`;

const Card = styled.section`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius};
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  min-width: 0;

  h2 { font-size: 1.2rem; }

  ${({ $wide, theme }) =>
    $wide &&
    css`
      ${theme.media.desktop} { grid-column: 1 / -1; }
    `}
`;

const CardHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  align-items: flex-start;

  ${({ theme }) => theme.media.tablet} {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
`;

const CourseGrid = styled.ul`
  display: grid;
  grid-template-columns: 1fr;
  gap: 0.75rem;

  ${({ theme }) => theme.media.tablet} { grid-template-columns: repeat(2, 1fr); }
  ${({ theme }) => theme.media.desktop} { grid-template-columns: repeat(4, 1fr); }
`;

const Course = styled.li`
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  padding: 0.9rem 1rem;
  background: ${({ theme }) => theme.colors.bg};

  h3 { font-size: 1rem; }
  p { color: ${({ theme }) => theme.colors.muted}; font-size: 0.9rem; }
`;

const Details = styled.dl`
  display: grid;
  gap: 0.6rem;

  div {
    display: flex;
    justify-content: space-between;
    gap: 1rem;
    border-bottom: 1px solid ${({ theme }) => theme.colors.border};
    padding-bottom: 0.5rem;
  }
  dt { color: ${({ theme }) => theme.colors.muted}; }
  dd { font-weight: 600; text-align: right; }
`;

const PlainList = styled.ul`
  display: grid;
  gap: 0.4rem;
`;

const Footer = styled.footer`
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  padding-block: 1.25rem;
  color: ${({ theme }) => theme.colors.muted};
  font-size: 0.9rem;
`;

export default function App() {
  const { showToast } = useToast();

  const [currentPage, setCurrentPage] = useState(1);
  const [sortKey, setSortKey] = useState('nameAsc');

  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);

  const [language, setLanguage] = useState('Português');

  const sortedCourses = useMemo(() => {
    const list = [...COURSES];
    if (sortKey === 'nameAsc') list.sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'));
    if (sortKey === 'nameDesc') list.sort((a, b) => b.name.localeCompare(a.name, 'pt-BR'));
    if (sortKey === 'hours') list.sort((a, b) => a.hours - b.hours || a.name.localeCompare(b.name, 'pt-BR'));
    return list;
  }, [sortKey]);

  const totalPages = Math.ceil(sortedCourses.length / PAGE_SIZE);
  const visibleCourses = sortedCourses.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const handleSort = (key) => {
    setSortKey(key);
    setCurrentPage(1);
    showToast(`Ordenado por ${SORT_OPTIONS[key]}.`, 'info');
  };

  const handleLanguage = (lang) => {
    setLanguage(lang);
    showToast(`Idioma alterado para ${lang}.`, 'success');
  };

  useEffect(() => {
    if (!uploading) return;
    const interval = setInterval(() => {
      setProgress((value) => Math.min(100, value + Math.random() * 12 + 4));
    }, 400);
    return () => clearInterval(interval);
  }, [uploading]);

  useEffect(() => {
    if (uploading && progress >= 100) {
      setUploading(false);
      showToast('Arquivo enviado com sucesso.', 'success');
    }
  }, [progress, uploading, showToast]);

  const startUpload = () => {
    setProgress(0);
    setUploading(true);
    showToast('Envio iniciado.', 'info');
  };

  const cancelUpload = () => {
    setUploading(false);
    setProgress(0);
    showToast('Envio cancelado. Tente novamente quando quiser.', 'error');
  };

  const profileTabs = [
    {
      id: 'dados',
      label: 'Dados pessoais',
      content: (
        <Details>
          <div><dt>Nome</dt><dd>Maria Souza</dd></div>
          <div><dt>Curso</dt><dd>Engenharia de Software</dd></div>
          <div><dt>Semestre</dt><dd>2026.2</dd></div>
        </Details>
      ),
    },
    {
      id: 'disciplinas',
      label: 'Disciplinas',
      content: (
        <PlainList>
          <li>Programação Web</li>
          <li>Engenharia de Requisitos</li>
          <li>Banco de Dados II</li>
        </PlainList>
      ),
    },
    {
      id: 'config',
      label: 'Configurações',
      content: (
        <div>
          <Muted>Salve suas preferências para receber avisos de prazos.</Muted>
          <Actions style={{ marginTop: '0.75rem' }}>
            <Button type="button" onClick={() => showToast('Preferências salvas.', 'success')}>
              Salvar preferências
            </Button>
          </Actions>
        </div>
      ),
    },
  ];

  return (
    <>
      <SkipLink href="#conteudo">Ir para o conteúdo</SkipLink>

      <Header>
        <HeaderInner>
          <div>
            <Kicker>Escola de Tecnologias · UCSAL</Kicker>
            <Title>Portal da Disciplina</Title>
          </div>
          <Dropdown
            label={`Idioma: ${language}`}
            align="right"
            options={LANGUAGES.map((lang) => ({ label: lang, onSelect: () => handleLanguage(lang) }))}
          />
        </HeaderInner>
      </Header>

      <Layout id="conteudo">
        <Card $wide aria-labelledby="titulo-catalogo">
          <CardHeader>
            <h2 id="titulo-catalogo">Catálogo de disciplinas</h2>
            <Dropdown
              label={`Ordenar por: ${SORT_OPTIONS[sortKey]}`}
              options={Object.entries(SORT_OPTIONS).map(([key, text]) => ({
                label: text,
                onSelect: () => handleSort(key),
              }))}
            />
          </CardHeader>

          <CourseGrid>
            {visibleCourses.map((course) => (
              <Course key={course.id}>
                <h3>{course.name}</h3>
                <p>{course.hours} horas</p>
              </Course>
            ))}
          </CourseGrid>

          <Muted aria-live="polite">
            Página {currentPage} de {totalPages} · {sortedCourses.length} disciplinas
          </Muted>
          <Pagination totalPages={totalPages} currentPage={currentPage} onPageChange={setCurrentPage} />
        </Card>

        <Card aria-labelledby="titulo-upload">
          <h2 id="titulo-upload">Envio de atividade</h2>
          <Muted>Simule o envio de um arquivo e acompanhe o andamento.</Muted>
          <ProgressBar value={progress} label="Envio do arquivo" />
          <Actions>
            <Button type="button" onClick={startUpload} disabled={uploading}>
              {uploading ? 'Enviando…' : 'Enviar arquivo'}
            </Button>
            <Button type="button" $variant="ghost" onClick={cancelUpload} disabled={!uploading}>
              Cancelar
            </Button>
          </Actions>
        </Card>

        <Card aria-labelledby="titulo-perfil">
          <h2 id="titulo-perfil">Meu perfil</h2>
          <Tabs tabs={profileTabs} />
        </Card>

        <Card $wide aria-labelledby="titulo-faq">
          <h2 id="titulo-faq">Perguntas frequentes</h2>
          <Accordion items={FAQ_ITEMS} />
        </Card>

        <Card $wide aria-labelledby="titulo-toast">
          <h2 id="titulo-toast">Testar notificações</h2>
          <Muted>Os avisos aparecem no canto da tela e somem sozinhos.</Muted>
          <Actions>
            <Button type="button" onClick={() => showToast('Operação concluída.', 'success')}>Sucesso</Button>
            <Button type="button" onClick={() => showToast('Não foi possível salvar. Verifique sua conexão.', 'error')}>Erro</Button>
            <Button type="button" onClick={() => showToast('Há 3 novos materiais disponíveis.', 'info')}>Informação</Button>
          </Actions>
        </Card>
      </Layout>

      <Footer>
        <Container>Atividade ReactJs · Prof. Elton Figueiredo da Silva</Container>
      </Footer>
    </>
  );
}
