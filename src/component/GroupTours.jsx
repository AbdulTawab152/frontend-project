import React, { useState } from 'react';
import CardList from './CardList';
import Navbar from './Navbar';
import { FaMapMarkerAlt, FaSearch } from 'react-icons/fa';

const provinces = [
  'Kabul', 'Herat', 'Balkh', 'Kandahar', 'Nangarhar', 'Bamyan', 'Badakhshan', 'Panjshir', 'Samangan', 'Parwan', 'Other'
];

const GroupTours = () => {
  const [province, setProvince] = useState('');
  const [search, setSearch] = useState('');

  // Filtering logic
  const filterFn = (card) => {
    let pass = true;
    if (province && card.province !== province) pass = false;
    if (search && !(card.title?.toLowerCase().includes(search.toLowerCase()) || card.name?.toLowerCase().includes(search.toLowerCase()))) pass = false;
    return pass;
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-10">
        <div className="max-w-7xl mx-auto px-4 mb-8">
          <div className="text-center mb-10">
            <h1 className="text-5xl font-extrabold text-blue-800 drop-shadow-lg tracking-tight mb-3">Discover Group Tours</h1>
            <p className="text-xl text-gray-600 font-medium max-w-2xl mx-auto">Explore Afghanistan's most beautiful destinations with our curated group tours. Filter by province or search by name to find your next adventure!</p>
          </div>
          {/* Sticky Filter Bar */}
          <div className="sticky top-4 z-20">
            <div className="flex flex-wrap gap-6 justify-center items-center bg-white/60 backdrop-blur-lg rounded-3xl shadow-2xl border border-blue-100 p-6 transition-all duration-300">
              {/* Province Filter */}
              <div className="flex flex-col items-start min-w-[180px]">
                <label className="flex items-center gap-2 text-sm font-semibold text-blue-700 mb-1">
                  <FaMapMarkerAlt className="text-blue-500" /> Province
                </label>
                <select
                  value={province}
                  onChange={e => setProvince(e.target.value)}
                  className="w-full rounded-xl border border-blue-200 bg-white/80 px-4 py-2 text-blue-900 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-200 shadow-sm hover:border-blue-400"
                >
                  <option value="">All</option>
                  {provinces.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>
              {/* Name/Title Filter */}
              <div className="flex flex-col items-start min-w-[220px]">
                <label className="flex items-center gap-2 text-sm font-semibold text-blue-700 mb-1">
                  <FaSearch className="text-blue-500" /> Tour Name
                </label>
                <div className="relative w-full">
                  <input
                    type="text"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Search by name..."
                    className="w-full rounded-xl border border-blue-200 bg-white/80 px-4 py-2 pl-10 text-blue-900 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-200 shadow-sm hover:border-blue-400 placeholder-blue-300"
                  />
                  <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-300 pointer-events-none" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <CardList filterFn={filterFn} headerTitle="" headerDesc="" />
      </div>
    </>
  );
};

export default GroupTours; 