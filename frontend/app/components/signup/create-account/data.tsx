"use client";

import {useState, FormEvent, useEffect} from "react";
import {IdCard, KeyRoundIcon, Mail} from "lucide-react";
import {useTranslations, useLocale} from "next-intl";
import toast from "react-hot-toast";
import {useAuth} from "@/contexts/AuthContext";
import InputField from "../../ui/validation/inputfield";

type Props = {
  onNext?: () => void;
  selectedTab: "shelter" | "ngo" | "ngoMember";
  inviteToken?: string | null;
};

export default function RegisterData({onNext, selectedTab, inviteToken}: Props) {
  const t = useTranslations("Signup");
  const locale = useLocale();
  const {register, isLoading, error: authErrorKey, token} = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [errors, setErrors] = useState<{
    email: string;
    password: string;
    firstname: string;
    lastname: string;
  }>({email: "", password: "", firstname: "", lastname: ""});
  const [isRegistrationAttempted, setIsRegistrationAttempted] = useState(false);
  const [inviteDetails, setInviteDetails] = useState<{email: string; ngoId: string} | null>(null);
  const [isLoadingInvite, setIsLoadingInvite] = useState(false);

  // Email validation regex pattern
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  // Password validation regex pattern - at least 8 chars, 1 digit, 1 lowercase, 1 uppercase, 1 special char
  const passwordPattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,}$/;

  useEffect(() => {
    const fetchInviteDetails = async () => {
      if (inviteToken) {
        setIsLoadingInvite(true);
        try {
          const response = await fetch(`/api/ngo/invite-details?invite=${encodeURIComponent(inviteToken)}`);
          if (response.ok) {
            const details = await response.json();
            setInviteDetails(details);
            setEmail(details.email);
          } else {
            console.error("Failed to fetch invite details");
            setEmail("");
          }
        } catch (error) {
          console.error("Error fetching invite details:", error);
          setEmail("");
        } finally {
          setIsLoadingInvite(false);
        }
      }
    };

    fetchInviteDetails();
  }, [inviteToken]);

  useEffect(() => {
    if (authErrorKey) {
      if (authErrorKey === "authError.emailExists") {
        setErrors((prevErrors) => ({
          ...prevErrors,
          email: t(authErrorKey),
        }));
      } else if (
        authErrorKey === "authError.networkError" ||
        authErrorKey === "authError.unknownError" ||
        authErrorKey === "authError.invalidResponse"
      ) {
        setErrors({email: "", password: "", firstname: "", lastname: ""}); // Reset all errors for these cases
      }

      toast.error(t(authErrorKey));
    }
  }, [authErrorKey, t]);

  useEffect(() => {
    if (isRegistrationAttempted && !isLoading && !authErrorKey) {
      if (inviteToken && token) {
        verifyInviteToken();
      } else if (onNext) {
        onNext();
      }
      setIsRegistrationAttempted(false);
    } else if (isRegistrationAttempted && !isLoading && authErrorKey) {
      setIsRegistrationAttempted(false);
    }
  }, [isRegistrationAttempted, isLoading, authErrorKey, onNext, inviteToken, token]);

  const verifyInviteToken = async () => {
    try {
      const response = await fetch("/api/verify-invite", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({invite: inviteToken}),
      });

      if (response.ok) {
        toast.success(t("inviteVerifySuccess"));
        if (onNext) {
          onNext();
        }
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || t("inviteVerifyError"));
      }
    } catch (error) {
      console.error("Failed to verify invite:", error);
      toast.error(t("inviteVerifyFailed"));
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    let hasErrors = false;
    const newErrors = {
      email: "",
      firstname: "",
      lastname: "",
      password: "",
    };

    if (!inviteToken) {
      if (email.trim() === "") {
        newErrors.email = t("emailRequired");
        hasErrors = true;
      } else if (!emailPattern.test(email)) {
        newErrors.email = t("invalidEmail");
        hasErrors = true;
      }
    }

    if (password.trim() === "") {
      newErrors.password = t("passwordRequired");
      hasErrors = true;
    } else if (!passwordPattern.test(password)) {
      newErrors.password = t("passwordRequirements");
      hasErrors = true;
    }

    if (firstname.trim() === "") {
      newErrors.firstname = t("firstnameRequired");
      hasErrors = true;
    }

    if (lastname.trim() === "") {
      newErrors.lastname = t("lastnameRequired");
      hasErrors = true;
    }

    setErrors(newErrors);

    if (hasErrors) {
      const missingFields: string[] = [];
      if (newErrors.email) missingFields.push(t("email"));
      if (newErrors.password) missingFields.push(t("password"));
      if (newErrors.firstname) missingFields.push(t("firstname"));
      if (newErrors.lastname) missingFields.push(t("lastname"));

      toast.error(`${t("missingFields")}: ${missingFields.join(", ")}`);
      return;
    }

    setIsRegistrationAttempted(true);
    const isNgoUser = selectedTab === "ngo";
    const redirectPath = selectedTab === "shelter" ? `/${locale}/signup` : "/";
    await register(email, password, firstname, lastname, isNgoUser, redirectPath);
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit} noValidate>
      {inviteToken && (
        <div className="alert alert-info">
          <div className="flex items-center gap-2">
            <Mail className="w-5 h-5" />
            <div>
              <div className="font-semibold">{t("inviteSignup")}</div>
              <div className="text-sm">
                {isLoadingInvite ? (
                  <span className="loading loading-spinner loading-sm"></span>
                ) : inviteDetails ? (
                  t("inviteSignupDescription", {email: inviteDetails.email})
                ) : (
                  t("loadingInviteDetails")
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row w-full gap-3">
        <div className="md:w-1/2">
          <InputField
            name="firstname"
            type="text"
            placeholder={t("firstname")}
            value={firstname}
            onChange={(e) => setFirstname(e.target.value)}
            error={errors.firstname}
            icon={<IdCard className="w-4 min-w-4" />}
          />
        </div>
        <div className="md:w-1/2">
          <InputField
            name="lastname"
            type="text"
            placeholder={t("lastname")}
            value={lastname}
            onChange={(e) => setLastname(e.target.value)}
            error={errors.lastname}
            icon={<IdCard className="w-4 min-w-4" />}
          />
        </div>
      </div>

      <div className="flex flex-col md:flex-row w-full gap-3">
        <div className="md:w-1/2">
          <InputField
            name="email"
            type="email"
            placeholder={t("email")}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={errors.email}
            icon={<Mail className="w-4 min-w-4" />}
            disabled={!!inviteToken}
          />
        </div>

        <div className="md:w-1/2">
          <InputField
            name="password"
            type="password"
            placeholder={t("password")}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={errors.password}
            icon={<KeyRoundIcon className="w-4 min-w-4" />}
          />
        </div>
      </div>

      <div>
        <button type="submit" className="btn btn-secondary w-full mt-2" disabled={isLoading}>
          {isLoading ? <span className="loading loading-spinner"></span> : t("createAccount")}
        </button>
      </div>
    </form>
  );
}
