import React from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

export default function ChartLine({data, dataKey, stroke='#f6c85f', height=120}){
  return (
    <div className="chart-panel bg-white dark:bg-slate-800 p-3 rounded shadow">
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={data}>
          <XAxis dataKey="label" hide />
          <YAxis hide />
          <Tooltip />
          <Line type="monotone" dataKey={dataKey} stroke={stroke} strokeWidth={3} dot={false} activeDot={{ r: 5 }} className="animated-line" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
