"use client";

import { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import { createAvatar } from "@dicebear/core";
import { bottts } from "@dicebear/collection";

export default function Home() {
  // Navigation, Authentication & Presence State
  const [socket, setSocket] = useState(null);
  const [joined, setJoined] = useState(false);
  const [nickname, setNickname] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [avatarColor, setAvatarColor] = useState(
    "bg-pink-600 hover:bg-pink-700",
  );
  const [usersInCasa, setUsersInCasa] = useState([]);
  const [activeTab, setActiveTab] = useState("campfire");

  // Anti-Screenshot Privacy Shield State Configurations
  const [privacyMode, setPrivacyMode] = useState(false);
  const [revealedIndex, setRevealedIndex] = useState(null);

  // Cozy Corners Core State Variables
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  // Feature 2 & 4: Vanishing & Fire Intensity State Managers
  const [letTurnToAsh, setLetTurnToAsh] = useState(false);
  const [fireIntensity, setFireIntensity] = useState("🪵");

  // Feature 3: Audio Ref Hook
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const audioRef = useRef(null);

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

  const [breathState, setBreathState] = useState("Inhale");
  const [breathCount, setBreathCount] = useState(4);

  // Synchronize Socket Connection & Listeners Safely
  useEffect(() => {
    const BACKEND_URL =
      process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";

    const socketIo = io(BACKEND_URL);
    setSocket(socketIo);

    socketIo.on("receive_message", (data) => {
      // Ingest text entries along with baseline spark counters and life cycles
      const incomingPayload = {
        ...data,
        id: data.id || Date.now() + Math.random(),
        sparks: data.sparks || 0,
        expiresAt: data.isAshen ? Date.now() + 60000 : null,
        timeLeft: data.isAshen ? 60 : null,
      };
      setMessages((prev) => [...prev, incomingPayload]);
    });

    socketIo.on("active_users_list", (userArray) => {
      setUsersInCasa(userArray);
    });

    return () => {
      socketIo.disconnect();
    };
  }, []);

  // Feature 2 & 4: Live Clock Loop for Ashen Countdown Timers and Fire Density Checks
  useEffect(() => {
    const lifecycleInterval = setInterval(() => {
      const now = Date.now();

      setMessages((prevMessages) => {
        return prevMessages
          .map((msg) => {
            if (!msg.expiresAt) return msg;
            const remaining = Math.max(
              0,
              Math.round((msg.expiresAt - now) / 1000),
            );
            return { ...msg, timeLeft: remaining };
          })
          .filter((msg) => !msg.expiresAt || msg.timeLeft > 0);
      });

      // Compute Room Intensity Metrics based on remaining visible items
  //   //   setMessages((currentFeed) => {
  //   //     if (currentFeed.length >= 8) setFireIntensity("🔥 Roaring");
  //   //     else if (currentFeed.length >= 4) setFireIntensity("🔥 Steady");
  //   //     else if (currentFeed.length > 0) setFireIntensity("🔥 Soft");
  //   //     else setFireIntensity("🪵 Ember");
  //   //     return currentFeed;
  //   //   });
  //   // }, 1000);

  //   return () => clearInterval(lifecycleInterval);
  // }, []);

  // Compute Dicebear profile avatar seeds and isolate dynamic colors
  useEffect(() => {
    if (nickname.trim()) {
      const backgroundColors = ["ffdfbf", "ffd5dc", "d1e8e2"];

      const avatar = createAvatar(bottts, {
        seed: nickname,
        radius: 50,
        backgroundColor: backgroundColors,
      });
      setAvatarUrl(avatar.toDataUri());

      const seedLength = nickname.trim().length;
      if (seedLength % 3 === 0) {
        setAvatarColor("bg-amber-600 hover:bg-amber-700 text-white");
      } else if (seedLength % 3 === 1) {
        setAvatarColor("bg-pink-600 hover:bg-pink-700 text-white");
      } else {
        setAvatarColor("bg-teal-600 hover:bg-teal-700 text-white");
      }
    }
  }, [nickname]);

  useEffect(() => {
    setRevealedIndex(null);
  }, [activeTab]);

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

  // Audio Toggle Controller Logic
  const toggleAmbientSound = () => {
    if (!audioRef.current) return;
    if (isAudioPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current
        .play()
        .catch((e) =>
          console.log("Audio play blocked by browser policies:", e),
        );
    }
    setIsAudioPlaying(!isAudioPlaying);
  };

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
        id: Date.now() + Math.random(),
        author: nickname,
        avatar: avatarUrl,
        text: message,
        isAshen: letTurnToAsh,
        sparks: 0,
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      socket.emit("send_message", payload);
      setMessage("");
    }
  };

  // Feature 1: Tend the fire locally & notify socket array
  const tendFireSpark = (messageId) => {
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === messageId ? { ...msg, sparks: msg.sparks + 1 } : msg,
      ),
    );
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

  // 1. WELCOME SCREEN
  if (!joined) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#FFF0F3] p-4">
        <div className="p-8 bg-white/95 backdrop-blur-md rounded-3xl shadow-xl flex flex-col items-center max-w-sm w-full border border-pink-100 relative overflow-hidden">
          <div className="flex flex-col items-center mb-6">
            <div className="w-24 h-20 mb-3 relative flex items-center justify-center drop-shadow-sm">
              <svg
                viewBox="0 0 100 80"
                className="w-full h-full"
                xmlns="http://www.w3.org/2000/svg"
              >
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
                <path
                  d="M 20,55 C 5,40 15,20 35,42 C 28,25 42,15 50,30 C 58,15 72,25 65,42 C 85,20 95,40 80,55 Z"
                  fill="url(#lotusPinkGrad)"
                  opacity="0.6"
                />
                <path
                  d="M 28,58 C 12,45 22,30 40,48 C 32,25 45,22 50,38 C 55,22 68,25 60,48 C 78,30 88,45 72,58 Z"
                  fill="url(#lotusPinkGrad)"
                  opacity="0.85"
                />
                <path
                  d="M 50,65 C 20,65 15,45 34,48 C 42,52 46,60 50,65 Z"
                  fill="url(#centerPetalGrad)"
                />
                <path
                  d="M 50,65 C 80,65 85,45 66,48 C 58,52 54,60 50,65 Z"
                  fill="url(#centerPetalGrad)"
                />
                <path
                  d="M 50,65 C 32,55 35,28 50,15 C 65,28 68,55 50,65 Z"
                  fill="url(#centerPetalGrad)"
                />
                <path
                  d="M 50,65 C 38,55 40,35 50,24 C 60,35 62,55 50,65 Z"
                  fill="url(#lotusPinkGrad)"
                />
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

            <h1 className="text-3xl font-serif font-bold tracking-tight text-slate-800">
              Calm<span className="text-pink-600 font-medium">Casa</span>
            </h1>
            <p className="text-pink-400 text-xs mt-1">
              A cozy space to just be.
            </p>
          </div>

          {avatarUrl && (
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-pink-50 rounded-full scale-110 -z-10 animate-pulse" />
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
            className="w-full p-3.5 mb-4 border border-pink-200 rounded-2xl text-center focus:outline-none focus:ring-2 focus:ring-pink-400 bg-pink-50/30 text-slate-700 font-medium text-sm transition-all"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
          />

          <button
            onClick={handleJoin}
            className={`w-full ${avatarColor} font-semibold p-3.5 rounded-2xl transition-all shadow-md active:scale-95`}
          >
            Enter the House
          </button>
        </div>
      </div>
    );
  }

  // 2. MAIN WORKSPACE INTERFACE
  return (
    <div className="h-screen w-full bg-[#FFF0F3] text-slate-800 flex flex-col font-sans overflow-hidden p-3 md:p-6">
      {/* Hidden Global Native Audio Core Asset Tag Module */}
      <audio
        ref={audioRef}
        src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"
        loop
        preload="auto"
      />

      {/* App Header Panel Layout */}
      <header className="w-full bg-white/95 backdrop-blur-xs border border-pink-100 rounded-2xl px-4 py-3 flex flex-row items-center justify-between shadow-xs shrink-0 max-w-4xl mx-auto mb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-3.5 h-3.5 bg-pink-500 rounded-full border-2 border-white shadow-xs animate-pulse" />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-serif font-bold text-slate-900 leading-tight">
                Calm<span className="text-pink-600 font-medium">Casa</span>{" "}
                Workspace
              </h1>
              {/* Feature 4: Core visual indicator */}
              <span className="text-[10px] px-2 py-0.5 bg-pink-50 text-pink-600 font-bold rounded-md border border-pink-100/60 animate-bounce">
                {fireIntensity}
              </span>
            </div>
            <p className="text-slate-400 text-[10px] hidden sm:block">
              Switch between cozy corners below to settle your mind.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Feature 3: Audio Control Button Node Component */}
          <button
            onClick={toggleAmbientSound}
            className={`p-2 rounded-full border text-xs transition-all ${
              isAudioPlaying
                ? "bg-emerald-50 text-emerald-600 border-emerald-200 animate-pulse"
                : "bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100"
            }`}
            title="Toggle Ambient Campfire Soundscape"
          >
            {isAudioPlaying ? "🔊 Sound On" : "🔇 Sound Muted"}
          </button>

          <div className="flex items-center gap-2 bg-pink-50/70 px-3 py-1.5 rounded-full border border-pink-100">
            <img
              src={avatarUrl}
              alt="Me"
              className="w-5 h-5 rounded-full bg-white"
            />
            <span className="text-xs font-semibold text-slate-700">
              {nickname}
            </span>
          </div>
        </div>
      </header>

      {/* Horizontally Scrollable Multi-Room Selector Tabs */}
      <nav className="w-full max-w-4xl mx-auto flex gap-2 mb-3 bg-white/60 p-1.5 border border-pink-100/40 rounded-2xl overflow-x-auto shrink-0 scrollbar-none">
        {[
          { id: "campfire", label: "🪵 The Campfire" },
          { id: "library", label: "📚 The Library" },
          { id: "garden", label: "🌱 The Garden" },
          { id: "breathe", label: "🧘 Calm Breath" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 min-w-[115px] text-center py-2 px-3 rounded-xl text-xs font-semibold transition-all shrink-0 ${
              activeTab === tab.id
                ? `${avatarColor} shadow-xs scale-[1.02]`
                : "text-slate-600 hover:bg-white/50 bg-white/30"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      {/* Main Focus Viewport Display Box */}
      <main className="w-full max-w-4xl mx-auto flex-1 bg-white/95 border border-pink-100 rounded-3xl p-4 md:p-6 shadow-sm flex flex-col overflow-hidden min-h-0 relative">
        {/* CAMPFIRE WORKSPACE (WITH NEW LUXURY COZY INTEGRATIONS) */}
        {activeTab === "campfire" && (
          <div className="flex flex-col h-full flex-1 min-h-0 justify-between">
            {/* Control Strip Module Block */}
            <div className="flex flex-wrap items-center justify-between gap-2 bg-pink-50/50 border border-pink-100 rounded-xl p-2 mb-2 shrink-0 text-xs font-medium">
              <div className="flex items-center gap-3">
                {/* <span className="text-slate-500 flex items-center gap-1.5 font-semibold">
                  {privacyMode ? "🔒 Privacy Shield Active" : "🔓 Public View"}
                </span> */}

                {/* Feature 2: Ashen Burning Toggle Option */}
                <label className="flex items-center gap-1.5 cursor-pointer text-slate-600 font-semibold select-none bg-white px-2 py-0.5 rounded-md border border-pink-100">
                  <input
                    type="checkbox"
                    checked={letTurnToAsh}
                    onChange={(e) => setLetTurnToAsh(e.target.checked)}
                    className="accent-pink-500"
                  />
                  <span>Let it turn to ash (60s)</span>
                </label>
              </div>

              <button
                onClick={() => {
                  setPrivacyMode(!privacyMode);
                  setRevealedIndex(null);
                }}
                className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-lg border transition-all ${
                  privacyMode
                    ? "bg-slate-900 text-white border-slate-900 shadow-xs"
                    : "bg-white text-slate-600 border-pink-200 hover:bg-pink-50"
                }`}
              >
                {privacyMode ? "Disable Shield" : "Enable Anti-Screenshot"}
              </button>
            </div>

            {/* Core Scroll Window Container Node */}
            <div className="space-y-3 flex-1 overflow-y-auto pr-1 select-none">
              {messages.length === 0 ? (
                <div className="text-center text-slate-300 my-auto py-16 animate-fadeIn">
                  <span className="text-4xl block mb-2">🪵</span>
                  <p className="text-xs font-medium text-slate-400 max-w-xs mx-auto leading-relaxed">
                    The fire is crackling softly. Leave a heavy thought here to
                    settle your mind.
                  </p>
                </div>
              ) : (
                messages.map((msg, index) => {
                  const isMyMessage = msg.author === nickname;
                  const isRevealed = revealedIndex === index;
                  const shouldBlur = privacyMode && !isRevealed;

                  return (
                    <div
                      key={msg.id || index}
                      className={`flex gap-2 max-w-[85%] animate-fadeIn ${isMyMessage ? "ml-auto flex-row-reverse" : ""}`}
                    >
                      <img
                        src={msg.avatar}
                        className="w-7 h-7 rounded-full bg-pink-50 self-end"
                        alt=""
                      />
                      <div className="group relative max-w-full">
                        {/* Interactive Message Content Box wrapper */}
                        <div className="flex items-start gap-1.5">
                          <div
                            onTouchStart={() =>
                              privacyMode && setRevealedIndex(index)
                            }
                            onTouchEnd={() =>
                              privacyMode && setRevealedIndex(null)
                            }
                            onMouseDown={() =>
                              privacyMode && setRevealedIndex(index)
                            }
                            onMouseUp={() =>
                              privacyMode && setRevealedIndex(null)
                            }
                            className={`p-3 rounded-2xl text-[13px] leading-relaxed transition-all duration-300 relative overflow-hidden cursor-pointer ${
                              isMyMessage
                                ? "bg-slate-900 text-white rounded-tr-none shadow-xs"
                                : "bg-pink-50/60 text-slate-800 border border-pink-100/40 rounded-tl-none"
                            } ${msg.expiresAt ? "opacity-75 italic border-dashed border-amber-300" : ""}`}
                          >
                            <span
                              className={`block transition-all duration-300 ${shouldBlur ? "blur-md opacity-25 select-none pointer-events-none" : ""}`}
                            >
                              {msg.text}
                            </span>

                            {shouldBlur && (
                              <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold uppercase tracking-wider text-slate-400 pointer-events-none animate-pulse">
                                Hold to view
                              </span>
                            )}
                          </div>

                          {/* Feature 1: Tend Fire Spark Button Interaction Element */}
                          <button
                            onClick={() => tendFireSpark(msg.id)}
                            className="text-xs p-1 bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-700 rounded-lg transition-transform active:scale-125 self-center"
                            title="Tend this fire entry with a log"
                          >
                            🪵{" "}
                            {msg.sparks > 0 && (
                              <span className="font-bold ml-0.5">
                                {msg.sparks}
                              </span>
                            )}
                          </button>
                        </div>

                        {/* Extra contextual labels (Vanishing countdown markers) */}
                        <div
                          className={`flex items-center justify-between gap-2 mt-0.5 px-1 text-[9px] text-slate-400 ${isMyMessage ? "flex-row-reverse" : ""}`}
                        >
                          <span>
                            {msg.author} • {msg.time}
                          </span>
                          {msg.expiresAt && (
                            <span className="text-amber-600 font-bold animate-pulse">
                              ⏳ Ashen ash in {msg.timeLeft}s
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            <div className="flex gap-2 mt-3 pt-3 border-t border-pink-50 shrink-0">
              <input
                type="text"
                placeholder="Set your thoughts ablaze..."
                className="flex-1 p-3 bg-pink-50/30 border border-pink-100 rounded-xl text-xs focus:outline-none text-slate-700 placeholder-slate-400"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              />
              <button
                onClick={sendMessage}
                className={`${avatarColor} px-5 rounded-xl text-xs font-semibold shadow-xs transition-transform active:scale-95`}
              >
                Share
              </button>
            </div>
          </div>
        )}

        {/* LIBRARY WORKSPACE */}
        {activeTab === "library" && (
          <div className="flex flex-col h-full flex-1 min-h-0 justify-between">
            <div className="overflow-y-auto flex-1 pr-1">
              <div className="bg-pink-50/40 border border-pink-100/60 rounded-xl p-3.5 mb-4 text-center max-w-xl mx-auto">
                <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                  📚 The Encouragement Board
                </h2>
                <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                  A quiet zone. Read a warm note dropped by an anonymous
                  neighbor or leave your own.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {notes.map((note, idx) => (
                  <div
                    key={idx}
                    className="p-4 bg-[#FFFaf0] border border-orange-100/60 rounded-2xl shadow-xs transform transition-all"
                  >
                    <p className="text-slate-700 font-serif italic text-[12.5px] leading-relaxed mb-2">
                      "{note.text}"
                    </p>
                    <span className="text-[10px] font-medium text-pink-500 block">
                      — Warmly, {note.author}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-2 mt-3 pt-3 border-t border-pink-50 shrink-0">
              <input
                type="text"
                placeholder="Write a sweet, uplifting note for someone else..."
                className="flex-1 p-3 bg-pink-50/30 border border-pink-100 rounded-xl text-xs focus:outline-none text-slate-700 placeholder-slate-400"
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
              />
              <button
                onClick={addStickyNote}
                className={`${avatarColor} px-4 rounded-xl text-xs font-semibold shadow-xs transition-transform active:scale-95`}
              >
                Pin Note
              </button>
            </div>
          </div>
        )}

        {/* GARDEN WORKSPACE */}
        {activeTab === "garden" && (
          <div className="flex flex-col h-full flex-1 min-h-0 justify-between">
            <div className="overflow-y-auto flex-1 pr-1">
              <div className="bg-pink-50/40 border border-pink-100/60 rounded-xl p-3.5 mb-4 text-center max-w-xl mx-auto">
                <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
                  🌱 The Worry Garden
                </h2>
                <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                  Attach a burden to a sprout. Watch it grow into a flower as
                  friends click to water it.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {plants.map((plant) => (
                  <div
                    key={plant.id}
                    className="p-3 bg-white border border-pink-100/60 rounded-2xl flex items-center justify-between gap-2 shadow-xs"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl bg-pink-50 p-2 rounded-xl shadow-xs">
                        {plant.stage}
                      </span>
                      <div>
                        <p className="text-xs text-slate-700 font-semibold line-clamp-1 max-w-[130px]">
                          "{plant.worry}"
                        </p>
                        <span className="text-[9px] font-medium text-slate-400 block mt-0.5">
                          Watered {plant.waters} times
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => waterPlant(plant.id)}
                      className="bg-sky-50 hover:bg-sky-100 text-sky-700 text-[10px] font-bold py-1.5 px-3 rounded-xl border border-sky-100 transition-colors"
                    >
                      💧 Water
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-2 mt-3 pt-3 border-t border-pink-50 shrink-0">
              <input
                type="text"
                placeholder="What burden would you like to grow into a flower today?"
                className="flex-1 p-3 bg-pink-50/30 border border-pink-100 rounded-xl text-xs focus:outline-none text-slate-700 placeholder-slate-400"
                value={worryText}
                onChange={(e) => setWorryText(e.target.value)}
              />
              <button
                onClick={plantWorry}
                className={`${avatarColor} px-4 rounded-xl text-xs font-semibold shadow-xs transition-transform active:scale-95`}
              >
                Plant Sprout
              </button>
            </div>
          </div>
        )}

        {/* BOX BREATHING ANCHOR */}
        {activeTab === "breathe" && (
          <div className="flex flex-col items-center justify-center flex-1 text-center py-4 min-h-0 overflow-y-auto">
            <h2 className="text-sm font-bold text-slate-800 mb-1">
              🧘 Box Breathing Anchor
            </h2>
            <p className="text-[11px] text-slate-400 mb-6 max-w-xs leading-relaxed">
              Sync your breathing with the cozy pulsing circle below to ground
              your nervous system.
            </p>

            <div className="relative flex items-center justify-center h-44 w-44 mb-4">
              <div
                className={`absolute rounded-full bg-pink-100/60 border border-pink-200/40 opacity-50 transition-allSubtle duration-1000 ${
                  breathState === "Inhale"
                    ? "h-44 w-44 scale-100"
                    : breathState === "Hold"
                      ? "h-44 w-44 scale-110 bg-pink-200/40"
                      : "h-24 w-24 scale-75"
                }`}
              />

              <div className="z-10 bg-white shadow-md rounded-full h-24 w-24 flex flex-col items-center justify-center border border-pink-50">
                <span className="text-[10px] font-bold text-pink-500 tracking-wider uppercase">
                  {breathState}
                </span>
                <span className="text-2xl font-black text-slate-800 mt-0.5 animate-fadeIn">
                  {breathCount}
                </span>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Embedded Persistent User Mini-Circle Info Block */}
      <footer className="w-full max-w-4xl mx-auto bg-white/80 border border-pink-100 rounded-2xl p-3 shrink-0 shadow-xs">
        <div className="flex items-center gap-1.5 mb-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
          <h3 className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">
            Gathering Circle ({usersInCasa.length})
          </h3>
        </div>
        <div className="flex flex-wrap gap-1.5 max-h-[48px] overflow-y-auto">
          {usersInCasa.map((user) => (
            <div
              key={user.id}
              className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium border ${
                user.nickname === nickname
                  ? "bg-pink-50/60 border-pink-200 text-pink-700"
                  : "bg-white border-pink-100 text-slate-600"
              }`}
            >
              <img
                src={user.avatar}
                alt=""
                className="w-3.5 h-3.5 rounded-full bg-white"
              />
              <span className="truncate max-w-[90px]">
                {user.nickname} {user.nickname === nickname && "(You)"}
              </span>
            </div>
          ))}
        </div>
      </footer>
    </div>
  );
}
