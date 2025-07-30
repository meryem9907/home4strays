"use client";

import {useState, FormEvent, useEffect} from "react";
import {Link} from "../../../i18n/routing";
import {KeyRoundIcon, Mail} from "lucide-react";
import {useTranslations} from "next-intl";
import {useAuth} from "../../../contexts/AuthContext";
import toast from "react-hot-toast";
import Box from "@/app/components/ui/box";
import InputField from "@/app/components/ui/validation/inputfield";

export default function Login() {
  const t = useTranslations("Login");
  const {login, isLoading, error: authErrorKey} = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{email: string; password: string}>({email: "", password: ""});

  // Email validation regex pattern
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  useEffect(() => {
    if (authErrorKey) {
      if (authErrorKey === "authError.invalidCredentials") {
        setErrors({
          email: " ",
          password: " ",
        });
      } else if (
        authErrorKey === "authError.networkError" ||
        authErrorKey === "authError.unknownError" ||
        authErrorKey === "authError.invalidResponse"
      ) {
        setErrors({email: "", password: ""});
      } else if (authErrorKey === "authError.emailExists") {
        setErrors({
          email: " ",
          password: "",
        });
      }

      toast.error(t(authErrorKey));
    }
  }, [authErrorKey, t]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    let hasErrors = false;
    const newErrors = {
      email: "",
      password: "",
    };

    if (email.trim() === "") {
      newErrors.email = t("emailRequired");
      hasErrors = true;
    } else if (!emailPattern.test(email)) {
      newErrors.email = t("invalidEmail");
      hasErrors = true;
    }

    if (password.trim() === "") {
      newErrors.password = t("passwordRequired");
      hasErrors = true;
    }

    setErrors(newErrors);

    if (hasErrors) {
      if (newErrors.email && newErrors.password) {
        toast.error(t("bothFieldsRequired"));
      } else if (newErrors.email) {
        toast.error(newErrors.email);
      } else if (newErrors.password) {
        toast.error(t("passwordRequired"));
      }
      return;
    }

    await login(email, password);
  };

  return (
    <Box size="sm">
      <div className="card-body">
        <p className="card-title justify-center text-3xl text-primary font-bold pb-5">{t("title")}</p>
        <form className="space-y-4" onSubmit={handleSubmit} noValidate>
          <InputField
            name="email"
            type="email"
            placeholder={t("email")}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={errors.email}
            icon={<Mail className="w-4 min-w-4" />}
          />

          <InputField
            name="password"
            type="password"
            placeholder={t("password")}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={errors.password}
            icon={<KeyRoundIcon className="w-4 min-w-4" />}
          />

          <div className="text-right">
            <Link href="#" className="link link-secondary link-hover">
              {t("forgotPassword")}
            </Link>
          </div>

          <div>
            <button type="submit" className="btn btn-secondary w-full" disabled={isLoading}>
              {isLoading ? <span className="loading loading-spinner"></span> : t("signIn")}
            </button>
          </div>
        </form>

        <div className="text-center mt-4">
          <p>
            {t("newUser")}{" "}
            <Link href="/signup" className="link link-secondary font-medium">
              {t("createAccount")}
            </Link>
          </p>
        </div>
      </div>
    </Box>
  );
}
