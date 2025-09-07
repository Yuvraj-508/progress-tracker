import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';

export default function WeeklyReport() {
  const [weeklyData, setWeeklyData] = useState([]);
  const [selectedWeekIndex, setSelectedWeekIndex] = useState(0);
  const [loading, setLoading] = useState(true);

useEffect(() => {
  const fetchWeeklyReport = async () => {
    try {
      const { data } = await axios.get('/api/user/taskplan/weekly-report');

      if (data.success && Array.isArray(data.weeklyReport)) {
        setWeeklyData(data.weeklyReport);
      } else {
        console.warn('weeklyReport not found or empty');
        setWeeklyData([]);
      }
    } catch (err) {
      console.error(err);
      setWeeklyData([]);
    } finally {
      setLoading(false);
    }
  };
  fetchWeeklyReport();
}, []);


  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
      </div>
    );
  }

  if (!weeklyData.length) return <p className="p-6">No progress data found</p>;

  const selectedWeek = weeklyData[selectedWeekIndex];
  const dailyData = selectedWeek.daily;
  const averageProgress = Math.round(
    dailyData.reduce((sum, d) => sum + d.progressPercent, 0) / dailyData.length
  );

  return (
    <div className="p-6 md:p-10 lg:p-16 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <header className="flex items-center justify-between mb-6">
          <h1 className="text-2xl md:text-3xl font-semibold">Weekly Progress Report</h1>
          <select
            value={selectedWeekIndex}
            onChange={(e) => setSelectedWeekIndex(Number(e.target.value))}
            className="border rounded px-3 py-2 bg-white text-sm"
          >
            {weeklyData.map((week, idx) => (
              <option key={idx} value={idx}>
                {week.weekLabel}
              </option>
            ))}
          </select>
        </header>

        <section className="mb-8">
          <h2 className="text-lg font-medium mb-3">Daily Progress</h2>
          <ul className="space-y-3">
            {dailyData.map((d) => (
              <li key={d.dayNumber} className="flex items-center justify-between">
                <span className="font-semibold">Day {d.dayNumber}</span>
                <div className="flex-1 mx-4">
                  <ProgressBar percent={d.progressPercent} />
                </div>
                <span className="w-12 text-right text-sm font-medium">{d.progressPercent}%</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white p-4 rounded shadow">
            <h2 className="text-lg font-medium mb-3">Line Chart</h2>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={dailyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="dayNumber" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Line type="monotone" dataKey="progressPercent" stroke="#4f46e5" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white p-4 rounded shadow">
            <h2 className="text-lg font-medium mb-3">Bar Chart</h2>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={dailyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="dayNumber" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Bar dataKey="progressPercent" fill="#06b6d4" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-medium mb-2">Weekly Summary</h2>
          <p className="text-gray-700">
            Average Progress: <strong>{averageProgress}%</strong>
          </p>
        </section>
      </div>
    </div>
  );
}

function ProgressBar({ percent = 0 }) {
  return (
    <div className="w-full bg-gray-200 rounded h-4 overflow-hidden">
      <div
        className="h-4 rounded transition-all duration-700 ease-in-out"
        style={{ width: `${percent}%`, background: 'linear-gradient(90deg, #06b6d4, #4f46e5)' }}
      />
    </div>
  );
}

function calculateDayProgress(day) {
  const sections = Array.from(day.locked.values());
  if (!sections.length) return 0;
  const completed = sections.filter(Boolean).length;
  return Math.round((completed / sections.length) * 100);
}
