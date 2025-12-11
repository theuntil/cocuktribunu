"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Baloo_2 } from "next/font/google";
import { Play } from "lucide-react";
import { useState } from "react";
import VideoModal from "../VideoModal";

const baloo = Baloo_2({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const rainbowColors = ["#FF6B6B", "#FFD93D", "#6BCB77", "#4D96FF", "#C77DFF"];

export default function Hero() {
  const [videoOpen, setVideoOpen] = useState(false);

  return (
    <>
      <section className="relative w-full h-screen overflow-hidden flex items-center justify-center">

         {/* BACKGROUND VIDEO */}
      <video
        className="absolute inset-0 w-full h-full object-cover"
        src="/tanitim.mp4"
        autoPlay
        loop
        muted
        playsInline
      />

      {/* TOP GRADIENT OVERLAY */}
      <div
        className="
        absolute inset-0 
        bg-linear-to-b from-black/40 via-black/20 to-black/60 
        dark:from-black/60 dark:via-black/40 dark:to-black/80
        pointer-events-none
      "
      />

      {/* BOTTOM FADE (İSTEDİĞİN GÖLGE) */}
      <div
        className="
          absolute bottom-0 left-0 w-full h-70
          bg-linear-to-t from-black to-transparent
          pointer-events-none
        "
      />

      {/* CONTENT */}
      <div className="relative z-10 max-w-4xl px-6 text-center mx-auto">

        {/* === BAŞLIK === */}
       <motion.h1
  initial={{ opacity: 0, y: 20, filter: "blur(6px)", scale: 0.96 }}
  animate={{ opacity: 1, y: 0, filter: "blur(0px)", scale: 1 }}
  transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
  className={`
    ${baloo.className}
    text-white dark:text-white 
    text-5xl md:text-6xl font-extrabold leading-tight
    drop-shadow-xl
  `}
>
  Sporda{" "}

  {/* Altı çizilecek grup */}
  <span className="relative inline-block">

    {/* === ÇOCUK — RENKLİ HARFLER === */}
    <span className="font-extrabold">
      {"Çocuk".split("").map((char, i) => (
        <span
          key={i}
          style={{
            color: rainbowColors[i % rainbowColors.length],
            display: "inline-block",
          }}
        >
          {char}
        </span>
      ))}
    </span>

    {" "}

    {/* === TRİBÜNÜ — YEŞİL === */}
<span className="text-white">Tribünü<br />

    </span>

    {/* ==== ALT ÇİZGİ (RAINBOW BAR) ==== */}
    <span
      className="
        absolute left-0 -bottom-1 w-full h-1.5 
        rounded-full
        bg-white
      "
    ></span>

  </span>

  {" "}

  <br />Sorumluluk Projesi
</motion.h1>

        {/* === ALT AÇIKLAMA === */}
        <motion.p
          initial={{ opacity: 0, y: 20, filter: "blur(6px)", scale: 0.98 }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)", scale: 1 }}
          transition={{ duration: 1.2, ease: [0.25, 0.1, 0.25, 1] }}
          className="
            text-white/90 dark:text-white/80 
            max-w-2xl mx-auto mt-6 
            text-sm md:text-lg leading-relaxed
            drop-shadow-md
          "
        >
          Çocukları spora teşvik eden, güvenli tribün alanları oluşturarak sağlıklı spor kültürünü
          yaymayı hedefleyen Türkiye’nin en yenilikçi sosyal sorumluluk projesi.
        </motion.p>

          {/* BUTONLAR */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.3 }}
            className="flex flex-row gap-4 justify-center mt-10"
          >
            <Link
              href="/join"
              className="
                px-6 py-3 rounded-full 
                bg-white text-black font-medium
                hover:brightness-110 transition
                shadow-lg hover:shadow-xl active:scale-[0.98]
                text-sm md:text-base
              "
            >
              Projeye Katıl
            </Link>

            {/* POPUP BUTON */}
            <button
              onClick={() => setVideoOpen(true)}
              className="
                px-6 py-3 rounded-full 
                border border-white/40 text-white 
                hover:bg-white/10 transition
                shadow-lg hover:shadow-xl active:scale-[0.98]
                backdrop-blur-md
                text-sm md:text-base
                flex items-center gap-2
              "
            >
              <Play className="w-4 h-4 text-white/80" />
              Tanıtım Videosu
            </button>
          </motion.div>
        </div>
      </section>

      {/* === VIDEO POPUP === */}
      <VideoModal open={videoOpen} onClose={() => setVideoOpen(false)} />
    </>
  );
}
