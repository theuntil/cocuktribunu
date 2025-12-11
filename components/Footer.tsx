"use client";

import Link from "next/link";
import Image from "next/image";
import { Facebook, Instagram, Twitter } from "lucide-react";
import Logo from "./Logo";

export default function Footer() {
  return (
    <footer 
      className="
        border-t border-neutral-200 dark:border-neutral-800 
        bg-neutral-50 dark:bg-neutral-950 
        transition-colors duration-300
      "
    >
      <div className="max-w-6xl mx-auto px-6 py-16">

        {/* TOP SECTION */}
        <div className="flex flex-col md:flex-row md:justify-between gap-12">

          {/* LOGO + DESCRIPTION */}
          <div className="flex flex-col max-w-sm">
            <Logo width={130} height={40} className="mb-4" />

            <p className="text-neutral-600 dark:text-neutral-300 text-sm leading-relaxed">
              Sporda Çocuk Tribünü, çocuklara güvenli tribün alanları oluşturarak 
              sağlıklı spor kültürünü yaymayı amaçlayan yenilikçi bir sosyal sorumluluk projesidir.
            </p>

            {/* SOCIAL ICONS */}
            <div className="flex gap-4 mt-5">
              <a
                href="#"
                className="p-2 rounded-full bg-neutral-200 dark:bg-neutral-800 
                           hover:bg-neutral-300 dark:hover:bg-neutral-700 
                           transition"
              >
                <Facebook className="w-4 h-4 text-neutral-700 dark:text-neutral-300" />
              </a>
              <a
                href="#"
                className="p-2 rounded-full bg-neutral-200 dark:bg-neutral-800 
                           hover:bg-neutral-300 dark:hover:bg-neutral-700 
                           transition"
              >
                <Instagram className="w-4 h-4 text-neutral-700 dark:text-neutral-300" />
              </a>
              <a
                href="#"
                className="p-2 rounded-full bg-neutral-200 dark:bg-neutral-800 
                           hover:bg-neutral-300 dark:hover:bg-neutral-700 
                           transition"
              >
                <Twitter className="w-4 h-4 text-neutral-700 dark:text-neutral-300" />
              </a>
            </div>
          </div>

          {/* QUICK LINKS */}
          <div>
            <h3 className="text-neutral-900 dark:text-neutral-100 font-semibold mb-4">
              Hızlı Erişim
            </h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link 
                  href="/"
                  className="text-neutral-600 dark:text-neutral-300 hover:text-[#006039] dark:hover:text-[#4D96FF] transition"
                >
                  Ana Sayfa
                </Link>
              </li>
              <li>
                <Link 
                  href="/about"
                  className="text-neutral-600 dark:text-neutral-300 hover:text-[#006039] dark:hover:text-[#4D96FF] transition"
                >
                  Hakkımızda
                </Link>
              </li>
              <li>
                <Link 
                  href="/policies"
                  className="text-neutral-600 dark:text-neutral-300 hover:text-[#006039] dark:hover:text-[#4D96FF] transition"
                >
                  Politikalar
                </Link>
              </li>
              <li>
                <Link 
                  href="/contact"
                  className="text-neutral-600 dark:text-neutral-300 hover:text-[#006039] dark:hover:text-[#4D96FF] transition"
                >
                  İletişim
                </Link>
              </li>
            </ul>
          </div>

          {/* CONTACT INFORMATION */}
          <div>
            <h3 className="text-neutral-900 dark:text-neutral-100 font-semibold mb-4">
              İletişim
            </h3>
            <ul className="space-y-2 text-sm">
              <li className="text-neutral-600 dark:text-neutral-300">
                iletisim@cocuktribunu.org
              </li>
            </ul>
          </div>

        </div>

        <hr className="my-10 border-neutral-200 dark:border-neutral-800" />

        {/* BOTTOM BAR */}
        <div className="
          flex flex-col md:flex-row justify-between 
          items-center gap-4
          text-sm text-neutral-500 dark:text-neutral-400
        ">
          <p>© {new Date().getFullYear()} Çocuk Tribünü. Tüm hakları saklıdır.</p>

          {/* --- SAĞ ALTA EKLEDİĞİN TERRA YAZILIMI ALANI --- */}
          <div className="flex items-center gap-2 text-xs text-neutral-400 dark:text-neutral-500">
            <span>bir</span>

            <a 
              href="https://terrayazilim.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="block hover:rotate-20 transition-all duration-300"
            >
              <Image 
                src="/terra.png"
                alt="Terra Software"
                width={20}
                height={20}
                className="opacity-80 hover:opacity-100 transition"
              />
            </a>

            <span>yazılımı</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
