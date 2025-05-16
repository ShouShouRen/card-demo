import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { makeRequest } from "../api";

interface Card {
  id: number;
  name: string;
  email: string;
  birthday: string;
  avatar: string | null;
  profession: string;
  created_at: string;
  updated_at: string;
  line_link: string;
  fb_link: string;
}

export default function CardPreview() {
  const { id } = useParams();
  const [card, setCard] = useState<Card | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCard = async () => {
      try {
        const res = await makeRequest<Card>(`/cards/${id}`);
        setCard(res);
      } catch {
        setCard(null);
      }
      setLoading(false);
    };
    fetchCard();
  }, [id]);

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        載入中...
      </div>
    );
  if (!card)
    return (
      <div className="flex items-center justify-center min-h-screen">
        找不到卡片
      </div>
    );

  return (
    <div className="bg-gray-100 text-gray-800 p-6 h-screen">
      <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-lg p-6 space-y-6">
        {/* <div className="bg-white p-8 rounded shadow-md w-96 flex flex-col items-center">
        {card.avatar && (
          <img
            src={`http://localhost:5001${card.avatar}`}
            alt="avatar"
            className="w-24 h-24 rounded-full mb-4"
          />
        )}
        <div className="text-2xl font-bold mb-2">{card.name}</div>
        <div className="mb-1">Email: {card.email}</div>
        <div className="mb-1">生日: {card.birthday}</div>
        <div className="mb-1">專業: {card.profession}</div>
        <div className="text-xs text-gray-400 mt-2">
          建立：{card.created_at}
        </div>
      </div> */}
        <h1 className="text-2xl font-bold">{card.name}</h1>
        <p className="text-lg font-semibold text-red-600">{card.profession}</p>
        {card.avatar && (
          <img
            src={`http://localhost:5001${card.avatar}`}
            alt="avatar"
            className="mt-4 w-full max-w-xs mx-auto rounded-xl shadow-md"
          />
        )}
        <h2 className="text-xl font-semibold">🔗 連結</h2>
        <a
          href="/flask/${data.card_link}"
          className="block bg-blue-100 hover:bg-blue-200 text-blue-800 font-bold text-xl py-3 px-6 rounded-xl text-center shadow"
          download
        >
          📇 訊息名片
        </a>
        <a
          href={card.line_link}
          className="block bg-green-100 hover:bg-green-200 text-green-800 font-bold text-xl py-3 px-6 rounded-xl text-center shadow"
        >
          💬 LINE 好友
        </a>
        <a
          href={card.fb_link}
          className="block bg-indigo-100 hover:bg-indigo-200 text-indigo-800 font-bold text-xl py-3 px-6 rounded-xl text-center shadow"
        >
          👥 FB 聯絡我
        </a>
      </div>
    </div>
  );
}
