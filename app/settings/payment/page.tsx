'use client';

import { useState } from 'react';
import Link from 'next/link';
import { CreditCard, Check, Clock, ShoppingCart } from 'lucide-react';

export default function PaymentSettingsPage() {
  const [selectedPlan, setSelectedPlan] = useState<number | null>(null);

  const plans = [
    { id: 1, credits: 100, price: 1000, bonus: 0 },
    { id: 2, credits: 500, price: 4500, bonus: 50, popular: true },
    { id: 3, credits: 1000, price: 8000, bonus: 200 },
    { id: 4, credits: 5000, price: 35000, bonus: 1500 },
  ];

  const purchaseHistory = [
    { id: 1, date: '2025-10-25', credits: 500, amount: 4500, status: '完了' },
    { id: 2, date: '2025-09-15', credits: 100, amount: 1000, status: '完了' },
    { id: 3, date: '2025-08-20', credits: 1000, amount: 8000, status: '完了' },
  ];

  const handlePurchase = () => {
    if (selectedPlan) {
      alert(`クレジットを購入しました！（プランID: ${selectedPlan}）`);
    } else {
      alert('プランを選択してください');
    }
  };

  return (
    <div className="bg-gray-950 min-h-screen">
      <div className="bg-gray-900 border-b border-gray-800">
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <h1 className="text-4xl font-bold flex items-center gap-3">
              <CreditCard className="text-yellow-400" />
              決済設定
            </h1>
            <Link href="/profile" className="text-purple-400 hover:text-purple-300 transition">
              ← マイページに戻る
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-yellow-900/30 to-orange-900/30 rounded-xl p-8 mb-8 border border-yellow-800/50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 mb-2">現在のクレジット残高</p>
                <p className="text-5xl font-bold text-yellow-400">92</p>
              </div>
              <CreditCard size={64} className="text-yellow-400 opacity-50" />
            </div>
          </div>

          <div className="bg-gray-900 rounded-xl p-8 mb-8 border border-gray-800">
            <h2 className="text-2xl font-bold mb-6">クレジット購入</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {plans.map((plan) => (
                <button
                  key={plan.id}
                  onClick={() => setSelectedPlan(plan.id)}
                  className={`relative rounded-xl p-6 border-2 transition ${selectedPlan === plan.id ? 'border-purple-600 bg-purple-900/30' : 'border-gray-700 bg-gray-800 hover:border-gray-600'}`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <span className="bg-purple-600 text-white text-xs font-bold px-3 py-1 rounded-full">人気</span>
                    </div>
                  )}
                  <div className="text-center">
                    <div className="text-3xl font-bold mb-2">
                      {plan.credits}
                      {plan.bonus > 0 && <span className="text-lg text-yellow-400"> +{plan.bonus}</span>}
                    </div>
                    <div className="text-sm text-gray-400 mb-4">クレジット</div>
                    <div className="text-2xl font-bold text-purple-400">¥{plan.price.toLocaleString()}</div>
                    {plan.bonus > 0 && <div className="text-xs text-yellow-400 mt-2">ボーナス{plan.bonus}クレジット付き！</div>}
                  </div>
                  {selectedPlan === plan.id && (
                    <div className="absolute top-4 right-4">
                      <div className="bg-purple-600 rounded-full p-1">
                        <Check size={20} />
                      </div>
                    </div>
                  )}
                </button>
              ))}
            </div>

            <button onClick={handlePurchase} disabled={!selectedPlan} className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-700 disabled:cursor-not-allowed px-6 py-4 rounded-lg font-semibold transition flex items-center justify-center gap-2 text-lg">
              <ShoppingCart size={24} />
              {selectedPlan ? '購入する' : 'プランを選択してください'}
            </button>
            <p className="text-xs text-gray-500 text-center mt-4">※ お支払いはクレジットカードまたはコンビニ決済が利用できます</p>
          </div>

          <div className="bg-gray-900 rounded-xl p-8 border border-gray-800">
            <h2 className="text-2xl font-bold mb-6">購入履歴</h2>
            {purchaseHistory.length > 0 ? (
              <div className="space-y-3">
                {purchaseHistory.map((purchase) => (
                  <div key={purchase.id} className="bg-gray-800 rounded-lg p-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="bg-yellow-900/30 rounded-full p-3">
                        <CreditCard size={24} className="text-yellow-400" />
                      </div>
                      <div>
                        <div className="font-semibold mb-1">{purchase.credits}クレジット</div>
                        <div className="text-sm text-gray-400 flex items-center gap-2">
                          <Clock size={14} />
                          {purchase.date}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-lg mb-1">¥{purchase.amount.toLocaleString()}</div>
                      <div className="text-xs">
                        <span className="bg-green-900/30 text-green-400 px-2 py-1 rounded-full">{purchase.status}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-400">
                <CreditCard size={48} className="mx-auto mb-4 opacity-50" />
                <p>購入履歴がありません</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


