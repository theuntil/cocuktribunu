"use client";

import { motion } from "framer-motion";

const reasons = [
  "Stadyumlarda şiddet ve küfür kültürünün azalmasına katkı sağlar.",
  "Çocukların sporla erken yaşta bağ kurmasını sağlayarak sağlıklı sosyal gelişim oluşturur.",
  "Aile ve çocuk katılımını artırarak daha güvenli ve keyifli tribün ortamı oluşturur.",
  "Kulüpler için gelecekte daha bilinçli ve eğitimli taraftar nesli yetişmesini destekler.",
  "Toplumda spor kültürünün yayılmasına ve anayasal spor hedeflerine doğrudan katkı sağlar."
];

export default function ReasonsSection() {
  return (
    <section className="
      relative w-full py-28 
      bg-linear-to-b from-white via-neutral-50 to-white
      dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950
      transition-colors duration-300
    ">
      <div className="max-w-4xl mx-auto px-6 text-center">

        {/* BAŞLIK */}
        <motion.h2
          initial={{ opacity: 0, y: 20, filter: "blur(6px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="
            text-4xl md:text-5xl font-extrabold
            text-neutral-900 dark:text-white
            leading-tight
          "
        >
          Neden Bu Proje Önemli?
        </motion.h2>

        {/* ALT AÇIKLAMA */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="
            max-w-2xl mx-auto mt-5
            text-neutral-600 dark:text-neutral-300
            leading-relaxed text-lg
          "
        >
          Çocuk Tribünü Projesi, yalnızca bir tribün düzenlemesi değil;
          çocukların geleceğine dokunan, toplumsal dönüşüm sağlayan bir sosyal sorumluluk hareketidir.
        </motion.p>

        {/* LİSTE */}
        <div className="mt-20 space-y-10">

          {reasons.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10, filter: "blur(4px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="
                group
                relative
                text-left
                mx-auto
                max-w-3xl
                border-l-4 border-[#006039]
                pl-6
                py-4
                bg-white dark:bg-neutral-900
                rounded-lg
                shadow-sm dark:shadow-black/40
                backdrop-blur-md
                transition-all duration-300
                hover:shadow-md hover:-translate-y-1
              "
            >
              <p className="
                text-neutral-800 dark:text-neutral-100 
                text-lg leading-relaxed
              ">
                {item}
              </p>
            </motion.div>
          ))}

        </div>

      </div>
    </section>
  );
}
