import { useEffect, useState, useRef } from "react";
import { toast } from "react-toastify";
import type { ToastContentProps, ToastOptions } from "react-toastify";
import { useNavigate } from "react-router-dom";
import CardForm from "../components/CardForm";
import { makeRequest } from "../api";
import logo from "/niu-logo.png";
import { animate, stagger } from "animejs";
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

export default function Dashboard() {
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editCard, setEditCard] = useState<Card | null>(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const cardsContainerRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    fetchCards();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    // 卡片進場動畫
    if (!showForm && cardsContainerRef.current) {
      animate(cardsContainerRef.current.querySelectorAll(".dashboard-card"), {
        opacity: [0, 1],
        translateY: [40, 0],
        scale: [0.95, 1],
        delay: stagger(100),
        duration: 700,
        easing: "easeOutElastic(1, .8)",
      });
    }
  }, [cards, showForm]);

  useEffect(() => {
    // 表單淡入動畫
    if (showForm && formRef.current) {
      animate(formRef.current, {
        opacity: [0, 1],
        translateY: [40, 0],
        duration: 500,
        easing: "easeOutQuad",
      });
    }
  }, [showForm, editCard]);

  const fetchCards = async () => {
    setLoading(true);
    try {
      const res = await makeRequest<Card[]>("/cards", "get", undefined, token!);
      setCards(res);
    } catch {
      toast.error("取得卡片失敗，請重新登入");
      navigate("/login");
    }
    setLoading(false);
  };

  const handleDelete = (id: number) => {
    const ConfirmToast = (props: ToastContentProps) => (
      <div className="flex flex-col gap-2">
        <span>確定要刪除這張卡片嗎？</span>
        <div className="flex gap-2 mt-2">
          <button
            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded cursor-pointer"
            onClick={async () => {
              await doDelete(id);
              if (props.closeToast) props.closeToast();
            }}
          >
            確定
          </button>
          <button
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-3 py-1 rounded cursor-pointer"
            onClick={props.closeToast}
          >
            取消
          </button>
        </div>
      </div>
    );
    toast.info((props) => <ConfirmToast {...props} />, {
      autoClose: false,
      closeOnClick: false,
      draggable: false,
      position: "bottom-center",
      toastStyle: { marginTop: "300px" },
    } as ToastOptions);
  };

  const doDelete = async (id: number) => {
    try {
      await makeRequest(`/cards/${id}`, "delete", undefined, token!);
      toast.success("刪除成功");
      fetchCards();
    } catch {
      toast.error("刪除失敗");
    }
  };

  const handleEdit = (card: Card) => {
    setEditCard(card);
    setShowForm(true);
  };

  const handlePreview = (id: number) => {
    navigate(`/card/${id}`);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-200">
      {/* Header */}
      <header className="bg-white shadow sticky top-0 z-10">
        <div className="max-w-6xl mx-auto flex items-center justify-between py-3 px-4">
          <div className="flex items-center gap-3">
            <img src={logo} alt="logo" className="h-16 w-full object-contain" />
          </div>
          <button
            onClick={handleLogout}
            className="bg-blue-100 hover:bg-blue-200 text-blue-700 font-semibold px-4 py-2 rounded-lg shadow-sm transition cursor-pointer"
          >
            登出
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
          <h2 className="text-xl md:text-2xl font-bold text-blue-800">
            我的電子卡片
          </h2>
          <button
            className="bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white font-bold px-6 py-2 rounded-xl shadow-md transition cursor-pointer"
            onClick={() => {
              setEditCard(null);
              setShowForm(true);
            }}
          >
            ＋ 新增卡片
          </button>
        </div>
        {showForm && (
          <div className="mb-8" ref={formRef} style={{ opacity: 0 }}>
            <CardForm
              token={token!}
              onSuccess={() => {
                setShowForm(false);
                fetchCards();
              }}
              onCancel={() => setShowForm(false)}
              editCard={editCard}
            />
          </div>
        )}
        {!showForm &&
          (loading ? (
            <div className="flex justify-center items-center h-40 text-lg text-blue-600 font-semibold">
              載入中...
            </div>
          ) : (
            <div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 px-2 md:px-0"
              ref={cardsContainerRef}
            >
              {cards.map((card) => (
                <div
                  key={card.id}
                  className="dashboard-card bg-white p-8 rounded shadow-md w-full flex flex-col items-center relative group transition hover:shadow-2xl"
                  style={{ opacity: 0 }}
                >
                  {card.avatar && (
                    <img
                      src={`http://localhost:5001${card.avatar}`}
                      alt="avatar"
                      className="w-24 h-24 rounded-full mb-4 object-cover border-4 border-blue-100 shadow-md"
                    />
                  )}
                  <div className="text-2xl font-bold mb-2 text-blue-800">
                    {card.name}
                  </div>
                  <div className="mb-1 text-gray-600">Email: {card.email}</div>
                  <div className="mb-1 text-gray-600">
                    生日: {card.birthday}
                  </div>
                  <div className="mb-1 text-gray-600">
                    專業: {card.profession}
                  </div>
                  <div className="flex gap-2 mb-2 mt-2">
                    {card.line_link && (
                      <a
                        href={card.line_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-2 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200 text-xs transition"
                      >
                        LINE
                      </a>
                    )}
                    {card.fb_link && (
                      <a
                        href={card.fb_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 text-xs transition"
                      >
                        Facebook
                      </a>
                    )}
                  </div>
                  <div className="flex gap-2 mt-auto w-full pt-2">
                    <button
                      className="flex-1 bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-lg font-semibold transition cursor-pointer"
                      onClick={() => handleEdit(card)}
                    >
                      編輯
                    </button>
                    <button
                      className="flex-1 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg font-semibold transition cursor-pointer"
                      onClick={() => handleDelete(card.id)}
                    >
                      刪除
                    </button>
                    <button
                      className="flex-1 bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded-lg font-semibold transition cursor-pointer"
                      onClick={() => handlePreview(card.id)}
                    >
                      預覽
                    </button>
                  </div>
                  <div className="absolute top-2 right-4 text-xs text-gray-300 group-hover:text-blue-400 transition">
                    建立：{card.created_at}
                  </div>
                </div>
              ))}
            </div>
          ))}
      </main>
    </div>
  );
}
