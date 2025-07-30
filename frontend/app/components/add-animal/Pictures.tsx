import { Camera, Trash2, UploadCloud } from "lucide-react";
import Box from "../ui/box";
import { ChangeEvent, RefObject } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";

interface PreviewImage {
  url: string;
  name: string;
}

interface UploadPicturesProps {
  previewImages: PreviewImage[];
  fileInputRef: RefObject<HTMLInputElement | null>;
  handleImageUpload: (e: ChangeEvent<HTMLInputElement>) => void;
  removeImage: (index: number) => void;
  triggerFileInput: () => void;
}

export default function UploadPictures({
  previewImages,
  fileInputRef,
  handleImageUpload,
  removeImage,
  triggerFileInput,
}: UploadPicturesProps) {
  const t = useTranslations("AddAnimal");

  return (
    <Box size="full">
      <h2 className="text-xl font-semibold mb-4 flex items-center">
        <Camera size={20} className="mr-2 text-secondary" />
        {t("Pictures.title")}
      </h2>

      <input
        type="file"
        multiple
        accept="image/*"
        className="hidden"
        ref={fileInputRef}
        onChange={handleImageUpload}
      />
      <div
        className="border-2 border-dashed border-base-300 rounded-box p-6 text-center hover:border-primary cursor-pointer"
        onClick={triggerFileInput}
      >
        <UploadCloud className="mx-auto mb-2 w-12 h-12 text-base-content/70" />
        <p className="text-sm">{t("Pictures.dragDropUpload")}</p>
        <p className="text-xs text-base-content/60 mt-1">
          {t("Pictures.supportedFormats")}
        </p>
      </div>

      {previewImages.length > 0 && (
        <div className="mt-6">
          <p className="text-sm font-medium mb-3">
            {t("Pictures.uploadedPictures", { count: previewImages.length })}
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {previewImages.map((image, index) => (
              <div key={index} className="relative group">
                <div className="relative aspect-square rounded-lg overflow-hidden bg-base-200">
                  <Image
                    src={image.url}
                    alt={image.name}
                    layout="fill"
                    objectFit="cover"
                    className="w-full h-full"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="btn btn-circle btn-sm btn-error absolute -top-2 -right-2 md:opacity-0 md:group-hover:opacity-100 md:transition-opacity"
                >
                  <Trash2 size={16} />
                </button>
                <p className="text-xs mt-1 truncate">{image.name}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </Box>
  );
}
