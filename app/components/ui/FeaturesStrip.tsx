"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

export default function FeaturesStrip() {
  const t = useTranslations("demo");
  const features = ((t.raw("features") as string[]) || []).filter(Boolean);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!features.length) return;
    const id = setInterval(() => setIndex((v) => (v + 1) % features.length), 2800);
    return () => clearInterval(id);
  }, [features.length]);

  return (
    <section className="w-full py-10 sm:py-14">
      <div className="max-w-6xl mx-auto px-6">
        <div className="rounded-3xl border border-white/10 bg-white/5 px-6 py-10 sm:px-10 sm:py-12">
          <div className="text-xs font-semibold tracking-[0.25em] text-white/40 uppercase mb-4">
            {t("title")}
          </div>
          <div className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight text-white leading-tight">
            <span className="text-white/60">{t("subtitle")}</span>{" "}
            <span className="text-amber-300">{features[index] || ""}</span>
          </div>
          <div className="mt-6 h-px bg-linear-to-r from-transparent via-white/10 to-transparent" />
        </div>
      </div>
    </section>
  );
}

