"use client";

import Image from "next/image";
import Link from "next/link";
import { useI18n } from "@/components/providers/I18nProvider";

export function VisualServicesSection() {
  const { t } = useI18n();

  const services = [
    {
      title: t("services.card1"),
      image: "/images/plumber.png",
      href: "/jobs?category=Plumbing",
      alt: "Local plumber repairing a kitchen sink",
    },
    {
      title: t("services.card2"),
      image: "/images/cleaning.png",
      href: "/jobs?category=Cleaning",
      alt: "Home cleaning professional at work",
    },
    {
      title: t("services.card3"),
      image: "/images/tutor.png",
      href: "/jobs?category=Tutoring",
      alt: "Local tutor helping a student",
    },
  ];

  return (
    <section className="py-16 md:py-20 bg-background border-b border-border/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 max-w-3xl">
          <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            {t("services.title")}
          </h2>
          <p className="mt-4 text-base text-muted-foreground leading-relaxed">
            {t("services.subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {services.map((service) => (
            <Link key={service.title} href={service.href} className="group block outline-none">
              <div className="relative overflow-hidden rounded-[16px] border border-border/50 bg-card shadow-sm transition-all duration-300 hover:shadow-md hover:border-border/80 hover:-translate-y-0.5">
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
                  <Image
                    src={service.image}
                    alt={service.alt}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                    {service.title}
                  </h3>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
