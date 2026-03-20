/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  CheckCircle2, 
  ArrowRightCircle, 
  PlayCircle, 
  Star, 
  ShieldCheck, 
  ChevronDown, 
  ChevronUp,
  Clock,
  Zap,
  ShoppingBag,
  MessageCircle,
  ArrowDown,
  Lock
} from 'lucide-react';

// --- Components ---

const TopBanner = () => {
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [currentDate, setCurrentDate] = useState('');

  useEffect(() => {
    const updateTimer = () => {
      const now = new Date();
      const endOfDay = new Date();
      endOfDay.setHours(23, 59, 59, 999);

      const diff = endOfDay.getTime() - now.getTime();
      
      if (diff > 0) {
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diff / 1000 / 60) % 60);
        const seconds = Math.floor((diff / 1000) % 60);
        setTimeLeft({ hours, minutes, seconds });
      }

      const options: Intl.DateTimeFormatOptions = { day: '2-digit', month: '2-digit', year: 'numeric' };
      setCurrentDate(now.toLocaleDateString('pt-BR', options));
    };

    updateTimer();
    const timer = setInterval(updateTimer, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatNumber = (num: number) => num.toString().padStart(2, '0');

  return (
    <div className="bg-gradient-to-r from-red-700 via-red-600 to-red-700 text-white py-3 px-4 text-center text-[10px] md:text-sm font-black flex flex-col md:flex-row justify-center items-center gap-2 md:gap-6 border-b-2 border-yellow-500/50 shadow-lg">
      <div className="flex items-center gap-2">
        <Zap className="w-4 h-4 fill-yellow-400 text-yellow-400 animate-pulse" />
        <span className="uppercase tracking-tighter md:tracking-widest">URGENTE: OFERTA EXCLUSIVA VÁLIDA ATÉ {currentDate}</span>
      </div>
      <div className="flex items-center gap-3 bg-black/40 px-4 py-1 rounded-full border border-white/20">
        <Clock className="w-4 h-4 text-yellow-400" />
        <span className="hidden lg:inline text-xs opacity-90">A PROMOÇÃO EXPIRA EM:</span>
        <span className="font-mono text-yellow-400 text-base md:text-lg font-black tracking-widest">
          {formatNumber(timeLeft.hours)}:{formatNumber(timeLeft.minutes)}:{formatNumber(timeLeft.seconds)}
        </span>
      </div>
    </div>
  );
};

const Navbar = () => (
  <header className="fixed top-0 left-0 right-0 z-50 shadow-2xl">
    <TopBanner />
  </header>
);

const PurchaseNotification = () => {
  const [visible, setVisible] = useState(false);
  const [name, setName] = useState('');
  
  const names = ['Joice', 'Joana', 'Antonia', 'Francisca', 'Carla', 'Paula', 'Petra', 'Luana', 'Luiza', 'Marcia', 'Lis', 'Gabriela', 'Rafaela', 'Daniela', 'Marcela', 'Bruna', 'Eduarda', 'Felipa', 'Romenia', 'Manoela', 'Marta', 'Andreia', 'Fernanda', 'Fabricia'];

  useEffect(() => {
    const show = () => {
      setName(names[Math.floor(Math.random() * names.length)]);
      setVisible(true);
      setTimeout(() => setVisible(false), 4000);
    };

    const interval = setInterval(() => {
      if (!visible) show();
    }, 10000);

    setTimeout(show, 3000);

    return () => clearInterval(interval);
  }, [visible]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -100, opacity: 0 }}
          className="fixed bottom-4 left-4 z-50 bg-white text-black p-3 rounded-lg shadow-2xl flex items-center gap-3 border-l-4 border-green-500 max-w-[280px]"
        >
          <div className="bg-green-100 p-2 rounded-full">
            <ShoppingBag className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <p className="text-xs font-bold">{name} acabou de comprar</p>
            <p className="text-[10px] text-gray-500">o Brigadeiro sem fogo</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

const Marquee = ({ text, color = "bg-yellow-500" }: { text: string, color?: string }) => (
  <div className={`${color} py-2 overflow-hidden whitespace-nowrap border-y-2 border-black/20`}>
    <div className="animate-marquee inline-block">
      {[...Array(10)].map((_, i) => (
        <span key={i} className="text-black font-display text-xl md:text-2xl uppercase italic mx-4">
          {text} •
        </span>
      ))}
    </div>
  </div>
);

const FAQItem = ({ question, answer }: { question: string, answer: string }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="border border-yellow-500/30 rounded-xl overflow-hidden mb-4">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-4 flex justify-between items-center bg-white/5 hover:bg-white/10 transition-colors text-left"
      >
        <span className="font-semibold">{question}</span>
        {isOpen ? <ChevronUp className="text-yellow-500" /> : <ChevronDown className="text-yellow-500" />}
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="p-4 bg-white/5 text-sm text-gray-300 border-t border-yellow-500/10"
          >
            {answer}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- Main Page ---

export default function App() {
  const [showFloatingCTA, setShowFloatingCTA] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowFloatingCTA(window.scrollY > 800);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleRedirect = (baseUrl: string) => {
    const currentSearch = window.location.search;
    
    // Se for uma âncora interna, apenas navega
    if (baseUrl.startsWith('#')) {
      window.location.href = baseUrl;
      return;
    }

    if (!currentSearch) {
      window.location.href = baseUrl;
      return;
    }

    try {
      // Tenta criar um objeto URL. Se baseUrl for relativa, precisamos passar o origin.
      const url = new URL(baseUrl, window.location.origin);
      const currentParams = new URLSearchParams(currentSearch);
      
      // Adiciona todos os parâmetros atuais à nova URL
      currentParams.forEach((value, key) => {
        url.searchParams.set(key, value);
      });
      
      window.location.href = url.toString();
    } catch (e) {
      // Fallback robusto para URLs malformadas
      const separator = baseUrl.includes('?') ? '&' : '?';
      // Remove o '?' inicial do search se existir
      const cleanSearch = currentSearch.startsWith('?') ? currentSearch.substring(1) : currentSearch;
      window.location.href = `${baseUrl}${separator}${cleanSearch}`;
    }
  };

  return (
    <div className="min-h-screen bg-[#130D19] overflow-x-hidden">
      <Navbar />
      <PurchaseNotification />

      {/* Hero Section */}
      <section className="relative pt-20 md:pt-24 pb-12 px-4 bg-gradient-hero overflow-hidden">
        <Marquee text="OFERTA LIMITADA • ÚLTIMAS VAGAS COM DESCONTO • ACESSO IMEDIATO" />
        
        {/* Abstract Background Elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none">
          <div className="absolute top-[10%] left-[-10%] w-[50%] h-[50%] bg-purple-600/30 blur-[150px] rounded-full" />
          <div className="absolute bottom-[10%] right-[-10%] w-[50%] h-[50%] bg-red-600/20 blur-[150px] rounded-full" />
        </div>

        <div className="max-w-7xl mx-auto text-center relative z-10 mt-12">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="inline-block bg-red-600 text-white px-6 py-2 rounded-full font-black text-sm md:text-base mb-8 tracking-widest uppercase shadow-[0_0_30px_rgba(220,38,38,0.5)]"
          >
            🚀 O MÉTODO QUE ESTÁ REVOLUCIONANDO A CONFEITARIA
          </motion.div>

          <div className="relative mb-12">
            <h1 className="text-6xl md:text-[12rem] font-display leading-[0.8] uppercase italic animate-slam">
              BRIGADEIRO <br />
              <span className="text-yellow-500 text-glow-yellow">SEM FOGO</span>
            </h1>
            <div className="absolute -top-10 -right-10 md:-right-20 rotate-12 hidden md:block">
              <div className="bg-red-600 text-white p-6 rounded-full font-display text-2xl animate-pulse shadow-2xl brutal-border-white">
                +50 <br /> RECEITAS
              </div>
            </div>
          </div>
          
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-xl md:text-3xl font-heading font-medium text-gray-200 mb-8 max-w-4xl mx-auto leading-tight"
          >
            Pare de queimar dinheiro com gás e receitas perdidas. <br />
            <span className="text-yellow-500 font-black">DOMINE A TÉCNICA</span> que os grandes chefs escondem de você!
          </motion.p>

          <div className="flex flex-col lg:flex-row items-center justify-center gap-16 mb-10">
            <motion.div 
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5, type: "spring" }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-yellow-500/30 blur-[100px] rounded-full group-hover:bg-yellow-500/50 transition-all" />
              <img 
                src="https://cmrdigital.com.br/wp-content/uploads/2024/12/96-Receitas-de-Salgados-de-Sucesso.pdf-3-e1751787796622.png.webp" 
                alt="Ebook Brigadeiro Sem Fogo"
                className="w-80 md:w-[500px] relative z-10 animate-float drop-shadow-[0_35px_35px_rgba(0,0,0,0.6)]"
                referrerPolicy="no-referrer"
              />
            </motion.div>

            <motion.div 
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.6, type: "spring" }}
              className="flex flex-col items-center lg:items-start"
            >
              <div className="flex flex-col gap-8 items-center lg:items-start">
                <button 
                  onClick={() => handleRedirect("#pricing")}
                  className="group relative flex flex-col items-center justify-center gap-1 bg-gradient-to-br from-yellow-400 via-yellow-500 to-orange-600 text-black font-display font-black text-4xl px-12 py-10 rounded-3xl shadow-[0_20px_50px_rgba(234,179,8,0.5)] hover:scale-105 transition-all active:scale-95 cursor-pointer overflow-hidden"
                >
                  <span className="relative z-10">QUERO MEU ACESSO!</span>
                  <div className="absolute inset-0 bg-white/30 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                </button>

                <div className="flex items-center justify-center lg:justify-start gap-6">
                  <div className="flex -space-x-3">
                    {[1,2,3,4].map(i => (
                      <img key={i} src={`https://picsum.photos/seed/user${i}/40/40`} className="w-10 h-10 rounded-full border-2 border-black" referrerPolicy="no-referrer" />
                    ))}
                  </div>
                  <p className="text-[10px] md:text-xs text-gray-300 font-black uppercase tracking-widest leading-tight">
                    <span className="text-green-500">+1.450 ALUNAS</span> <br /> SATISFEITAS ESTA SEMANA
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-white to-transparent" />
      </section>

      {/* Advantages Section */}
      <section className="py-16 px-4 bg-white text-black relative">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-end justify-between mb-10 gap-8">
            <div className="max-w-2xl">
              <h2 className="text-6xl md:text-9xl font-display uppercase italic leading-[0.85] mb-6">
                POR QUE O <br /> <span className="text-red-600">SEM FOGO</span> <br /> É O MELHOR?
              </h2>
              <p className="text-xl font-heading font-medium text-gray-600">Esqueça tudo o que você sabe sobre brigadeiro tradicional. O futuro é frio, rápido e lucrativo.</p>
            </div>
            <div className="bg-black text-white p-8 rounded-3xl brutal-border">
              <p className="font-display text-4xl italic uppercase leading-none">ECONOMIA <br /> DE 100% <br /> NO GÁS</p>
            </div>
          </div>
          
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { title: "ZERO GÁS", desc: "Economize dinheiro real em cada receita.", icon: Zap, color: "bg-yellow-400" },
              { title: "ZERO RISCO", desc: "Nunca mais perca o ponto ou queime o doce.", icon: ShieldCheck, color: "bg-red-500" },
              { title: "ULTRA RÁPIDO", desc: "Pronto para modelar em minutos.", icon: Clock, color: "bg-blue-500" },
              { title: "LUCRO MÁXIMO", desc: "Baixo custo de produção, alta margem.", icon: ShoppingBag, color: "bg-green-500" },
              { title: "SEM ESPERA", desc: "Não precisa esperar esfriar por horas.", icon: PlayCircle, color: "bg-purple-500" },
              { title: "PERFEIÇÃO", desc: "Textura aveludada e brilho intenso.", icon: Star, color: "bg-orange-500" },
              { title: "SIMPLICIDADE", desc: "Qualquer pessoa consegue fazer.", icon: CheckCircle2, color: "bg-cyan-500" },
              { title: "SABOR REAL", desc: "O mesmo sabor do brigadeiro gourmet.", icon: MessageCircle, color: "bg-pink-500" }
            ].map((item, i) => (
              <motion.div 
                key={i} 
                whileHover={{ y: -10, rotate: i % 2 === 0 ? 1 : -1 }}
                className="p-8 rounded-3xl bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-none transition-all group"
              >
                <div className={`${item.color} w-16 h-16 rounded-2xl flex items-center justify-center mb-6 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]`}>
                  <item.icon className="w-8 h-8 text-black" />
                </div>
                <h3 className="font-display text-2xl mb-3 uppercase italic leading-none">{item.title}</h3>
                <p className="text-base text-gray-700 font-heading font-medium">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Recipe List Section */}
      <section className="py-16 px-4 bg-[#0A050D] border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-4xl md:text-7xl font-display uppercase italic leading-none mb-4">
              O QUE VOCÊ VAI <span className="text-yellow-500">DOMINAR?</span>
            </h2>
            <p className="text-gray-400 font-heading text-lg">Receitas testadas e aprovadas por especialistas.</p>
          </div>
          
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="w-full lg:w-1/2 relative group">
              <div className="absolute inset-0 bg-yellow-500/10 blur-[100px] rounded-full group-hover:bg-yellow-500/20 transition-all" />
              <img 
                src="https://cmrdigital.com.br/wp-content/uploads/2024/08/Design-sem-nome-2-e1751787150126.png.webp" 
                alt="Receitas"
                className="rounded-[40px] shadow-2xl relative z-10 border-4 border-white/5 group-hover:scale-[1.02] transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="w-full lg:w-1/2 grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                "Brigadeiro Creme de Avelã",
                "Brigadeiro de Pistache",
                "Brigadeiro de Café",
                "Brigadeiro Noir",
                "Brigadeiros Tradicionais",
                "Brigadeiro Salgado",
                "Chocolate com pimenta",
                "Brigadeiro Alcoólico",
                "Brigadeiro de Capuccino",
                "Frutas Vermelhas"
              ].map((item, i) => (
                <motion.div 
                  key={i} 
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center gap-4 glass-card p-4 rounded-2xl border-white/5 hover:border-yellow-500/30 transition-all"
                >
                  <div className="bg-yellow-500/20 p-2 rounded-full">
                    <Star className="text-yellow-500 w-4 h-4 fill-yellow-500" />
                  </div>
                  <span className="font-heading font-bold text-gray-200">{item}</span>
                </motion.div>
              ))}
              <div className="md:col-span-2 mt-4">
                <p className="font-display text-2xl text-yellow-500 italic uppercase">E MUITO MAIS...</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bonus Section */}
      <section className="py-16 px-4 bg-white text-black relative overflow-hidden border-t-8 border-black">
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            className="inline-block bg-black text-white px-8 py-3 rounded-full font-black text-base mb-8 uppercase tracking-[0.3em] shadow-[10px_10px_0px_0px_rgba(220,38,38,1)]"
          >
            BÔNUS EXCLUSIVOS: SÓ HOJE!
          </motion.div>
          <h2 className="text-6xl md:text-[10rem] font-display uppercase italic mb-12 leading-[0.8] tracking-tighter">
            VOCÊ LEVA <br /> <span className="text-red-600">TUDO ISSO</span> <br /> <span className="underline decoration-black decoration-8 underline-offset-8">GRÁTIS!</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8">
            {[
              { title: "CURSO EM VÍDEO", desc: "+30 AULAS PASSO A PASSO", img: "https://cmrdigital.com.br/wp-content/uploads/2024/09/mockup-e1751787233682.png.webp", value: "R$ 97,00" },
              { title: "70 RECEITAS", desc: "BRIGADEIRO TRADICIONAL", img: "https://cmrdigital.com.br/wp-content/uploads/2024/08/brigadeiro-gourmett-e1751787269772.png.webp", value: "R$ 47,00" },
              { title: "60 RECEITAS", desc: "GELADINHOS DE SUCESSO", img: "https://cmrdigital.com.br/wp-content/uploads/2024/08/96-Receitas-de-Salgados-de-Sucesso.pdf-2-e1751787298806.png.webp", value: "R$ 37,00" },
              { title: "50 RECEITAS", desc: "DOCES FIT & SAUDÁVEIS", img: "https://cmrdigital.com.br/wp-content/uploads/2024/08/3223-e1751787315579.png.webp", value: "R$ 27,00" },
              { title: "40 RECEITAS", desc: "BOLOS CASEIROS ESPECIAIS", img: "https://cmrdigital.com.br/wp-content/uploads/2024/08/42-e1751787334729.png.webp", value: "R$ 27,00" }
            ].map((bonus, i) => (
              <motion.div 
                key={i} 
                whileHover={{ y: -15, rotate: i % 2 === 0 ? -2 : 2 }}
                className="bg-white rounded-3xl p-8 flex flex-col items-center border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] hover:shadow-none transition-all"
              >
                <div className="relative mb-8">
                  <img src={bonus.img} alt={bonus.title} className="w-full relative z-10 drop-shadow-xl" referrerPolicy="no-referrer" />
                  <div className="absolute -top-4 -right-4 bg-red-600 text-white text-xs font-black px-4 py-2 rounded-full shadow-xl border-2 border-white rotate-12">100% GRÁTIS</div>
                </div>
                <h3 className="font-display text-2xl mb-2 uppercase italic leading-none">{bonus.title}</h3>
                <p className="text-gray-500 text-xs font-black uppercase tracking-widest mb-6">{bonus.desc}</p>
                <div className="mt-auto w-full border-t-2 border-black pt-6">
                  <p className="text-gray-400 text-xs line-through mb-2 font-bold italic">VALOR REAL: {bonus.value}</p>
                  <div className="bg-green-500 text-black text-sm font-black py-3 rounded-2xl uppercase tracking-widest border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">LIBERADO</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 px-4 bg-[#0A050D]">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl md:text-7xl font-display uppercase italic text-white mb-10 leading-none">
            QUEM JÁ <span className="text-yellow-500">MUDOU DE VIDA</span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              "https://cmrdigital.com.br/wp-content/uploads/2024/08/WhatsApp-Image-2024-08-19-at-15.14.33-768x1559.jpeg.webp",
              "https://cmrdigital.com.br/wp-content/uploads/2024/08/WhatsApp-Image-2024-08-19-at-15.14.33-1-768x1563.jpeg.webp",
              "https://cmrdigital.com.br/wp-content/uploads/2024/08/WhatsApp-Image-2024-08-19-at-15.14.33-2-768x1548.jpeg.webp"
            ].map((img, i) => (
              <motion.div 
                key={i} 
                whileHover={{ scale: 1.05 }}
                className="relative group cursor-zoom-in"
              >
                <div className="absolute inset-0 bg-yellow-500/10 blur-2xl rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                <img src={img} alt="Depoimento" className="rounded-3xl shadow-2xl relative z-10 border-2 border-white/5" referrerPolicy="no-referrer" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Guarantee Section */}
      <section className="py-16 px-4 bg-gradient-to-b from-[#0A050D] to-red-900/40">
        <div className="max-w-5xl mx-auto glass-card rounded-[40px] p-10 md:p-16 flex flex-col md:flex-row items-center gap-12 border-red-600/30">
          <div className="relative">
            <div className="absolute inset-0 bg-red-600/20 blur-[60px] rounded-full animate-pulse" />
            <img 
              src="https://cmrdigital.com.br/wp-content/uploads/2024/06/SELO-7-DIAS-ALPHA.png.webp" 
              alt="Garantia 7 Dias" 
              className="w-48 md:w-72 relative z-10 animate-float"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="text-center md:text-left">
            <h2 className="text-4xl md:text-6xl font-display uppercase italic mb-6 leading-none">
              RISCO <span className="text-red-600">ZERO</span> <br /> PARA VOCÊ!
            </h2>
            <p className="text-xl font-heading font-light text-gray-300 leading-relaxed mb-8">
              Nós confiamos tanto no nosso método que se você não gostar do conteúdo, devolvemos <span className="text-white font-bold">100% do seu dinheiro</span> em até 7 dias. Sem perguntas, sem burocracia.
            </p>
            <div className="flex items-center justify-center md:justify-start gap-4">
              <ShieldCheck className="w-8 h-8 text-green-500" />
              <span className="font-black uppercase tracking-widest text-xs">Sua satisfação é nossa prioridade</span>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-16 px-4 bg-[#0A050D] relative overflow-hidden border-t-8 border-yellow-500">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-yellow-500/10 blur-[200px] rounded-full pointer-events-none" />
        
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-6xl md:text-[12rem] font-display uppercase italic text-white mb-6 leading-[0.8] tracking-tighter">
              ESCOLHA SEU <br /> <span className="text-yellow-500 text-glow-yellow">DESTINO</span>
            </h2>
            <p className="text-2xl font-heading font-medium text-gray-400">A sua nova vida começa com um clique.</p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
            {/* Basic Plan */}
            <motion.div 
              whileHover={{ y: -15 }}
              className="glass-card rounded-[60px] p-12 flex flex-col border-white/10 hover:border-white/30 transition-all relative group"
            >
              <div className="mb-10">
                <span className="text-gray-500 font-black tracking-[0.3em] text-sm uppercase">OPÇÃO ESSENCIAL</span>
                <h3 className="text-5xl font-display uppercase italic mt-4 leading-none">E-BOOK <br /> COMPLETO</h3>
              </div>
              <ul className="space-y-6 mb-16 flex-grow">
                <li className="flex items-center gap-4 text-gray-300">
                  <CheckCircle2 className="text-yellow-500 w-6 h-6" />
                  <span className="font-heading text-lg font-medium">50 Receitas de Brigadeiro Sem Fogo</span>
                </li>
                <li className="flex items-center gap-4 text-gray-300">
                  <CheckCircle2 className="text-yellow-500 w-6 h-6" />
                  <span className="font-heading text-lg font-medium">Passo a Passo Detalhado</span>
                </li>
                <li className="flex items-center gap-4 text-gray-500/50 opacity-50">
                  <Lock className="w-6 h-6" />
                  <span className="font-heading text-lg font-medium line-through">Todos os Bônus Exclusivos</span>
                </li>
                <li className="flex items-center gap-4 text-gray-500/50 opacity-50">
                  <Lock className="w-6 h-6" />
                  <span className="font-heading text-lg font-medium line-through">Acesso Vitalício</span>
                </li>
              </ul>
              <div className="space-y-8">
                <div className="flex flex-col">
                  <span className="text-gray-500 line-through text-xl font-black italic">R$ 10,00</span>
                  <span className="text-6xl md:text-8xl font-display text-white leading-none">R$ 2,99</span>
                </div>
                <button 
                  onClick={() => handleRedirect("https://docesgourmet.shop/oferta/")}
                  className="w-full bg-white text-black font-display font-black py-8 rounded-3xl hover:bg-yellow-500 transition-all cursor-pointer text-3xl uppercase italic shadow-[0_10px_30px_rgba(255,255,255,0.1)]"
                >
                  COMPRAR AGORA
                </button>
              </div>
            </motion.div>

            {/* Premium Plan */}
            <motion.div 
              whileHover={{ y: -15 }}
              className="bg-premium-card rounded-[60px] p-12 flex flex-col border-4 border-yellow-500 shadow-[0_30px_100px_rgba(234,179,8,0.3)] relative overflow-hidden"
            >
              <div className="absolute top-10 right-10 bg-red-600 text-white px-6 py-2 rounded-full text-sm font-black uppercase tracking-widest animate-pulse shadow-2xl border-2 border-white">
                MAIS VENDIDO
              </div>
              
              <div className="mb-10">
                <span className="text-yellow-500 font-black tracking-[0.3em] text-sm uppercase">OPÇÃO PROFISSIONAL</span>
                <h3 className="text-5xl font-display uppercase italic mt-4 leading-none">COMBO <br /> IMPERADOR</h3>
              </div>

              <div className="bg-yellow-500 text-black text-center py-3 rounded-2xl text-sm font-black mb-10 uppercase tracking-[0.2em] shadow-lg">
                OFERTA POR TEMPO LIMITADO
              </div>

              <ul className="space-y-4 mb-16 flex-grow">
                {[
                  "E-book: 50 Receitas Sem Fogo",
                  "BÔNUS: Curso em Vídeo (+30 Aulas)",
                  "BÔNUS: 70 Receitas Tradicionais",
                  "BÔNUS: 60 Receitas Geladinho Gourmet",
                  "BÔNUS: 50 Receitas Doces Fit",
                  "BÔNUS: 40 Receitas Bolos Caseiros",
                  "Suporte VIP via WhatsApp",
                  "Certificado de Conclusão"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-4 text-white">
                    <Star className="text-yellow-500 w-5 h-5 fill-yellow-500" />
                    <span className="font-heading text-base font-bold">{item}</span>
                  </li>
                ))}
              </ul>

              <div className="space-y-8">
                <div className="flex flex-col">
                  <span className="text-gray-400 text-xl line-through font-black italic">VALOR TOTAL: R$ 197,00</span>
                  <div className="flex items-baseline gap-3">
                    <span className="text-7xl md:text-[9rem] font-display text-yellow-500 text-glow-yellow leading-none tracking-tighter">R$ 14,99</span>
                  </div>
                </div>
                <button 
                  onClick={() => handleRedirect("https://pay.lowify.com.br/checkout?product_id=BPKfvc")}
                  className="w-full bg-yellow-500 text-black font-display font-black py-8 rounded-3xl hover:bg-white transition-all cursor-pointer text-4xl uppercase italic shadow-[0_20px_60px_rgba(234,179,8,0.4)]"
                >
                  QUERO O COMBO COMPLETO!
                </button>
                <p className="text-xs text-center text-gray-400 font-black uppercase tracking-[0.3em]">PAGAMENTO ÚNICO · ACESSO VITALÍCIO</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4 bg-black relative">
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="text-center mb-10">
            <h2 className="text-6xl md:text-8xl font-display uppercase italic text-white mb-6">
              DÚVIDAS <span className="text-yellow-500">FREQUENTES</span>
            </h2>
            <p className="text-xl font-heading text-gray-500 uppercase tracking-widest">Tudo o que você precisa saber antes de dominar o mercado.</p>
          </div>

          <div className="space-y-6">
            {[
              {
                q: "COMO RECEBO O ACESSO?",
                a: "Imediatamente após a confirmação do pagamento. Você receberá um e-mail com todos os dados de acesso à nossa plataforma exclusiva."
              },
              {
                q: "PRECISO DE EQUIPAMENTOS CAROS?",
                a: "Absolutamente NÃO. Você só precisa de utensílios básicos que já tem na sua cozinha. O foco é praticidade e baixo custo inicial."
              },
              {
                q: "NUNCA COZINHEI, CONSIGO FAZER?",
                a: "Sim! Nossas receitas foram desenhadas para serem à prova de erros. O passo a passo é tão detalhado que qualquer pessoa consegue resultados profissionais."
              },
              {
                q: "O ACESSO É VITALÍCIO?",
                a: "Sim. Uma vez seu, sempre seu. Você pode acessar quando quiser, de onde quiser, para sempre."
              },
              {
                q: "PRECISO INFORMAR MEU CPF?",
                a: "Não! Valorizamos sua privacidade e agilidade. Você pode realizar sua compra de forma rápida e segura sem a necessidade de informar seu CPF."
              }
            ].map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="brutal-border-white p-8 hover:bg-yellow-500 hover:text-black transition-all group cursor-pointer"
              >
                <h3 className="text-2xl font-display uppercase italic mb-4 group-hover:text-black">{item.q}</h3>
                <p className="font-heading text-gray-400 group-hover:text-black/80 leading-relaxed">{item.a}</p>
              </motion.div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <button 
                onClick={() => handleRedirect("#pricing")}
                className="bg-yellow-500 text-black font-display font-black px-12 py-8 rounded-full text-4xl uppercase italic hover:bg-white hover:scale-110 transition-all shadow-[0_0_50px_rgba(234,179,8,0.3)] cursor-pointer"
              >
                QUERO MEU ACESSO!
              </button>
            </motion.div>
            <p className="mt-8 text-gray-500 font-black uppercase tracking-[0.4em] text-sm">ÚLTIMAS VAGAS COM DESCONTO DISPONÍVEIS</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 px-4 bg-black border-t border-white/5 text-center">
        {/* Floating CTA */}
        <AnimatePresence>
          {showFloatingCTA && (
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-md"
            >
              <button
                onClick={() => handleRedirect("#pricing")}
                className="w-full bg-yellow-500 text-black font-display font-black py-5 rounded-2xl shadow-[0_10px_40px_rgba(234,179,8,0.6)] flex items-center justify-center gap-3 text-xl uppercase italic group border-2 border-black"
              >
                QUERO MEU ACESSO AGORA!
                <ArrowRightCircle className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="max-w-4xl mx-auto">
          <div className="flex justify-center mb-6">
            <img 
              src="https://cmrdigital.com.br/wp-content/uploads/2024/06/16072019115806-768x190-2-1-1.png.webp" 
              alt="Bandeiras de Pagamento" 
              className="h-10 opacity-50 grayscale hover:grayscale-0 transition-all"
              referrerPolicy="no-referrer"
            />
          </div>
          <p className="text-gray-500 text-xs">
            © 2026 Brigadeiro Sem Fogo. Todos os direitos reservados. <br />
            Este site não faz parte do Google ou do Facebook.
          </p>
        </div>
      </footer>
    </div>
  );
}
