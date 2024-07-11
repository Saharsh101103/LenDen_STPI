"use client";

import React from "react";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

interface OverviewProps {
  paymentAmount: number;
  payoutAmount: number;
  refundAmount: number;
}

const Overview: React.FC<OverviewProps> = ({ paymentAmount, payoutAmount, refundAmount }) => {
  const data = [
    {
      name: "Total Revenue",
      total: paymentAmount - payoutAmount - refundAmount,
    },
    {
      name: "Payments Received",
      total: paymentAmount,
    },
    {
      name: "Payouts Made",
      total: payoutAmount,
    },
    {
      name: "Refunds",
      total: refundAmount,
    },
  ];

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <XAxis
          dataKey="name"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `₹${value}`}
        />
        <Bar
          dataKey="total"
          fill="currentColor"
          radius={[4, 4, 0, 0]}
          className="fill-secondary"
        />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default Overview;
