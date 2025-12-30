"use client";

import Image from "next/image";
import { useState } from "react";
import { Button } from "@/components/ui/button";

// Dummy data
const payouts = [
  {
    date: "15 May 2020 11:00 pm",
    amount: "$45.99",
    method: "stripe",
    status: "Processing",
  },
  {
    date: "15 May 2020 8:00 pm",
    amount: "$4500",
    method: "stripe",
    status: "Confirmed",
  },
  {
    date: "15 May 2020 7:00 pm",
    amount: "$73.02",
    method: "stripe",
    status: "Confirmed",
  },
  {
    date: "15 May 2020 6:00 pm",
    amount: "$783.83",
    method: "stripe",
    status: "Confirmed",
  },
  {
    date: "15 May 2020 10:00 pm",
    amount: "$91.83",
    method: "stripe",
    status: "Confirmed",
  },
  {
    date: "15 May 2020 9:00 pm",
    amount: "$92.93",
    method: "stripe",
    status: "Confirmed",
  },
  {
    date: "15 May 2020 5:00 pm",
    amount: "$839",
    method: "stripe",
    status: "Confirmed",
  },
];

export default function PayoutHistoryTable() {
  const [page, setPage] = useState(1);
  const totalPages = 10;

  return (
    <div>
      <div className="p-4">
        <h2 className="text-[20px] font-inter font-[600] text-[#414651]">
          Payout History
        </h2>
      </div>
      <div className="bg-white rounded-md border mt-1">
        <div className="overflow-x-auto">
          <table className="min-w-full text-[12px] font-[500] font-inter text-center text-[#535862]">
            <thead className="border-b text-[#535862]">
              <tr>
                <th className="px-6 py-3">Date</th>
                <th className="px-6 py-3">Amount</th>
                <th className="px-6 py-3">Method</th>
                <th className="px-6 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {payouts.map((payout, index) => (
                <tr
                  key={index}
                  className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
                >
                  <td className="px-6 py-4 whitespace-nowrap font-[400] font-inter text-[14px] text-[#181D27]">
                    {payout.date}
                  </td>
                  <td
                    className={`px-6 py-4 ${
                      payout.status === "Processing"
                        ? "text-[#F97316]"
                        : " font-[400] font-inter text-[14px] text-[#181D27]"
                    }`}
                  >
                    {payout.amount}
                  </td>

                  <td className="px-6 py-4 flex justify-center items-center">
                    <Image
                      src="/images/stripe-image.png"
                      alt="stripe"
                      width={50}
                      height={20}
                    />
                  </td>
                  <td className="px-6 py-4">
                    {payout.status === "Confirmed" ? (
                      <span className="bg-green-100 text-green-700 text-xs font-medium px-3 py-1 rounded-full">
                        Confirmed
                      </span>
                    ) : (
                      <span className="bg-orange-100 text-orange-700 text-xs font-medium px-3 py-1 rounded-full">
                        Processing
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between p-2 border-t text-sm text-gray-600">
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={page === totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            >
              Next
            </Button>
          </div>
          <p className="text-sm text-gray-500">
            Page {page} of {totalPages}
          </p>
        </div>
      </div>
    </div>
  );
}
