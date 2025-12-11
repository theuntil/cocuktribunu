"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function AboutPage() {
  return (
    <div
      className="
        min-h-screen
        bg-neutral-50 dark:bg-neutral-950
        text-neutral-800 dark:text-neutral-200
        transition-colors duration-300
      "
    >
      {/* ================= HERO SECTION ================= */}
      <section className="relative w-full h-[45vh] md:h-[55vh] overflow-hidden">
        <Image
          src="/kapak3.png"
          alt="Hakkımızda Kapak"
          fill
          className="object-cover opacity-90"
        />
        <div className="absolute inset-0 bg-linear-to-b from-black/40 via-black/20 to-black/60" />

        <div className="absolute bottom-14 left-0 w-full text-center px-6">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-3xl md:text-5xl font-extrabold text-white drop-shadow-xl"
          >
            Hakkımızda
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-white/80 max-w-2xl mx-auto mt-4 text-sm md:text-lg"
          >
            Çocuklar için güvenli, eğlenceli ve ilham veren tribün kültürü oluşturuyoruz.
          </motion.p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-6 py-16 space-y-20">

        {/* ================= BİZ KİMİZ ================= */}
        <section>
          <h2 className="text-3xl font-bold mb-6">Biz Kimiz?</h2>

          <p className="text-lg leading-relaxed text-neutral-700 dark:text-neutral-300">
            Sporda Çocuk Tribünü Projesi, çocuklara spor kültürünü doğru yaşta 
            kazandırmak amacıyla kurulmuş bağımsız bir sosyal sorumluluk girişimidir.  
            Amacımız, çocukların güvenli bir ortamda maç izleyebileceği özel tribün alanları 
            oluşturarak, onların spora olan sevgisini ve bağlılığını artırmaktır.
          </p>
        </section>

        {/* ================= PROJE NASIL BAŞLADI ================= */}
        <section>
          <h2 className="text-3xl font-bold mb-6">Bu Proje Nasıl Doğdu?</h2>

          <div className="prose dark:prose-invert prose-neutral text-lg leading-relaxed">
            <p>
              Projenin fikir temeli, spor müsabakalarında giderek artan şiddet olayları 
              ve çocukların stadyum deneyiminden uzaklaşması üzerine yapılan kapsamlı 
              araştırmalar sonucunda atıldı. Araştırmalar, çocuklara özel, güvenli ve 
              pozitif bir alan oluşturulduğunda hem kulüplerin hem toplumun hem de 
              çocukların uzun vadeli fayda sağladığını ortaya koydu.
            </p>

            <p>
              Kurucumuz <strong>Hakan Coşkun</strong>, çocukların küçük yaşlarda sağlıklı 
              spor kültürünü öğrenmesi gerektiğini savunarak projenin aktif olarak planlanması 
              ve hayata geçirilmesi sürecine öncülük etmiştir.
            </p>
          </div>
        </section>

        {/* ================= MISYON & VIZYON ================= */}
        <section>
          <h2 className="text-3xl font-bold mb-10">Misyon & Vizyon</h2>

          <div className="grid md:grid-cols-2 gap-8">
            {/* MİSYON KARTI */}
            <div
              className="
                p-8 rounded-2xl shadow-sm border 
                bg-white dark:bg-neutral-900 
                border-neutral-200 dark:border-neutral-800
                hover:shadow-lg transition
              "
            >
              <h3 className="text-xl font-bold mb-4">Misyonumuz</h3>
              <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
                Çocuklara güvenli, bilinçli ve eğlenceli bir tribün ortamı sunarak 
                spor sevgisini küçük yaşta aşılamak ve toplumsal spor kültürünün 
                gelişmesine katkıda bulunmak.
              </p>
            </div>

            {/* VİZYON KARTI */}
            <div
              className="
                p-8 rounded-2xl shadow-sm border 
                bg-white dark:bg-neutral-900 
                border-neutral-200 dark:border-neutral-800
                hover:shadow-lg transition
              "
            >
              <h3 className="text-xl font-bold mb-4">Vizyonumuz</h3>
              <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
                Türkiye’nin her stadında çocuklara özel tribün bölümleri oluşturmak ve 
                geleceğin bilinçli, saygılı ve spor kültürüne sahip taraftar neslini yetiştirmek.
              </p>
            </div>
          </div>
        </section>

        {/* ================= TIMELINE ================= */}
        <section>
          <h2 className="text-3xl font-bold mb-10">Projenin Yolculuğu</h2>

          <div className="relative border-l border-neutral-300 dark:border-neutral-700 pl-8 space-y-12">
            
            <div>
              <span className="text-sm text-neutral-500">2021</span>
              <h3 className="text-xl font-semibold mt-1">İlk Araştırmalar</h3>
              <p className="text-neutral-600 dark:text-neutral-400 mt-2">
                Çocukların stadyum deneyimi üzerine saha ve anket çalışmaları başlatıldı.
              </p>
            </div>

            <div>
              <span className="text-sm text-neutral-500">2022</span>
              <h3 className="text-xl font-semibold mt-1">Proje Tasarım Aşaması</h3>
              <p className="text-neutral-600 dark:text-neutral-400 mt-2">
                Çocuk tribünü modeli oluşturuldu, kulüpler ve uzmanlarla görüşmeler yapıldı.
              </p>
            </div>

            <div>
              <span className="text-sm text-neutral-500">2023</span>
              <h3 className="text-xl font-semibold mt-1">Pilot Çalışmalar</h3>
              <p className="text-neutral-600 dark:text-neutral-400 mt-2">
                İlk örnek tribünler kuruldu, çocuklardan ve ebeveynlerden geri bildirimler alındı.
              </p>
            </div>

            <div>
              <span className="text-sm text-neutral-500">2024 →</span>
              <h3 className="text-xl font-semibold mt-1">Genişleme Dönemi</h3>
              <p className="text-neutral-600 dark:text-neutral-400 mt-2">
                Proje ülke genelinde tüm kulüplere uygulanabilir bir model haline geldi.
              </p>
            </div>

          </div>
        </section>

        {/* ================= DEĞERLER ================= */}
        <section>
          <h2 className="text-3xl font-bold mb-10">Temel Değerlerimiz</h2>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              "Güvenlik ve Koruma",
              "Saygı ve Hoşgörü",
              "Eğitim ve Bilinç",
              "Toplumsal Fayda",
              "Sporun Birleştirici Gücü",
              "Çocuk Odaklılık",
            ].map((value, index) => (
              <div
                key={index}
                className="
                  p-6 rounded-xl border 
                  bg-white dark:bg-neutral-900 
                  border-neutral-200 dark:border-neutral-800
                  shadow-sm hover:shadow-md 
                  transition
                "
              >
                <p className="font-semibold text-neutral-900 dark:text-neutral-100 text-center">
                  {value}
                </p>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}
