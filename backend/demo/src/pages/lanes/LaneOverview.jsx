import { useState, useEffect, useMemo, useCallback } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, ReferenceLine
} from 'recharts';
import './LaneOverview.css';

// Color palette matching original
const COLORS = {
  spot: '#1976d2',      // Blue - Spot Price
  contract: '#ff9800',   // Orange - Contract Price  
  diesel: '#26a69a',     // Teal - Diesel Price
};

// Countries available for selection
const COUNTRIES = [
  { code: 'DE', name: 'Germany' },
  { code: 'FR', name: 'France' },
  { code: 'NL', name: 'Netherlands' },
  { code: 'BE', name: 'Belgium' },
  { code: 'PL', name: 'Poland' },
  { code: 'ES', name: 'Spain' },
  { code: 'IT', name: 'Italy' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'AT', name: 'Austria' },
  { code: 'CZ', name: 'Czechia' },
];

// German regions
const DE_REGIONS = [
  { code: 'ALL', name: 'Whole country' },
  { code: 'Central', name: 'Central' },
  { code: 'East', name: 'East' },
  { code: 'Northeast', name: 'Northeast' },
  { code: 'Northwest', name: 'Northwest' },
  { code: 'Southeast', name: 'Southeast' },
  { code: 'Southwest', name: 'Southwest' },
  { code: 'West', name: 'West' },
];

// Date range options
const DATE_RANGES = [
  { value: '2y', label: 'Last 2 years' },
  { value: '1y', label: 'Last year' },
  { value: '6m', label: 'Last 6 months' },
  { value: '3m', label: 'Last 3 months' },
];

// Get calendar week number from date
function getCalendarWeek(dateStr) {
  const date = new Date(dateStr);
  const jan1 = new Date(date.getFullYear(), 0, 1);
  const days = Math.floor((date - jan1) / (24 * 60 * 60 * 1000));
  return Math.ceil((days + jan1.getDay() + 1) / 7);
}

// Format date for X-axis
function formatXAxis(dateStr) {
  const date = new Date(dateStr);
  const month = date.toLocaleString('en', { month: 'short' });
  const year = date.getFullYear().toString().slice(-2);
  return `${month} '${year}`;
}

// Calculate percentage change
function calcChange(current, previous) {
  if (!previous || previous === 0) return null;
  return ((current - previous) / previous) * 100;
}

export default function LaneOverview() {
  const [allData, setAllData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filter state
  const [fromCountry, setFromCountry] = useState('DE');
  const [fromRegion, setFromRegion] = useState('ALL');
  const [toCountry, setToCountry] = useState('DE');
  const [toRegion, setToRegion] = useState('ALL');
  const [frequency, setFrequency] = useState('weekly');
  const [dateRange, setDateRange] = useState('2y');
  
  // Hover state for chart-table sync
  const [hoveredIndex, setHoveredIndex] = useState(null);
  
  // Dropdown open states
  const [fromOpen, setFromOpen] = useState(false);
  const [toOpen, setToOpen] = useState(false);

  // Load all lane data
  useEffect(() => {
    fetch('/api-data/lane-overview/all-lanes.json')
      .then(res => res.json())
      .then(data => {
        setAllData(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  // Build lane key from current selection
  const laneKey = useMemo(() => {
    if (fromCountry === 'DE' && toCountry === 'DE') {
      // German regional route
      if (fromRegion !== 'ALL' || toRegion !== 'ALL') {
        return `DE-${fromRegion}-DE-${toRegion}`;
      }
    }
    return `${fromCountry}-${toCountry}`;
  }, [fromCountry, fromRegion, toCountry, toRegion]);

  // Get current lane data
  const laneData = useMemo(() => {
    if (!allData) return null;
    return allData[laneKey] || null;
  }, [allData, laneKey]);

  // Process data for chart
  const chartData = useMemo(() => {
    if (!laneData) return [];
    
    const families = laneData.metricFamilies;
    const spotFamily = families.find(f => f.metricFamilyId === 'spot-price');
    const contractFamily = families.find(f => f.metricFamilyId === 'contract-price');
    const dieselFamily = families.find(f => f.metricFamilyId === 'diesel-price');
    
    const spotData = spotFamily?.metrics?.metrics?.[0]?.timeseries?.datapoints || [];
    const contractData = contractFamily?.metrics?.metrics?.[0]?.timeseries?.datapoints || [];
    const dieselData = dieselFamily?.metrics?.metrics?.[0]?.timeseries?.datapoints || [];
    
    // Merge all data by date
    const dataMap = new Map();
    
    spotData.forEach(([date, value]) => {
      if (!dataMap.has(date)) dataMap.set(date, { date });
      dataMap.get(date).spot = value;
    });
    
    contractData.forEach(([date, value]) => {
      if (!dataMap.has(date)) dataMap.set(date, { date });
      dataMap.get(date).contract = value;
    });
    
    dieselData.forEach(([date, value]) => {
      if (!dataMap.has(date)) dataMap.set(date, { date });
      dataMap.get(date).diesel = value;
    });
    
    // Convert to array and sort by date
    let data = Array.from(dataMap.values()).sort((a, b) => 
      new Date(a.date) - new Date(b.date)
    );
    
    // Apply date range filter
    const now = new Date();
    let cutoff = new Date();
    switch (dateRange) {
      case '1y': cutoff.setFullYear(now.getFullYear() - 1); break;
      case '6m': cutoff.setMonth(now.getMonth() - 6); break;
      case '3m': cutoff.setMonth(now.getMonth() - 3); break;
      default: cutoff.setFullYear(now.getFullYear() - 2); // 2y
    }
    data = data.filter(d => new Date(d.date) >= cutoff);
    
    // Add calculated fields
    data.forEach((d, i) => {
      d.cw = `CW${getCalendarWeek(d.date)}`;
      d.year = new Date(d.date).getFullYear();
      d.formattedDate = formatXAxis(d.date);
      
      // Calculate percentage changes from previous
      if (i > 0) {
        d.spotChange = calcChange(d.spot, data[i-1].spot);
        d.contractChange = calcChange(d.contract, data[i-1].contract);
        d.dieselChange = calcChange(d.diesel, data[i-1].diesel);
      }
    });
    
    return data;
  }, [laneData, dateRange]);

  // Custom tooltip
  const CustomTooltip = useCallback(({ active, payload }) => {
    if (!active || !payload?.length) return null;
    
    const data = payload[0]?.payload;
    if (!data) return null;
    
    return (
      <div className="chart-tooltip">
        <div className="tooltip-header">{data.cw} {data.year}</div>
        {payload.map((p, i) => (
          <div key={i} className="tooltip-row">
            <span className="tooltip-dot" style={{ background: p.color }} />
            <span className="tooltip-label">{p.name}:</span>
            <span className="tooltip-value">€{p.value?.toFixed(4)}</span>
          </div>
        ))}
      </div>
    );
  }, []);

  // Handle mouse move on chart for sync
  const handleChartMouseMove = useCallback((state) => {
    if (state?.activeTooltipIndex !== undefined) {
      setHoveredIndex(state.activeTooltipIndex);
    }
  }, []);

  const handleChartMouseLeave = useCallback(() => {
    setHoveredIndex(null);
  }, []);

  // Country dropdown component
  const CountryDropdown = ({ value, region, setValue, setRegion, open, setOpen, label }) => (
    <div className="filter-group">
      <label>{label}</label>
      <div className="dropdown-wrapper">
        <button 
          className="dropdown-button"
          onClick={() => setOpen(!open)}
        >
          <span className="country-flag">{value}</span>
          <span className="country-name">
            {COUNTRIES.find(c => c.code === value)?.name}
            {value === 'DE' && region !== 'ALL' ? ` - ${region}` : ''}
          </span>
          <span className="dropdown-arrow">▼</span>
        </button>
        
        {open && (
          <div className="dropdown-menu">
            {COUNTRIES.map(country => (
              <div key={country.code}>
                <button
                  className={`dropdown-item ${value === country.code && region === 'ALL' ? 'active' : ''}`}
                  onClick={() => {
                    setValue(country.code);
                    setRegion('ALL');
                    setOpen(false);
                  }}
                >
                  <span className="country-flag">{country.code}</span>
                  {country.name}
                </button>
                
                {/* Show German regions */}
                {country.code === 'DE' && value === 'DE' && (
                  <div className="region-submenu">
                    {DE_REGIONS.map(r => (
                      <button
                        key={r.code}
                        className={`dropdown-item region-item ${region === r.code ? 'active' : ''}`}
                        onClick={() => {
                          setValue('DE');
                          setRegion(r.code);
                          setOpen(false);
                        }}
                      >
                        {r.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  if (loading) {
    return <div className="lane-overview loading">Loading lane data...</div>;
  }

  if (error) {
    return <div className="lane-overview error">Error: {error}</div>;
  }

  if (!laneData) {
    return (
      <div className="lane-overview no-data">
        <p>No data available for route {laneKey}</p>
        <p>Try selecting a different From/To combination</p>
      </div>
    );
  }

  return (
    <div className="lane-overview">
      {/* Header */}
      <div className="page-header">
        <h1>Lane Overview</h1>
        <div className="lane-route">
          {fromCountry}{fromRegion !== 'ALL' ? ` (${fromRegion})` : ''} → {toCountry}{toRegion !== 'ALL' ? ` (${toRegion})` : ''}
        </div>
      </div>

      {/* Filter Bar */}
      <div className="filter-bar">
        <CountryDropdown
          value={fromCountry}
          region={fromRegion}
          setValue={setFromCountry}
          setRegion={setFromRegion}
          open={fromOpen}
          setOpen={setFromOpen}
          label="From"
        />
        
        <CountryDropdown
          value={toCountry}
          region={toRegion}
          setValue={setToCountry}
          setRegion={setToRegion}
          open={toOpen}
          setOpen={setToOpen}
          label="To"
        />
        
        <div className="filter-group">
          <label>Date Range</label>
          <select 
            value={dateRange} 
            onChange={e => setDateRange(e.target.value)}
            className="filter-select"
          >
            {DATE_RANGES.map(r => (
              <option key={r.value} value={r.value}>{r.label}</option>
            ))}
          </select>
        </div>
        
        <div className="filter-group">
          <label>Frequency</label>
          <select 
            value={frequency} 
            onChange={e => setFrequency(e.target.value)}
            className="filter-select"
          >
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>
        
        <div className="filter-group">
          <label>Metrics</label>
          <button className="filter-select metrics-button" disabled>
            Spot Price, Contract Price, Diesel
          </button>
        </div>
      </div>

      {/* Chart */}
      <div className="chart-container">
        <ResponsiveContainer width="100%" height={400}>
          <LineChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
            onMouseMove={handleChartMouseMove}
            onMouseLeave={handleChartMouseLeave}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis 
              dataKey="formattedDate" 
              tick={{ fontSize: 12 }}
              tickLine={false}
              interval="preserveStartEnd"
            />
            <YAxis 
              domain={['auto', 'auto']}
              tickFormatter={v => `€${v.toFixed(2)}`}
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend 
              verticalAlign="bottom" 
              height={36}
              iconType="circle"
            />
            
            {/* Hover reference line */}
            {hoveredIndex !== null && chartData[hoveredIndex] && (
              <ReferenceLine 
                x={chartData[hoveredIndex].formattedDate} 
                stroke="#666"
                strokeDasharray="3 3"
              />
            )}
            
            <Line 
              type="monotone" 
              dataKey="spot" 
              name="Spot Price €/km"
              stroke={COLORS.spot}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 6 }}
            />
            <Line 
              type="monotone" 
              dataKey="contract" 
              name="Contract Price €/km"
              stroke={COLORS.contract}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 6 }}
            />
            <Line 
              type="monotone" 
              dataKey="diesel" 
              name="Diesel Price"
              stroke={COLORS.diesel}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Data Table */}
      <div className="data-table-container">
        <h3>Weekly Data</h3>
        <div className="data-table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th className="metric-col">Metric</th>
                {chartData.slice(-26).map((d, i) => (
                  <th 
                    key={d.date} 
                    className={`cw-col ${hoveredIndex === chartData.length - 26 + i ? 'highlighted' : ''}`}
                  >
                    {d.cw}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="metric-col">
                  <span className="metric-dot" style={{ background: COLORS.spot }} />
                  Spot Price €/km
                </td>
                {chartData.slice(-26).map((d, i) => (
                  <td 
                    key={d.date}
                    className={`cw-col ${hoveredIndex === chartData.length - 26 + i ? 'highlighted' : ''}`}
                  >
                    <div className="cell-value">{d.spot?.toFixed(2)}</div>
                    {d.spotChange != null && (
                      <div className={`cell-change ${d.spotChange >= 0 ? 'positive' : 'negative'}`}>
                        {d.spotChange >= 0 ? '+' : ''}{d.spotChange.toFixed(1)}%
                      </div>
                    )}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="metric-col">
                  <span className="metric-dot" style={{ background: COLORS.contract }} />
                  Contract Price €/km
                </td>
                {chartData.slice(-26).map((d, i) => (
                  <td 
                    key={d.date}
                    className={`cw-col ${hoveredIndex === chartData.length - 26 + i ? 'highlighted' : ''}`}
                  >
                    <div className="cell-value">{d.contract?.toFixed(2)}</div>
                    {d.contractChange != null && (
                      <div className={`cell-change ${d.contractChange >= 0 ? 'positive' : 'negative'}`}>
                        {d.contractChange >= 0 ? '+' : ''}{d.contractChange.toFixed(1)}%
                      </div>
                    )}
                  </td>
                ))}
              </tr>
              <tr>
                <td className="metric-col">
                  <span className="metric-dot" style={{ background: COLORS.diesel }} />
                  Diesel Price
                </td>
                {chartData.slice(-26).map((d, i) => (
                  <td 
                    key={d.date}
                    className={`cw-col ${hoveredIndex === chartData.length - 26 + i ? 'highlighted' : ''}`}
                  >
                    <div className="cell-value">{d.diesel?.toFixed(2)}</div>
                    {d.dieselChange != null && (
                      <div className={`cell-change ${d.dieselChange >= 0 ? 'positive' : 'negative'}`}>
                        {d.dieselChange >= 0 ? '+' : ''}{d.dieselChange.toFixed(1)}%
                      </div>
                    )}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
