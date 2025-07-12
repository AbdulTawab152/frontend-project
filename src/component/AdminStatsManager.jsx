import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API_URL = 'http://localhost:5001/api/admin/stats';

const AdminStatsManager = () => {
  const [stats, setStats] = useState([]);
  const [form, setForm] = useState({ label: '', value: '', icon: '', order: 0 });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch stats
  const fetchStats = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get(API_URL, { headers: { Authorization: `Bearer ${token}` } });
      // Defensive: handle both array and object response
      const data = Array.isArray(res.data) ? res.data : res.data.stats || [];
      setStats(data);
      setError('');
    } catch (err) {
      setError('Failed to load stats');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchStats();
    // eslint-disable-next-line
  }, []);

  // Handle form input
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Add or update stat
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const token = localStorage.getItem('token');
    try {
      if (editingId) {
        await axios.put(`${API_URL}/${editingId}`, form, { headers: { Authorization: `Bearer ${token}` } });
      } else {
        await axios.post(API_URL, form, { headers: { Authorization: `Bearer ${token}` } });
      }
      setForm({ label: '', value: '', icon: '', order: 0 });
      setEditingId(null);
      fetchStats();
      setError('');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save stat');
    }
    setLoading(false);
  };

  // Edit stat
  const handleEdit = (stat) => {
    setForm({ label: stat.label, value: stat.value, icon: stat.icon || '', order: stat.order || 0 });
    setEditingId(stat._id);
  };

  // Delete stat
  const handleDelete = async (id) => {
    if (!window.confirm('Delete this stat?')) return;
    setLoading(true);
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`${API_URL}/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      fetchStats();
      setError('');
    } catch (err) {
      setError('Failed to delete stat');
    }
    setLoading(false);
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow border border-blue-100 max-w-2xl mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4 text-blue-900">Manage Site Stats</h2>
      {error && <div className="text-red-600 mb-2">{error}</div>}
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 mb-6">
        <div className="flex gap-2">
          <input
            type="text"
            name="label"
            value={form.label}
            onChange={handleChange}
            placeholder="Label (e.g. Happy Travelers)"
            required
            className="flex-1 rounded border px-3 py-2"
          />
          <input
            type="text"
            name="value"
            value={form.value}
            onChange={handleChange}
            placeholder="Value (e.g. 500+)"
            required
            className="w-32 rounded border px-3 py-2"
          />
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            name="icon"
            value={form.icon}
            onChange={handleChange}
            placeholder="Icon (optional, e.g. users, support)"
            className="flex-1 rounded border px-3 py-2"
          />
          <input
            type="number"
            name="order"
            value={form.order}
            onChange={handleChange}
            placeholder="Order"
            className="w-24 rounded border px-3 py-2"
          />
        </div>
        <button type="submit" className="bg-blue-700 text-white px-6 py-2 rounded hover:bg-blue-800 transition">
          {editingId ? 'Update Stat' : 'Add Stat'}
        </button>
        {editingId && (
          <button type="button" onClick={() => { setEditingId(null); setForm({ label: '', value: '', icon: '', order: 0 }); }} className="text-blue-700 underline text-sm mt-1">Cancel Edit</button>
        )}
      </form>
      <div>
        {loading ? (
          <div>Loading...</div>
        ) : (
          <table className="w-full text-left border-t">
            <thead>
              <tr className="text-blue-800">
                <th className="py-2">Label</th>
                <th>Value</th>
                <th>Icon</th>
                <th>Order</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(stats) && stats.length > 0 ? (
                stats.map(stat => (
                  <tr key={stat._id} className="border-t hover:bg-blue-50">
                    <td className="py-2">{stat.label}</td>
                    <td>{stat.value}</td>
                    <td>{stat.icon}</td>
                    <td>{stat.order}</td>
                    <td>
                      <button onClick={() => handleEdit(stat)} className="text-blue-600 hover:underline mr-2">Edit</button>
                      <button onClick={() => handleDelete(stat._id)} className="text-red-600 hover:underline">Delete</button>
                    </td>
                  </tr>
                ))
                
              ) : (
                <tr>
                  <td colSpan="5">No stats found.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdminStatsManager; 