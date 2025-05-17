import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
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

interface CardFormProps {
  token: string;
  onSuccess: () => void;
  onCancel: () => void;
  editCard: Card | null;
}

export default function CardForm({
  token,
  onSuccess,
  onCancel,
  editCard,
}: CardFormProps) {
  const [name, setName] = useState(editCard?.name || "");
  const [email, setEmail] = useState(editCard?.email || "");
  const [birthday, setBirthday] = useState(editCard?.birthday || "");
  const [profession, setProfession] = useState(editCard?.profession || "");
  const [avatar, setAvatar] = useState<File | null>(null);
  const [vcfFile, setVcfFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [line_link, setLine_link] = useState(editCard?.line_link || "");
  const [fb_link, setFb_link] = useState(editCard?.fb_link || "");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editCard?.avatar && !avatar) {
      setPreviewUrl(`http://localhost:5001${editCard.avatar}`);
    }
  }, [editCard, avatar]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setAvatar(file || null);
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = () => setPreviewUrl(reader.result as string);
      reader.readAsDataURL(file);
    } else {
      setPreviewUrl(null);
      toast.error("❌ 請選擇有效的圖片格式（png、jpg、jpeg）");
    }
  };

  // 檢查檔案格式就好
  const handleFileVcfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === "text/vcard") {
      setVcfFile(file);
    } else {
      setVcfFile(null);
      toast.error("❌ 請選擇有效的 vcf 檔案");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("birthday", birthday);
    formData.append("profession", profession);
    formData.append("line_link", line_link);
    formData.append("fb_link", fb_link);
    if (vcfFile) {
      formData.append("cardVcf", vcfFile);
    }
    if (avatar) {
      formData.append("avatar", avatar);
    }
    try {
      if (editCard) {
        await makeRequest(`/cards/${editCard.id}`, "put", formData, token, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("✅ 資料已成功更新！");
      } else {
        await makeRequest("/cards", "post", formData, token, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("✅ 資料已成功新增！");
      }
      onSuccess();
    } catch {
      toast.error("⚠️ 資料儲存失敗，請稍後再試");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-2xl shadow-lg p-8 space-y-6 border border-blue-100">
      <h1 className="text-2xl font-bold mb-4 text-blue-700 flex items-center gap-2">
        {editCard ? "✏️ 編輯卡片" : "📝 新增卡片"}
      </h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="block text-start text-sm font-medium text-gray-700 mb-1">
          上傳大頭照
        </label>
        <div className="flex flex-col items-center mb-2">
          {previewUrl && (
            <img
              src={previewUrl}
              alt="預覽圖片"
              className="my-4 w-full max-w-xs mx-auto rounded-xl shadow-md"
            />
          )}
          <input
            type="file"
            accept="image/png, image/jpeg, image/jpg"
            onChange={handleFileChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            上傳訊息名片請上傳.vcf
          </label>
          <input
            type="file"
            accept=".vcf"
            onChange={handleFileVcfChange}
            name="cardVcf"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        {/* 姓名 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            姓名
          </label>
          <input
            type="text"
            placeholder="請輸入姓名"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>
        {/* 職稱 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            職稱
          </label>
          <input
            type="text"
            placeholder="請輸入職稱"
            value={profession}
            onChange={(e) => setProfession(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        {/* email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email
          </label>
          <input
            type="email"
            placeholder="請輸入Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>
        {/* 生日 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            生日
          </label>
          <input
            type="date"
            value={birthday}
            onChange={(e) => setBirthday(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        <div>
          <h4 className="text-2xl text-green-500 font-bold mb-2">
            Line 複製 id 說明
          </h4>
          <p>點選右上方設定(齒輪)⚙️ -&gt; 個人檔案 -&gt; 複製ID</p>
        </div>
        {/* 常用連結 */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            LINE 好友連結
          </label>
          <div className="flex gap-2 items-center">
            <input
              type="url"
              placeholder="輸入 LINE 加好友連結"
              value={line_link}
              onChange={(e) => setLine_link(e.target.value)}
              className="w-72 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <a
              href="line://"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white bg-green-500 text-sm block rounded p-2"
            >
              跳轉至line
            </a>
          </div>
          <label className="block text-sm font-medium text-gray-700 mb-1 mt-2">
            Facebook 好友連結
          </label>
          <input
            type="url"
            placeholder="輸入 Facebook 個人頁面連結"
            value={fb_link}
            onChange={(e) => setFb_link(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>
        {/* 按鈕區 */}
        <div className="flex gap-4 pt-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-xl transition duration-300 cursor-pointer"
          >
            儲存
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="w-full bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-xl cursor-pointer"
          >
            取消
          </button>
        </div>
      </form>
    </div>
  );
}
