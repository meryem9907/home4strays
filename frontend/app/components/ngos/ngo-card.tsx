"use client";

import { CircleCheck, CircleX, MapPin, UserRound } from "lucide-react";
import Card from "../ui/card/card";
import { NGO } from "../../types/ngo";

interface NGOProps {
  ngo: NGO;
  locale: string;
}

export default function NGOCard({ ngo, locale }: NGOProps) {
  let verificationIcon;

  if (ngo.verified) {
    verificationIcon = <CircleCheck size={16} />;
  } else {
    verificationIcon = <CircleX size={16} />;
  }

  const ngoImages = [];
  if (ngo.logo && ngo.logo.trim() !== "") {
    try {
      if (ngo.logo.startsWith("http") || ngo.logo.startsWith("/")) {
        ngoImages.push(ngo.logo);
      } else {
        ngoImages.push(`/${ngo.logo}`);
      }
    } catch {
      // Invalid URL, use fallback
    }
  }

  // Use fallback if no valid images found
  if (ngoImages.length === 0) {
    ngoImages.push("/logo.png");
  }

  return (
    <Card
      href={`/${locale}/ngos/${ngo.id}`}
      image={ngoImages}
      title={ngo.name}
      description={ngo.mission || "No mission statement available."}
      tags={[
        { icon: <MapPin size={16} />, label: ngo.country },
        {
          icon: <UserRound size={16} />,
          label: `${ngo.membercount} ${
            ngo.membercount > 1 ? "Members" : "Member"
          }`,
        },
      ]}
      badge={{
        icon: verificationIcon,
        label: ngo.verified ? "verified" : "not verified yet",
        color: ngo.verified ? "success" : "error",
        soft: true,
      }}
      websites={ngo.websites}
    />
  );
}
