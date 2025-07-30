import { AlertCircle, Info } from "lucide-react";
import { useTranslations } from "next-intl";

export default function WaitForVerification() {

  const t = useTranslations("WaitForVerification");

  // TODO: Replace with real data
  const mock = {
    name: "Tierschutzverein Augsburg e.V."
  }

  return (
    <div className="flex flex-col items-center justify-center text-center p-4 space-y-6">
      <div className="bg-accent rounded-full p-4 shadow-md">
        <AlertCircle className="w-10 h-10 text-primary" />
      </div>

      <h1 className="text-xl md:text-3xl font-bold text-primary">
        {mock.name} {t("title")}
      </h1>

      <p className="max-w-2xl">
        { t("text") }
      </p>

      <div className="mt-4">
        <span className="loading loading-bars loading-lg text-secondary"></span>
      </div>

      <div role="alert" className="alert p-4">
        <Info className="text-info"/>
        <p>
          { t("info") }
        </p>
      </div>
    </div>
  );
}
