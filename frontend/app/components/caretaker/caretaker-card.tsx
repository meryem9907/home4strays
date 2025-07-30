"use client";
import Card from "../ui/card/card";
import {Baby, BookOpenText, Cake, CircleCheck, CircleX, Earth, MapPin} from "lucide-react";
import {useTranslations} from "next-intl";
import {Caretaker} from "@/app/types/caretaker";

interface CareTakerProps {
  caretaker: Caretaker;
  locale: string;
  id: string;
}

export default function CareTakerCard({caretaker, locale, id}: CareTakerProps) {
  const t = useTranslations("Caretaker");

  const getAge = () => {
    const today = new Date();
    const birthDate = new Date(caretaker.birthdate);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  let adoptingIcon;

  if (caretaker.adoptionWillingness) {
    adoptingIcon = <CircleCheck size={16} className="text-success" />;
  } else {
    adoptingIcon = <CircleX size={16} className="text-error" />;
  }

  return (
    <Card
      href={`/${locale}/caretaker/${id}`}
      image={[caretaker.profilePictureLink ?? ""]}
      title={caretaker.firstName + " " + caretaker.lastName}
      // button={<Button icon={<Handshake size={20}/>} label="Match" color="primary" soft size="md" rounded onClick={(e) => e.stopPropagation()} />}
      tags={[
        {icon: <Cake size={16} />, label: getAge().toString() + " " + t("years")},
        {icon: <Earth size={16} />, label: caretaker.country},
        {icon: <MapPin size={16} />, label: caretaker.cityName},
        {icon: <BookOpenText size={16} />, label: caretaker.experience},
        {icon: <Baby size={16} />, label: caretaker.numberKids.toString() + " " + t("kids")},
      ]}
      badge={{
        icon: adoptingIcon,
        label: caretaker.adoptionWillingness ? t("adoption") : t("no adoption"),
        color: caretaker.adoptionWillingness ? "success" : "error",
        soft: true,
      }}
      progress={caretaker.score}
    />
  );
}
