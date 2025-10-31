'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Save, X, Upload, Twitter, Instagram, Globe } from 'lucide-react';

export default function ProfileEditPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    username: 'AIマスター',
    bio: 'AIアートを愛するクリエイター。Seedream、Midjourney、DALL-Eを使って幻想的な世界を創造しています。コンテストで数々の賞を受賞。初心者の方へのアドバイスも歓迎です！',
    twitter: 'https://twitter.com/ai_master',
    instagram: 'https://instagram.com/ai_master',
    portfolio: 'https://ai-master-portfolio.com',
  });

  const [avatarPreview, setAvatarPreview] = useState('/images/avatars/user1.jpg');
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      alert('プロフィールを保存しました！');
      router.push('/profile');
    }, 2000);
  };

  return (
    <div className="bg-gray-950 min-h-screen">
      <div className="bg-gray-900 border-b border-gray-800">
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <h1 className="text-4xl font-bold">プロフィール編集</h1>
            <Link href="/profile" className="text-purple-400 hover:text-purple-300 transition">
              ← マイページに戻る
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-gray-900 rounded-xl p-8 border border-gray-800">
            <div className="mb-8">
              <label className="block text-sm font-semibold mb-3">プロフィール画像</label>
              <div className="flex items-center gap-6">
                <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-purple-600">
                  <Image src={avatarPreview} alt="プロフィール画像" fill className="object-cover" />
                </div>
                <label className="bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-lg font-semibold transition cursor-pointer flex items-center gap-2">
                  <Upload size={20} />
                  画像をアップロード
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                </label>
              </div>
              <p className="text-xs text-gray-500 mt-2">推奨サイズ: 400x400px、最大5MB</p>
            </div>

            <div className="mb-6">
              <label htmlFor="username" className="block text-sm font-semibold mb-2">ユーザネーム *</label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                maxLength={50}
                className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="ユーザネームを入力"
              />
              <p className="text-xs text-gray-500 mt-1">{formData.username.length}/50文字</p>
            </div>

            <div className="mb-6">
              <label htmlFor="bio" className="block text-sm font-semibold mb-2">自己紹介</label>
              <textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                maxLength={500}
                rows={6}
                className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                placeholder="あなたについて教えてください"
              />
              <p className="text-xs text-gray-500 mt-1">{formData.bio.length}/500文字</p>
            </div>

            <div className="space-y-4 mb-8">
              <h3 className="text-lg font-semibold">SNSリンク</h3>
              <div>
                <label htmlFor="twitter" className="block text-sm font-semibold mb-2 flex items-center gap-2">
                  <Twitter size={18} className="text-blue-400" />
                  Twitter
                </label>
                <input type="url" id="twitter" name="twitter" value={formData.twitter} onChange={handleChange} className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="https://twitter.com/username" />
              </div>
              <div>
                <label htmlFor="instagram" className="block text-sm font-semibold mb-2 flex items-center gap-2">
                  <Instagram size={18} className="text-pink-400" />
                  Instagram
                </label>
                <input type="url" id="instagram" name="instagram" value={formData.instagram} onChange={handleChange} className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="https://instagram.com/username" />
              </div>
              <div>
                <label htmlFor="portfolio" className="block text-sm font-semibold mb-2 flex items-center gap-2">
                  <Globe size={18} className="text-purple-400" />
                  ポートフォリオサイト
                </label>
                <input type="url" id="portfolio" name="portfolio" value={formData.portfolio} onChange={handleChange} className="w-full bg-gray-800 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" placeholder="https://your-portfolio.com" />
              </div>
            </div>

            <div className="flex gap-4">
              <button onClick={handleSave} disabled={isSaving} className="flex-1 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-700 disabled:cursor-not-allowed px-6 py-3 rounded-lg font-semibold transition flex items-center justify-center gap-2">
                <Save size={20} />
                {isSaving ? '保存中...' : '保存する'}
              </button>
              <Link href="/profile" className="flex-1 bg-gray-700 hover:bg-gray-600 px-6 py-3 rounded-lg font-semibold transition flex items-center justify-center gap-2">
                <X size={20} />
                キャンセル
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


