"use client";

import Image from "next/image";

export default function ProjectPage() {
  return (
    <div
      className="
        min-h-screen 
        bg-neutral-50 dark:bg-neutral-950 
        text-neutral-800 dark:text-neutral-200 
        transition-colors duration-300
      "
    >
      {/* === HERO COVER === */}
      <section className="relative w-full h-[45vh] md:h-[55vh] overflow-hidden">
        <Image
          src="/kapak2.png"
          alt="Proje Kapak Görseli"
          fill
          className="object-cover object-center opacity-90"
        />

        <div className="absolute inset-0 bg-linear-to-b from-black/40 via-black/20 to-black/60" />

        <div className="absolute bottom-10 left-0 w-full text-center px-4">
          <h1
            className="
              text-3xl md:text-5xl font-extrabold 
              text-white drop-shadow-lg
            "
          >
            Sporda Çocuk Tribünü Projesi
          </h1>
        </div>
      </section>

      {/* === CONTENT WRAPPER === */}
      <div className="max-w-5xl mx-auto px-6 py-14 space-y-20">
        
        {/* === PROJECT INFO CARDS === */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Proje Bilgileri</h2>

          <div className="grid md:grid-cols-3 gap-6">
            
            <div
              className="
                p-6 rounded-2xl 
                bg-white dark:bg-neutral-900 
                border border-neutral-200 dark:border-neutral-800 
                shadow-sm hover:shadow-md transition
              "
            >
              <h3 className="text-sm font-semibold text-neutral-500 dark:text-neutral-400">
                Projenin Adı
              </h3>
              <p className="mt-2 font-bold">
                SPORDA ÇOCUK TRİBÜNÜ SOSYAL SORUMLULUK PROJESİ
              </p>
            </div>

            <div
              className="
                p-6 rounded-2xl 
                bg-white dark:bg-neutral-900 
                border border-neutral-200 dark:border-neutral-800 
                shadow-sm hover:shadow-md transition
              "
            >
              <h3 className="text-sm font-semibold text-neutral-500 dark:text-neutral-400">
                Proje Süresi
              </h3>
              <p className="mt-2 font-bold">Sürekli</p>
            </div>

            <div
              className="
                p-6 rounded-2xl 
                bg-white dark:bg-neutral-900 
                border border-neutral-200 dark:border-neutral-800 
                shadow-sm hover:shadow-md transition
              "
            >
              <h3 className="text-sm font-semibold text-neutral-500 dark:text-neutral-400">
                Proje Yürütücüsü
              </h3>
              <p className="mt-2 font-bold">
                Hakan COŞKUN  
                <span className="block font-normal text-sm">
                  Araştırmacı Gazeteci / Basın Danışmanı
                </span>
              </p>
            </div>

          </div>
        </section>

        {/* === SECTION: KONU & AMAÇ === */}
        <section>
          <h2 className="text-2xl font-bold mb-4">Konu ve Amaç</h2>

          <div className="prose dark:prose-invert prose-neutral text-lg leading-relaxed">
            <p>
              Bu projenin konusu, okullar ve futbol kulüpleriyle iş birliği yapılarak 
              7–15 yaş arasındaki çocukların stadyumlarda ayrılmış bir bölgeye 
              (Çocuk Tribününe) yerleştirilip burada toplu faaliyetler yapmasının 
              sağlanmasıdır.
            </p>

            <p>
              Projenin amacı, ülkemizde spor ile iç içe sağlıklı bir yaşam kültürü 
              oluşturmak ve çocuklara küçük yaşta spor bilinci aşılamaktır.
            </p>
          </div>
        </section>

        {/* === SECTION: AMAÇ LİSTESİ === */}
        <section>
          <h2 className="text-2xl font-bold mb-4">Projenin Hedefleri</h2>

          <ul className="list-disc ml-5 space-y-3 text-neutral-700 dark:text-neutral-300 text-lg">
            <li>Stadyumlarda şiddetin ve küfürün önlenmesini sağlamak.</li>
            <li>Çocukları madde bağımlılığından uzak tutmak.</li>
            <li>Daha fazla çocuk ve kadın seyircinin maçlara gelmesini sağlamak.</li>
            <li>Çocuklara spor sevgisini küçük yaşta aşılamak.</li>
            <li>Gelecek yıllarda bilinçli taraftar sayısını artırmak.</li>
            <li>Çocuklara sağlıklı yaşam alışkanlığı kazandırmak.</li>
          </ul>
        </section>

        {/* === SECTION: FAALİYETLER === */}
        <section>
          <h2 className="text-2xl font-bold mb-4">Faaliyetler</h2>

          <ul className="space-y-4 text-lg">
            <li>✓ Sanatsal etkinlikler: sinema, tiyatro, fotoğraf yarışması.</li>
            <li>✓ Gezici araçlarda spor simülasyon etkinlikleri.</li>
            <li>✓ “DİKKAT ÇOCUK VAR!” temalı pankartlarla farkındalık.</li>
            <li>✓ Çocuklara spor dallarını tanıtan hediyeler.</li>
            <li>✓ Maç esnasında çocukların tezahürat katılımının artırılması.</li>
          </ul>
        </section>

        {/* === SECTION: GEREKÇE VE FAYDA === */}
        <section>
          <h2 className="text-2xl font-bold mb-4">Gerekçe ve Faydalar</h2>

          <div className="prose dark:prose-invert prose-neutral text-lg leading-relaxed">
            <p>
              Yapılan araştırmalara göre çocuk tribünü uygulaması, tribünlerdeki 
              şiddet olaylarının azaltılmasında etkili bir yöntemdir. Aynı zamanda 
              çocukların spora yönelmesini, bilinçli taraftar olarak yetişmesini 
              ve kulüplerin gelecekte daha güçlü bir taraftar kitlesi elde etmesini sağlar.
            </p>

            <p>
              Spor müsabakalarında yaşanan şiddetin büyük kısmı futbol karşılaşmalarında 
              meydana gelmektedir. Bu uygulama, çocukları korurken aynı zamanda spor 
              kültürüne olumlu katkı sağlayacaktır.
            </p>
          </div>
        </section>

        {/* === SECTION: NOT === */}
        <section>
          <h2 className="text-2xl font-bold mb-4">Not</h2>
          <p className="text-lg leading-relaxed">
            Çocuk tribünü marka patent belgesi PDF olarak ekte gönderilmiştir.
          </p>
        </section>

        <p className="text-lg font-semibold">Sevgi ve Saygılarımla,<br />Hakan COŞKUN</p>
      </div>
    </div>
  );
}
