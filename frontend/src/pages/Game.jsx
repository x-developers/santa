import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { 
  Gift, UserPlus, Shuffle, Trash2, Users, Link, 
  ArrowLeft, Copy, Check, Share2, Loader 
} from 'lucide-react'
import { api } from '../api'

export default function Game() {
  const { code } = useParams()
  const navigate = useNavigate()
  const [game, setGame] = useState(null)
  const [loading, setLoading] = useState(true)
  const [newName, setNewName] = useState('')
  const [newWishlist, setNewWishlist] = useState('')
  const [error, setError] = useState('')
  const [isShuffling, setIsShuffling] = useState(false)
  const [copiedId, setCopiedId] = useState(null)

  const fetchGame = async () => {
    try {
      const data = await api.getGame(code)
      setGame(data)
    } catch (e) {
      navigate('/')
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchGame()
  }, [code])

  const addParticipant = async () => {
    const name = newName.trim()
    if (!name) {
      setError('Введите имя участника')
      return
    }

    try {
      await api.addParticipant(code, name, newWishlist.trim())
      setNewName('')
      setNewWishlist('')
      setError('')
      fetchGame()
    } catch (e) {
      setError(e.message || 'Ошибка добавления')
    }
  }

  const removeParticipant = async (id) => {
    try {
      await api.removeParticipant(code, id)
      fetchGame()
    } catch (e) {
      setError('Ошибка удаления')
    }
  }

  const shuffle = async () => {
    setIsShuffling(true)
    setError('')
    
    try {
      if (game.shuffled) {
        await api.reshuffle(code)
      } else {
        await api.shuffle(code)
      }
      await fetchGame()
    } catch (e) {
      setError(e.message || 'Ошибка жеребьёвки')
    }
    
    setIsShuffling(false)
  }

  const getParticipantLink = (participant) => {
    return `${window.location.origin}/p/${participant.token}`
  }

  const copyLink = async (participant) => {
    await navigator.clipboard.writeText(getParticipantLink(participant))
    setCopiedId(participant.id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const copyAllLinks = async () => {
    const links = game.participants.map(p => `${p.name}:\n${getParticipantLink(p)}`).join('\n\n')
    await navigator.clipboard.writeText(links)
    setCopiedId('all')
    setTimeout(() => setCopiedId(null), 2000)
  }

  const copyGameLink = async () => {
    await navigator.clipboard.writeText(`${window.location.origin}/game/${code}`)
    setCopiedId('game')
    setTimeout(() => setCopiedId(null), 2000)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="w-8 h-8 text-white animate-spin" />
      </div>
    )
  }

  return (
    <div className="relative z-10 max-w-2xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate('/')}
          className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-all"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            🎅 Тайный Санта
          </h1>
          <div className="flex items-center gap-2 text-blue-300 text-sm">
            <span>Код: {code}</span>
            <button
              onClick={copyGameLink}
              className="p-1 hover:bg-white/10 rounded transition-all"
            >
              {copiedId === 'game' ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
            </button>
          </div>
        </div>
      </div>

      {/* Add Participant */}
      {!game.shuffled && (
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-6 border border-white/20">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <UserPlus className="w-5 h-5" />
            Добавить участника
          </h2>
          <div className="space-y-3">
            <input
              type="text"
              placeholder="Имя участника"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addParticipant()}
              className="w-full px-4 py-3 rounded-xl bg-white/20 border border-white/30 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-green-400"
            />
            <input
              type="text"
              placeholder="Пожелания к подарку (необязательно)"
              value={newWishlist}
              onChange={(e) => setNewWishlist(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addParticipant()}
              className="w-full px-4 py-3 rounded-xl bg-white/20 border border-white/30 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-green-400"
            />
            <button
              onClick={addParticipant}
              className="w-full py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-xl transition-all flex items-center justify-center gap-2"
            >
              <UserPlus className="w-5 h-5" />
              Добавить
            </button>
          </div>
          
          {error && (
            <div className="mt-3 p-3 bg-red-500/30 border border-red-400/50 rounded-xl text-red-200 text-sm">
              {error}
            </div>
          )}
        </div>
      )}

      {/* Participants List */}
      {game.participants.length > 0 && (
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-6 border border-white/20">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <Users className="w-5 h-5" />
            Участники ({game.participants.length})
          </h2>
          
          <div className="space-y-2">
            {game.participants.map((p, index) => (
              <div key={p.id} className="flex items-center justify-between p-3 bg-white/10 rounded-xl group">
                <div className="flex items-center gap-3">
                  <span className="w-8 h-8 bg-gradient-to-br from-red-400 to-red-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {index + 1}
                  </span>
                  <div>
                    <div className="text-white font-medium">{p.name}</div>
                    {p.wishlist && <div className="text-blue-200 text-sm">🎁 {p.wishlist}</div>}
                  </div>
                </div>
                {!game.shuffled && (
                  <button
                    onClick={() => removeParticipant(p.id)}
                    className="p-2 text-red-300 hover:text-red-400 hover:bg-red-500/20 rounded-lg transition-all opacity-50 group-hover:opacity-100"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Shuffle Button */}
          <button
            onClick={shuffle}
            disabled={isShuffling || game.participants.length < 3}
            className={`w-full mt-4 py-3 font-semibold rounded-xl transition-all flex items-center justify-center gap-2 ${
              isShuffling
                ? 'bg-yellow-500 text-white'
                : game.participants.length < 3
                ? 'bg-gray-500 text-gray-300 cursor-not-allowed'
                : 'bg-gradient-to-r from-red-500 to-green-500 hover:from-red-600 hover:to-green-600 text-white'
            }`}
          >
            <Shuffle className={`w-5 h-5 ${isShuffling ? 'animate-spin' : ''}`} />
            {isShuffling ? 'Распределяем...' : game.shuffled ? 'Перераспределить' : 'Провести жеребьёвку'}
          </button>
          
          {game.participants.length < 3 && (
            <p className="text-yellow-300 text-sm mt-2 text-center">
              Добавьте ещё {3 - game.participants.length} участник(а)
            </p>
          )}
        </div>
      )}

      {/* Links Section */}
      {game.shuffled && (
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
              <Link className="w-5 h-5 text-green-400" />
              Ссылки для участников
            </h2>
            <button
              onClick={copyAllLinks}
              className="px-3 py-1.5 bg-white/20 hover:bg-white/30 text-white text-sm rounded-lg transition-all flex items-center gap-2"
            >
              {copiedId === 'all' ? <Check className="w-4 h-4 text-green-400" /> : <Share2 className="w-4 h-4" />}
              {copiedId === 'all' ? 'Скопировано!' : 'Копировать все'}
            </button>
          </div>
          
          <p className="text-blue-200 text-sm mb-4">
            Отправьте каждому участнику его персональную ссылку
          </p>
          
          <div className="space-y-2">
            {game.participants.map(p => (
              <div key={p.id} className="flex items-center justify-between p-3 bg-white/10 rounded-xl">
                <div className="flex items-center gap-3">
                  <span className="text-xl">🎁</span>
                  <span className="text-white font-medium">{p.name}</span>
                </div>
                <button
                  onClick={() => copyLink(p)}
                  className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-2 text-sm ${
                    copiedId === p.id
                      ? 'bg-green-500/30 text-green-300'
                      : 'bg-white/20 hover:bg-white/30 text-white'
                  }`}
                >
                  {copiedId === p.id ? (
                    <>
                      <Check className="w-4 h-4" />
                      Скопировано!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      Копировать
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>
          
          <div className="mt-4 p-3 bg-green-500/20 border border-green-400/30 rounded-xl">
            <p className="text-green-200 text-sm">
              ✅ Жеребьёвка проведена! Отправьте ссылки участникам
            </p>
          </div>
        </div>
      )}

      {/* Empty State */}
      {game.participants.length === 0 && (
        <div className="text-center py-8">
          <Gift className="w-16 h-16 text-white/30 mx-auto mb-4" />
          <p className="text-white/50">Добавьте участников для начала</p>
        </div>
      )}

      <div className="text-center mt-8 text-blue-300/50 text-sm">
        🎄 Счастливого Нового Года! 🎄
      </div>
    </div>
  )
}
