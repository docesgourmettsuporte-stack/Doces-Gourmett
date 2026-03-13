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
  ArrowDown
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
    <div className="bg-red-600 text-white py-2 px-4 text-center text-[10px] md:text-sm font-bold flex flex-col md:flex-row justify-center items-center gap-1 md:gap-4 border-b border-white/10">
      <div className="flex items-center gap-2">
        <Zap className="w-3 h-3 md:w-4 md:h-4 fill-yellow-400 text-yellow-400 animate-pulse" />
        <span className="uppercase tracking-wider">Atenção: Oferta válida apenas até {currentDate}</span>
      </div>
      <div className="flex items-center gap-2 bg-black/20 px-3 py-0.5 rounded-full">
        <Clock className="w-3 h-3 md:w-4 md:h-4" />
        <span className="hidden md:inline">A PROMOÇÃO ENCERRA EM:</span>
        <span className="font-mono text-yellow-300 text-sm md:text-base">
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
  const handleRedirect = (baseUrl: string) => {
    const currentSearch = window.location.search;
    if (!currentSearch) {
      window.location.href = baseUrl;
      return;
    }

    // Se a URL base já tiver parâmetros, usamos & para concatenar, senão ?
    // Mas uma forma mais robusta é usar a API URL
    try {
      const url = new URL(baseUrl);
      const currentParams = new URLSearchParams(currentSearch);
      
      currentParams.forEach((value, key) => {
        url.searchParams.set(key, value);
      });
      
      window.location.href = url.toString();
    } catch (e) {
      // Fallback simples caso a URL seja relativa ou malformada
      const separator = baseUrl.includes('?') ? '&' : '?';
      window.location.href = `${baseUrl}${separator}${currentSearch.substring(1)}`;
    }
  };

  return (
    <div className="min-h-screen bg-[#130D19] overflow-x-hidden">
      <Navbar />
      <PurchaseNotification />

      {/* Hero Section */}
      <section className="relative pt-20 md:pt-24 pb-20 px-4 bg-gradient-hero">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-4xl md:text-6xl font-baloo font-black leading-tight mb-6"
          >
            +50 RECEITAS DE BRIGADEIRO <br />
            <span className="text-yellow-500">SEM FOGO</span>
          </motion.h1>
          
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-lg md:text-xl font-medium text-gray-200 mb-10"
          >
            Você terá acesso ao <span className="text-yellow-500 underline underline-offset-4">passo a passo</span> detalhado de <span className="text-yellow-500">50 receitas exclusivas</span> para fazer os mais deliciosos brigadeiros em casa.
          </motion.p>

          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="relative inline-block mb-12"
          >
            <img 
              src="https://cmrdigital.com.br/wp-content/uploads/2024/12/96-Receitas-de-Salgados-de-Sucesso.pdf-3-e1751787796622.png.webp" 
              alt="Ebook Brigadeiro Sem Fogo"
              className="w-64 md:w-80 mx-auto drop-shadow-[0_0_30px_rgba(255,173,0,0.3)]"
              referrerPolicy="no-referrer"
            />
          </motion.div>

          <div className="space-y-4">
            <p className="italic text-gray-400">de <del className="text-red-500">R$ 10,00</del> por</p>
            <p className="text-5xl md:text-7xl font-display font-black text-white mb-8">R$ 2,99</p>
            
            <a 
              href="#pricing"
              className="inline-flex items-center gap-3 bg-gradient-to-b from-orange-500 to-orange-600 text-white font-display font-bold text-xl px-10 py-5 rounded-2xl shadow-[0_0_20px_rgba(225,92,19,0.6)] border border-white/20 hover:scale-105 transition-transform animate-pulse-subtle"
            >
              SIM! EU QUERO <ArrowRightCircle />
            </a>
            
            <div className="flex justify-center mt-6">
              <img 
                src="https://cmrdigital.com.br/wp-content/uploads/2024/07/WhatsApp_Image_2024-07-20_at_02.07.23-removebg-preview.png.webp" 
                alt="Segurança"
                className="h-8 opacity-80"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Advantages Section */}
      <section className="py-20 px-4 bg-white text-black">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-center mb-12 leading-tight">
            Veja as vantagens de fazer o <br /> brigadeiro sem fogo
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            {[
              "Baixo Investimento",
              "Preparo Rápido",
              "Economia de Tempo",
              "Não precisa ficar esperando esfriar para modelar",
              "Baixo risco de a receita dar errado",
              "Não tem perda de material (não gruda nem queima)",
              "Não gasta gás",
              "Fica tão delicioso quanto o tradicional"
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3 p-4 rounded-xl bg-gray-50 border border-gray-100">
                <CheckCircle2 className="text-red-500 shrink-0 w-6 h-6" />
                <span className="font-medium text-gray-800">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recipe List Section */}
      <section className="py-20 px-4 bg-[#1A051B]">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-center mb-12 leading-tight">
            Veja um pouco das receitas <br /> que você vai aprender
          </h2>
          
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="w-full md:w-1/2">
              <img 
                src="https://cmrdigital.com.br/wp-content/uploads/2024/08/Design-sem-nome-2-e1751787150126.png.webp" 
                alt="Receitas"
                className="rounded-2xl shadow-2xl"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="w-full md:w-1/2 grid gap-4">
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
                <div key={i} className="flex items-center gap-3">
                  <Star className="text-green-400 w-5 h-5 fill-green-400" />
                  <span className="font-medium italic text-gray-200">{item}</span>
                </div>
              ))}
              <p className="font-bold text-yellow-500 mt-2">E muito mais...</p>
            </div>
          </div>
        </div>
      </section>

      {/* Bonus Section */}
      <section className="py-20 px-4 bg-[#1A051B] border-t border-white/5">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-gray-400 mb-4">Escolhendo o pacote <span className="font-bold text-white">Premium</span> você leva todos esses bônus:</p>
          <h2 className="text-4xl md:text-6xl font-display font-black mb-16">
            +5 BÔNUS <span className="text-yellow-500">ESPECIAIS!</span>
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {[
              { title: "Curso em vídeo", desc: "+ de 30 aulas passo a passo", img: "https://cmrdigital.com.br/wp-content/uploads/2024/09/mockup-e1751787233682.png.webp" },
              { title: "70 Receitas", desc: "Brigadeiros gourmet tradicional", img: "https://cmrdigital.com.br/wp-content/uploads/2024/08/brigadeiro-gourmett-e1751787269772.png.webp" },
              { title: "60 Receitas", desc: "Geladinhos que mais vendem", img: "https://cmrdigital.com.br/wp-content/uploads/2024/08/96-Receitas-de-Salgados-de-Sucesso.pdf-2-e1751787298806.png.webp" },
              { title: "50 Receitas", desc: "Melhores doces fit", img: "https://cmrdigital.com.br/wp-content/uploads/2024/08/3223-e1751787315579.png.webp" },
              { title: "40 Receitas", desc: "Bolos caseiros especiais", img: "https://cmrdigital.com.br/wp-content/uploads/2024/08/42-e1751787334729.png.webp" }
            ].map((bonus, i) => (
              <div key={i} className="bg-white rounded-2xl p-4 flex flex-col items-center">
                <img src={bonus.img} alt={bonus.title} className="w-full mb-4" referrerPolicy="no-referrer" />
                <h3 className="text-black font-bold text-sm leading-tight mb-1">{bonus.title}</h3>
                <p className="text-gray-600 text-[10px] uppercase font-bold">{bonus.desc}</p>
                <div className="mt-auto pt-3 w-full">
                  <div className="bg-green-100 text-green-600 text-[10px] font-black py-1 rounded-md">GRÁTIS</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-display font-black text-black mb-12">
            Depoimentos de <span className="text-orange-500">nossas clientes!</span>
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              "https://cmrdigital.com.br/wp-content/uploads/2024/08/WhatsApp-Image-2024-08-19-at-15.14.33-768x1559.jpeg.webp",
              "https://cmrdigital.com.br/wp-content/uploads/2024/08/WhatsApp-Image-2024-08-19-at-15.14.33-1-768x1563.jpeg.webp",
              "https://cmrdigital.com.br/wp-content/uploads/2024/08/WhatsApp-Image-2024-08-19-at-15.14.33-2-768x1548.jpeg.webp"
            ].map((img, i) => (
              <img key={i} src={img} alt="Depoimento" className="rounded-xl shadow-lg" referrerPolicy="no-referrer" />
            ))}
          </div>
        </div>
      </section>

      {/* Guarantee Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-yellow-700 to-yellow-900">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-10 text-center md:text-left">
          <img 
            src="https://cmrdigital.com.br/wp-content/uploads/2024/06/SELO-7-DIAS-ALPHA.png.webp" 
            alt="Garantia 7 Dias" 
            className="w-48 md:w-64 animate-pulse-subtle"
            referrerPolicy="no-referrer"
          />
          <div>
            <h2 className="text-3xl font-display font-black mb-4">GARANTIA INCONDICIONAL</h2>
            <p className="text-lg text-yellow-100">
              Nós confiamos tanto em nossos estudos e pesquisas que lhe garantimos 7 dias de garantia incondicional! Se não gostar, devolvemos seu dinheiro.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 bg-black">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-display font-black text-center mb-16">
            Escolha a melhor opção <span className="text-yellow-500">para você!</span>
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Basic Plan */}
            <div className="bg-white rounded-[32px] p-8 flex flex-col text-black">
              <div className="text-center mb-8">
                <span className="bg-gray-100 px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest">BÁSICO</span>
                <h3 className="text-2xl font-black mt-4">E-book Brigadeiro</h3>
              </div>
              <ul className="space-y-4 mb-10 flex-grow">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="text-green-500 shrink-0" />
                  <span className="text-sm font-medium">E-book: 50 receitas de brigadeiro sem fogo</span>
                </li>
              </ul>
              <div className="text-center space-y-4">
                <p className="text-4xl font-black text-yellow-700">R$ 2,99</p>
                <button 
                  onClick={() => handleRedirect("https://docesgourmet.shop/oferta/")}
                  className="block w-full bg-green-600 text-white font-bold py-4 rounded-2xl hover:bg-green-700 transition-colors cursor-pointer"
                >
                  PLANO BÁSICO
                </button>
                <p className="text-[10px] text-gray-500">Mas antes de comprar, temos uma oferta ainda melhor abaixo</p>
                <ArrowDown className="mx-auto text-black animate-bounce" />
              </div>
            </div>

            {/* Premium Plan */}
            <div className="bg-premium-card rounded-[32px] p-8 flex flex-col border-2 border-yellow-500 shadow-[0_0_40px_rgba(255,163,17,0.2)]">
              <div className="text-center mb-8">
                <span className="bg-yellow-500 text-black px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest">PREMIUM</span>
                <h3 className="text-2xl font-black mt-4">Combo Completo</h3>
              </div>
              <div className="bg-green-500/20 text-green-400 text-center py-2 rounded-lg text-xs font-bold mb-6">
                RESTAM APENAS 10 VAGAS PROMOCIONAIS
              </div>
              <ul className="space-y-3 mb-10 flex-grow text-sm">
                {[
                  "E-book completo: 50 receitas",
                  "+5 Bônus Especiais",
                  "Curso completo de geladinhos",
                  "70 Receitas brigadeiro tradicional",
                  "60 Receitas geladinho gourmet",
                  "50 Receitas doces fit",
                  "40 Receitas bolos caseiros",
                  "Atualizações gratuitas",
                  "Acesso vitalício",
                  "Acesso imediato!"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <CheckCircle2 className="text-yellow-500 shrink-0 w-4 h-4" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <div className="text-center space-y-2">
                <p className="text-xs text-gray-400">Valor Total de <del className="text-red-500">R$ 49,99</del> por</p>
                <p className="text-5xl font-black text-green-400">R$ 14,99</p>
                <p className="text-sm font-bold">Pagamento Único</p>
                <button 
                  onClick={() => handleRedirect("https://pay.lowify.com.br/checkout?product_id=BPKfvc")}
                  className="block w-full bg-yellow-500 text-black font-black py-5 rounded-2xl hover:bg-yellow-400 transition-colors mt-4 shadow-xl cursor-pointer"
                >
                  GARANTIR MINHA VAGA!
                </button>
                <p className="text-[10px] text-gray-400 mt-4 italic">*Pagamento único, acesso vitalício*</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 px-4 bg-[#100D0D]">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-display font-black text-center text-yellow-500 mb-12">
            DÚVIDAS FREQUENTES
          </h2>
          
          <FAQItem 
            question="Como irei receber meu acesso?" 
            answer="Assim que você realizar o pagamento, você receberá no seu e-mail o link de acesso. Para baixar o material em seu celular, computador ou tablet." 
          />
          <FAQItem 
            question="Por quanto tempo terei acesso?" 
            answer="Seu acesso é vitalício! Você paga uma única vez e pode acessar o conteúdo para sempre, inclusive as futuras atualizações." 
          />
          <FAQItem 
            question="O pagamento é seguro?" 
            answer="Sim, é 100% seguro. A Kiwify é uma das maiores empresas de pagamentos e hospedagens de produtos online do Brasil, com criptografia de ponta." 
          />
          <FAQItem 
            question="Quero comprar sem informar o CPF" 
            answer="Pela plataforma oficial é obrigatório por lei. Caso queira alternativas, entre em contato com nosso suporte via WhatsApp." 
          />
          <FAQItem 
            question="Comprei e não recebi" 
            answer="Verifique sua caixa de entrada, spam ou lixeira. O e-mail vem em nome da Kiwify. Se não encontrar, chame nosso suporte imediatamente." 
          />

          <div className="text-center mt-16">
            <button 
              onClick={() => handleRedirect("https://pay.lowify.com.br/checkout?product_id=BPKfvc")}
              className="inline-flex items-center gap-3 bg-yellow-500 text-black font-display font-black text-lg px-8 py-4 rounded-full hover:scale-105 transition-transform cursor-pointer"
            >
              CLIQUE AQUI E GARANTA SUA VAGA!
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 px-4 bg-black border-t border-white/5 text-center">
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
