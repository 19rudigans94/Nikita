import { useState, useEffect } from 'react';
import { rentalsAPI } from '../../services/api';
import { RentalOrder } from '../../types';
import LoadingSpinner from '../common/LoadingSpinner';
import { formatDate } from '../../utils/date';
import { useWebSocket } from '../../hooks/useWebSocket';

export default function OrderHistory() {
  const [orders, setOrders] = useState<RentalOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { lastMessage } = useWebSocket();

  useEffect(() => {
    loadOrders();
  }, []);

  useEffect(() => {
    if (lastMessage?.type === 'NEW_RENTAL') {
      loadOrders();
    }
  }, [lastMessage]);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const data = await rentalsAPI.getAll();
      setOrders(data);
    } catch (err) {
      setError('Failed to load orders');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId: string, newStatus: string) => {
    try {
      await rentalsAPI.updateStatus(orderId, newStatus);
      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      ));
    } catch (err) {
      console.error('Failed to update order status:', err);
    }
  };

  if (loading) return <LoadingSpinner />;

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">{error}</p>
        <button
          onClick={loadOrders}
          className="mt-4 text-indigo-600 hover:text-indigo-800"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No orders found.</p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Order Details
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Customer
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
          {orders.map((order) => (
            <tr key={order.id} className={order.status === 'pending' ? 'bg-yellow-50' : ''}>
              <td className="px-6 py-4">
                <div className="text-sm">
                  <p className="font-medium text-gray-900">
                    Order #{order.id?.slice(-6)}
                  </p>
                  <p className="text-gray-500">
                    {formatDate(order.createdAt || '')}
                  </p>
                  <div className="mt-1">
                    {order.games.map(game => (
                      <span
                        key={game.id}
                        className="inline-block bg-gray-100 rounded px-2 py-1 text-xs font-medium text-gray-800 mr-2 mb-1"
                      >
                        {game.title}
                      </span>
                    ))}
                  </div>
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="text-sm">
                  <p className="font-medium text-gray-900">{order.name}</p>
                  <p className="text-gray-500">{order.phone}</p>
                  <p className="text-gray-500">{order.duration} days</p>
                </div>
              </td>
              <td className="px-6 py-4">
                <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  order.status === 'pending'
                    ? 'bg-yellow-100 text-yellow-800'
                    : order.status === 'active'
                    ? 'bg-green-100 text-green-800'
                    : order.status === 'completed'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {order.status}
                </span>
              </td>
              <td className="px-6 py-4 text-sm">
                {order.status === 'pending' && (
                  <button
                    onClick={() => handleStatusUpdate(order.id!, 'active')}
                    className="text-green-600 hover:text-green-900 mr-2"
                  >
                    Approve
                  </button>
                )}
                {order.status === 'active' && (
                  <button
                    onClick={() => handleStatusUpdate(order.id!, 'completed')}
                    className="text-blue-600 hover:text-blue-900 mr-2"
                  >
                    Complete
                  </button>
                )}
                {order.status === 'pending' && (
                  <button
                    onClick={() => handleStatusUpdate(order.id!, 'cancelled')}
                    className="text-red-600 hover:text-red-900"
                  >
                    Cancel
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}