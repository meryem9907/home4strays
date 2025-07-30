
import { Link } from "@/i18n/routing";
import Tabs from "../../ui/tabs";
import RegisterData from "./data";
import {useTranslations} from "next-intl";

type Props = {
  selectedTab: "shelter" | "ngo" | "ngoMember";
  onChange: (tab: "shelter" | "ngo" | "ngoMember") => void;
  onNext: () => void;
  inviteToken?: string | null;
};

export default function SignUpView({selectedTab, onChange, onNext, inviteToken}: Props) {
  const t = useTranslations("Signup");

  return (
    <div className="card-body">
      <Tabs<"shelter" | "ngo" | "ngoMember"> tabs={["shelter", "ngo", "ngoMember"]} selectedTab={selectedTab} onChange={onChange} t={t} />

      <RegisterData onNext={onNext} selectedTab={selectedTab} inviteToken={inviteToken} />

      <div className="text-center mt-4">
        <p>
          {t("haveAccount")}{" "}
          <Link href="/login" className="link link-secondary font-medium">
            {t("signIn")}
          </Link>
        </p>
      </div>
    </div>
  );
}
