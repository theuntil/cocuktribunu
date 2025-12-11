"use client";

import Image from "next/image";
import Link from "next/link";
import { useTheme } from "../providers/ThemeProvider";

interface LogoProps {
  width?: number;
  height?: number;
  className?: string;
  href?: string; // opsiyonel, tıklanabilir yapmak için
}

export default function Logo({
  width = 130,
  height = 40,
  className = "",
  href = "/",
}: LogoProps) {
  const { theme } = useTheme();

  const logoSrc = theme === "dark" ? "/cocuk.png" : "/light.png";

  const image = (
    <Image
      src={logoSrc}
      alt="Logo"
      width={width}
      height={height}
      className={`object-contain transition-all duration-300 ${className}`}
    />
  );

  return href ? <Link href={href}>{image}</Link> : image;
}
