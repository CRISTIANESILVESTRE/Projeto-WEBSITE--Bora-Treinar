import { type FormEvent, useEffect, useRef, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Bot,
  ChevronDown,
  CircleHelp,
  Headphones,
  MessageCircle,
  RefreshCw,
  Send,
  UserRound,
  X,
} from 'lucide-react';

type Author = 'assistant' | 'user';
type ChatScreen =
  | 'home'
  | 'academy'
  | 'new-client'
  | 'student'
  | 'help'
  | 'lead'
  | 'retention-reason'
  | 'retention-data'
  | 'issue-data'
  | 'human';
type LeadField = 'name' | 'whatsapp' | 'goal' | 'time';
type AlertPriority = 'BAIXA' | 'MÉDIA' | 'ALTA';
type AlertStatus = 'NOVO' | 'EM ATENDIMENTO' | 'RESOLVIDO';

type ChatMessage = {
  id: string;
  author: Author;
  text: string;
};

type Choice = {
  id: string;
  label: string;
};

type LeadDraft = Record<LeadField, string>;

const initialMessage =
  'Oi! 👋 Eu sou o Bora, assistente do Bora Treinar. Como posso ajudar você hoje?';

const rootChoices: Choice[] = [
  { id: 'academy', label: 'Quero conhecer a academia' },
  { id: 'trial', label: 'Quero fazer uma aula experimental' },
  { id: 'plans', label: 'Quero saber sobre planos' },
  { id: 'classes', label: 'Quero conhecer as aulas' },
  { id: 'student', label: 'Sou aluno' },
  { id: 'help', label: 'Preciso de ajuda' },
  { id: 'human', label: 'Falar com a equipe' },
];

const clientChoices: Choice[] = [
  { id: 'wellhub', label: 'Wellhub' },
  { id: 'totalpass', label: 'TotalPass' },
  { id: 'location', label: 'Localização' },
  { id: 'contact', label: 'Contato' },
];

const academyChoices: Choice[] = [
  { id: 'modalities', label: 'Modalidades' },
  { id: 'classes', label: 'Aulas' },
  { id: 'structure', label: 'Estrutura' },
  { id: 'kids', label: 'Espaço Kids' },
  { id: 'plans', label: 'Planos' },
  { id: 'trial', label: 'Aula experimental' },
];

const helpChoices: Choice[] = [
  { id: 'academy-question', label: 'Dúvida sobre a academia' },
  { id: 'student-help', label: 'Sou aluno' },
  { id: 'complaint', label: 'Tenho uma reclamação' },
  { id: 'human', label: 'Falar com humano' },
];

const studentChoices: Choice[] = [
  { id: 'my-workout', label: 'Meu treino' },
  { id: 'book-class', label: 'Reservar aula' },
  { id: 'coach', label: 'Falar com professor' },
  { id: 'change-time', label: 'Alterar horário' },
  { id: 'pause-plan', label: 'Pausar plano' },
  { id: 'cancel', label: 'Estou pensando em cancelar' },
  { id: 'complaint', label: 'Tenho uma reclamação' },
  { id: 'student-team', label: 'Falar com equipe' },
];

const retentionChoices: Choice[] = [
  { id: 'time', label: 'Falta de tempo' },
  { id: 'price', label: 'Preço' },
  { id: 'trip', label: 'Viagem' },
  { id: 'results', label: 'Não estou vendo resultados' },
  { id: 'schedule', label: 'Horário' },
  { id: 'professor', label: 'Professor' },
  { id: 'service', label: 'Atendimento' },
  { id: 'structure', label: 'Estrutura' },
  { id: 'other', label: 'Outro' },
];

const retentionPriorities: Record<string, AlertPriority> = {
  time: 'MÉDIA',
  price: 'MÉDIA',
  trip: 'BAIXA',
  results: 'MÉDIA',
  schedule: 'MÉDIA',
  professor: 'MÉDIA',
  service: 'ALTA',
  structure: 'MÉDIA',
  other: 'MÉDIA',
};

const retentionReplies: Record<string, string> = {
  time:
    'Podemos olhar alternativas de rotina, mas não há horários alternativos ou treino rápido configurados aqui. A equipe pode verificar o que está disponível para você.',
  price:
    'Entendo. Não há planos ou condições comerciais configurados neste atendimento, então não vou inventar uma alternativa. A equipe pode verificar as opções disponíveis.',
  trip:
    'Entendi. A possibilidade de pausa depende do seu plano e precisa ser confirmada pela equipe. Posso registrar seu pedido para esse retorno.',
  results:
    'Cada corpo responde de um jeito e em um tempo diferente. Podemos registrar um alerta para uma reavaliação e uma conversa com o professor, sem pressionar você a continuar.',
  schedule:
    'Podemos procurar uma alternativa, mas a grade atual não está configurada aqui. A equipe pode conferir os horários disponíveis.',
  professor:
    'Obrigado por falar. Vou registrar seu feedback para que a gestão e o professor responsável possam acompanhar.',
  service:
    'Sinto muito que o atendimento não tenha funcionado como deveria. Vou registrar a reclamação com prioridade alta para a equipe responsável.',
  structure:
    'Obrigado pelo feedback. Vou registrar o ponto sobre a estrutura para a gestão acompanhar.',
  other:
    'Tudo bem. Você pode contar um pouco mais no próximo passo. Vou registrar o motivo sem tentar direcionar sua decisão.',
};

const clientReplies: Record<string, string> = {
  academy:
    'O Bora Treinar é um clube de treino urbano para quem quer começar, evoluir e continuar com acompanhamento próximo, comunidade e um ritmo possível.',
  modalities:
    'Hoje você pode conhecer musculação, funcional, HIIT, mobilidade e aulas coletivas. A equipe ajuda a encontrar o melhor ponto de partida para o seu objetivo.',
  classes:
    'Temos aulas coletivas e diferentes formas de treinar, incluindo musculação, funcional, HIIT e mobilidade. A grade e os horários estão em confirmação com a equipe.',
  structure:
    'A proposta é juntar estrutura de treino, acompanhamento e tecnologia em um ambiente acolhedor. Para detalhes atualizados de endereço, horários e disponibilidade, fale com a equipe.',
  kids:
    'O Bora Família inclui o conceito de Espaço Kids para ajudar quem tem filhos a encontrar espaço para treinar na rotina. Disponibilidade e condições precisam ser confirmadas.',
  plans:
    'Existem opções para diferentes momentos da jornada. Valores e condições ainda não estão publicados aqui; a equipe pode explicar as alternativas sem compromisso.',
  trial:
    'Bora! A equipe pode confirmar a disponibilidade e combinar o melhor próximo passo para sua aula experimental. Me conta como falar com você?',
  wellhub:
    'O Wellhub pode ser uma forma de acesso, mas a disponibilidade atual precisa ser confirmada diretamente com a equipe.',
  totalpass:
    'O TotalPass pode ser uma forma de acesso, mas a disponibilidade atual precisa ser confirmada diretamente com a equipe.',
  location:
    'O endereço ainda está como informação a confirmar. Deixe seu contato e a equipe envia os dados corretos para você.',
  contact:
    'Claro. Posso registrar seu interesse e pedir para a equipe falar com você pelo melhor canal.',
};

const studentReplies: Record<string, string> = {
  'my-workout':
    'Eu não consigo abrir seu treino por aqui ainda. Posso encaminhar você para a equipe ou para um professor continuar o atendimento.',
  'book-class':
    'A reserva precisa ser confirmada pela equipe com a grade atual. Posso registrar seu pedido para alguém te ajudar.',
  coach:
    'Boa. Vou pedir seus dados para a equipe ou para um professor continuar com você.',
  'change-time':
    'Vamos encontrar um horário que faça sentido. A equipe precisa consultar a disponibilidade atual para confirmar a troca.',
  'pause-plan':
    'A pausa do plano depende das condições do seu contrato. Posso registrar o pedido para a equipe verificar com você.',
  complaint:
    'Sinto muito que algo não tenha saído bem. Quero registrar isso com cuidado para a equipe entender e acompanhar.',
  'student-team':
    'Claro. Vou pedir alguns dados rápidos para encaminhar seu atendimento.',
};

const leadFieldLabels: Record<LeadField, string> = {
  name: 'seu nome',
  whatsapp: 'seu WhatsApp',
  goal: 'o seu objetivo',
  time: 'o melhor horário para contato',
};

const leadPlaceholders: Record<LeadField, string> = {
  name: 'Como podemos te chamar?',
  whatsapp: '(00) 00000-0000',
  goal: 'Ex.: começar, emagrecimento, força...',
  time: 'Ex.: manhã, almoço, tarde ou noite',
};

const goalSuggestions = [
  'Começar a treinar',
  'Emagrecimento',
  'Hipertrofia e força',
  'Condicionamento',
  'Qualidade de vida',
  'Treinar em família',
];

const timeSuggestions = ['Manhã', 'Almoço', 'Tarde', 'Noite'];

const makeId = () =>
  `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

function readStoredItems(key: string): unknown[] {
  try {
    const value = window.localStorage.getItem(key);
    if (!value) return [];
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function SupportChat() {
  const [open, setOpen] = useState(false);
  const [screen, setScreen] = useState<ChatScreen>('home');
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: makeId(), author: 'assistant', text: initialMessage },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState('');
  const [leadContext, setLeadContext] = useState('');
  const [leadStep, setLeadStep] = useState<LeadField>('name');
  const [leadDraft, setLeadDraft] = useState<LeadDraft>({
    name: '',
    whatsapp: '',
    goal: '',
    time: '',
  });
  const [retentionReason, setRetentionReason] = useState('');
  const [retentionStep, setRetentionStep] = useState<'name' | 'whatsapp'>(
    'name',
  );
  const [retentionDraft, setRetentionDraft] = useState({
    name: '',
    whatsapp: '',
  });
  const [retentionPriority, setRetentionPriority] =
    useState<AlertPriority>('MÉDIA');
  const [issueCategory, setIssueCategory] = useState('');
  const [issuePriority, setIssuePriority] =
    useState<AlertPriority>('MÉDIA');
  const [issueStep, setIssueStep] = useState<'name' | 'whatsapp'>('name');
  const [issueDraft, setIssueDraft] = useState({
    name: '',
    whatsapp: '',
  });
  const [draft, setDraft] = useState('');
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const addMessage = (author: Author, text: string) => {
    setMessages((current) => [...current, { id: makeId(), author, text }]);
  };

  const reply = (
    text: string,
    after?: () => void,
    delay = 420,
  ) => {
    setIsTyping(true);
    window.setTimeout(() => {
      addMessage('assistant', text);
      setIsTyping(false);
      after?.();
    }, delay);
  };

  const resetChat = () => {
    setMessages([{ id: makeId(), author: 'assistant', text: initialMessage }]);
    setScreen('home');
    setIsTyping(false);
    setError('');
    setLeadContext('');
    setLeadStep('name');
    setLeadDraft({ name: '', whatsapp: '', goal: '', time: '' });
    setRetentionReason('');
    setRetentionStep('name');
    setRetentionDraft({ name: '', whatsapp: '' });
    setRetentionPriority('MÉDIA');
    setIssueCategory('');
    setIssuePriority('MÉDIA');
    setIssueStep('name');
    setIssueDraft({ name: '', whatsapp: '' });
    setDraft('');
  };

  const startLeadCapture = (context: string) => {
    setError('');
    setLeadContext(context);
    setLeadStep('name');
    setLeadDraft({ name: '', whatsapp: '', goal: '', time: '' });
    setScreen('lead');
    reply('Perfeito. Para começar, me passa seu nome?');
  };

  const startIssueCapture = (
    category: string,
    priority: AlertPriority,
    openingMessage: string,
  ) => {
    setError('');
    setIssueCategory(category);
    setIssuePriority(priority);
    setIssueStep('name');
    setIssueDraft({ name: '', whatsapp: '' });
    setScreen('issue-data');
    reply(`${openingMessage} Para registrar, qual é o seu nome?`);
  };

  const handleRootChoice = (choice: Choice) => {
    setError('');
    addMessage('user', choice.label);
    if (choice.id === 'student') {
      setScreen('student');
      reply('Boa! Como posso ajudar no seu treino hoje?');
      return;
    }
    if (choice.id === 'help') {
      setScreen('help');
      reply('Claro. Primeiro vou identificar o assunto para resolver o que for possível por aqui.');
      return;
    }
    if (choice.id === 'human') {
      startLeadCapture('atendimento com a equipe');
      return;
    }
    if (choice.id === 'trial') {
      startLeadCapture('aula experimental');
      return;
    }
    setScreen('academy');
    reply(
      choice.id === 'academy'
        ? 'Claro. O que você quer conhecer primeiro?'
        : clientReplies[choice.id],
    );
  };

  const handleHelpChoice = (choice: Choice) => {
    setError('');
    addMessage('user', choice.label);
    if (choice.id === 'academy-question') {
      setScreen('academy');
      reply('Posso ajudar com informações simples sobre a academia. O que você quer saber?');
      return;
    }
    if (choice.id === 'student-help') {
      setScreen('student');
      reply('Boa! Como posso ajudar no seu treino hoje?');
      return;
    }
    if (choice.id === 'complaint') {
      startIssueCapture(
        'reclamação',
        'ALTA',
        'Sinto muito que algo não tenha saído bem. Vou registrar isso com prioridade alta para a equipe responsável.',
      );
      return;
    }
    startLeadCapture('atendimento humano');
  };

  const handleClientChoice = (choice: Choice) => {
    setError('');
    addMessage('user', choice.label);
    if (choice.id === 'trial') {
      startLeadCapture('aula experimental');
      return;
    }
    setScreen(choice.id === 'academy' ? 'academy' : 'new-client');
    reply(clientReplies[choice.id] ?? 'Posso pedir ajuda da equipe com essa informação.');
  };

  const handleStudentChoice = (choice: Choice) => {
    setError('');
    addMessage('user', choice.label);
    if (choice.id === 'cancel') {
      setScreen('retention-reason');
      reply('Entendi. Antes de qualquer decisão, queremos entender o que está dificultando sua continuidade. O que aconteceu?');
      return;
    }
    if (choice.id === 'complaint') {
      startIssueCapture(
        'reclamação',
        'ALTA',
        'Sinto muito que algo não tenha saído bem. Vou registrar sua reclamação com prioridade alta.',
      );
      return;
    }
    if (choice.id === 'coach') {
      startIssueCapture(
        'problema com professor',
        'MÉDIA',
        'Obrigado por falar. Vou registrar seu feedback para a gestão acompanhar.',
      );
      return;
    }
    if (choice.id === 'pause-plan') {
      startIssueCapture(
        'pedido de pausa',
        'BAIXA',
        'Entendi. A possibilidade de pausa depende do seu plano e precisa ser confirmada pela equipe.',
      );
      return;
    }
    if (choice.id === 'student-team') {
      startLeadCapture('atendimento de aluno');
      return;
    }
    setScreen('student');
    reply(studentReplies[choice.id] ?? 'Posso pedir ajuda da equipe com isso.');
  };

  const handleRetentionReason = (choice: Choice) => {
    setError('');
    setRetentionReason(choice.label);
    setRetentionPriority(retentionPriorities[choice.id] ?? 'MÉDIA');
    addMessage('user', choice.label);
    setScreen('retention-data');
    setRetentionStep('name');
    reply(
      `${retentionReplies[choice.id]} Obrigado por contar. Qual é o seu nome?`,
    );
  };

  const saveLead = () => {
    const record = {
      ...leadDraft,
      intent: leadContext,
      status: 'NOVO' as AlertStatus,
      responsible: 'A definir pela equipe',
      capturedAt: new Date().toISOString(),
    };
    try {
      const current = readStoredItems('bora-treinar-chat-leads');
      window.localStorage.setItem(
        'bora-treinar-chat-leads',
        JSON.stringify([...current, record]),
      );
      return true;
    } catch {
      setError('Não consegui salvar os dados neste dispositivo. Tente novamente.');
      return false;
    }
  };

  const saveAlert = (
    student: { name: string; whatsapp: string },
    category: string,
    priority: AlertPriority,
  ) => {
    const record = {
      aluno: student,
      categoria: category,
      prioridade: priority,
      data: new Date().toISOString(),
      status: 'NOVO' as AlertStatus,
      responsavel: 'A definir pela equipe',
    };
    try {
      const current = readStoredItems('bora-treinar-chat-alerts');
      window.localStorage.setItem(
        'bora-treinar-chat-alerts',
        JSON.stringify([...current, record]),
      );
      return true;
    } catch {
      setError('Não consegui registrar o alerta agora. Tente novamente em instantes.');
      return false;
    }
  };

  const saveRetention = () => {
    const record = {
      intent: 'cancelamento',
      reason: retentionReason,
      student: retentionDraft,
      recordedAt: new Date().toISOString(),
    };
    try {
      const current = readStoredItems('bora-treinar-chat-retention');
      window.localStorage.setItem(
        'bora-treinar-chat-retention',
        JSON.stringify([...current, record]),
      );
      return saveAlert(retentionDraft, `intenção de cancelamento — ${retentionReason}`, retentionPriority);
    } catch {
      setError('Não consegui registrar agora. Tente novamente em instantes.');
      return false;
    }
  };

  const saveIssue = () => {
    const record = {
      intent: issueCategory,
      student: issueDraft,
      recordedAt: new Date().toISOString(),
    };
    try {
      const current = readStoredItems('bora-treinar-chat-issues');
      window.localStorage.setItem(
        'bora-treinar-chat-issues',
        JSON.stringify([...current, record]),
      );
      return saveAlert(issueDraft, issueCategory, issuePriority);
    } catch {
      setError('Não consegui registrar agora. Tente novamente em instantes.');
      return false;
    }
  };

  const handleLeadSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    const value = leadDraft[leadStep].trim();
    if (!value) {
      setError(`Preencha ${leadFieldLabels[leadStep]} para continuar.`);
      return;
    }
    addMessage('user', value);
    setDraft('');

    if (leadStep === 'name') {
      setLeadStep('whatsapp');
      reply(`Prazer, ${value}. Agora me passa ${leadFieldLabels.whatsapp}?`);
    } else if (leadStep === 'whatsapp') {
      setLeadStep('goal');
      reply('Obrigada. O que você busca neste momento?');
    } else if (leadStep === 'goal') {
      setLeadStep('time');
      reply('Entendi. Qual é o melhor horário para a equipe falar com você?');
    } else if (saveLead()) {
      setScreen('home');
      reply(
        'Obrigado por nos contar. 💚 Registramos sua solicitação e nossa equipe poderá continuar o atendimento. Por enquanto, o registro fica salvo neste dispositivo; quando o CRM estiver conectado, ele poderá seguir automaticamente para a equipe.',
        undefined,
        560,
      );
    }
  };

  const handleRetentionSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    const value = retentionDraft[retentionStep].trim();
    if (!value) {
      setError(
        retentionStep === 'name'
          ? 'Preencha seu nome para continuar.'
          : 'Preencha seu WhatsApp para registrar o pedido.',
      );
      return;
    }
    addMessage('user', value);
    setDraft('');
    if (retentionStep === 'name') {
      setRetentionStep('whatsapp');
      reply('Obrigado. Agora me passa seu WhatsApp?');
      return;
    }
    if (saveRetention()) {
      setScreen('student');
      reply(
        'Obrigado por nos contar. 💚 Registramos sua solicitação e nossa equipe poderá continuar o atendimento.',
        undefined,
        560,
      );
    }
  };

  const handleIssueSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    const value = issueDraft[issueStep].trim();
    if (!value) {
      setError(
        issueStep === 'name'
          ? 'Preencha seu nome para continuar.'
          : 'Preencha seu WhatsApp para registrar o pedido.',
      );
      return;
    }
    addMessage('user', value);
    setDraft('');
    if (issueStep === 'name') {
      setIssueStep('whatsapp');
      reply('Obrigado. Agora me passa seu WhatsApp?');
      return;
    }
    if (saveIssue()) {
      setScreen('student');
      reply(
        'Obrigado por nos contar. 💚 Registramos sua solicitação e nossa equipe poderá continuar o atendimento.',
        undefined,
        560,
      );
    }
  };

  const handleInputChange = (value: string) => {
    setDraft(value);
    if (screen === 'lead') {
      setLeadDraft((current) => ({ ...current, [leadStep]: value }));
    } else if (screen === 'retention-data') {
      setRetentionDraft((current) => ({ ...current, [retentionStep]: value }));
    } else if (screen === 'issue-data') {
      setIssueDraft((current) => ({ ...current, [issueStep]: value }));
    }
  };

  const goBack = () => {
    setError('');
    if (screen === 'home') return;
    if (screen === 'lead' || screen === 'human') {
      setScreen('academy');
      return;
    }
    if (
      screen === 'retention-data' ||
      screen === 'retention-reason' ||
      screen === 'issue-data'
    ) {
      setScreen('student');
      return;
    }
    if (screen === 'new-client') {
      setScreen('academy');
      return;
    }
    setScreen('home');
  };

  const choices =
    screen === 'home'
      ? rootChoices
      : screen === 'academy'
        ? academyChoices
      : screen === 'new-client'
        ? clientChoices
          : screen === 'student'
            ? studentChoices
            : screen === 'help'
              ? helpChoices
              : screen === 'retention-reason'
                ? retentionChoices
                : [];

  const inputLabel =
    screen === 'lead'
      ? `Digite ${leadFieldLabels[leadStep]}`
      : screen === 'issue-data'
        ? `Digite ${issueStep === 'name' ? 'seu nome' : 'seu WhatsApp'}`
      : `Digite ${retentionStep === 'name' ? 'seu nome' : 'seu WhatsApp'}`;
  const inputPlaceholder =
    screen === 'lead'
      ? leadPlaceholders[leadStep]
      : screen === 'issue-data'
        ? issueStep === 'name'
          ? 'Como podemos te chamar?'
          : '(00) 00000-0000'
      : retentionStep === 'name'
        ? 'Como podemos te chamar?'
        : '(00) 00000-0000';
  const isWhatsApp =
    (screen === 'lead' && leadStep === 'whatsapp') ||
    (screen === 'retention-data' && retentionStep === 'whatsapp') ||
    (screen === 'issue-data' && issueStep === 'whatsapp');

  return (
    <>
      {open && (
        <section
          className="chat-panel fixed bottom-4 right-4 z-[60] flex h-[min(680px,calc(100dvh-2rem))] w-[min(390px,calc(100vw-2rem))] flex-col overflow-hidden rounded-[28px] border border-[#123c32]/10 bg-[#f5f7f2] text-[#171a19] shadow-2xl shadow-[#123c32]/30"
          aria-label="Chat de atendimento Bora Treinar"
        >
          <header className="flex items-center justify-between bg-[#123c32] px-5 py-4 text-[#f5f7f2]">
            <div className="flex items-center gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#b8f500] text-[#123c32]">
                <Bot size={21} />
              </span>
              <div>
                <p className="font-display text-lg font-bold leading-none">
                  bora<span className="text-[#b8f500]">.</span>
                </p>
                <p className="mt-1 text-[11px] text-[#f5f7f2]/60">
                  Atendimento online
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-full p-2 text-[#f5f7f2]/70 transition-colors hover:bg-white/10 hover:text-white"
              aria-label="Fechar chat"
              data-testid="button-chat-close"
            >
              <X size={19} />
            </button>
          </header>

          <div
            className="chat-scroll min-h-0 flex-1 overflow-y-auto px-4 py-5 sm:px-5"
            role="log"
            aria-live="polite"
            aria-label="Mensagens do atendimento"
          >
            {messages.length === 0 ? (
              <div className="flex min-h-full flex-col items-center justify-center px-5 text-center">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-[#e7ede4] text-[#123c32]">
                  <MessageCircle size={22} />
                </span>
                <p className="mt-4 font-display text-xl font-bold text-[#123c32]">
                  Bora conversar?
                </p>
                <p className="mt-2 text-sm text-[#5e6861]">
                  Escolha uma opção para começar.
                </p>
              </div>
            ) : (
              <>
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`mb-3 flex items-end gap-2 ${
                      message.author === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    {message.author === 'assistant' && (
                      <span className="mb-1 grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-[#123c32] text-[#b8f500]">
                        <Bot size={14} />
                      </span>
                    )}
                    <div
                      className={`max-w-[84%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                        message.author === 'user'
                          ? 'rounded-br-md bg-[#123c32] text-[#f5f7f2]'
                          : 'rounded-bl-md bg-[#e7ede4] text-[#30413a]'
                      }`}
                    >
                      {message.text}
                    </div>
                    {message.author === 'user' && (
                      <span className="mb-1 grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-[#b8f500] text-[#123c32]">
                        <UserRound size={14} />
                      </span>
                    )}
                  </div>
                ))}
                {isTyping && (
                  <div className="mb-3 flex items-end gap-2">
                    <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-[#123c32] text-[#b8f500]">
                      <Bot size={14} />
                    </span>
                    <div className="flex items-center gap-1 rounded-2xl rounded-bl-md bg-[#e7ede4] px-4 py-3">
                      <span className="chat-dot" />
                      <span className="chat-dot [animation-delay:120ms]" />
                      <span className="chat-dot [animation-delay:240ms]" />
                      <span className="sr-only">Bora está digitando</span>
                    </div>
                  </div>
                )}
                <div ref={endOfMessagesRef} />
              </>
            )}
          </div>

          <div className="border-t border-[#123c32]/10 bg-[#f5f7f2] px-4 pb-4 pt-3 sm:px-5">
            {error && (
              <div
                className="mb-3 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs leading-relaxed text-red-800"
                role="alert"
              >
                <CircleHelp size={15} className="mt-0.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {(screen === 'lead' ||
              screen === 'retention-data' ||
              screen === 'issue-data') && (
              <form
                onSubmit={
                  screen === 'lead'
                    ? handleLeadSubmit
                    : screen === 'retention-data'
                      ? handleRetentionSubmit
                      : handleIssueSubmit
                }
              >
                <label
                  htmlFor="chat-input"
                  className="mb-2 block text-xs font-bold text-[#123c32]"
                >
                  {inputLabel}
                </label>
                <div className="flex gap-2">
                  <input
                    id="chat-input"
                    type={isWhatsApp ? 'tel' : 'text'}
                    value={draft}
                    onChange={(event) => handleInputChange(event.target.value)}
                    placeholder={inputPlaceholder}
                    className="min-w-0 flex-1 rounded-xl border border-[#cbd6ca] bg-white px-3.5 py-3 text-sm text-[#171a19] outline-none transition-colors placeholder:text-[#8a918d] focus:border-[#123c32]"
                    autoComplete="off"
                    autoFocus
                    data-testid="input-chat-response"
                  />
                  <button
                    type="submit"
                    className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-[#b8f500] text-[#123c32] transition-transform hover:-translate-y-0.5"
                    aria-label="Enviar resposta"
                    data-testid="button-chat-send"
                  >
                    <Send size={17} />
                  </button>
                </div>
                {screen === 'lead' &&
                  (leadStep === 'goal' || leadStep === 'time') && (
                    <div className="mt-2 flex gap-2 overflow-x-auto pb-1">
                      {(leadStep === 'goal' ? goalSuggestions : timeSuggestions).map(
                        (suggestion) => (
                          <button
                            type="button"
                            key={suggestion}
                            onClick={() => {
                              setDraft(suggestion);
                              setLeadDraft((current) => ({
                                ...current,
                                [leadStep]: suggestion,
                              }));
                            }}
                            className="whitespace-nowrap rounded-full border border-[#123c32]/15 px-3 py-1.5 text-[11px] font-semibold text-[#123c32] transition-colors hover:border-[#123c32] hover:bg-[#e7ede4]"
                          >
                            {suggestion}
                          </button>
                        ),
                      )}
                    </div>
                  )}
              </form>
            )}

            {screen !== 'lead' &&
              screen !== 'retention-data' &&
              screen !== 'issue-data' &&
              choices.length > 0 && (
                <div className="flex max-h-32 flex-wrap gap-2 overflow-y-auto">
                  {choices.map((choice) => (
                    <button
                      type="button"
                      key={choice.id}
                      disabled={isTyping}
                      onClick={() => {
                        if (screen === 'home') handleRootChoice(choice);
                        else if (screen === 'help') handleHelpChoice(choice);
                        else if (
                          screen === 'academy' ||
                          screen === 'new-client'
                        )
                          handleClientChoice(choice);
                        else if (screen === 'student') handleStudentChoice(choice);
                        else handleRetentionReason(choice);
                      }}
                      className="group flex items-center gap-1.5 rounded-full border border-[#123c32]/15 bg-white px-3 py-2 text-left text-xs font-semibold text-[#123c32] transition-all hover:border-[#123c32] hover:bg-[#e7ede4] disabled:cursor-not-allowed disabled:opacity-50"
                      data-testid={`chat-choice-${choice.id}`}
                    >
                      {choice.label}
                      <ArrowRight
                        size={12}
                        className="transition-transform group-hover:translate-x-0.5"
                      />
                    </button>
                  ))}
                </div>
              )}

            {screen === 'academy' && !isTyping && (
              <button
                type="button"
                onClick={() => setScreen('new-client')}
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-full border border-[#123c32]/15 px-4 py-3 text-sm font-bold text-[#123c32] transition-colors hover:bg-[#e7ede4]"
                data-testid="button-chat-more-info"
              >
                Ver mais informações
                <ChevronDown size={16} />
              </button>
            )}

            {(screen === 'academy' || screen === 'new-client') && !isTyping && (
              <button
                type="button"
                onClick={() => startLeadCapture('interesse comercial')}
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-full bg-[#b8f500] px-4 py-3 text-sm font-bold text-[#123c32] transition-transform hover:-translate-y-0.5"
                data-testid="button-chat-human"
              >
                <Headphones size={16} />
                Quero falar com a equipe
              </button>
            )}

            {screen === 'student' && !isTyping && (
              <button
                type="button"
                onClick={() => startLeadCapture('atendimento de aluno')}
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-full bg-[#b8f500] px-4 py-3 text-sm font-bold text-[#123c32] transition-transform hover:-translate-y-0.5"
                data-testid="button-chat-student-team"
              >
                <Headphones size={16} />
                Falar com humano
              </button>
            )}

            {screen === 'human' && !isTyping && (
              <button
                type="button"
                onClick={() => startLeadCapture('pedido de atendimento humano')}
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-full bg-[#b8f500] px-4 py-3 text-sm font-bold text-[#123c32] transition-transform hover:-translate-y-0.5"
                data-testid="button-chat-human"
              >
                <Headphones size={16} />
                Falar com humano
              </button>
            )}

            {screen === 'retention-data' && !isTyping && (
              <p className="mt-3 text-center text-[11px] leading-relaxed text-[#8a918d]">
                O registro fica salvo neste dispositivo por enquanto.
              </p>
            )}

            {(screen === 'issue-data' || screen === 'retention-data') &&
              !isTyping && (
                <p className="mt-3 text-center text-[11px] leading-relaxed text-[#8a918d]">
                  O registro fica salvo neste dispositivo por enquanto.
                </p>
              )}

            {screen === 'lead' ||
            screen === 'retention-data' ||
            screen === 'issue-data' ? (
              <button
                type="button"
                onClick={goBack}
                className="mx-auto mt-3 flex items-center gap-1 text-xs font-semibold text-[#5e6861] underline underline-offset-4"
              >
                <ArrowLeft size={13} />
                Voltar às opções
              </button>
            ) : (
              <div className="mt-3 flex items-center justify-between gap-3">
                {screen !== 'home' ? (
                  <button
                    type="button"
                    onClick={goBack}
                    className="flex items-center gap-1 text-xs font-semibold text-[#5e6861] underline underline-offset-4"
                  >
                    <ArrowLeft size={13} />
                    Voltar
                  </button>
                ) : (
                  <span className="text-[10px] text-[#8a918d]">
                    Atendimento rápido
                  </span>
                )}
                <button
                  type="button"
                  onClick={resetChat}
                  className="flex items-center gap-1 text-xs font-semibold text-[#5e6861] transition-colors hover:text-[#123c32]"
                  data-testid="button-chat-reset"
                >
                  <RefreshCw size={12} />
                  Recomeçar
                </button>
              </div>
            )}
          </div>
        </section>
      )}

      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="chat-launcher fixed bottom-5 right-5 z-[59] flex items-center gap-3 rounded-full bg-[#b8f500] px-4 py-3 text-sm font-bold text-[#123c32] shadow-xl shadow-[#123c32]/25 transition-transform hover:-translate-y-1 sm:bottom-6 sm:right-6"
          aria-label="Abrir chat de atendimento"
          data-testid="button-chat-open"
        >
          <span className="grid h-8 w-8 place-items-center rounded-full bg-[#123c32] text-[#b8f500]">
            <MessageCircle size={17} />
          </span>
          <span className="hidden sm:inline">Falar com o Bora</span>
        </button>
      )}
    </>
  );
}

export default SupportChat;