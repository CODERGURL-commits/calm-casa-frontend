"use client";

import { useState, useEffect } from "react";
import io from "socket.io-client";
import { createAvatar } from "@dicebear/core";
import { bottts } from "@dicebear/collection";

export default function Home() {
  // Navigation, Authentication & Presence State
  const [socket, setSocket] = useState(null);
  const [joined, setJoined] = useState(false);
  const [nickname, setNickname] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [usersInCasa, setUsersInCasa] = useState([]);
  const [activeTab, setActiveTab] = useState("campfire"); // campfire, library, garden, breathe

  // Cozy Corners Core State Variables
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const [notes, setNotes] = useState([
    {
      text: "You are doing much better than you give yourself credit for.",
      author: "KindSoul",
    },
    {
      text: "Take a deep breath. It's just a bad day, not a bad life. 🌊",
      author: "CloudWatcher",
    },
  ]);
  const [newNote, setNewNote] = useState("");

  const [worryText, setWorryText] = useState("");
  const [plants, setPlants] = useState([
    {
      id: 1,
      worry: "Stressed about upcoming project deadlines",
      waters: 3,
      stage: "🌱",
    },
  ]);

  const [breathState, setBreathState] = useState("Inhale"); // Inhale, Hold, Exhale
  const [breathCount, setBreathCount] = useState(4);

  // Synchronize Socket Connection & Listeners Safely
  
 useEffect(() => {
  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";
  
  const socketIo = io(BACKEND_URL);
  setSocket(socketIo);

  socketIo.on('receive_message', (data) => {
    setMessages((prev) => [...prev, data]);
  });

  socketIo.on('active_users_list', (userArray) => {
    setUsersInCasa(userArray);
  });

  return () => {
    socketIo.disconnect();
  };
}, []);

  // Compute Dicebear profile avatar seeds
  useEffect(() => {
    if (nickname.trim()) {
      const avatar = createAvatar(bottts, {
        seed: nickname,
        radius: 50,
        backgroundColor: ["ffdfbf", "ffd5dc", "d1e8e2"],
      });
      setAvatarUrl(avatar.toDataUri());
    }
  }, [nickname]);

  // Breathing Anchor Loop Animation Clock
  useEffect(() => {
    if (activeTab !== "breathe") return;
    const timer = setInterval(() => {
      setBreathCount((prev) => {
        if (prev === 1) {
          if (breathState === "Inhale") {
            setBreathState("Hold");
            return 4;
          }
          if (breathState === "Hold") {
            setBreathState("Exhale");
            return 4;
          }
          if (breathState === "Exhale") {
            setBreathState("Inhale");
            return 4;
          }
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [breathCount, breathState, activeTab]);

  // Functional Core Interactive Handlers
  const handleJoin = () => {
    if (nickname.trim() !== "") {
      setJoined(true);
      if (socket) {
        socket.emit("join_casa", { nickname: nickname, avatar: avatarUrl });
      }
    }
  };

  const sendMessage = () => {
    if (message.trim() && socket) {
      const payload = {
        author: nickname,
        avatar: avatarUrl,
        text: message,
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      socket.emit("send_message", payload);
      setMessage("");
    }
  };

  const addStickyNote = () => {
    if (newNote.trim()) {
      setNotes([...notes, { text: newNote, author: nickname || "Anonymous" }]);
      setNewNote("");
    }
  };

  const plantWorry = () => {
    if (worryText.trim()) {
      setPlants([
        ...plants,
        { id: Date.now(), worry: worryText, waters: 0, stage: "🌱" },
      ]);
      setWorryText("");
    }
  };

  const waterPlant = (id) => {
    setPlants(
      plants.map((p) => {
        if (p.id === id) {
          const newWaters = p.waters + 1;
          let newStage = p.stage;
          if (newWaters >= 6) newStage = "🌸";
          else if (newWaters >= 3) newStage = "🌿";
          return { ...p, waters: newWaters, stage: newStage };
        }
        return p;
      }),
    );
  };

  // 1. LOTUS-INFUSED WELCOME SCREEN
  if (!joined) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#FFFaf0] p-4">
        <div className="p-8 bg-white rounded-3xl shadow-md flex flex-col items-center max-w-sm w-full border border-stone-100 relative overflow-hidden">
          {/*  Premium Multi-Layered Lotus Logo Illustration */}
          <div className="flex flex-col items-center mb-6">
            <div className="w-24 h-20 mb-3 relative flex items-center justify-center drop-shadow-sm">
              <svg
                viewBox="0 0 100 80"
                className="w-full h-full"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Defs for delicate gradients matching the photo */}
                <defs>
                  <linearGradient
                    id="lotusPinkGrad"
                    x1="0%"
                    y1="100%"
                    x2="0%"
                    y2="0%"
                  >
                    <stop offset="0%" stopColor="#fff3f5" />
                    <stop offset="70%" stopColor="#f3a4b5" />
                    <stop offset="100%" stopColor="#c95b74" />
                  </linearGradient>
                  <linearGradient
                    id="centerPetalGrad"
                    x1="0%"
                    y1="100%"
                    x2="0%"
                    y2="0%"
                  >
                    <stop offset="0%" stopColor="#ffffff" />
                    <stop offset="65%" stopColor="#eb889d" />
                    <stop offset="100%" stopColor="#b3425b" />
                  </linearGradient>
                </defs>

                {/* Back Layer Outermost Petals */}
                <path
                  d="M 20,55 C 5,40 15,20 35,42 C 28,25 42,15 50,30 C 58,15 72,25 65,42 C 85,20 95,40 80,55 Z"
                  fill="url(#lotusPinkGrad)"
                  opacity="0.6"
                />

                {/* Mid Layer Overlapping Petals */}
                <path
                  d="M 28,58 C 12,45 22,30 40,48 C 32,25 45,22 50,38 C 55,22 68,25 60,48 C 78,30 88,45 72,58 Z"
                  fill="url(#lotusPinkGrad)"
                  opacity="0.85"
                />

                {/* Foreground Guard Petals (Left and Right Flanks) */}
                <path
                  d="M 50,65 C 20,65 15,45 34,48 C 42,52 46,60 50,65 Z"
                  fill="url(#centerPetalGrad)"
                />
                <path
                  d="M 50,65 C 80,65 85,45 66,48 C 58,52 54,60 50,65 Z"
                  fill="url(#centerPetalGrad)"
                />

                {/* Main Prominent Center Sharp Petals */}
                <path
                  d="M 50,65 C 32,55 35,28 50,15 C 65,28 68,55 50,65 Z"
                  fill="url(#centerPetalGrad)"
                />
                <path
                  d="M 50,65 C 38,55 40,35 50,24 C 60,35 62,55 50,65 Z"
                  fill="url(#lotusPinkGrad)"
                />

                {/* Golden Center Core Detail Glow */}
                <circle
                  cx="50"
                  cy="52"
                  r="4"
                  fill="#fcd34d"
                  opacity="0.9"
                  className="animate-pulse"
                />
              </svg>
            </div>

            <h1 className="text-3xl font-serif font-bold tracking-tight text-[#2f3e46]">
              Calm<span className="text-[#b56576]">Casa</span>
            </h1>
            <p className="text-stone-400 text-xs mt-1">
              A cozy space to just be.
            </p>
          </div>

          {avatarUrl && (
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-[#fbf7f0] rounded-full scale-105 -z-10 opacity-80 animate-pulse"></div>
              <img
                src={avatarUrl}
                alt="Avatar"
                className="w-24 h-24 drop-shadow-sm"
              />
            </div>
          )}

          <input
            type="text"
            placeholder="Pick a cozy nickname..."
            className="w-full p-3.5 mb-4 border border-stone-200 rounded-xl text-center focus:outline-none focus:ring-2 focus:ring-[#b56576]/40 bg-stone-50/50 text-stone-700 font-medium text-sm transition-all"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
          />

          <button
            onClick={handleJoin}
            className="w-full bg-[#b56576] hover:bg-[#9c4e5e] text-white font-semibold p-3.5 rounded-xl transition-all shadow-sm"
          >
            Enter the House
          </button>
        </div>
      </div>
    );
  }

  // 2. MAIN APPLICATION INTERFACE
  return (
    <div className="flex flex-col h-screen bg-[#FFFaf0] p-4 max-w-4xl mx-auto">
      {/* Header Panel Layout */}
      <header className="flex flex-col md:flex-row items-center justify-between gap-4 mb-4 p-4 bg-white rounded-2xl shadow-sm border border-stone-100">
        <div className="flex items-center gap-3 text-center md:text-left">
          <div className="w-4 h-4 bg-[#e777cb] rounded-full flex-shrink-0 border-2 border-white shadow-sm" />
          <div>
            <h1 className="text-lg font-serif font-bold text-[#2f3e46]">
              Calm<span className="text-[#b92075]">Casa</span> Workspace
            </h1>
            <p className="text-stone-400 text-[11px]">
              Switch between cozy corners below to settle your mind.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-[#f8edeb] px-3 py-1.5 rounded-full border border-orange-50">
          <img
            src={avatarUrl}
            alt="Me"
            className="w-6 h-6 rounded-full bg-white"
          />
          <span className="text-xs font-semibold text-stone-600">
            {nickname}
          </span>
        </div>
      </header>

      {/* Global Real-time Presence Tracker Bar */}
      <div className="bg-white p-3.5 rounded-2xl shadow-sm border border-stone-100 mb-4">
        <h3 className="text-[10px] font-bold text-stone-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
          Gathering Circle ({usersInCasa.length})
        </h3>
        <div className="flex flex-wrap gap-2">
          {usersInCasa.map((user) => (
            <div
              key={user.id}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
                user.nickname === nickname
                  ? "bg-stone-50 border-stone-200 text-stone-600"
                  : "bg-amber-50/40 border-amber-100/70 text-stone-600"
              }`}
            >
              <img
                src={user.avatar}
                alt=""
                className="w-4 h-4 rounded-full bg-stone-50"
              />
              <span>
                {user.nickname} {user.nickname === nickname && "(You)"}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Workspace Menu Bar Tab Selectors */}
      <nav className="flex gap-2 mb-4 bg-stone-200/40 p-1.5 rounded-xl overflow-x-auto">
        {[
          { id: "campfire", label: "🔥 The Campfire" },
          { id: "library", label: "📚 The Library" },
          { id: "garden", label: "🌱 The Garden" },
          { id: "breathe", label: "🧘 Calm Breath" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 min-w-[110px] text-center p-2 rounded-lg text-xs font-medium transition-all ${
              activeTab === tab.id
                ? "bg-white text-stone-800 shadow-sm font-semibold"
                : "text-stone-500 hover:bg-white/40"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      {/* Primary Container Viewport */}
      <main className="flex-1 bg-white rounded-2xl shadow-inner border border-stone-100 p-6 overflow-y-auto mb-4 flex flex-col min-h-[350px]">
        {/* VIEWPORTS: CAMPFIRE */}
        {activeTab === "campfire" && (
          <div className="flex flex-col h-full flex-1 justify-between">
            <div className="space-y-4 flex-1 overflow-y-auto pr-2">
              {messages.length === 0 ? (
                <div className="text-center text-stone-300 my-16">
                  <span className="text-4xl block mb-2">🪵</span>
                  <p className="text-xs">
                    The fire is crackling softly. Leave a heavy thought here to
                    settle your mind.
                  </p>
                </div>
              ) : (
                messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex gap-3 max-w-sm ${msg.author === nickname ? "ml-auto flex-row-reverse" : ""}`}
                  >
                    <img
                      src={msg.avatar}
                      className="w-7 h-7 rounded-full bg-stone-100 self-end"
                      alt=""
                    />
                    <div>
                      <div
                        className={`p-3 rounded-2xl text-xs ${msg.author === nickname ? "bg-stone-800 text-white rounded-br-none" : "bg-[#f8edeb] text-stone-700 rounded-bl-none"}`}
                      >
                        <p>{msg.text}</p>
                      </div>
                      <span className="text-[9px] text-stone-400 block mt-0.5 px-1 text-right">
                        {msg.author} • {msg.time}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="flex gap-2 mt-4 pt-2 border-t border-stone-50">
              <input
                type="text"
                placeholder="Type a heavy thought to lay down at the fire..."
                className="flex-1 p-3 bg-stone-50 rounded-xl text-xs focus:outline-none text-stone-700"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              />
              <button
                onClick={sendMessage}
                className="bg-stone-800 hover:bg-stone-700 text-white px-5 rounded-xl text-xs transition-colors"
              >
                Share
              </button>
            </div>
          </div>
        )}

        {/* VIEWPORTS: LIBRARY */}
        {activeTab === "library" && (
          <div className="flex flex-col h-full flex-1 justify-between">
            <div>
              <h2 className="text-sm font-bold text-stone-700 mb-1">
                📚 The Encouragement Board
              </h2>
              <p className="text-[11px] text-stone-400 mb-4">
                A quiet zone. Read a warm note dropped by an anonymous neighbor
                or leave your own.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {notes.map((note, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 bg-amber-50/60 border border-amber-100 rounded-xl shadow-sm"
                  >
                    <p className="text-stone-700 font-serif italic text-xs mb-1.5">
                      "{note.text}"
                    </p>
                    <span className="text-[9px] text-stone-400 block">
                      — Warmly, {note.author}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-2 mt-6 pt-3 border-t border-stone-100">
              <input
                type="text"
                placeholder="Write a sweet, uplifting note for someone else..."
                className="flex-1 p-3 bg-stone-50 border border-stone-100 rounded-xl text-xs focus:outline-none text-stone-700"
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
              />
              <button
                onClick={addStickyNote}
                className="bg-stone-800 text-white px-4 rounded-xl text-xs"
              >
                Pin Note
              </button>
            </div>
          </div>
        )}

        {/* VIEWPORTS: GARDEN */}
        {activeTab === "garden" && (
          <div className="flex flex-col h-full flex-1 justify-between">
            <div>
              <h2 className="text-sm font-bold text-stone-700 mb-1">
                🌱 The Worry Garden
              </h2>
              <p className="text-[11px] text-stone-400 mb-4">
                Attach a burden to a sprout. Watch it grow into a resilient
                flower as friends click to water it.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {plants.map((plant) => (
                  <div
                    key={plant.id}
                    className="p-3 bg-stone-50 rounded-xl border border-stone-100 flex items-center justify-between gap-2"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-2xl bg-white p-1.5 rounded-full shadow-sm">
                        {plant.stage}
                      </span>
                      <div>
                        <p className="text-[11px] text-stone-600 font-medium line-clamp-1 max-w-[140px]">
                          "{plant.worry}"
                        </p>
                        <span className="text-[9px] text-stone-400 block">
                          Watered {plant.waters} times
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => waterPlant(plant.id)}
                      className="bg-white hover:bg-stone-100 text-stone-700 text-[10px] py-1 px-2.5 rounded-lg border border-stone-200 font-medium"
                    >
                      💧 Water
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-2 mt-6 pt-3 border-t border-stone-100">
              <input
                type="text"
                placeholder="What burden would you like to grow into a flower today?"
                className="flex-1 p-3 bg-stone-50 border border-stone-100 rounded-xl text-xs focus:outline-none text-stone-700"
                value={worryText}
                onChange={(e) => setWorryText(e.target.value)}
              />
              <button
                onClick={plantWorry}
                className="bg-stone-800 text-white px-4 rounded-xl text-xs"
              >
                Plant Sprout
              </button>
            </div>
          </div>
        )}

        {/* VIEWPORTS: BREATHING WIDGET */}
        {activeTab === "breathe" && (
          <div className="flex flex-col items-center justify-center flex-1 text-center py-4">
            <h2 className="text-sm font-bold text-stone-700 mb-1">
              🧘 Box Breathing Anchor
            </h2>
            <p className="text-[11px] text-stone-400 mb-8">
              Sync your breathing with the cozy pulsing circle below to ground
              your nervous system.
            </p>

            <div className="relative flex items-center justify-center h-40 w-40 mb-6">
              <div
                className={`absolute rounded-full bg-amber-100/50 border border-amber-200/30 opacity-40 transition-all duration-1000 ${
                  breathState === "Inhale"
                    ? "h-40 w-40 scale-100"
                    : breathState === "Hold"
                      ? "h-40 w-40 scale-105 bg-amber-200/40"
                      : "h-20 w-20 scale-75"
                }`}
              />

              <div className="z-10 bg-white shadow-sm rounded-full h-24 w-24 flex flex-col items-center justify-center border border-stone-100">
                <span className="text-[10px] font-bold text-stone-500 tracking-wide uppercase">
                  {breathState}
                </span>
                <span className="text-xl font-black text-stone-700 mt-0.5">
                  {breathCount}
                </span>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
