import React, { useState, useEffect } from 'react';
import { Shirt, Square, ShoppingBag, Sun, Cloud, Snowflake, Leaf, Heart, History, Info } from 'lucide-react';

interface ClothingItem {
  id: number;
  type: string;
  name: string;
  color: string;
  season: string[];
  description: string;
}

const clothingItems: ClothingItem[] = [
  { id: 1, type: 'tops', name: 'Tシャツ', color: 'bg-red-500', season: ['spring', 'summer'], description: '軽くて涼しい綿100%のTシャツ' },
  { id: 2, type: 'tops', name: 'シャツ', color: 'bg-blue-500', season: ['spring', 'fall'], description: 'オックスフォード生地の長袖シャツ' },
  { id: 3, type: 'tops', name: 'セーター', color: 'bg-green-500', season: ['fall', 'winter'], description: '暖かいウールのセーター' },
  { id: 4, type: 'bottoms', name: 'ジーンズ', color: 'bg-indigo-500', season: ['spring', 'fall', 'winter'], description: 'クラシックなストレートジーンズ' },
  { id: 5, type: 'bottoms', name: 'チノパン', color: 'bg-yellow-500', season: ['spring', 'summer', 'fall'], description: '快適なストレッチチノパン' },
  { id: 6, type: 'bottoms', name: 'スカート', color: 'bg-pink-500', season: ['spring', 'summer'], description: 'Aラインのミディアムスカート' },
  { id: 7, type: 'shoes', name: 'スニーカー', color: 'bg-purple-500', season: ['spring', 'summer', 'fall'], description: '軽量で快適なランニングシューズ' },
  { id: 8, type: 'shoes', name: 'ブーツ', color: 'bg-gray-500', season: ['fall', 'winter'], description: '防水レザーのアンクルブーツ' },
  { id: 9, type: 'shoes', name: 'サンダル', color: 'bg-orange-500', season: ['summer'], description: 'ビーチにぴったりのフラットサンダル' },
];

type Season = 'spring' | 'summer' | 'fall' | 'winter';

function App() {
  const [outfit, setOutfit] = useState<ClothingItem[]>([]);
  const [favorites, setFavorites] = useState<ClothingItem[][]>([]);
  const [history, setHistory] = useState<ClothingItem[][]>([]);
  const [selectedSeason, setSelectedSeason] = useState<Season>('spring');
  const [showInfo, setShowInfo] = useState<number | null>(null);

  useEffect(() => {
    const savedFavorites = localStorage.getItem('favorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  const generateOutfit = () => {
    const seasonalItems = clothingItems.filter(item => item.season.includes(selectedSeason));
    const tops = seasonalItems.filter(item => item.type === 'tops');
    const bottoms = seasonalItems.filter(item => item.type === 'bottoms');
    const shoes = seasonalItems.filter(item => item.type === 'shoes');

    const randomTop = tops[Math.floor(Math.random() * tops.length)];
    const randomBottom = bottoms[Math.floor(Math.random() * bottoms.length)];
    const randomShoes = shoes[Math.floor(Math.random() * shoes.length)];

    const newOutfit = [randomTop, randomBottom, randomShoes];
    setOutfit(newOutfit);
    setHistory(prevHistory => [newOutfit, ...prevHistory.slice(0, 4)]);
  };

  const toggleFavorite = () => {
    if (outfit.length === 0) return;
    const isFavorite = favorites.some(fav => fav.every((item, index) => item.id === outfit[index].id));
    if (isFavorite) {
      setFavorites(prevFavorites => prevFavorites.filter(fav => !fav.every((item, index) => item.id === outfit[index].id)));
    } else {
      setFavorites(prevFavorites => [...prevFavorites, outfit]);
    }
  };

  useEffect(() => {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }, [favorites]);

  const seasonIcons = {
    spring: <Leaf className="w-6 h-6 text-green-500" />,
    summer: <Sun className="w-6 h-6 text-yellow-500" />,
    fall: <Cloud className="w-6 h-6 text-orange-500" />,
    winter: <Snowflake className="w-6 h-6 text-blue-500" />,
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold mb-8">ランダムコーディネーター</h1>
      <div className="flex space-x-4 mb-4">
        {Object.entries(seasonIcons).map(([season, icon]) => (
          <button
            key={season}
            onClick={() => setSelectedSeason(season as Season)}
            className={`p-2 rounded-full ${selectedSeason === season ? 'bg-blue-500 text-white' : 'bg-white'}`}
          >
            {icon}
          </button>
        ))}
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md mb-8 w-full max-w-md">
        {outfit.length === 0 ? (
          <p className="text-gray-500 text-center">コーディネートを生成してください</p>
        ) : (
          <ul className="space-y-4">
            {outfit.map((item, index) => (
              <li key={index} className="flex items-center space-x-4">
                {item.type === 'tops' && <Shirt className={`w-8 h-8 ${item.color} text-white p-1 rounded`} />}
                {item.type === 'bottoms' && <Square className={`w-8 h-8 ${item.color} text-white p-1 rounded`} />}
                {item.type === 'shoes' && <ShoppingBag className={`w-8 h-8 ${item.color} text-white p-1 rounded`} />}
                <span>{item.name}</span>
                <button onClick={() => setShowInfo(showInfo === item.id ? null : item.id)} className="ml-auto">
                  <Info className="w-5 h-5 text-gray-500" />
                </button>
                {showInfo === item.id && (
                  <div className="absolute bg-white border border-gray-200 p-2 rounded shadow-md mt-2 z-10">
                    {item.description}
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="flex space-x-4 mb-8">
        <button
          onClick={generateOutfit}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-300"
        >
          コーディネートを生成
        </button>
        <button
          onClick={toggleFavorite}
          className={`${
            favorites.some(fav => fav.every((item, index) => item.id === outfit[index]?.id))
              ? 'bg-red-500 hover:bg-red-600'
              : 'bg-gray-300 hover:bg-gray-400'
          } text-white font-bold py-2 px-4 rounded transition duration-300`}
        >
          <Heart className="w-5 h-5" />
        </button>
      </div>
      <div className="w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">履歴</h2>
        <div className="bg-white p-4 rounded-lg shadow-md">
          {history.map((historyOutfit, index) => (
            <div key={index} className="flex items-center space-x-2 mb-2">
              {historyOutfit.map((item, itemIndex) => (
                <div key={itemIndex} className={`w-6 h-6 ${item.color} rounded`}></div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;