"use client";

import InputField from "@/app/components/ui/validation/inputfield";
import { FileText, Info } from "lucide-react";
import Button from "@/app/components/ui/button";
import { useTranslations } from "next-intl";
import { useState } from "react";
import AddWebsite from "./add-website";
import { useAuth } from "@/contexts/AuthContext";
import ImageUpload from "../../../ui/image-upload";
import IconHeading from "@/app/components/ui/icon-heading";
import toast from "react-hot-toast";

type Props = {
  onNext: () => void;
};

export default function CreateNGOProfile({ onNext }: Props) {
  const t = useTranslations("CreateNGOProfile");
  const { token } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    memberCount: "",
    country: "",
    phone: "",
    description: "",
    websites: [] as string[],
  });
  const [ngoLogo, setNgoLogo] = useState<File | string | null>(null);
  const [verificationDocument, setVerificationDocument] = useState<File | null>(
    null
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (e.target.name === "verification-document") {
      setVerificationDocument(file || null);
    }
  };

  const saveNgoMemberHours = async () => {
    try {
      const savedSchedule = localStorage.getItem("ngoSignupSchedule");
      if (!savedSchedule) {
        console.log("No schedule found in localStorage");
        return;
      }

      const schedule = JSON.parse(savedSchedule);

      // Convert schedule to hours format expected by backend
      const hours = Object.entries(schedule)
        .filter(([, time]) => {
          const timeSlot = time as {
            from?: string;
            to?: string;
            available?: boolean;
          };
          return timeSlot.from && timeSlot.to && timeSlot.available;
        })
        .map(([weekday, time]) => {
          const timeSlot = time as { from: string; to: string };
          return {
            weekday: weekday.charAt(0).toUpperCase() + weekday.slice(1),
            startTime:
              timeSlot.from.length === 5
                ? `${timeSlot.from}:00`
                : timeSlot.from,
            endTime:
              timeSlot.to.length === 5 ? `${timeSlot.to}:00` : timeSlot.to,
          };
        });

      if (hours.length === 0) {
        console.log("No valid hours to save");
        return;
      }

      const response = await fetch("/api/ngo-member", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          firstName: "",
          lastName: "",
          phoneNumber: "",
          hours: hours,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        console.error("Failed to save NGO member hours:", error);
        toast.error("Failed to save working hours");
      } else {
        console.log("NGO member hours saved successfully");
      }
    } catch (error) {
      console.error("Error saving NGO member hours:", error);
      toast.error("Error saving working hours");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.name.trim()) {
      const msg = t("requiredFieldsMissing", { field: t("name") });
      setError(msg);
      toast.error(msg);
      return;
    }
    if (!formData.email.trim()) {
      const msg = t("requiredFieldsMissing", { field: t("email") });
      setError(msg);
      toast.error(msg);
      return;
    }
    if (!formData.country.trim()) {
      const msg = t("requiredFieldsMissing", { field: t("country") });
      setError(msg);
      toast.error(msg);
      return;
    }

    if (!verificationDocument) {
      const msg = t("verificationDocRequired");
      setError(msg);
      toast.error(msg);
      return;
    }

    setIsSubmitting(true);

    const data = new FormData();
    data.append("name", formData.name);
    data.append("email", formData.email);
    data.append("country", formData.country);
    data.append("phoneNumber", formData.phone);
    data.append("memberCount", formData.memberCount || "0");

    formData.websites.forEach((website) => {
      data.append("website", website);
    });

    data.append("mission", formData.description);
    data.append("verification-document", verificationDocument);
    if (ngoLogo) {
      data.append("ngo-logo", ngoLogo);
    }

    try {
      const headers: HeadersInit = {};
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }

      const response = await fetch(`/api/request-verification`, {
        method: "POST",
        headers: headers,
        body: data,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({
          message: "An unknown error occurred while parsing error response.",
        }));
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      // Save NGO member hours from localStorage
      await saveNgoMemberHours();

      localStorage.removeItem("ngoSignupSchedule");

      onNext();
    } catch (err: unknown) {
      console.error("Failed to create NGO profile:", err);
      if (err instanceof Error) {
        setError(err.message || "Failed to submit the form. Please try again.");
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="card-body">
      <form className="space-y-4" noValidate onSubmit={handleSubmit}>
        <IconHeading icon={<Info />} label={t("generalInfo")} />
        <div className="grid grid-cols-6 gap-2 items-start space-y-2">
          <div className="col-span-6 md:col-span-4 space-y-4 mb-0">
            <InputField
              name="name"
              type="text"
              placeholder={t("name")}
              value={formData.name}
              onChange={handleChange}
            />

            <div className="md:hidden">
              <InputField
                name="memberCount"
                type="number"
                min={0}
                placeholder={t("memberCount")}
                value={formData.memberCount}
                onChange={handleChange}
              />
            </div>
            <div className="md:flex hidden gap-2">
              <div className="flex-grow">
                <InputField
                  name="email"
                  type="text"
                  placeholder={t("email")}
                  info={t("emailInfo")}
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              <div className="w-fit max-w-30">
                <InputField
                  name="memberCount"
                  type="number"
                  min={0}
                  placeholder={t("memberCount")}
                  value={formData.memberCount}
                  onChange={handleChange}
                />
              </div>
            </div>
            <InputField
              name="country"
              type="text"
              placeholder={t("country")}
              value={formData.country}
              onChange={handleChange}
            />
          </div>

          <div className="col-span-6 md:col-span-2">
            <ImageUpload
              value={ngoLogo}
              onChange={(file: File | string | null) => setNgoLogo(file)}
              size="lg"
              notBlurry
            />
          </div>

          <div className="col-span-6 md:col-span-2">
            <InputField
              name="phone"
              type="text"
              placeholder={t("phone")}
              value={formData.phone}
              onChange={handleChange}
            />
          </div>

          <div className="col-span-6 md:col-span-4">
            <AddWebsite
              websites={formData.websites}
              setWebsites={(sites) =>
                setFormData((prev) => ({ ...prev, websites: sites }))
              }
            />
          </div>

          <div className="col-span-6 md:col-span-6">
            <textarea
              className="textarea w-full"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder={t("description")}
              rows={4}
            />
          </div>
        </div>

        <div className="flex items-center gap-2 mt-6">
          <IconHeading icon={<FileText />} label={t("verification")} />
          <div
            className="tooltip md:tooltip-right mb-3"
            data-tip={t("verificationInfo")}
          >
            <Info className="text-primary cursor-pointer" size={20} />
          </div>
        </div>
        <input
          accept=".pdf"
          type="file"
          name="verification-document"
          onChange={handleFileChange}
          className="file-input file-input-bordered file-input-primary w-full"
          required
        />

        {/* {error && (
          <p className="text-sm text-error mt-2 text-center">{error}</p>
        )} */}

        <div className="mt-3 text-center">
          <Button
            type="submit"
            label={t("create")}
            color="secondary"
            fullwidth
            disabled={isSubmitting}
          />
        </div>
      </form>
    </div>
  );
}
