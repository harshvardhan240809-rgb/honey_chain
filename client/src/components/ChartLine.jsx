import React from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

export default function ChartLine({data, dataKey, stroke='#f6c85f', height=120}){
  return (
    <div className="chart-panel p-3 rounded shadow">
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={data}>
          <XAxis dataKey="label" hide />
          <YAxis hide />
          <Tooltip
            wrapperStyle={{ pointerEvents: 'auto' }}
            contentStyle={{ backgroundColor: 'rgba(2,6,23,0.95)', color: '#e2e8f0', border: '1px solid rgba(255,255,255,0.06)' }}
            labelStyle={{ color: '#cbd5e1' }}
            itemStyle={{ color: stroke }}
          />
          <Line type="monotone" dataKey={dataKey} stroke={stroke} strokeWidth={3} dot={false} activeDot={{ r: 5 }} className="animated-line" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
