import React, { useState } from "react";
import { useLang } from "@/context/LanguageContext";
import { Calculator, IndianRupee } from "lucide-react";

export default function BudgetCalculator() {
  const { t } = useLang();
  const [rent, setRent] = useState("");
  const [salary, setSalary] = useState("");
  const [materials, setMaterials] = useState("");
  const [utilities, setUtilities] = useState("");
  const [marketing, setMarketing] = useState("");
  const [revenue, setRevenue] = useState("");
  const [result, setResult] = useState<{
    totalCost: number;
    profit: number;
    margin: number;
    breakeven: number;
  } | null>(null);

  const calculate = () => {
    const r = parseFloat(rent) || 0;
    const s = parseFloat(salary) || 0;
    const m = parseFloat(materials) || 0;
    const u = parseFloat(utilities) || 0;
    const mk = parseFloat(marketing) || 0;
    const rev = parseFloat(revenue) || 0;
    const totalCost = r + s + m + u + mk;
    const profit = rev - totalCost;
    const margin = rev > 0 ? (profit / rev) * 100 : 0;
    const breakeven = profit > 0 ? Math.ceil(totalCost / profit) : 99;
    setResult({ totalCost, profit, margin, breakeven });
  };

  const inputClass = "w-full bg-neutral-950 border border-neutral-800 text-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-neutral-700";

  return (
    <div className="bg-neutral-900/30 border border-neutral-800 rounded-2xl p-5 space-y-4">
      <h3 className="font-bold text-sm text-neutral-300 flex items-center gap-2">
        <Calculator className="w-4 h-4 text-orange-500" />
        {t("budget.title")}
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="text-[10px] text-neutral-500 uppercase font-semibold">{t("budget.rent")}</label>
          <div className="relative mt-1">
            <IndianRupee className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-neutral-500" />
            <input type="number" value={rent} onChange={(e) => setRent(e.target.value)} className={`${inputClass} pl-8`} placeholder="15000" />
          </div>
        </div>
        <div>
          <label className="text-[10px] text-neutral-500 uppercase font-semibold">{t("budget.salary")}</label>
          <div className="relative mt-1">
            <IndianRupee className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-neutral-500" />
            <input type="number" value={salary} onChange={(e) => setSalary(e.target.value)} className={`${inputClass} pl-8`} placeholder="30000" />
          </div>
        </div>
        <div>
          <label className="text-[10px] text-neutral-500 uppercase font-semibold">{t("budget.materials")}</label>
          <div className="relative mt-1">
            <IndianRupee className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-neutral-500" />
            <input type="number" value={materials} onChange={(e) => setMaterials(e.target.value)} className={`${inputClass} pl-8`} placeholder="20000" />
          </div>
        </div>
        <div>
          <label className="text-[10px] text-neutral-500 uppercase font-semibold">{t("budget.utilities")}</label>
          <div className="relative mt-1">
            <IndianRupee className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-neutral-500" />
            <input type="number" value={utilities} onChange={(e) => setUtilities(e.target.value)} className={`${inputClass} pl-8`} placeholder="8000" />
          </div>
        </div>
        <div>
          <label className="text-[10px] text-neutral-500 uppercase font-semibold">{t("budget.marketing")}</label>
          <div className="relative mt-1">
            <IndianRupee className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-neutral-500" />
            <input type="number" value={marketing} onChange={(e) => setMarketing(e.target.value)} className={`${inputClass} pl-8`} placeholder="10000" />
          </div>
        </div>
        <div>
          <label className="text-[10px] text-neutral-500 uppercase font-semibold">{t("budget.revenue")}</label>
          <div className="relative mt-1">
            <IndianRupee className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-neutral-500" />
            <input type="number" value={revenue} onChange={(e) => setRevenue(e.target.value)} className={`${inputClass} pl-8`} placeholder="100000" />
          </div>
        </div>
      </div>
      <button onClick={calculate} className="w-full bg-orange-500 hover:bg-orange-600 text-black font-bold py-2 rounded-lg text-sm transition-colors">
        {t("budget.calculate")}
      </button>
      {result && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          <div className="bg-neutral-950/60 border border-neutral-800 rounded-xl p-3 text-center">
            <div className="text-[10px] text-neutral-500 uppercase">{t("budget.total_cost")}</div>
            <div className="text-lg font-bold text-white">₹{result.totalCost.toLocaleString()}</div>
          </div>
          <div className="bg-neutral-950/60 border border-neutral-800 rounded-xl p-3 text-center">
            <div className="text-[10px] text-neutral-500 uppercase">{t("budget.profit")}</div>
            <div className={`text-lg font-bold ${result.profit >= 0 ? "text-green-400" : "text-red-400"}`}>
              ₹{result.profit.toLocaleString()}
            </div>
          </div>
          <div className="bg-neutral-950/60 border border-neutral-800 rounded-xl p-3 text-center">
            <div className="text-[10px] text-neutral-500 uppercase">{t("budget.margin")}</div>
            <div className={`text-lg font-bold ${result.margin >= 20 ? "text-green-400" : "text-amber-400"}`}>
              {result.margin.toFixed(1)}%
            </div>
          </div>
          <div className="bg-neutral-950/60 border border-neutral-800 rounded-xl p-3 text-center">
            <div className="text-[10px] text-neutral-500 uppercase">{t("budget.breakeven")}</div>
            <div className="text-lg font-bold text-orange-400">
              {result.breakeven >= 99 ? ">2yr" : `${result.breakeven}m`}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}