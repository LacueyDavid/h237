import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Send, Bot, User, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { attractions } from '../data/attractions';
import type { ChatMessage } from '../data/types';

const suggestions = [
  'Quel manège pour un enfant de 5 ans ?',
  'Où manger dans le parc ?',
  'Quelle attraction a le moins d\'attente ?',
  'Raconte-moi l\'histoire du parc',
  'Parcours accessible en fauteuil ?',
];

function generateResponse(message: string): string {
  const lower = message.toLowerCase();

  if (lower.includes('enfant') || lower.includes('petit') || lower.includes('bébé') || lower.includes('ans')) {
    const kidFriendly = attractions.filter(a => !a.minAge || a.minAge <= 4);
    return `🎠 Pour les plus petits, je recommande :\n\n${kidFriendly.map(a => `• **${a.name}** ${a.image} — ${a.description.slice(0, 60)}...`).join('\n')}\n\nTous ces manèges sont adaptés aux jeunes enfants. Le Carrousel du Jardin est un incontournable !`;
  }

  if (lower.includes('manger') || lower.includes('restaurant') || lower.includes('faim') || lower.includes('goûter')) {
    const restos = attractions.filter(a => a.category === 'restauration');
    return `🍽️ Pour vous restaurer :\n\n${restos.map(a => `• **${a.name}** — ${a.description}`).join('\n')}\n\n💡 Conseil : la terrasse du Pavillon des Oiseaux offre une vue magnifique sur le parc. Pensez à réserver aux heures de pointe !`;
  }

  if (lower.includes('attente') || lower.includes('queue') || lower.includes('monde')) {
    const sorted = [...attractions].filter(a => a.waitMinutes > 0).sort((a, b) => a.waitMinutes - b.waitMinutes);
    return `⏱️ Voici les temps d'attente actuels :\n\n${sorted.map(a => `• **${a.name}** ${a.image} : ${a.waitMinutes} min`).join('\n')}\n\n💡 Conseil : privilégiez ${sorted[0].name} pour éviter l'attente !`;
  }

  if (lower.includes('histoire') || lower.includes('origine') || lower.includes('napoléon') || lower.includes('ancien')) {
    return `🏛️ **L'histoire du Jardin d'Acclimatation**\n\nOuvert le **6 octobre 1860** par **Napoléon III et l'Impératrice Eugénie**, le Jardin d'Acclimatation est le plus ancien parc de loisirs de France.\n\nInitialement conçu comme un jardin zoologique et botanique par la Société impériale zoologique d'acclimatation, il avait pour mission d'acclimater des espèces exotiques.\n\nDepuis 2018, le groupe **LVMH** a investi dans une rénovation majeure, ajoutant de nouvelles attractions tout en préservant le charme historique du lieu.\n\n📍 Situé dans le **Bois de Boulogne**, à deux pas de la Fondation Louis Vuitton.`;
  }

  if (lower.includes('accessible') || lower.includes('fauteuil') || lower.includes('handicap') || lower.includes('pmr')) {
    const accessible = attractions.filter(a => a.accessible);
    return `♿ **Attractions accessibles PMR** :\n\n${accessible.map(a => `• **${a.name}** ${a.image}`).join('\n')}\n\n${accessible.length}/${attractions.length} attractions sont accessibles aux personnes à mobilité réduite. Le parc dispose également de fauteuils roulants en prêt à l'accueil.`;
  }

  if (lower.includes('sensation') || lower.includes('frisson') || lower.includes('speed') || lower.includes('rapide')) {
    return `🚀 Pour les amateurs de sensations :\n\n• **Speed Rocket** 🎢 — La montagne russe la plus rapide du parc ! (Taille min: 120cm)\n• **Les Chaises Volantes** 🌀 — Sensations aériennes garanties !\n\n💡 Conseil : Commencez par les chaises volantes pour vous échauffer avant le Speed Rocket. Et tentez le parcours "Aventurier des Sensations" dans les Quêtes !`;
  }

  return `🌳 Je suis votre guide du Jardin d'Acclimatation ! Je peux vous aider avec :\n\n• 🎠 **Recommandations** d'attractions par âge\n• ⏱️ **Temps d'attente** en temps réel\n• 🍽️ **Restauration** et bons plans\n• 🏛️ **Histoire** et anecdotes du parc\n• ♿ **Accessibilité** et infos pratiques\n• 🧭 **Parcours** personnalisés\n\nN'hésitez pas à me poser vos questions !`;
}

export function ChatPage() {
  const { state, dispatch } = useApp();
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [state.chatMessages]);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text.trim(),
      timestamp: new Date(),
    };
    dispatch({ type: 'ADD_CHAT_MESSAGE', message: userMsg });

    setTimeout(() => {
      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        role: 'assistant',
        content: generateResponse(text),
        timestamp: new Date(),
      };
      dispatch({ type: 'ADD_CHAT_MESSAGE', message: botMsg });
    }, 500);

    setInput('');
  };

  return (
    <div className="flex flex-col h-[calc(100dvh-120px)]">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {state.chatMessages.length === 0 && (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-jardin-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Bot className="w-8 h-8 text-jardin-600" />
            </div>
            <h3 className="font-bold text-gray-800 mb-1">Guide IA du Jardin</h3>
            <p className="text-sm text-gray-500 mb-6">
              Posez-moi vos questions sur le parc, les attractions, ou demandez des recommandations !
            </p>
            <div className="space-y-2">
              {suggestions.map(s => (
                <button
                  key={s}
                  onClick={() => sendMessage(s)}
                  className="block w-full text-left px-4 py-2.5 bg-white rounded-xl border border-gray-100 shadow-sm text-sm text-gray-700 hover:bg-jardin-50 hover:border-jardin-200 transition-colors"
                >
                  <Sparkles className="w-3 h-3 inline mr-2 text-gold-400" />
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {state.chatMessages.map(msg => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.role === 'assistant' && (
              <div className="w-7 h-7 rounded-full bg-jardin-100 flex items-center justify-center shrink-0 mt-1">
                <Bot className="w-4 h-4 text-jardin-600" />
              </div>
            )}
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm whitespace-pre-line ${
                msg.role === 'user'
                  ? 'bg-jardin-600 text-white rounded-br-sm'
                  : 'bg-white border border-gray-100 text-gray-700 rounded-bl-sm shadow-sm'
              }`}
            >
              {msg.content}
            </div>
            {msg.role === 'user' && (
              <div className="w-7 h-7 rounded-full bg-jardin-600 flex items-center justify-center shrink-0 mt-1">
                <User className="w-4 h-4 text-white" />
              </div>
            )}
          </motion.div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="px-4 py-3 bg-white border-t border-gray-100">
        <form
          onSubmit={e => { e.preventDefault(); sendMessage(input); }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Posez votre question..."
            className="flex-1 bg-gray-50 rounded-full px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-jardin-300 border border-gray-200"
          />
          <button
            type="submit"
            disabled={!input.trim()}
            className="w-10 h-10 rounded-full bg-jardin-600 text-white flex items-center justify-center disabled:opacity-40 hover:bg-jardin-700 transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
