import { type FormEvent, type ReactNode, useEffect, useRef, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import SupportChat from '@/components/support-chat';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import {
  ArrowDown, ArrowRight, Check, Dumbbell, HeartPulse, Instagram, Menu,
  MoveUpRight, Play, Sparkles, Star, Trophy, Users, X, Zap,
} from 'lucide-react';
import {
  Route,
  Switch,
  useLocation,
  Router as WouterRouter,
} from 'wouter';

const queryClient = new QueryClient();

function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: '', whatsapp: '', goal: '', time: '' });
  const revealRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    document.title = 'Bora Treinar | Sua rotina. Seu objetivo. Seu ritmo.';
    const description = 'Mais do que uma academia: treino com acompanhamento, comunidade e consistência para todos os ritmos.';
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) { meta = document.createElement('meta'); meta.setAttribute('name', 'description'); document.head.appendChild(meta); }
    meta.setAttribute('content', description);
    let og = document.querySelector('meta[property="og:description"]');
    if (!og) { og = document.createElement('meta'); og.setAttribute('property', 'og:description'); document.head.appendChild(og); }
    og.setAttribute('content', description);
    revealRef.current = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add('is-visible');
    }), { threshold: 0.12 });
    document.querySelectorAll('.reveal').forEach((element) => revealRef.current?.observe(element));
    return () => revealRef.current?.disconnect();
  }, []);

  const goTo = (id: string) => {
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };
  const submitForm = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="noise min-h-[100dvh] overflow-hidden bg-[#f5f7f2] text-[#171a19]">
      <header className="fixed left-0 right-0 top-0 z-40 px-4 pt-4 md:px-8">
        <nav className="mx-auto flex max-w-[1180px] items-center justify-between rounded-2xl border border-white/15 bg-[#123c32]/95 px-4 py-3 text-[#f5f7f2] shadow-2xl shadow-[#123c32]/20 backdrop-blur md:px-6" aria-label="Navegação principal">
          <button type="button" onClick={() => goTo('top')} className="flex items-center gap-2" data-testid="button-logo">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-[#b8f500] text-[#123c32]"><Dumbbell size={19} strokeWidth={2.7} /></span>
            <span className="font-display text-xl font-extrabold tracking-[-.05em]">bora<span className="text-[#b8f500]">.</span></span>
          </button>
          <div className="hidden items-center gap-7 text-sm font-medium text-[#f5f7f2]/75 md:flex">
            <button onClick={() => goTo('experiencia')} data-testid="link-experiencia" className="transition-colors hover:text-[#b8f500]">A experiência</button>
            <button onClick={() => goTo('modalidades')} data-testid="link-modalidades" className="transition-colors hover:text-[#b8f500]">Treinos</button>
            <button onClick={() => goTo('app')} data-testid="link-app" className="transition-colors hover:text-[#b8f500]">Bora App</button>
            <button onClick={() => goTo('planos')} data-testid="link-planos" className="transition-colors hover:text-[#b8f500]">Planos</button>
          </div>
          <button type="button" onClick={() => goTo('contato')} className="hidden rounded-full bg-[#b8f500] px-5 py-2.5 text-sm font-bold text-[#123c32] transition-transform hover:-translate-y-0.5 md:block" data-testid="button-header-cta">Agende uma aula</button>
          <button type="button" onClick={() => setMenuOpen(!menuOpen)} className="rounded-lg p-2 md:hidden" aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'} data-testid="button-mobile-menu">{menuOpen ? <X size={21} /> : <Menu size={21} />}</button>
          {menuOpen && <div className="absolute left-0 right-0 top-[calc(100%+8px)] rounded-2xl bg-[#123c32] p-4 text-sm shadow-xl md:hidden">
            {['experiencia', 'modalidades', 'app', 'planos'].map((item) => <button key={item} onClick={() => goTo(item)} className="block w-full border-b border-white/10 px-2 py-3 text-left capitalize text-[#f5f7f2]/80 last:border-0" data-testid={`mobile-link-${item}`}>{item === 'app' ? 'Bora App' : item}</button>)}
            <button onClick={() => goTo('contato')} className="mt-3 w-full rounded-full bg-[#b8f500] py-3 font-bold text-[#123c32]" data-testid="mobile-cta">Agende uma aula</button>
          </div>}
        </nav>
      </header>

      <main id="top">
        <section className="hero-image relative flex min-h-[760px] items-end pb-16 pt-36 text-[#f5f7f2] md:min-h-[820px] md:pb-24">
          <div className="section-shell relative z-10">
            <div className="max-w-3xl reveal">
              <div className="mb-6 flex items-center gap-3 text-xs font-bold uppercase tracking-[.22em] text-[#b8f500]"><span className="h-px w-8 bg-[#b8f500]" /> Clube de treino urbano</div>
              <h1 className="font-display text-[clamp(3.3rem,8vw,7.8rem)] font-extrabold leading-[.91] tracking-[-.075em] text-balance">Sua rotina.<br />Seu objetivo.<br /><span className="text-[#b8f500]">Seu ritmo.</span></h1>
              <p className="mt-8 max-w-lg text-lg leading-relaxed text-[#f5f7f2]/80 md:text-xl">Mais do que uma academia. Uma experiência que acompanha você.</p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <button onClick={() => goTo('experiencia')} className="group flex items-center justify-center gap-3 rounded-full bg-[#b8f500] px-6 py-4 font-bold text-[#123c32] transition-transform hover:-translate-y-1" data-testid="button-hero-experience">Conheça o Bora Treinar <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" /></button>
                <button onClick={() => goTo('contato')} className="flex items-center justify-center gap-2 rounded-full border border-[#f5f7f2]/40 px-6 py-4 font-bold transition-colors hover:border-[#b8f500] hover:text-[#b8f500]" data-testid="button-hero-trial">Agende uma aula experimental</button>
              </div>
            </div>
            <div className="mt-16 flex items-end justify-between border-t border-white/20 pt-5 text-xs uppercase tracking-[.16em] text-[#f5f7f2]/60">
              <span>Para quem quer continuar</span><span className="hidden md:block">01 / 08</span><ArrowDown size={17} className="text-[#b8f500]" />
            </div>
          </div>
        </section>

        <div className="overflow-hidden border-b border-[#123c32]/10 bg-[#b8f500] py-3 text-[#123c32]">
          <div className="marquee-track flex w-max items-center gap-8 whitespace-nowrap font-display text-sm font-bold uppercase tracking-[.16em]"><span>treino que cabe na vida</span><span>•</span><span>gente de verdade</span><span>•</span><span>consistência sem drama</span><span>•</span><span>treino que cabe na vida</span><span>•</span><span>gente de verdade</span><span>•</span><span>consistência sem drama</span><span>•</span></div>
        </div>

        <section id="experiencia" className="section-shell py-24 md:py-36">
          <div className="grid gap-14 md:grid-cols-[.8fr_1.2fr] md:items-end">
            <div className="reveal"><span className="text-xs font-bold uppercase tracking-[.2em] text-[#8a918d]">01 — O que muda</span><h2 className="mt-5 font-display text-4xl font-extrabold leading-[.96] tracking-[-.055em] md:text-6xl">Você não precisa<br /><span className="text-[#123c32]">dar conta sozinho.</span></h2></div>
            <div className="reveal max-w-xl md:pb-1"><p className="text-xl leading-relaxed text-[#525a56]">A gente acredita em treino possível, acompanhamento próximo e uma comunidade que torce por você. Um lugar para começar sem medo e continuar porque faz sentido.</p><button onClick={() => goTo('jornada')} className="mt-7 flex items-center gap-2 font-bold text-[#123c32] underline decoration-[#b8f500] decoration-4 underline-offset-4 hover:gap-3" data-testid="link-jornada">Conheça a Jornada Bora 90 <ArrowRight size={17} /></button></div>
          </div>
          <div className="mt-20 grid gap-3 md:grid-cols-3">
            {[
              { icon: Users, title: 'Olho no olho', copy: 'Coach que sabe seu nome, seu objetivo e o que te faz voltar amanhã.' },
              { icon: HeartPulse, title: 'Treino com contexto', copy: 'Método e tecnologia para o plano acompanhar a vida real, não o contrário.' },
              { icon: Sparkles, title: 'Vontade de voltar', copy: 'Ambiente, desafios e uma turma que deixa o treino mais leve.' },
            ].map(({ icon: Icon, title, copy }, index) => <article className="reveal rounded-2xl bg-[#e7ede4] p-7 md:p-8" style={{ transitionDelay: `${index * 100}ms` }} key={title}><Icon className="mb-14 text-[#123c32]" size={26} /><h3 className="font-display text-2xl font-bold tracking-[-.04em]">{title}</h3><p className="mt-3 leading-relaxed text-[#5e6861]">{copy}</p></article>)}
          </div>
        </section>

        <section id="jornada" className="bg-[#123c32] py-24 text-[#f5f7f2] md:py-32">
          <div className="section-shell">
            <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end"><div className="reveal"><span className="text-xs font-bold uppercase tracking-[.2em] text-[#b8f500]">02 — Nosso jeito</span><h2 className="mt-5 max-w-2xl font-display text-4xl font-extrabold leading-[.94] tracking-[-.06em] md:text-7xl">A sua evolução<br /><span className="text-[#b8f500]">tem um caminho.</span></h2></div><p className="reveal max-w-xs text-[#f5f7f2]/65">Jornada Bora 90: um começo que acolhe, uma evolução que motiva e um ritmo que permanece.</p></div>
            <div className="mt-20 grid gap-0 border-t border-[#f5f7f2]/20 md:grid-cols-3">
              {[['01', 'Bora Começar', 'Primeiros 30 dias', 'Conheça seu treino, seu coach e o espaço. Sem cobrança, com clareza para dar o primeiro passo.'], ['02', 'Bora Evoluir', 'Dias 31 a 60', 'Ajustes, novos desafios e aquela sensação boa de perceber que você já mudou.'], ['03', 'Bora Continuar', 'Dias 61 a 90', 'O treino vira parte da rotina. E continuar deixa de ser promessa para virar escolha.']].map(([number, title, period, copy], index) => <article key={number} className="reveal border-b border-[#f5f7f2]/20 py-8 md:border-b-0 md:border-r md:px-8 md:first:pl-0 md:last:border-r-0" style={{ transitionDelay: `${index * 120}ms` }}><div className="flex items-center justify-between"><span className="font-display text-5xl font-bold text-[#b8f500]">{number}</span><span className="rounded-full border border-[#f5f7f2]/20 px-3 py-1 text-xs text-[#f5f7f2]/60">{period}</span></div><h3 className="mt-12 font-display text-2xl font-bold">{title}</h3><p className="mt-3 leading-relaxed text-[#f5f7f2]/65">{copy}</p></article>)}
            </div>
          </div>
        </section>

        <section id="modalidades" className="section-shell py-24 md:py-36">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end"><div className="reveal"><span className="text-xs font-bold uppercase tracking-[.2em] text-[#8a918d]">03 — Seu treino</span><h2 className="mt-5 font-display text-4xl font-extrabold tracking-[-.055em] md:text-6xl">Movimento que<br /><span className="text-[#123c32]">faz sentido para você.</span></h2></div><p className="reveal max-w-sm text-[#5e6861]">Escolha seu foco. A gente ajuda a transformar vontade em prática.</p></div>
          <div className="mt-16 grid gap-3 md:grid-cols-12 md:grid-rows-2">
            {[['Musculação', 'Força para o seu dia a dia.', 'md:col-span-7 md:row-span-2 bg-[#e7ede4]'], ['Funcional', 'Corpo presente, movimento livre.', 'md:col-span-5 bg-[#ffc83d]'], ['HIIT + Mobilidade', 'Intensidade e cuidado no mesmo treino.', 'md:col-span-5 bg-[#d4e8d4]'], ['Aulas coletivas', 'Energia boa é energia compartilhada.', 'md:col-span-7 bg-[#171a19] text-[#f5f7f2]']].map(([title, copy, classes], index) => <article key={title} className={`reveal group relative min-h-[210px] overflow-hidden rounded-2xl p-7 transition-transform hover:-translate-y-1 md:p-9 ${classes}`} style={{ transitionDelay: `${index * 70}ms` }}><span className="absolute right-7 top-7 grid h-10 w-10 place-items-center rounded-full border border-current/20 transition-transform group-hover:rotate-45"><ArrowRight size={17} /></span><div className="flex h-full flex-col justify-end"><h3 className="font-display text-3xl font-extrabold tracking-[-.05em]">{title}</h3><p className="mt-2 max-w-xs opacity-70">{copy}</p></div></article>)}
          </div>
        </section>

        <section id="app" className="bg-[#e0e9dc] py-24 md:py-32">
          <div className="section-shell grid gap-14 md:grid-cols-[1.1fr_.9fr] md:items-center">
            <div className="reveal"><span className="text-xs font-bold uppercase tracking-[.2em] text-[#5e6861]">04 — Tudo no bolso</span><h2 className="mt-5 max-w-xl font-display text-4xl font-extrabold leading-[.94] tracking-[-.06em] md:text-7xl">Seu treino.<br /><span className="text-[#123c32]">Mais perto.</span></h2><p className="mt-7 max-w-md text-lg leading-relaxed text-[#5e6861]">No Bora App, você acompanha o que importa e encontra novos motivos para aparecer.</p><div className="mt-10 grid max-w-md grid-cols-2 gap-x-5 gap-y-4">{['Meu treino', 'Evolução', 'Bora Points', 'Desafios'].map((item) => <div key={item} className="flex items-center gap-2 font-semibold"><Check size={17} className="text-[#123c32]" />{item}</div>)}</div></div>
            <div className="reveal relative mx-auto w-full max-w-sm"><div className="rotate-3 rounded-[2.4rem] border-[8px] border-[#171a19] bg-[#f5f7f2] p-4 shadow-2xl"><div className="rounded-[1.6rem] bg-[#123c32] p-5 text-[#f5f7f2]"><div className="flex items-center justify-between text-xs text-[#f5f7f2]/60"><span>BORA APP</span><span>09:41</span></div><p className="mt-10 text-sm text-[#f5f7f2]/60">Bom dia, Marina</p><h3 className="mt-1 font-display text-3xl font-bold">Bora treinar?</h3><div className="mt-7 rounded-2xl bg-[#b8f500] p-4 text-[#123c32]"><div className="flex items-center justify-between text-sm font-bold"><span>Treino de hoje</span><ArrowRight size={16} /></div><p className="mt-5 text-2xl font-bold">Força A</p><p className="text-xs opacity-70">45 min · 6 exercícios</p></div><div className="mt-4 grid grid-cols-2 gap-3"><div className="rounded-xl bg-white/10 p-3"><Trophy size={17} className="mb-5 text-[#ffc83d]" /><p className="text-xl font-bold">240</p><p className="text-[11px] text-white/50">Bora Points</p></div><div className="rounded-xl bg-white/10 p-3"><Zap size={17} className="mb-5 text-[#ffc83d]" /><p className="text-xl font-bold">12</p><p className="text-[11px] text-white/50">dias seguidos</p></div></div></div></div><span className="absolute -bottom-3 -left-8 rounded-full bg-[#ffc83d] px-4 py-2 text-sm font-bold text-[#171a19] -rotate-6">A constância pontua.</span></div>
          </div>
        </section>

        <section className="section-shell py-24 md:py-32">
          <div className="grid gap-3 md:grid-cols-2"><article className="reveal rounded-2xl bg-[#ffc83d] p-8 md:p-12"><span className="text-xs font-bold uppercase tracking-[.2em] text-[#5c481c]">05 — Para a vida toda</span><h2 className="mt-20 max-w-md font-display text-4xl font-extrabold leading-[.95] tracking-[-.06em] md:text-5xl">Treinar junto<br />é mais gostoso.</h2><p className="mt-5 max-w-md leading-relaxed text-[#574719]">Com o Bora Família e o Espaço Kids, seu treino também encontra lugar na rotina da família.</p><button onClick={() => goTo('contato')} className="mt-8 flex items-center gap-2 font-bold underline decoration-2 underline-offset-4" data-testid="button-family">Quero saber mais <ArrowRight size={17} /></button></article><article className="reveal flex min-h-[330px] flex-col justify-between rounded-2xl bg-[#d4e8d4] p-8 md:p-12"><div><span className="text-xs font-bold uppercase tracking-[.2em] text-[#426049]">06 — Conteúdo que ajuda</span><h2 className="mt-20 font-display text-4xl font-extrabold leading-[.95] tracking-[-.06em] md:text-5xl">Bora Saber</h2><p className="mt-5 max-w-md leading-relaxed text-[#506355]">Dicas honestas para entender seu corpo, fazer melhores escolhas e não cair no tudo ou nada.</p></div><button onClick={() => goTo('contato')} className="flex items-center gap-2 self-start font-bold text-[#123c32]" data-testid="button-bora-saber">Explorar conteúdos <MoveUpRight size={17} /></button></article></div>
        </section>

        <section className="bg-[#171a19] py-24 text-[#f5f7f2] md:py-32">
          <div className="section-shell"><div className="reveal flex flex-col justify-between gap-6 md:flex-row md:items-end"><div><span className="text-xs font-bold uppercase tracking-[.2em] text-[#b8f500]">07 — Gente como a gente</span><h2 className="mt-5 font-display text-4xl font-extrabold leading-[.95] tracking-[-.06em] md:text-6xl">O treino muda.<br /><span className="text-[#b8f500]">Você também.</span></h2></div><div className="flex items-center gap-2 text-sm text-[#f5f7f2]/55"><Play size={15} fill="currentColor" /> Histórias reais, em breve</div></div><div className="mt-16 grid gap-3 md:grid-cols-3">{['“[Depoimento real de aluno — aguardando conteúdo aprovado]”', '“[Depoimento real de aluna — aguardando conteúdo aprovado]”', '“[Depoimento real de aluno — aguardando conteúdo aprovado]”'].map((quote, index) => <figure className="reveal rounded-2xl border border-white/15 p-7" key={`${index}-${quote}`}><div className="flex gap-1 text-[#b8f500]" aria-label="Avaliação aguardando aprovação">{[0, 1, 2, 3, 4].map((star) => <Star key={star} size={14} fill="currentColor" aria-hidden="true" />)}</div><blockquote className="mt-8 min-h-20 leading-relaxed text-[#f5f7f2]/75">{quote}</blockquote><figcaption className="mt-7 border-t border-white/10 pt-4 text-xs uppercase tracking-[.16em] text-white/40">Nome / objetivo — placeholder {index + 1}</figcaption></figure>)}</div></div>
        </section>

        <section id="planos" className="section-shell py-24 md:py-32"><div className="reveal max-w-2xl"><span className="text-xs font-bold uppercase tracking-[.2em] text-[#8a918d]">08 — Seu ponto de partida</span><h2 className="mt-5 font-display text-4xl font-extrabold leading-[.95] tracking-[-.06em] md:text-6xl">Um plano que<br /><span className="text-[#123c32]">acompanha seu momento.</span></h2><p className="mt-6 max-w-lg leading-relaxed text-[#5e6861]">Fale com a nossa equipe para conhecer as opções e encontrar a melhor forma de começar. Sem preços inventados, só conversa honesta.</p></div><div className="mt-12 grid gap-3 md:grid-cols-3">{[['Bora Começar', 'Para dar o primeiro passo com segurança.', 'Aula experimental + orientação inicial'], ['Bora Evoluir', 'Para quem quer construir ritmo e resultado.', 'Treino acompanhado + acesso ao app'], ['Bora Continuar', 'Para fazer do treino parte da vida.', 'Experiência completa + comunidade']].map(([title, copy, detail], index) => <article key={title} className={`reveal rounded-2xl p-7 ${index === 1 ? 'bg-[#123c32] text-[#f5f7f2]' : 'bg-[#e7ede4]'}`}><div className="flex items-start justify-between"><span className="font-display text-3xl font-bold">0{index + 1}</span>{index === 1 && <span className="rounded-full bg-[#b8f500] px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-[#123c32]">Mais escolhido</span>}</div><h3 className="mt-16 font-display text-2xl font-bold">{title}</h3><p className="mt-3 min-h-12 opacity-70">{copy}</p><div className="mt-8 border-t border-current/15 pt-4 text-sm opacity-70">{detail}</div><p className="mt-4 text-xs uppercase tracking-wider opacity-50">Valores e condições: consultar</p></article>)}</div><p className="mt-6 text-xs text-[#8a918d]">* Valores, horários, endereço, disponibilidade de modalidades e condições comerciais: informações a confirmar diretamente com o Bora Treinar. Wellhub e TotalPass podem ser opções de acesso — consulte a disponibilidade.</p></section>

        <section id="contato" className="bg-[#b8f500] py-24 md:py-32"><div className="section-shell grid gap-12 md:grid-cols-[.9fr_1.1fr] md:items-start"><div className="reveal"><span className="text-xs font-bold uppercase tracking-[.2em] text-[#42601d]">09 — Vamos conversar</span><h2 className="mt-5 font-display text-5xl font-extrabold leading-[.9] tracking-[-.07em] text-[#123c32] md:text-7xl">Bora<br />começar?</h2><p className="mt-7 max-w-sm text-lg leading-relaxed text-[#355a35]">Seu próximo treino pode começar hoje.</p><div className="mt-12 space-y-3 text-sm text-[#355a35]"><p><strong>WhatsApp:</strong> [número a confirmar]</p><p><strong>Local:</strong> [endereço a confirmar]</p><p><strong>Horários:</strong> [horários a confirmar]</p></div></div><div className="reveal rounded-2xl bg-[#f5f7f2] p-6 shadow-xl shadow-[#123c32]/10 md:p-8">{submitted ? <div className="flex min-h-[390px] flex-col items-center justify-center text-center"><div className="grid h-16 w-16 place-items-center rounded-full bg-[#b8f500] text-[#123c32]"><Check size={30} /></div><h3 className="mt-6 font-display text-3xl font-bold text-[#123c32]">Recebemos seu pedido.</h3><p className="mt-3 max-w-sm text-[#5e6861]">Obrigado, {form.name || 'por chamar'}. A equipe do Bora Treinar entra em contato pelo melhor canal.</p><button onClick={() => { setSubmitted(false); setForm({ name: '', whatsapp: '', goal: '', time: '' }); }} className="mt-8 font-bold text-[#123c32] underline underline-offset-4" data-testid="button-new-contact">Enviar outra mensagem</button></div> : <form onSubmit={submitForm} className="space-y-5"><div><label htmlFor="name" className="mb-2 block text-sm font-bold text-[#123c32]">Seu nome</label><input id="name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Como podemos te chamar?" className="w-full rounded-xl border border-[#d2dad0] bg-transparent px-4 py-3.5 outline-none transition-colors placeholder:text-[#8a918d] focus:border-[#123c32]" data-testid="input-name" /></div><div><label htmlFor="whatsapp" className="mb-2 block text-sm font-bold text-[#123c32]">WhatsApp</label><input id="whatsapp" required value={form.whatsapp} onChange={(e) => setForm({ ...form, whatsapp: e.target.value })} placeholder="(00) 00000-0000" className="w-full rounded-xl border border-[#d2dad0] bg-transparent px-4 py-3.5 outline-none transition-colors placeholder:text-[#8a918d] focus:border-[#123c32]" data-testid="input-whatsapp" /></div><div><label htmlFor="goal" className="mb-2 block text-sm font-bold text-[#123c32]">O que você busca?</label><select id="goal" required value={form.goal} onChange={(e) => setForm({ ...form, goal: e.target.value })} className="w-full appearance-none rounded-xl border border-[#d2dad0] bg-[#f5f7f2] px-4 py-3.5 text-[#5e6861] outline-none focus:border-[#123c32]" data-testid="select-goal"><option value="">Escolha uma opção</option><option>Começar a treinar</option><option>Emagrecimento</option><option>Hipertrofia e força</option><option>Condicionamento</option><option>Qualidade de vida</option><option>Treinar em família</option></select></div><div><label htmlFor="time" className="mb-2 block text-sm font-bold text-[#123c32]">Melhor horário para falar</label><select id="time" required value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} className="w-full appearance-none rounded-xl border border-[#d2dad0] bg-[#f5f7f2] px-4 py-3.5 text-[#5e6861] outline-none focus:border-[#123c32]" data-testid="select-time"><option value="">Escolha uma opção</option><option>Manhã</option><option>Almoço</option><option>Tarde</option><option>Noite</option></select></div><button type="submit" className="flex w-full items-center justify-center gap-3 rounded-full bg-[#123c32] px-6 py-4 font-bold text-[#f5f7f2] transition-transform hover:-translate-y-0.5" data-testid="button-submit-contact">Quero treinar <ArrowRight size={18} /></button><p className="text-center text-xs text-[#8a918d]">Ao enviar, você demonstra interesse. Este formulário é uma demonstração local.</p></form>}</div></div></section>
      </main>
      <footer className="bg-[#123c32] py-10 text-[#f5f7f2]"><div className="section-shell flex flex-col justify-between gap-8 md:flex-row md:items-end"><div><div className="flex items-center gap-2"><span className="grid h-8 w-8 place-items-center rounded-lg bg-[#b8f500] text-[#123c32]"><Dumbbell size={16} /></span><span className="font-display text-xl font-bold">bora<span className="text-[#b8f500]">.</span></span></div><p className="mt-4 max-w-xs text-sm leading-relaxed text-[#f5f7f2]/50">Treino que acompanha a vida real. Um dia de cada vez.</p></div><div className="flex items-center justify-between gap-8 text-sm text-[#f5f7f2]/60 md:gap-12"><div><p className="mb-2 text-xs uppercase tracking-wider text-[#b8f500]">Fale com a gente</p><p>[WhatsApp a confirmar]</p></div><button className="transition-colors hover:text-[#b8f500]" aria-label="Instagram do Bora Treinar" data-testid="button-instagram"><Instagram size={22} /></button></div></div><div className="section-shell mt-12 flex flex-col justify-between gap-3 border-t border-white/10 pt-5 text-xs text-[#f5f7f2]/35 md:flex-row"><span>© {new Date().getFullYear()} Bora Treinar. Todos os direitos reservados.</span><span>Dados comerciais exibidos como placeholders.</span></div></footer>
      <SupportChat />
    </div>
  );
}

function Router() {
  return (
    // Keep a shared shell (sidebar, navbar) outside the boundary so it
    // survives a page crash.
    <RoutedErrorBoundary>
      <Switch>
        <Route path="/" component={Home} />
        <Route component={NotFound} />
      </Switch>
    </RoutedErrorBoundary>
  );
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
