import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { makeRequest } from "../api";

export default function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await makeRequest("/register", "post", { username, password, email });
      toast.success("註冊成功，請登入");
      navigate("/login");
    } catch {
      toast.error("註冊失敗，請檢查資料");
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-white via-[#008CCE]/70 to-[#004098]/70 backdrop-blur-2xl z-0" />

      <div className="relative z-10 bg-white p-8 rounded-2xl shadow-xl w-full max-w-xs md:max-w-sm">
        <img
          src="../../public/niu-logo.png"
          className="w-full mb-4 mt-2"
          alt=""
        />
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              form="username"
              className="block text-gray-700 font-medium mb-1"
            >
              帳號
            </label>
            <input
              type="text"
              id="username"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <label
              form="password"
              className="block text-gray-700 font-medium mb-1"
            >
              密碼
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <label
              form="password"
              className="block text-gray-700 font-medium mb-1"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 cursor-pointer"
          >
            註冊
          </button>
          <div className="mt-4 text-center text-sm">
            已有帳號？
            <Link to="/login" className="text-blue-500 hover:underline">
              登入
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
