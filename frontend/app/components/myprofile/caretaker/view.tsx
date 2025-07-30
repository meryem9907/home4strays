"use client";

import React, { useEffect, useState } from "react";
import SummaryCards from "./SummaryCards";
import LivingSituation from "./LivingSituation";
import ExperienceSection from "./Experience";
import Contact from "../Contact";
import PersonalInfo from "./PersonalInfo";
import Hours from "../Hours";
import Header from "../Header";
import EditSaveBar from "../../ui/editSaveBar";
import { CareTime, initialSchedule } from "../../ui/schedule";
import { CTHours } from "@/app/types/ngoMember";
import toast from "react-hot-toast";
import { useTranslations } from "next-intl";
import { Caretaker } from "@/app/types/backend/caretaker";

export function appendSeconds(time: string): string {
  return time.length === 5 ? `${time}:00` : time;
}

function isFile(value: unknown): value is File {
  return value instanceof File;
}

interface CaretakerProfileProps {
  fetchedCaretakerData: Caretaker;
}
export default function CaretakerProfile({
  fetchedCaretakerData,
}: CaretakerProfileProps) {
  const t = useTranslations("DeleteAccount");

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [caretakerData, setCaretakerData] =
    useState<Caretaker>(fetchedCaretakerData);

  const [originalCaretakerData, setOriginalCaretakerData] =
    useState<Caretaker | null>(null);
  const [schedule, setSchedule] =
    useState<Record<string, CareTime>>(initialSchedule);

  useEffect(() => {
    const updatedSchedule: Record<string, CareTime> = { ...initialSchedule };

    caretakerData.ctHours.forEach((hour) => {
      const dayKey = hour.weekday.toLowerCase();
      if (updatedSchedule[dayKey]) {
        updatedSchedule[dayKey] = {
          from: hour.startTime,
          to: hour.endTime,
          allDay: false,
          available: true,
        };
      }
    });

    setSchedule(updatedSchedule);
  }, [caretakerData.ctHours]);

  function handleInputChange<K extends keyof Caretaker>(
    key: K,
    value: Caretaker[K] | File | CTHours | null
  ) {
    setCaretakerData((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  const saveChanges = async () => {
    const updatedCtHours = Object.entries(schedule)
      .filter(([, time]) => time.from && time.to)
      .map(([weekday, time]) => ({
        weekday: weekday.charAt(0).toUpperCase() + weekday.slice(1),
        startTime: appendSeconds(time.from),
        endTime: appendSeconds(time.to),
      }));

    const updatedData = {
      ...caretakerData,
      ctHours: updatedCtHours,
    };

    setCaretakerData(updatedData);

    const token = localStorage.getItem("authToken");
    if (!token) {
      toast.error("Kein Authentifizierungs-Token gefunden.");
      return;
    }

    try {
      const response = await fetch("/api/caretaker", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: caretakerData.firstName,
          lastName: caretakerData.lastName,
          email: caretakerData.email,
          phoneNumber: caretakerData.phoneNumber,
          profilePictureLink: caretakerData.profilePictureLink,
          maritalStatus: caretakerData.maritalStatus,
          birthdate: caretakerData.birthdate,
          numberKids: caretakerData.numberKids,
          streetName: caretakerData.streetName,
          houseNumber: caretakerData.houseNumber,
          cityName: caretakerData.cityName,
          zip: caretakerData.zip,
          country: caretakerData.country,
          localityType: caretakerData.localityType,
          space: caretakerData.space,
          floor: caretakerData.floor,
          garden: caretakerData.garden,
          residence: caretakerData.residence,
          tenure: caretakerData.tenure,
          financialAssistance: caretakerData.financialAssistance,
          employmentType: caretakerData.employmentType,
          previousAdoption: caretakerData.previousAdoption,
          holidayCare: caretakerData.holidayCare,
          adoptionWillingness: caretakerData.adoptionWillingness,
          experience: caretakerData.experience,
          ctHours: updatedCtHours,
        }),
      });

      if (response.ok) {
        toast.success("Profil erfolgreich gespeichert.");
        setOriginalCaretakerData(updatedData);
        setIsEditing(false);
      } else {
        const error = await response.json();
        console.error("Fehler beim Speichern:", error);
        toast.error("Fehler beim Speichern des Profils.");
      }
    } catch (err) {
      console.error("Fehler beim API-Aufruf:", err);
      toast.error("Serverfehler beim Speichern.");
    }

    // Update Picture
    if (
      caretakerData.profilePictureLink &&
      isFile(caretakerData.profilePictureLink)
    ) {
      try {
        const pictureFormData = new FormData();
        pictureFormData.append(
          "user-profile-picture",
          caretakerData.profilePictureLink
        );

        const uploadRes = await fetch("/api/user/picture", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: pictureFormData,
        });

        if (uploadRes.ok) {
          const result = await uploadRes.json();
          caretakerData.profilePictureLink = result.profilePictureLink;
          toast.success("Profilbild erfolgreich hochgeladen.");
        } else {
          const error = await uploadRes.json();
          console.error("Fehler beim Bild-Upload:", error);
          toast.error("Bild konnte nicht hochgeladen werden.");
          return;
        }
      } catch (uploadErr) {
        console.error("Fehler beim Bild-Upload:", uploadErr);
        toast.error("Fehler beim Bild-Upload.");
        return;
      }
    }
  };

  const deleteAccount = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      console.log(t("auth.noTokenFound"));
      return;
    }

    try {
      const response = await fetch("/api/caretaker", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        toast.success(t("account.deleteSuccess", { duration: 5000 }));
        localStorage.removeItem("authToken");
        window.location.href = "/";
      } else {
        const errorData = await response.json();
        console.error(t("account.deleteErrorLog"), errorData);
        toast.error(t("account.deleteError"));
      }
    } catch (error) {
      console.error(t("account.deleteExceptionLog"), error);
      alert(t("account.deleteAlert"));
      toast.error(t("account.deleteError"));
    }
  };

  const startEditing = () => {
    setOriginalCaretakerData({ ...caretakerData });
    setIsEditing(true);
  };

  const cancelEditing = (): void => {
    if (!originalCaretakerData) return;
    setCaretakerData({ ...originalCaretakerData });

    const updatedSchedule: Record<string, CareTime> = { ...initialSchedule };
    originalCaretakerData.ctHours.forEach((hour) => {
      const dayKey = hour.weekday.toLowerCase();
      if (updatedSchedule[dayKey]) {
        updatedSchedule[dayKey] = {
          from: hour.startTime,
          to: hour.endTime,
          allDay: false,
          available: true,
        };
      }
    });

    setSchedule(updatedSchedule);
    setIsEditing(false);
  };

  const calculateAge = (birthdate: string) => {
    const today = new Date();
    const birth = new Date(birthdate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birth.getDate())
    ) {
      age--;
    }
    return age;
  };

  return (
    <div className="min-h-full py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-end gap-4 mb-6">
          <EditSaveBar
            isEditing={isEditing}
            onEditClick={startEditing}
            onCancelClick={cancelEditing}
            onSaveClick={saveChanges}
            onDeleteClick={deleteAccount}
          />
        </div>

        <Header
          data={caretakerData}
          isCaretakerData
          isEditing={isEditing}
          age={calculateAge(caretakerData.birthdate)}
          onInputChange={handleInputChange}
        />

        {!isEditing && <SummaryCards caretakerData={caretakerData} />}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 space-y-8">
            <LivingSituation
              caretakerData={caretakerData}
              isEditing={isEditing}
              onInputChange={handleInputChange}
            />
            <ExperienceSection
              caretakerData={caretakerData}
              isEditing={isEditing}
              onInputChange={handleInputChange}
            />
          </div>

          <div className="lg:col-span-5 space-y-6">
            <Contact
              data={caretakerData}
              isEditing={isEditing}
              handleChange={(key, value) =>
                setCaretakerData((prev) => ({ ...prev, [key]: value }))
              }
            />
            <PersonalInfo
              caretakerData={caretakerData}
              age={calculateAge(caretakerData.birthdate)}
              isEditing={isEditing}
              onInputChange={handleInputChange}
            />
            <Hours
              isEditing={isEditing}
              schedule={schedule}
              setSchedule={setSchedule}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
