"use client";

import {
  Film,
  Bus,
  Flag,
  Gift,
  Megaphone,
  Sparkles,
} from "lucide-react";
import { motion } from "framer-motion";

const activityData = [
  {
    title: "Sanatsal Etkinlikler",
    desc: "Projeye katılan çocuklara yönelik sinema, tiyatro ve fotoğraf yarışmaları düzenlenerek onların sanatsal yönleri ve özgüvenleri desteklenir.",
    icon: Film,
  },
  {
    title: "Gezici Spor Simülasyonu",
    desc: "Özel olarak tasarlanmış gezici araç içerisinde tüm spor dallarını içeren simülasyonlarla çocuklara sporun eğlenceli yüzü deneyimletilir.",
    icon: Bus,
  },
  {
    title: "“Dikkat Çocuk Var!” Farkındalığı",
    desc: "Maç sırasında sporcuların ve seyircilerin açtığı pankartlarla çocuk güvenliği ve tribün farkındalığı tüm stadyuma duyurulur.",
    icon: Flag,
  },
  {
    title: "Hediye & Spor Setleri",
    desc: "Çocuk tribünündeki her koltuğa küçük spor bilgilendirme kartları ve çeşitli teşvik edici sürpriz hediyeler bırakılır.",
    icon: Gift,
  },
  {
    title: "Tezahürat & Ses Deneyimi",
    desc: "Çocukların tezahüratları özel olarak stadyumda duyurulur, onlara unutulmayacak bir maç deneyimi sunulur.",
    icon: Megaphone,
  },
  {
    title: "Güvenli Tribün Kültürü",
    desc: "Spor kültürünün küçük yaşta sevdirilmesi ve bilinçli taraftar yetiştirilmesi için güvenli ortamlar oluşturulur.",
    icon: Sparkles,
  },
];

export default function ActivitiesSection() {
  return (
    <section className="relative w-full py-32 px-6 max-w-7xl mx-auto">
      
      {/* BACKGROUND FLOW LINES */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.06] dark:opacity-[0.12]">
        <div className="absolute left-1/3 top-0 w-px h-full bg-linear-to-b from-transparent via-blue-400 to-transparent"></div>
        <div className="absolute left-2/3 top-0 w-px h-full bg-linear-to-b from-transparent via-emerald-400 to-transparent"></div>
      </div>

      {/* TITLE */}
      <motion.h2
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="text-3xl md:text-4xl font-extrabold text-center mb-20
        text-neutral-900 dark:text-neutral-100"
      >
        Proje Faaliyetleri
      </motion.h2>

      {/* FLOW WRAPPER */}
      <div className="relative flex flex-col gap-20">
        {activityData.map((item, index) => {
          const Icon = item.icon;

          const isRight = index % 2 === 1; // zigzag akış ama kart değil

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: isRight ? 60 : -60 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className={`
                flex flex-col md:flex-row items-center gap-10
                ${isRight ? "md:flex-row-reverse" : ""}
              `}
            >
              {/* ICON + CIRCLE */}
              <div
                className="
                  relative w-28 h-28 rounded-full
                  bg-linear-to-br from-blue-500/30 to-emerald-400/30
                  dark:from-blue-500/20 dark:to-emerald-400/20
                  backdrop-blur-xl border border-white/20 dark:border-neutral-700
                  shadow-[0_10px_30px_rgba(0,0,0,0.15)]
                  flex items-center justify-center
                "
              >
                <Icon className="w-12 h-12 text-blue-700 dark:text-blue-300" />
              </div>

              {/* TEXT CONTENT */}
              <div className="max-w-xl">
                <h3 className="text-2xl font-bold mb-3 text-neutral-900 dark:text-neutral-50">
                  {item.title}
                </h3>
                <p className="text-neutral-600 dark:text-neutral-300 leading-relaxed text-lg">
                  {item.desc}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
