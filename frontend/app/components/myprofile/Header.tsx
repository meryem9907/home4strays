import { Award, Cake, Heart, User } from "lucide-react";
import { useTranslations } from "next-intl";
import Badge from "../ui/badge";
import Image from "next/image";
import ImageUpload from "../ui/image-upload";
import InputField from "../ui/inputfield";
import { Caretaker } from "@/app/types/backend/caretaker";
import { NGOMember } from "@/app/types/backend/ngoMember";

interface Props {
  data: Caretaker | NGOMember; 
  isCaretakerData?: boolean;
  isEditing: boolean;
  age?: number;
  onInputChange: (key: keyof Caretaker, value: string | boolean | File | null) => void;
}

export default function Header({ data, isCaretakerData = false, isEditing, age, onInputChange }: Props) {
  const t = useTranslations("CaretakerProfile");
  
  return (
    <div className="bg-base-100 rounded-2xl shadow-xl mb-8 overflow-hidden border border-neutral">
      <div className="p-8">
        <div className="flex flex-col lg:flex-row items-center gap-8">
          {isEditing ? (
            <> 
              <ImageUpload
                value={data.profilePictureLink ?? null}
                onChange={(image) => onInputChange?.("profilePictureLink", image)}
                notBlurry 
              />

              <div className="flex text-center lg:text-left flex-1 space-x-2">
                <InputField 
                  type="text"
                  label={t("firstname")}
                  value={data.firstName}
                  onChange={(value) => onInputChange?.("firstName", value.target.value)}
                  maxLength={255}
                />
                <InputField 
                  type="text"
                  label={t("lastname")}
                  value={data.lastName}
                  onChange={(value) => onInputChange?.("lastName", value.target.value)}
                  maxLength={255}
                />
              </div>
            </>
          ) : (
            <>
              <div className="w-32 h-32 rounded-full bg-base-100 backdrop-blur-sm border-4 border-neutral flex items-center justify-center overflow-hidden">
                {data.profilePictureLink ? (
                  <Image src={data.profilePictureLink} width={400} height={400} alt="Profilbild" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-16 h-16 text-neutral" />
                )}
              </div>
            

              <div className="text-center lg:text-left flex-1 space-y-4">
                <h1 className="text-3xl font-bold">
                  {data.firstName} {data.lastName}
                </h1>
                {isCaretakerData && (
                  <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
                    <Badge 
                      icon={<Award size={18} />} 
                      label={'experience' in data ? data.experience : 'N/A'} 
                      size="xl" 
                      rounded 
                      color="primary" 
                      soft 
                    />
                    <Badge 
                      icon={<Cake size={18} />} 
                      label={`${age} ${t("years")}`} 
                      size="xl" 
                      rounded 
                      color="secondary" 
                      soft 
                    />
                    <Badge 
                      icon={<Heart size={18} />} 
                      label={
                        'adoptionWillingness' in data
                          ? t(data.adoptionWillingness ? "adoptionWillingness.true" : "adoptionWillingness.false")
                          : t("adoptionWillingness.unknown")
                      } 
                      size="xl" 
                      rounded 
                      color={
                        'adoptionWillingness' in data
                          ? data.adoptionWillingness
                            ? "success"
                            : "error"
                          : "secondary"
                      } 
                      soft 
                    />
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
