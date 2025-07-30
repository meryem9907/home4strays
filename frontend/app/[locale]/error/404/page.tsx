import React from "react";
import { PawPrint, Home } from "lucide-react";
import Image from "next/image";
import Button from "@/app/components/ui/button";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";

export default function NotFoundPage() {

  const t = useTranslations("404");

  return (
    <div className="container flex items-center justify-center mx-auto py-16 px-4 h-full">
      <div className="flex items-center justify-center gap-10">

        <figure className="hidden lg:block">
          <Image src="/404/dog.png" alt="404" width={500} height={500} />
        </figure>

        <div className="card bg-base-100 shadow-xl max-w-3xl mx-auto overflow-hidden">
          <div className="card-body relative">

            {/* Background Paws */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
              {Array(20).fill(null).map((_, i) => (
                <PawPrint
                  key={i}
                  size={32}
                  className="absolute text-secondary/20"
                  style={{
                    top: `${Math.random() * 100}%`,
                    left: `${Math.random() * 100}%`,
                    transform: `rotate(${Math.random() * 360}deg)`
                  }}
                />
              ))}
            </div>
            
            <div className="flex flex-col items-center text-center z-10">
              <h1 className="text-8xl font-bold text-primary mb-4">{t("title")}</h1>
              
              <div className="divider divider-primary w-32 mx-auto"></div>
              
              <h2 className="text-2xl font-semibold text-secondary mb-6">
                {t("subtitle")}
              </h2>
              
              <p className="text-base-content opacity-80 max-w-md mb-8">
                {t("text")}
              </p>
              
              <Link href="/">
                <Button label="Homepage" icon={<Home size={18} />} color="primary" />
              </Link>
            </div>
          </div>
        </div>

        <figure className="hidden lg:block">
          <Image src="/404/cat.png" alt="404" width={500} height={500} />
        </figure>

      </div>
    </div>
  );
}