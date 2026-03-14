"use client";

import Image from "next/image";
import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";

const NO_PHRASES = [
  "No 🙈",
  "Are you sure? 🥺",
  "Really sure? 😳",
  "Think again! 💭",
  "Last chance! 💌",
  "Pretty please? 🥺",
  "Don't do this to me! 😩",
  "I'll cry... 😢",
  "You're breaking my heart! 💔",
  "Just kidding, PLEASE? 🙏",
  "I'll make you cookies! 🍪",
  "What if I said pretty pretty please? ✨",
];

const ASKING_GIF = "/giphy.gif";
const CELEBRATE_GIF = "/giphy-celebrate.gif";
const CELEBRATION_HEARTS = [
  { id: 0, emoji: "💕", x: 8, delay: 0.1, duration: 4.2, size: 20 },
  { id: 1, emoji: "💗", x: 16, delay: 0.7, duration: 5.1, size: 24 },
  { id: 2, emoji: "💖", x: 24, delay: 1.3, duration: 4.8, size: 18 },
  { id: 3, emoji: "❤️", x: 33, delay: 0.4, duration: 5.6, size: 28 },
  { id: 4, emoji: "🩷", x: 41, delay: 1.8, duration: 4.5, size: 22 },
  { id: 5, emoji: "✨", x: 49, delay: 0.9, duration: 5.9, size: 16 },
  { id: 6, emoji: "💕", x: 57, delay: 2.1, duration: 4.3, size: 26 },
  { id: 7, emoji: "💗", x: 65, delay: 0.2, duration: 5.4, size: 19 },
  { id: 8, emoji: "💖", x: 73, delay: 1.1, duration: 4.9, size: 23 },
  { id: 9, emoji: "❤️", x: 81, delay: 1.6, duration: 5.2, size: 27 },
  { id: 10, emoji: "🩷", x: 89, delay: 0.6, duration: 4.7, size: 21 },
  { id: 11, emoji: "✨", x: 13, delay: 2.4, duration: 5.8, size: 15 },
];

function FloatingHearts() {
  const hearts = ["💕", "💗", "💖", "❤️", "🩷", "💘", "💝", "🌸", "✨", "💓"];
  return (
    <div className="floating-hearts">
      {hearts.map((heart, i) => (
        <span key={i} className="floating-heart">
          {heart}
        </span>
      ))}
    </div>
  );
}

function fireConfetti() {
  const colors = ["#e11d48", "#f472b6", "#fda4af", "#fecdd3", "#ff6b9d"];

  // Center burst
  confetti({
    particleCount: 100,
    spread: 80,
    origin: { y: 0.6, x: 0.5 },
    colors,
    shapes: ["circle"],
    scalar: 1.2,
  });

  // Left burst
  setTimeout(() => {
    confetti({
      particleCount: 60,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.65 },
      colors,
      shapes: ["circle"],
      scalar: 1,
    });
  }, 250);

  // Right burst
  setTimeout(() => {
    confetti({
      particleCount: 60,
      angle: 120,
      spread: 55,
      origin: { x: 1, y: 0.65 },
      colors,
      shapes: ["circle"],
      scalar: 1,
    });
  }, 400);

  // Delayed top shower
  setTimeout(() => {
    confetti({
      particleCount: 150,
      spread: 160,
      origin: { y: 0, x: 0.5 },
      colors,
      gravity: 0.6,
      scalar: 1.4,
      drift: 0,
      ticks: 300,
    });
  }, 700);
}

function CelebratingHearts() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {CELEBRATION_HEARTS.map((h) => (
        <motion.span
          key={h.id}
          className="absolute"
          style={{ left: `${h.x}%`, fontSize: h.size, bottom: -40 }}
          animate={{
            y: ["0vh", "-120vh"],
            rotate: [0, 360],
            opacity: [0, 0.8, 0.6, 0],
          }}
          transition={{
            duration: h.duration,
            delay: h.delay,
            repeat: Infinity,
            ease: "easeOut",
            type: "tween",
          }}
        >
          {h.emoji}
        </motion.span>
      ))}
    </div>
  );
}

export default function Home() {
  const [accepted, setAccepted] = useState(false);
  const [noCount, setNoCount] = useState(0);
  const [noText, setNoText] = useState("No");
  const [noPosition, setNoPosition] = useState({ x: 0, y: 0 });
  const [isNoEscaping, setIsNoEscaping] = useState(false);

  const yesScale = Math.min(1 + noCount * 0.18, 3.5);
  const glowIntensity = Math.min(noCount * 8, 60);
  const noShrinkStart = 7;
  const noDisappearCount = 12;
  const noScale =
    noCount < noShrinkStart
      ? 1
      : Math.max(0, 1 - (noCount - noShrinkStart + 1) * 0.2);
  const noHasDisappeared = noCount >= noDisappearCount;

  const evadeNo = useCallback(() => {
    const padding = 100;
    const btnW = 160;
    const btnH = 60;
    const maxX = window.innerWidth - btnW - padding;
    const maxY = window.innerHeight - btnH - padding;
    const newX = padding + Math.random() * (maxX - padding);
    const newY = padding + Math.random() * (maxY - padding);
    setNoPosition({ x: newX, y: newY });
    setIsNoEscaping(true);
    setNoCount((prev) => {
      const next = prev + 1;
      setNoText(NO_PHRASES[Math.min(next, NO_PHRASES.length - 1)]);
      return next;
    });
  }, []);

  const handleYes = useCallback(() => {
    setAccepted(true);
    fireConfetti();
    // Second wave of confetti
    setTimeout(fireConfetti, 1500);
  }, []);

  return (
    <div className="animated-gradient min-h-screen relative overflow-hidden">
      <FloatingHearts />

      <AnimatePresence mode="wait">
        {!accepted ? (
          <motion.main
            key="asking"
            className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.8, filter: "blur(10px)" }}
            transition={{ duration: 0.5 }}
          >
            {/* Heading */}
            <motion.h1
              className="text-4xl md:text-6xl lg:text-7xl font-bold text-center"
              style={{
                fontFamily: "var(--font-dancing-script), cursive",
                color: "#9f1239",
              }}
              initial={{ opacity: 0, y: -40, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{
                type: "spring",
                stiffness: 100,
                damping: 12,
                delay: 0.2,
              }}
            >
              Will you be my Valentine?
            </motion.h1>

            {/* Romantic GIF */}
            <motion.div
              className="relative"
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                type: "spring",
                stiffness: 80,
                damping: 15,
                delay: 0.5,
              }}
            >
              <Image
                src={ASKING_GIF}
                alt="Cute bear with a heart"
                className="w-48 h-48 md:w-64 md:h-64 rounded-2xl object-cover"
                width={256}
                height={256}
                style={{
                  boxShadow: "0 8px 32px rgba(225, 29, 72, 0.2)",
                }}
              />
            </motion.div>

            {/* Buttons */}
            <motion.div
              className="flex items-center gap-4 mt-4"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              {/* Yes Button */}
              <motion.button
                onClick={handleYes}
                className="rounded-full font-bold text-white cursor-pointer px-8 py-3 text-lg md:text-xl"
                style={{
                  background:
                    "linear-gradient(135deg, #e11d48, #be123c, #9f1239)",
                  boxShadow: `0 0 ${15 + glowIntensity}px rgba(225, 29, 72, ${0.3 + glowIntensity / 100}), 0 0 ${30 + glowIntensity * 2}px rgba(225, 29, 72, ${0.1 + glowIntensity / 200})`,
                  animation: "heartbeat 1.5s ease-in-out infinite",
                }}
                animate={{ scale: yesScale }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                whileHover={{ scale: yesScale * 1.08 }}
                whileTap={{ scale: yesScale * 0.95 }}
              >
                Yes! 💖
              </motion.button>

              {/* No Button - in place or escaping */}
              {!isNoEscaping && !noHasDisappeared && (
                <motion.button
                  onClick={evadeNo}
                  onMouseEnter={evadeNo}
                  className="rounded-full font-semibold cursor-pointer px-8 py-3 text-lg border-2"
                  style={{
                    background: "rgba(253, 164, 175, 0.6)",
                    borderColor: "#f472b6",
                    color: "#9f1239",
                  }}
                  whileHover={{ scale: 1.05 }}
                >
                  {noText}
                </motion.button>
              )}
            </motion.div>

            {/* Escaped No Button - fixed position */}
            {isNoEscaping && !noHasDisappeared && (
              <motion.button
                onClick={evadeNo}
                onMouseEnter={evadeNo}
                className="fixed rounded-full font-semibold cursor-pointer px-6 py-3 text-base z-50 border-2"
                style={{
                  background:
                    noCount > 7
                      ? "rgba(254, 205, 211, 0.9)"
                      : "rgba(253, 164, 175, 0.7)",
                  borderColor: noCount > 7 ? "#e11d48" : "#f472b6",
                  color: "#9f1239",
                  animation: noCount > 5 ? "shake 0.4s ease-in-out" : "none",
                }}
                animate={{
                  left: noPosition.x,
                  top: noPosition.y,
                  scale: noScale,
                  opacity: Math.max(0.15, noScale),
                  rotate: noCount > 8 ? (noCount % 2 === 0 ? 5 : -5) : 0,
                }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 12,
                }}
              >
                {noText}
                {noCount > 6 && (
                  <motion.span
                    className="ml-1"
                    animate={{ scale: 1.3 }}
                    transition={{
                      repeat: Infinity,
                      repeatType: "reverse",
                      duration: 0.3,
                    }}
                  >
                    😭
                  </motion.span>
                )}
              </motion.button>
            )}

            {/* Encouraging sub-text that appears after a few "no"s */}
            <AnimatePresence>
              {noCount >= 3 && (
                <motion.p
                  className="text-base md:text-lg text-center mt-2"
                  style={{ color: "#e11d48" }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                >
                  {noCount < 6
                    ? "The Yes button is getting bigger... just saying 👀"
                    : noCount < 10
                      ? "You can't escape love! 💘"
                      : "At this point, it's basically destiny 💫"}
                </motion.p>
              )}
            </AnimatePresence>
          </motion.main>
        ) : (
          <motion.main
            key="celebrating"
            className="celebrate-cursor relative z-10 flex flex-col items-center justify-center min-h-screen px-4 gap-8"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              type: "spring",
              stiffness: 80,
              damping: 15,
              delay: 0.2,
            }}
          >
            <CelebratingHearts />

            {/* Celebration heading */}
            <motion.h1
              className="text-5xl md:text-7xl lg:text-8xl font-bold text-center"
              style={{
                fontFamily: "var(--font-dancing-script), cursive",
                color: "#e11d48",
              }}
              initial={{ opacity: 0, y: -50, rotate: -5 }}
              animate={{ opacity: 1, y: 0, rotate: 0 }}
              transition={{
                type: "spring",
                stiffness: 100,
                damping: 10,
                delay: 0.3,
              }}
            >
              Yay! 🎉
            </motion.h1>

            {/* Happy GIF */}
            <motion.div
              initial={{ opacity: 0, scale: 0, rotate: -180 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{
                type: "spring",
                stiffness: 80,
                damping: 12,
                delay: 0.5,
              }}
            >
              <Image
                src={CELEBRATE_GIF}
                alt="Happy celebrating cats"
                className="w-56 h-56 md:w-72 md:h-72 rounded-3xl object-cover"
                width={288}
                height={288}
                style={{
                  boxShadow: "0 12px 40px rgba(225, 29, 72, 0.3)",
                }}
              />
            </motion.div>

            {/* Sub-message */}
            <motion.p
              className="text-2xl md:text-3xl font-semibold text-center"
              style={{ color: "#9f1239" }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              You + Me = Forever 💕
            </motion.p>

            <motion.p
              className="text-lg md:text-xl text-center max-w-md"
              style={{ color: "#be123c" }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
            >
              I knew you&apos;d say yes 😏
              <br />
              <span className="text-base opacity-70">
                (you were always my favorite answer)
              </span>
            </motion.p>

            {/* Pulsing heart */}
            <motion.div
              className="text-6xl md:text-8xl"
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 5, -5, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
                type: "tween",
              }}
            >
              💖
            </motion.div>
          </motion.main>
        )}
      </AnimatePresence>
    </div>
  );
}
