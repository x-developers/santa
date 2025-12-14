import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Gift, KeyRound, Snowflake, Loader } from 'lucide-react'
import { api } from '../api'

export default function Home() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [joinCode, setJoinCode] = useState('')
  const [showJoin, setShowJoin] = useState(false)
  const [error, setError] = useState('')

  const createGame = async () => {
    setLoading(true)
    try {
      const data = await api.createGame()
      navigate(`/game/${data.code}`)
    } catch (e) {
      setError('Ошибка создания игры')
    }
    setLoading(false)
  }

  const joinGame = async () => {
    if (!joinCode.trim()) {
      setError('Введите код игры')
      return
    }
    
    try {
      await api.getGame(joinCode.trim())
      navigate(`/game/${joinCode.trim()}`)
    } catch (e) {
      setError('Игра не найдена')
    }
  }

  return (
    <div className="relative z-10 max-w-2xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Snowflake className="w-10 h-10 text-blue-200" />
          <h1 className="text-5xl font-bold text-white">🎅 Тайный Санта</h1>
          <Snowflake className="w-10 h-10 text-blue-200" />
        </div>
        <p className="text-blue-200 text-lg">Организуй обмен подарками с друзьями!</p>
      </div>

      <div className="grid gap-4 max-w-md mx-auto">
        <button
          onClick={createGame}
          disabled={loading}
          className="px-8 py-5 bg-gradient-to-r from-red-500 to-green-500 hover:from-red-600 hover:to-green-600 text-white text-xl font-bold rounded-2xl transition-all transform hover:scale-105 shadow-xl flex items-center justify-center gap-3 disabled:opacity-50"
        >
          {loading ? (
            <Loader className="w-6 h-6 animate-spin" />
          ) : (
            <>
              <Gift className="w-6 h-6" />
              Создать игру
            </>
          )}
        </button>

        {!showJoin ? (
          <button
            onClick={() => setShowJoin(true)}
            className="px-8 py-5 bg-white/20 hover:bg-white/30 text-white text-xl font-bold rounded-2xl transition-all border border-white/30 flex items-center justify-center gap-3"
          >
            <KeyRound className="w-6 h-6" />
            Присоединиться
          </button>
        ) : (
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <input
              type="text"
              placeholder="Код игры"
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && joinGame()}
              className="w-full px-4 py-3 rounded-xl bg-white/20 border border-white/30 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-green-400 mb-3"
            />
            <button
              onClick={joinGame}
              className="w-full py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-xl transition-all"
            >
              Войти
            </button>
          </div>
        )}
      </div>

      {error && (
        <div className="mt-4 p-3 bg-red-500/30 border border-red-400/50 rounded-xl text-red-200 text-sm text-center max-w-md mx-auto">
          {error}
        </div>
      )}

      <div className="mt-16 grid grid-cols-3 gap-4 text-center">
        <div className="bg-white/10 rounded-xl p-4">
          <div className="text-3xl mb-2">1️⃣</div>
          <div className="text-white text-sm font-medium">Создай игру и добавь участников</div>
        </div>
        <div className="bg-white/10 rounded-xl p-4">
          <div className="text-3xl mb-2">2️⃣</div>
          <div className="text-white text-sm font-medium">Проведи жеребьёвку</div>
        </div>
        <div className="bg-white/10 rounded-xl p-4">
          <div className="text-3xl mb-2">3️⃣</div>
          <div className="text-white text-sm font-medium">Отправь ссылки участникам</div>
        </div>
      </div>

      <div className="text-center mt-8 text-blue-300/50 text-sm">
        🎄 Счастливого Нового Года! 🎄
      </div>
    </div>
  )
}
