import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Gift, ArrowLeft, Loader, Snowflake, RefreshCw } from 'lucide-react'
import { api } from '../api'

export default function Participant() {
  const { token } = useParams()
  const navigate = useNavigate()
  const [assignment, setAssignment] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchAssignment = async () => {
    setLoading(true)
    try {
      const data = await api.getAssignment(token)
      setAssignment(data)
      setError('')
    } catch (e) {
      setError(e.message || 'Ошибка загрузки')
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchAssignment()
  }, [token])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="w-8 h-8 text-white animate-spin" />
      </div>
    )
  }

  return (
    <div className="relative z-10 max-w-2xl mx-auto px-4 py-12">
      <div className="text-center">
        <div className="flex items-center justify-center gap-3 mb-6">
          <Snowflake className="w-8 h-8 text-blue-200" />
          <h1 className="text-3xl font-bold text-white">🎅 Тайный Санта</h1>
          <Snowflake className="w-8 h-8 text-blue-200" />
        </div>

        {error ? (
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
            {error === 'Жеребьёвка ещё не проведена' ? (
              <>
                <div className="text-6xl mb-4">⏳</div>
                <h2 className="text-xl font-semibold text-white mb-2">Жеребьёвка ещё не проведена</h2>
                <p className="text-blue-200">Подожди, пока организатор распределит участников</p>
                <button
                  onClick={fetchAssignment}
                  className="mt-4 px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-all flex items-center gap-2 mx-auto"
                >
                  <RefreshCw className="w-4 h-4" />
                  Обновить
                </button>
              </>
            ) : (
              <>
                <div className="text-6xl mb-4">❌</div>
                <h2 className="text-xl font-semibold text-white mb-2">Ошибка</h2>
                <p className="text-blue-200">{error}</p>
              </>
            )}
          </div>
        ) : assignment && (
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
            <div className="text-6xl mb-4">🎁</div>
            <h2 className="text-xl text-blue-200 mb-2">
              Привет, <span className="text-white font-bold">{assignment.my_name}</span>!
            </h2>
            <p className="text-blue-200 mb-6">Ты даришь подарок для:</p>
            
            <div className="bg-gradient-to-r from-red-500/30 to-green-500/30 rounded-2xl p-6 border border-yellow-400/50 animate-glow">
              <div className="text-4xl font-bold text-yellow-300 mb-2">
                🎄 {assignment.receiver_name} 🎄
              </div>
              
              {assignment.receiver_wishlist && (
                <div className="mt-4 p-4 bg-white/10 rounded-xl">
                  <div className="text-white/70 text-sm mb-1">Пожелания к подарку:</div>
                  <div className="text-white text-lg">💡 {assignment.receiver_wishlist}</div>
                </div>
              )}
            </div>
            
            <p className="text-blue-300/70 text-sm mt-6">
              Никому не рассказывай! Это секрет 🤫
            </p>
          </div>
        )}

        <button
          onClick={() => navigate('/')}
          className="mt-6 text-blue-300 hover:text-white transition-all flex items-center gap-2 mx-auto"
        >
          <ArrowLeft className="w-4 h-4" />
          Создать свою игру
        </button>

        <div className="text-center mt-8 text-blue-300/50 text-sm">
          🎄 Счастливого Нового Года! 🎄
        </div>
      </div>
    </div>
  )
}
