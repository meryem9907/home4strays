"use client";

import {Link} from "@/i18n/routing";
import Button from "./button";
import {AlignJustify, Dog, Heart, LogIn, LogOut, MoonStar, Plus, Signature, Sun, User, Users, ShieldCheck, FileQuestion} from "lucide-react";
import Image from "next/image";
import {useTheme} from "../providers/theme-provider";
import {useTranslations} from "next-intl";
import {usePathname} from "next/navigation";
import {useAuth} from "@/contexts/AuthContext";
import {useBookmarks} from "@/contexts/BookmarkContext";
import {useAccessControl} from "@/contexts/AccessControlContext";
import {useUserProfile} from "@/contexts/UserProfileContext";
import DropDown from "./dropDown";
import LanguageSwitcher from "./language-switcher";
import {useEffect, useState} from "react";

export default function Navbar() {
  const {theme, setTheme} = useTheme();
  const t = useTranslations("Navbar");
  const pathname = usePathname();
  const {token, logout} = useAuth();
  const {bookmarkedPets} = useBookmarks();
  const {permissions} = useAccessControl();
  const {getNgoId} = useUserProfile();
  const [isNgoMember, setIsNgoMember] = useState<boolean | null>(null);

  const toggleTheme = () => {
    setTheme(theme === "light-h4s" ? "dark-h4s" : "light-h4s");
  };

  useEffect(() => {
    const token = localStorage.getItem("authToken");

    if (!token) {
      return;
    }

    const fetchNgoStatus = async () => {
      try {
        const res = await fetch("/api/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Status request failed");
        const data = await res.json();
        setIsNgoMember(data.isNgoUser);
      } catch (err) {
        console.error("Failed to fetch NGO status", err);
        setIsNgoMember(false);
      }
    };

    fetchNgoStatus();
  }, []);

  const ngoId = getNgoId();

  const dropdownItems = [
    ...(isNgoMember && ngoId
      ? [
          {
            href: `/ngos/${ngoId}`,
            label: t("My NGOs"),
            icon: <Users />,
            active: pathname.includes(`/ngos/${ngoId}`),
          },
          {
            href: "/myanimals",
            label: t("My Animals"),
            icon: <Dog />,
            active: pathname.includes("/myanimals"),
          },
        ]
      : []),

    {
      href: "/myprofile",
      label: t("My Profile"),
      icon: <User />,
      active: pathname.includes("/profile"),
    },

    {label: t("logout"), icon: <LogOut />, onClick: logout},
  ];

  const mobileDropdownItems = [
    // {
    //   href: "/animals",
    //   label: t("Liked Animals"),
    //   icon: <Heart />,
    //   active: pathname.includes("/animals"),
    //   mobileOnly: true,
    // },
    {
      href: "/login",
      label: t("sign in"),
      icon: <LogIn />,
      hidden: pathname.includes("/login"),
      mobileOnly: true,
    },
    {
      href: "/signup",
      label: t("sign up"),
      icon: <Signature />,
      hidden: pathname.includes("/signup"),
      mobileOnly: true,
    },
  ];

  return (
    <div className="navbar flex bg-neutral z-40 h-18 px-1 md:px-2">
      <div className="navbar-start flex-1">
        <Link className="flex items-center text-xl font-bold" href="/">
          <div className="avatar">
            <div className="w-14 rounded">
              <Image src="/trace.svg" alt="logo" width={56} height={56} />
            </div>
          </div>
          <p className="text-primary">Home</p>
          <p className="text-secondary">4</p>
          <p className="text-primary">Strays</p>
        </Link>
        <p className="text-center text-xs md:text-xl text-error/70 lg:hidden pl-3">Testbetrieb</p>
      </div>
      <div className="navbar-center flex justify-end">
        <p className="text-3xl text-error/70 hidden lg:block">Testbetrieb</p>
      </div>
      <div className="navbar-end md:flex-grow">
        <div className="gap-3 justify-end hidden md:flex flex-nowrap">
          <Link href="/animals">
            <Button label={t("animals")} color="ghost" bordered={pathname.includes("/animals")} />
          </Link>
          <Link href="/ngos">
            <Button label={t("ngos")} color="ghost" bordered={pathname.includes("/ngos")} />
          </Link>
          <Link href="/aboutus">
            <Button label={t("about")} color="ghost" bordered={pathname.includes("/aboutus")} />
          </Link>
          {permissions.canAccessAddAnimals && (
            <div className="tooltip tooltip-bottom" data-tip="Add Animal">
              <Link href="/add-animal">
                <Button icon={<Plus />} color="primary" bordered={pathname.includes("/add-animal")} />
              </Link>
            </div>
          )}
          {permissions.canAccessNGOVerification && (
            <div className="tooltip tooltip-bottom" data-tip="NGO Verification">
              <Link href="/ngo-verification">
                <Button icon={<ShieldCheck />} color="ghost" bordered={pathname.includes("/ngo-verification")} />
              </Link>
            </div>
          )}
          {!token && (
            <>
              {!pathname.includes("/login") && (
                <Link href="/login">
                  <Button label={t("sign in")} color="primary" soft />
                </Link>
              )}
              {!pathname.includes("/signup") && (
                <Link href="/signup">
                  <Button label={t("sign up")} color="primary" />
                </Link>
              )}
            </>
          )}
        </div>
        {permissions.canBookmarkAnimals && (
          <Link href="/bookmarks" className="hidden md:block ml-2 relative">
            <Button icon={<Heart />} color="ghost" />
            {bookmarkedPets.size > 0 && (
              <span className="absolute -top-1 -right-1 badge badge-primary badge-xs min-h-[1.2rem] min-w-[1.2rem] text-xs font-bold">
                {bookmarkedPets.size > 99 ? "99+" : bookmarkedPets.size}
              </span>
            )}
          </Link>
        )}
        <div className="mx-2">
          <LanguageSwitcher />
          <label className="swap swap-rotate hover:bg-base-300 w-10 h-10 rounded-lg md:mx-2">
            <input type="checkbox" checked={theme === "light-h4s"} onChange={toggleTheme} />
            <Sun className="swap-on fill-current" />
            <MoonStar className="swap-off" />
          </label>
          <Link href="https://home4strays.org/docs">
            <Button icon={<FileQuestion />} />
          </Link>
        </div>
        {token ? (
          <DropDown bgColor="accent" color="ghost" icon={<AlignJustify />} items={dropdownItems} />
        ) : (
          <div className="md:hidden">
            <DropDown bgColor="accent" color="ghost" icon={<AlignJustify />} items={mobileDropdownItems} />
          </div>
        )}
      </div>
    </div>
  );
}
