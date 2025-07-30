"use client";
import { useEffect, useState } from "react";
import Contact from "@/app/components/myprofile/Contact";
import Hours from "@/app/components/myprofile/Hours";
import { NGOInfo } from "../../animals/NGOInfo";
import { CareTime, initialSchedule } from "../../ui/schedule";
import EditSaveBar from "../../ui/editSaveBar";
import { useTranslations } from "next-intl";
import toast from "react-hot-toast";
import { appendSeconds } from "../caretaker/view";
import { NGOMember } from "@/app/types/backend/ngoMember";
import Header from "../Header";
import { NGOInformation } from "@/app/types/backend/ngoInfo";

function isFile(value: unknown): value is File {
  return value instanceof File;
}

interface NgoMemberProfileProps {
  userId: string;
  fetchedNGOMemberData: NGOMember;
  fetchedNGOInfo: NGOInformation;
}

export default function NgoMemberProfile({
  userId,
  fetchedNGOMemberData,
  fetchedNGOInfo,
}: NgoMemberProfileProps) {
  const t = useTranslations("DeleteAccount");

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<NGOMember>(fetchedNGOMemberData);
  const [ngoInfo] = useState<NGOInformation>(fetchedNGOInfo);

  const [originalData, setOriginalData] = useState<NGOMember>(formData);
  const [schedule, setSchedule] =
    useState<Record<string, CareTime>>(initialSchedule);

  useEffect(() => {
    const updatedSchedule: Record<string, CareTime> = { ...initialSchedule };

    formData.ngoMemberHours?.forEach((hour) => {
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
  }, [formData.ngoMemberHours]);

  const saveChanges = async () => {
    const updatedHours = Object.entries(schedule)
      .filter(([, time]) => time.from && time.to)
      .map(([weekday, time]) => ({
        weekday: weekday.charAt(0).toUpperCase() + weekday.slice(1),
        startTime: appendSeconds(time.from),
        endTime: appendSeconds(time.to),
      }));

    const updatedData = {
      ...formData,
      ngoMemberHours: updatedHours,
    };

    setFormData(updatedData);

    const token = localStorage.getItem("authToken");
    if (!token) {
      toast.error("Kein Authentifizierungs-Token gefunden.");
      return;
    }
    // Update Data (without Picture)
    try {
      const response = await fetch(`/api/ngo-member`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          phoneNumber: formData.phoneNumber,
          hours: updatedHours,
        }),
      });

      if (response.ok) {
        toast.success("Profil erfolgreich gespeichert.");
        setOriginalData(updatedData);
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
    if (formData.profilePictureLink && isFile(formData.profilePictureLink)) {
      try {
        const pictureFormData = new FormData();
        pictureFormData.append(
          "user-profile-picture",
          formData.profilePictureLink
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
          formData.profilePictureLink = result.profilePictureLink;
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
      const response = await fetch(`/api/ngo-member?userId=${userId}`, {
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

  // const mockNGO = {
  //   name: "Tierschutzverein Augsburg und Umgebung e.V.",
  //   logo: "https://placehold.co/400x400/4F6C3F/FFFFFF.png?text=TSV&font=montserrat",
  //   location: "86343 Königsbrunn",
  //   country: "Germany",
  // };

  const startEditing = () => {
    setOriginalData({ ...formData });
    setIsEditing(true);
  };

  const cancelEditing = (): void => {
    if (!originalData) return;
    setFormData({ ...originalData });

    const updatedSchedule: Record<string, CareTime> = { ...initialSchedule };
    originalData.ngoMemberHours?.forEach((hour) => {
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

  return (
    <div className="min-h-full py-8 px-4">
      <div className="max-w-6xl mx-auto">
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
          data={formData}
          isEditing={isEditing}
          onInputChange={(key, value) =>
            setFormData((prev) => ({ ...prev, [key]: value }))
          }
        />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 space-y-8">
            <NGOInfo
              name={ngoInfo.name}
              logo={ngoInfo.logo ?? ""}
              email={ngoInfo.email}
              country={ngoInfo.country}
              websites={ngoInfo.websites}
            />

            <Hours
              isEditing={isEditing}
              schedule={schedule}
              setSchedule={setSchedule}
            />
          </div>

          <div className="lg:col-span-5 space-y-6">
            <Contact
              data={formData}
              isEditing={isEditing}
              handleChange={(key, value) =>
                setFormData((prev) => ({ ...prev, [key]: value }))
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}
