"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Search, MapPin, ShieldCheck, Zap, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/components/providers/I18nProvider";
import { dictionaries } from "@/i18n/dictionaries";

export function HeroSection() {
  const router = useRouter();
  const { t, locale } = useI18n();
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query.trim()) params.set("search", query.trim());
    if (location.trim()) params.set("location", location.trim());
    router.push(`/jobs?${params.toString()}`);
  };

  return (
    <section className="relative pt-20 pb-24 md:pt-28 md:pb-32 bg-background border-b border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
        {/* Trust Label */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-3 py-1 text-xs font-medium text-muted-foreground mb-6 shadow-sm"
        >
          <Zap size={14} className="text-primary" />
          <span>{t("hero.badge")}</span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mx-auto max-w-4xl text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl leading-[1.15]"
        >
          {t("hero.title1")}{locale === 'en' ? <br className="hidden sm:block" /> : ' '}
          <span className="text-primary">{t("hero.title2")}</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mx-auto mt-6 max-w-2xl text-base text-muted-foreground sm:text-lg leading-relaxed text-center"
        >
          {t("hero.subtitle")}
        </motion.p>

        {/* Search Box */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          onSubmit={handleSearch}
          className="mx-auto mt-10 max-w-3xl rounded-xl border border-border bg-card p-2 shadow-sm flex flex-col sm:flex-row items-stretch gap-2 transition-all focus-within:border-primary/40 focus-within:ring-2 focus-within:ring-primary/20"
        >
          <div className="flex-1 flex items-center gap-3 px-3 py-2.5 sm:border-r border-border">
            <Search size={18} className="text-muted-foreground shrink-0" />
            <input
              type="text"
              placeholder={t("hero.searchPlaceholder")}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
            />
          </div>

          <div className="flex-1 flex items-center gap-3 px-3 py-2.5">
            <MapPin size={18} className="text-muted-foreground shrink-0" />
            <input
              type="text"
              placeholder={t("hero.locationPlaceholder")}
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
            />
          </div>

          <Button type="submit" size="lg" className="rounded-lg px-8 font-semibold shrink-0 sm:ml-2 bg-primary hover:bg-primary/90 text-primary-foreground border-0">
            {t("hero.searchButton")}
          </Button>
        </motion.form>

        {/* Popular Tags */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-6 flex flex-wrap items-center justify-center gap-2.5 text-sm"
        >
          <span className="font-medium text-muted-foreground">{t("hero.popular")}</span>
          {["tag1", "tag2", "tag3", "tag4", "tag5"].map((tagKey) => {
            const translatedTag = t(`hero.${tagKey}` as any);
            const englishTag = dictionaries.en[`hero.${tagKey}` as keyof typeof dictionaries.en];
            return (
              <button
                key={tagKey}
                onClick={() => router.push(`/jobs?search=${encodeURIComponent(englishTag)}`)}
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                {translatedTag}
              </button>
            );
          })}
        </motion.div>

        {/* Value Prop Highlights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-20 grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-4xl mx-auto pt-10 border-t border-border"
        >
          <div className="flex flex-col items-center sm:items-start text-center sm:text-left gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <ShieldCheck size={20} />
            </div>
            <div>
              <h4 className="text-base font-semibold text-foreground">{t("hero.valueProp1Title")}</h4>
              <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{t("hero.valueProp1Desc")}</p>
            </div>
          </div>

          <div className="flex flex-col items-center sm:items-start text-center sm:text-left gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Zap size={20} />
            </div>
            <div>
              <h4 className="text-base font-semibold text-foreground">{t("hero.valueProp2Title")}</h4>
              <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{t("hero.valueProp2Desc")}</p>
            </div>
          </div>

          <div className="flex flex-col items-center sm:items-start text-center sm:text-left gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Star size={20} />
            </div>
            <div>
              <h4 className="text-base font-semibold text-foreground">{t("hero.valueProp3Title")}</h4>
              <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{t("hero.valueProp3Desc")}</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
