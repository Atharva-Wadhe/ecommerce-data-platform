import React, { useEffect, useState } from 'react';
import api from './services/api';

export default function App(){
  const [summary, setSummary] = useState(null);

  useEffect(()=>{
    async function load(){
      const res = await api.get('/api/dashboard/summary?fromDate=2018-01-01&toDate=2018-01-31');
      setSummary(res.data);
    }
    load();
  },[]);

  if(!summary) return <div>Loading...</div>;

  return (
    <div style={{padding:20}}>
      <h1>ShopSphere Dashboard</h1>
      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:10}}>
        <Stat title="Revenue" value={summary.totalRevenue} />
        <Stat title="Orders" value={summary.totalOrders} />
        <Stat title="Customers" value={summary.totalCustomers} />
        <Stat title="Products" value={summary.totalProducts} />
      </div>
    </div>
  );
}

function Stat({title, value}){
  return (
    <div style={{border:'1px solid #ddd',padding:10}}>
      <h3>{title}</h3>
      <div>{value}</div>
    </div>
  )
}
