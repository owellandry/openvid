"use client";
import { Icon } from "@iconify/react";
import { useTranslations } from "next-intl";

export default function DonationCard() {
  const t = useTranslations("donation");

  return (
    <a
      href="/donate"
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center justify-between w-full overflow-hidden rounded-3xl border border-white/10 bg-white/3 px-6 py-5 transition-all hover:border-white/20 hover:bg-white/5 active:scale-[0.99]"
    >
      <div className="flex items-center gap-4">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/5 text-amber-300 border border-white/10 group-hover:bg-white/10 transition-colors shrink-0">
          <Icon icon="carbon:cafe" width="22" height="22" />
        </div>

        <div className="flex flex-col">
          <h4 className="text-base sm:text-lg font-medium text-white tracking-tight">{t("title")}</h4>
          <p className="text-sm text-neutral-500 group-hover:text-neutral-400 transition-colors">
            {t("description")}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 text-white/30 group-hover:text-amber-300 transition-all">
        <Icon icon="carbon:arrow-right" width="22" height="22" className="transform group-hover:translate-x-1 transition-transform" />
      </div>
    </a>
  );
}
