"use client";

import {Calendar, Phone, User} from "lucide-react";
import IconHeading from "@/app/components/ui/icon-heading";
import {useTranslations} from "next-intl";
import InputField from "../../ui/inputfield";
import ImageUpload from "../../ui/image-upload";
import ScheduleEditor, {CareTime, initialSchedule} from "../../ui/schedule";
import Button from "../../ui/button";
import {useState, useEffect} from "react";
import {useAuth} from "@/contexts/AuthContext";
import {useRouter} from "next/navigation";
import toast from "react-hot-toast";

interface AddNgoMemberInfoProps {
  inviteToken: string | null;
  onNext?: () => void;
}

export default function AddNgoMemberInfo({inviteToken, onNext}: AddNgoMemberInfoProps) {
  const t = useTranslations("CreateNGOMemberProfile");
  const {token, user} = useAuth();
  const router = useRouter();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [schedule, setSchedule] = useState<Record<string, CareTime>>(initialSchedule);
  const [image, setImage] = useState<File | string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      setFirstName(user.firstName || "");
      setLastName(user.lastName || "");
    }

    const savedSchedule = localStorage.getItem("ngoSignupSchedule");
    if (savedSchedule) {
      try {
        setSchedule(JSON.parse(savedSchedule));
      } catch (error) {
        console.error("Error parsing saved schedule:", error);
      }
    }
  }, [user]);

  const uploadProfilePicture = async (): Promise<string | null> => {
    if (!image || typeof image === "string") return null;

    try {
      const formData = new FormData();
      formData.append("user-profile-picture", image);

      const response = await fetch("/api/user/picture", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        return data.profilePictureLink;
      } else {
        console.error("Failed to upload profile picture");
        return null;
      }
    } catch (error) {
      console.error("Error uploading profile picture:", error);
      return null;
    }
  };

  const saveUserBasicInfo = async (): Promise<boolean> => {
    try {
      const response = await fetch("/api/user/basic-info", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          firstName: firstName.trim() || undefined,
          lastName: lastName.trim() || undefined,
          phoneNumber: phone.trim() || null,
        }),
      });

      if (response.ok) {
        return true;
      } else {
        const error = await response.json();
        console.error("Failed to save user basic info:", error);
        return false;
      }
    } catch (error) {
      console.error("Error saving user basic info:", error);
      return false;
    }
  };

  const handleSubmit = async () => {
    if (!inviteToken && onNext) {
      setIsSubmitting(true);

      try {
        if (image) {
          const pictureUploadResult = await uploadProfilePicture();
          if (!pictureUploadResult) {
            toast.error("Failed to upload profile picture");
          }
        }

        const basicInfoSaved = await saveUserBasicInfo();
        if (!basicInfoSaved) {
          toast.error("Failed to save user information");
          return;
        }

        localStorage.setItem("ngoSignupSchedule", JSON.stringify(schedule));

        toast.success("Information saved successfully!");
        onNext();
      } catch (error) {
        console.error("Error during submission:", error);
        toast.error("Failed to save information");
      } finally {
        setIsSubmitting(false);
      }
      return;
    }

    if (!token || !inviteToken) return;

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/verify-invite", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({token: inviteToken}),
      });

      if (response.ok) {
        toast.success(t("inviteSuccess"));
        router.push("/");
      } else {
        const error = await response.json();
        toast.error(error.message || t("inviteError"));
      }
    } catch {
      toast.error(t("inviteError"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <IconHeading icon={<User />} label={t("personalInfo")} />
      <div className="flex flex-col lg:flex-row gap-4 mb-0 mt-6">
        <div className="flex-1 space-y-4">
          <div className="flex items-center gap-4">
            <ImageUpload value={image} onChange={setImage} notBlurry />
            <div className="flex-1 space-y-4">
              <InputField name="firstName" type="text" placeholder="First Name" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
              <InputField name="lastName" type="text" placeholder="Last Name" value={lastName} onChange={(e) => setLastName(e.target.value)} />
              <InputField
                icon={<Phone size={20} />}
                name="phone"
                type="text"
                placeholder={t("phone")}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <IconHeading icon={<Calendar />} label={t("availability")} />
        <ScheduleEditor schedule={schedule} setSchedule={setSchedule} />
      </div>

      <div className="mt-6 text-center">
        <Button label={t("submit")} color="secondary" fullwidth disabled={isSubmitting || (!inviteToken && !onNext)} onClick={handleSubmit} />
      </div>
    </div>
  );
}
