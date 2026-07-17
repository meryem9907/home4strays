"use client"

import { Link } from "@/i18n/routing"
import Button from "./button"
import { useTranslations } from "next-intl";
import { useAuth } from "@/contexts/AuthContext";
import { useAccessControl } from "@/contexts/AccessControlContext";
import { usePathname } from "next/navigation";

export default function MatchBtn() {
    const t = useTranslations("Navbar");

    const {token} = useAuth();
    const {permissions} = useAccessControl();
    const pathname = usePathname();
  return (
    <div>

  { /* permissions.canAccessMatches  */ false? (
            <Link href="/matches" >
            <Button label={t("matches")}  bordered={pathname.includes("/matches")} />
          </Link>
        ):
        (
          <Link href="/login" className="md:hidden fixed bottom-24 right-4 z-50 rounded-full shadow-xl shadow-primary/30">
                   <Button label={t("matches")} color="primary" size="lg" bordered={pathname.includes("/matches")} optional="w-fit min-w-fit whitespace-wrap px-4 text-center" />
          </Link>
        )} 

 </div> )
 
}

