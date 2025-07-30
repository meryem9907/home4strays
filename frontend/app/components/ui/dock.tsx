"use client";
import {Dog, HandHeart, Heart, Info, Plus} from "lucide-react";
import {Link} from "@/i18n/routing";
import {usePathname} from "next/navigation";
import {useTranslations} from "next-intl";
import {useAuth} from "@/contexts/AuthContext";
import {useAccessControl} from "@/contexts/AccessControlContext";

export default function Dock() {
  const t = useTranslations("Navbar");

  const {token} = useAuth();
  const {permissions} = useAccessControl();

  const pathname = usePathname();
  return (
    <div className="dock bg-neutral/95 z-40 h-16 md:hidden">
      <Link href="/animals" className={pathname.includes("animals") ? "dock-active" : ""}>
        <Dog />
        <span className="dock-label">{t("animals")}</span>
      </Link>
      <Link href="/ngos" className={pathname.includes("ngos") ? "dock-active" : ""}>
        <HandHeart />
        <span className="dock-label">{t("ngos")}</span>
      </Link>
      {permissions.canAccessAddAnimals && (
        <Link href="/add-animal" className={pathname.includes("add-animal") ? "dock-active" : ""}>
          <Plus />
          <span className="dock-label">{t("Add Animal")}</span>
        </Link>
      )}
      {token && (
        <Link href="/bookmarks" className={pathname.includes("bookmarks") ? "dock-active" : ""}>
          <Heart />
          <span className="dock-label">{t("Liked Animals")}</span>
        </Link>
      )}
      <Link href="/aboutus" className={pathname.includes("aboutus") ? "dock-active" : ""}>
        <Info />
        <span className="dock-label">{t("about")}</span>
      </Link>
    </div>
  );
}
