"use client";

import {
  Shield,
  HeartHandshake,
  Users,
  Smile,
  Dumbbell,
  Lightbulb,
} from "lucide-react";

const goals = [
  {
    title: "Stadyumlarda Şiddeti Azaltmak",
    desc: "Çocuk odaklı tribün kültürü ile şiddetsiz ve güvenli bir spor ortamı oluşturmak.",
    icon: Shield,
  },
  {
    title: "Bağımlılıklardan Uzak Tutmak",
    desc: "Çocuklara sağlıklı yaşam alışkanlıkları kazandırmak.",
    icon: HeartHandshake,
  },
  {
    title: "Kadın & Çocuk Seyircisini Artırmak",
    desc: "Aile dostu tribün ortamı oluşturarak katılımı artırmak.",
    icon: Users,
  },
  {
    title: "Spor Sevgisi Aşılamak",
    desc: "Sporun birleştirici gücünü çocuklarla buluşturmak.",
    icon: Smile,
  },
  {
    title: "Bilinçli Taraftar Yetiştirmek",
    desc: "Geleceğin kültürlü, saygılı ve bilinçli taraftar profiline katkı sağlamak.",
    icon: Lightbulb,
  },
  {
    title: "Sağlığı ve Hareketliliği Teşvik",
    desc: "Sporu eğlenceli ve sürdürülebilir bir yaşam biçimi haline getirmek.",
    icon: Dumbbell,
  },
];

export default function ProjectGoals() {
  return (
    <section
      className="
        w-full py-24 px-6 max-w-7xl mx-auto
        rounded-3xl
    
        
        
        backdrop-blur-xl
        transition-colors duration-300
      "
    >
      {/* TITLE */}
      <h2
        className="
          text-3xl md:text-4xl font-extrabold text-center mb-14 tracking-tight
          text-neutral-900 dark:text-neutral-50
        "
      >
        Projenin Amaçları
      </h2>

      {/* GRID */}
      <div
        className="
          grid 
          grid-cols-2          /* 📌 Mobilde 2 kolon */
          md:grid-cols-2       /* Tablet 2 */
          lg:grid-cols-3       /* Desktop 3 */
          gap-6
        "
      >
        {goals.map((goal, index) => {
          const Icon = goal.icon;

          return (
            <div
              key={index}
              className="
                w-full h-[230px]
                flex flex-col items-center text-center
                bg-white/90 dark:bg-white/1
                border border-neutral-200/70 dark:border-neutral-800
                rounded-3xl
                p-6
                
                transition-all
                hover:-translate-y-1
                
              "
            >
              {/* ICON */}
              <div
                className="
                  w-16 h-16
                  rounded-2xl
                  bg-linear-to-br from-sky-500/20 via-blue-500/20 to-emerald-400/20
                  dark:from-sky-500/25 dark:via-blue-500/25 dark:to-emerald-400/25
                  flex items-center justify-center mb-4
                "
              >
                <Icon className="w-8 h-8 text-sky-600 dark:text-sky-300" />
              </div>

              {/* TITLE */}
              <h3
                className="
                  text-lg font-semibold mb-2
                  text-neutral-900 dark:text-neutral-50
                "
              >
                {goal.title}
              </h3>

              {/* TEXT */}
              <p
                className="
                  text-sm leading-relaxed
                  text-neutral-600 dark:text-neutral-300
                "
              >
                {goal.desc}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
