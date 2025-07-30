'use client'
import React, { useState } from "react";

import { useTranslations } from "next-intl";
import AboutUsCard from "@/app/components/aboutUs/aboutUsCard";
import Modal from "@/app/components/aboutUs/modal";
export default function TeamCard() {
  const [openModal, setOpenModal] = useState<string | null>(null);
  const t = useTranslations("aboutUs");
  return (
    <div className="md:flex h-full justify-center items-center space-y-4 md:gap-10 w-full md:w-auto px-8 pt-8 overflow-y-auto">
      <AboutUsCard 
        title={t("Our Team", {defaultMessage: "Our Team"})}
        onClick={() => setOpenModal('Our Team')}
        image={{src:"/AboutUs/team.png", alt:"About Us"}}
      />

      <AboutUsCard
        title={t("Our Mission", {defaultMessage: "Our Mission"})}
        onClick={() => setOpenModal('Our Mission')}
        image={{src:"/AboutUs/mission.png", alt:"Our Mission"}}
      />

      <AboutUsCard
        title={t("Future plans", {defaultMessage: "Future plans"})}
        onClick={() => setOpenModal('Our future plans')}
        image={{src:"/AboutUs/future2.png", alt:"Future plans"}}
      />

      {/* Modal for Team */}
      <Modal
        isOpen={openModal === 'Our Team'}
        onClose={() => setOpenModal(null)} 
        title={t("Our Team", {defaultMessage: "Our Team"})}
        text={t("TeamText", {defaultMessage:"TeamText"})}
      />
        {/* Modal for Mission */}
      <Modal
        isOpen={openModal === 'Our Mission'}
        onClose={() => setOpenModal(null)}
        title={t("Our Mission", {defaultMessage: "Our Mission"})}
        text={t("MissionText", {defaultMessage:"MissionText"})}
      />
      {/* Modal for Future Plans */}
      <Modal
        isOpen={openModal === 'Our future plans'}
        onClose={() => setOpenModal(null)}
        title={t("Future plans", {defaultMessage: "Future plans"})}
        text={t("FutureText", {defaultMessage:"FutureText"})}
      />
    </div>
  );
}