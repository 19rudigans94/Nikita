import { useState, useEffect } from 'react';
import { Edit, Trash2, Plus, Save, X, Bell } from 'lucide-react';
import { Game } from '../types';
import { gamesAPI, rentalsAPI } from '../services/api';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Container from '../components/common/Container';
import OrderHistory from '../components/admin/OrderHistory';
import NotificationBadge from '../components/admin/NotificationBadge';
import { useWebSocket } from '../hooks/useWebSocket';

const INITIAL_FORM: Omit<Game, 'id'> = {
  title: '',
  description: '',
  imageUrl: '',
  pricePerDay: 0,
  platform: '',
  available: true
};

export default function Admin() {
  const [activeTab, setActiveTab] = useState<'games' | 'orders'>('games');
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [editingGame, setEditingGame] = useState<Game | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasNewNotification, setHasNewNotification] = useState(false);
  const { lastMessage } = useWebSocket();

  useEffect(() => {
    if (lastMessage?.type === 'NEW_RENTAL') {
      setHasNewNotification(true);
      if (activeTab === 'orders') {
        setHasNewNotification(false);
      }
    }
  }, [lastMessage, activeTab]);

  useEffect(() => {
    loadGames();
  }, []);

  const loadGames = async () => {
    try {
      const data = await gamesAPI.getAll();
      setGames(data);
    } catch (err) {
      setError('Failed to load games');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      if (editingGame) {
        const updatedGame = await gamesAPI.update(editingGame.id, formData);
        setGames(games.map(game => 
          game.id === editingGame.id ? updatedGame : game
        ));
      } else {
        const newGame = await gamesAPI.create(formData);
        setGames([...games, newGame]);
      }
      handleCloseForm();
    } catch (err) {
      setError('Failed to save game');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (game: Game) => {
    setEditingGame(game);
    setFormData(game);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this game?')) return;

    try {
      await gamesAPI.delete(id);
      setGames(games.filter(game => game.id !== id));
    } catch (err) {
      setError('Failed to delete game');
      console.error(err);
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingGame(null);
    setFormData(INITIAL_FORM);
    setError('');
  };

  const handleTabChange = (tab: 'games' | 'orders') => {
    setActiveTab(tab);
    if (tab === 'orders') {
      setHasNewNotification(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <Container className="py-12">
      <div className="mb-8">
        <div className="sm:flex sm:items-center sm:justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <div className="mt-4 sm:mt-0 flex space-x-4">
            <button
              onClick={() => handleTabChange('games')}
              className={`px-4 py-2 rounded-md ${
                activeTab === 'games'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              Games
            </button>
            <button
              onClick={() => handleTabChange('orders')}
              className={`px-4 py-2 rounded-md flex items-center ${
                activeTab === 'orders'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              Orders
              {hasNewNotification && <NotificationBadge />}
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {activeTab === 'games' ? (
        <>
          <div className="mb-4">
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add New Game
            </button>
          </div>

          <div className="bg-white shadow-md rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Game
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Platform
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price/Day
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {games.map((game) => (
                  <tr key={game.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          <img
                            className="h-10 w-10 rounded-full object-cover"
                            src={game.imageUrl}
                            alt={game.title}
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{game.title}</div>
                          <div className="text-sm text-gray-500">{game.description}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {game.platform}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ${game.pricePerDay}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        game.available
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {game.available ? 'Available' : 'Unavailable'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleEdit(game)}
                        className="text-indigo-600 hover:text-indigo-900 mr-4"
                      >
                        <Edit className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(game.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <OrderHistory />
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">
                {editingGame ? 'Edit Game' : 'Add New Game'}
              </h2>
              <button
                onClick={handleCloseForm}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Title</label>
                <input
                  type="text"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  required
                  rows={3}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Image URL</label>
                <input
                  type="url"
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Price per Day ($)</label>
                <input
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  value={formData.pricePerDay}
                  onChange={(e) => setFormData({ ...formData, pricePerDay: parseFloat(e.target.value) })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Platform</label>
                <select
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  value={formData.platform}
                  onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                >
                  <option value="">Select Platform</option>
                  <option value="PS5">PS5</option>
                  <option value="Xbox Series X">Xbox Series X</option>
                  <option value="Nintendo Switch">Nintendo Switch</option>
                </select>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="available"
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  checked={formData.available}
                  onChange={(e) => setFormData({ ...formData, available: e.target.checked })}
                />
                <label htmlFor="available" className="ml-2 block text-sm text-gray-700">
                  Available for Rent
                </label>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={handleCloseForm}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 inline-flex items-center disabled:opacity-50"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      {editingGame ? 'Update Game' : 'Add Game'}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Container>
  );
}