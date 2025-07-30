"use client";

import CaretakerProfile from "@/app/components/myprofile/caretaker/view";
import NgoMemberProfile from "@/app/components/myprofile/ngomember/view";
import { Caretaker } from "@/app/types/backend/caretaker";
import { NGOInformation } from "@/app/types/backend/ngoInfo";
import { NGOMember } from "@/app/types/backend/ngoMember";

import { useLocale } from "next-intl";
import { useRouter, notFound } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function MyProfile() {
  const [isNgoMember, setIsNgoMember] = useState<boolean | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [userId, setUserId] = useState<string>("");
  const [caretakerData, setCaretakerData] = useState<Caretaker | null>(null);
  const [ngoMemberData, setNgoMemberData] = useState<NGOMember | null>(null);
  const [ngoInfo, setNgoInfo] = useState<NGOInformation | null>(null);

  const router = useRouter();
  const locale = useLocale();

  useEffect(() => {
    const token = localStorage.getItem("authToken");

    if (!token) {
      setIsAuthenticated(false);
      return;
    }

    const fetchAllStatus = async () => {
      try {
        const headers = {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        };

        // Fetch /me
        const res = await fetch("/api/me", { headers });

        if (!res.ok) throw new Error("Status request failed");
        const data = await res.json();

        setIsNgoMember(data.isNgoUser);
        setUserId(data.id);
        setIsAuthenticated(true);

        // Fetch /ngo-status
        if (data.isNgoUser) {
          const ngoStatusRes = await fetch("/api/ngo-status", { headers });
          if (!ngoStatusRes.ok) throw new Error("Failed to fetch /ngo-status");
          const ngoStatus = await ngoStatusRes.json();

          if (ngoStatus.needsNgoProfile) {
            router.push(`/${locale}/signup`);
          } else {
            // Fetch /ngo-member
            const ngoRes = await fetch(`/api/ngo-member?userId=${data.id}`, {
              method: "GET",
              headers,
            });

            if (!ngoRes.ok) throw new Error("Failed to fetch ngo-member data");

            const ngoMember = await ngoRes.json();
            const ngoMemberWithUserPicture = {
              userId: ngoMember.ngoMember.userId,
              ngoId: ngoMember.ngoMember.ngoId,
              isAdmin: ngoMember.ngoMember.isAdmin,
              isNGOUser: ngoMember.ngoMember.isNGOUser,
              firstName: ngoMember.ngoMember.firstName,
              lastName: ngoMember.ngoMember.lastName,
              email: ngoMember.ngoMember.email,
              profilePictureLink:
                data.profilePictureLink ||
                ngoMember.ngoMember.profilePictureLink,
              phoneNumber: ngoMember.ngoMember.phoneNumber,
              ngoMemberHours: ngoMember.ngoMemberHours,
            } as NGOMember;
            setNgoMemberData(ngoMemberWithUserPicture);

            // Fetch /ngo (NGO Info)
            console.log(
              "Fetching NGO info for NGO ID:",
              ngoMember.ngoMember.ngoId
            );
            const ngoInfoRes = await fetch(
              `/api/ngo/${ngoMember.ngoMember.ngoId}`,
              {
                method: "GET",
                headers,
              }
            );

            if (!ngoInfoRes.ok) {
              console.error(
                "Failed to fetch ngo info data, status:",
                ngoInfoRes.status
              );
              throw new Error("Failed to fetch ngo info data");
            }

            const ngoInfo = await ngoInfoRes.json();
            console.log("NGO Info:", ngoInfo);
            setNgoInfo({
              name: ngoInfo.ngo.name,
              logo: ngoInfo.ngo.logoPictureLink,
              email: ngoInfo.ngo.email,
              country: ngoInfo.ngo.country,
              websites: ngoInfo.ngo.website,
            });
          }
        }
        // Fetch /caretaker-status
        else {
          const caretakerStatusRes = await fetch("/api/caretaker-status", {
            headers,
          });
          if (!caretakerStatusRes.ok)
            throw new Error("Failed to fetch /caretaker-status");
          const caretakerStatus = await caretakerStatusRes.json();

          if (caretakerStatus.needsCaretakerProfile) {
            router.push(`/${locale}/signup`);
          }

          // Fetch /caretaker
          else {
            const caretakerRes = await fetch(`/api/caretaker/${data.id}`, {
              method: "GET",
              headers,
            });

            if (!caretakerRes.ok)
              throw new Error("Failed to fetch caretaker data");

            const caretaker = await caretakerRes.json();
            const caretakerWithUserPicture = {
              ...caretaker,
              profilePictureLink:
                data.profilePictureLink || caretaker.profilePictureLink,
            };
            setCaretakerData(caretakerWithUserPicture);
          }
        }
      } catch (err) {
        console.error("Failed to fetch profile data:", err);
        setIsAuthenticated(false);
      }
    };

    fetchAllStatus();
  }, []);

  // Not logged in
  if (isAuthenticated === false) {
    notFound();
  }

  // Loading
  if (
    isAuthenticated === null ||
    isNgoMember === null ||
    (caretakerData === null && ngoMemberData === null)
  ) {
    return (
      <div className="container mx-auto py-8 px-4 h-full flex flex-col justify-center items-center">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 rounded-full bg-primary animate-pulse"></div>
          <div className="w-4 h-4 rounded-full bg-primary animate-pulse delay-75"></div>
          <div className="w-4 h-4 rounded-full bg-primary animate-pulse delay-150"></div>
        </div>
        <p className="mt-4 text-base-content/70">Loading profile...</p>
      </div>
    );
  }

  // View
  console.log(
    "Rendering profile - isNgoMember:",
    isNgoMember,
    "ngoMemberData:",
    !!ngoMemberData,
    "ngoInfo:",
    !!ngoInfo,
    "caretakerData:",
    !!caretakerData
  );

  return isNgoMember
    ? ngoMemberData && ngoInfo && (
        <NgoMemberProfile
          userId={userId}
          fetchedNGOMemberData={ngoMemberData}
          fetchedNGOInfo={ngoInfo!}
        />
      )
    : caretakerData && (
        <CaretakerProfile fetchedCaretakerData={caretakerData} />
      );
}
