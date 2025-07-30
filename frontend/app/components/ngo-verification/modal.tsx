import { useEffect, useRef } from "react";
import Link from "next/link";
import { NGO, BackendNGO } from "../../types/ngo";
import { FileText, Phone, Mail, CircleX, User, Earth } from "lucide-react"; // Icons importieren
import Button from "../ui/button";
import { getWebsiteIcon } from "../ui/card/functions";
import { useTranslations } from "next-intl";
import Image from "next/image";

interface ModalProps {
  id: string;
  ngo: NGO | BackendNGO;
}

function isBackendNGO(ngo: NGO | BackendNGO): ngo is BackendNGO {
  return "verificationDocumentLink" in ngo;
}

export default function Modal({ id, ngo }: ModalProps) {
  const t = useTranslations("NGO-Validation");

  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dialogRef.current &&
        event.target instanceof Node &&
        !dialogRef.current.querySelector(".modal-box")?.contains(event.target)
      ) {
        dialogRef.current.close();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const backendNgo = isBackendNGO(ngo);
  const logoSrc = backendNgo ? ngo.logoPictureLink : ngo.logo;
  const phoneNumber = backendNgo ? ngo.phoneNumber : ngo.phone;
  const websites = backendNgo ? ngo.website || [] : ngo.websites || [];
  const verificationDoc = backendNgo
    ? ngo.verificationDocumentLink
    : ngo.verificationDoc;
  const memberEmail = backendNgo
    ? ngo.email
    : ngo.member && ngo.member[0]
    ? ngo.member[0].email
    : ngo.email;

  return (
    <dialog
      ref={dialogRef}
      id={id}
      className="modal font-normal text-left text-md max-h-full"
    >
      <div className="modal-box max-w-3xl rounded-3xl">
        {/* Closing Button */}
        <form method="dialog" className="absolute right-2 top-2">
          <Button icon={<CircleX />} color="ghost" />
        </form>

        <h3 className="font-bold text-2xl text-center my-4">{ngo.name}</h3>

        {/* Logo */}
        {logoSrc && (
          <div className="flex justify-center mb-6">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-accent">
              <figure className="object-cover w-full h-full">
                <Image src={logoSrc} height={200} width={200} alt={ngo.name} />
              </figure>
            </div>
          </div>
        )}

        {/* Verifikation document */}
        {verificationDoc && (
          <div className="flex items-center mb-4">
            <FileText className="mr-3 text-gray-500" size={20} />
            <Link
              href={verificationDoc}
              className="text-blue-600 hover:text-blue-800 underline"
              target="_blank"
            >
              {t("verificationsdoc")}
            </Link>
          </div>
        )}

        {/* NGO Details */}
        <div className="space-y-4">
          <div className="flex items-center">
            <Earth className="mr-3 text-gray-500" size={20} />
            <span className="text-gray-700">{ngo.country}</span>
          </div>

          {phoneNumber && (
            <div className="flex items-center">
              <Phone className="mr-3 text-gray-500" size={20} />
              <span className="text-gray-700">{phoneNumber}</span>
            </div>
          )}

          {memberEmail && (
            <div className="flex items-center">
              <User className="mr-3 text-gray-500" size={20} />
              <Link
                href={`mailto:${memberEmail}`}
                className="text-blue-600 hover:text-blue-800"
              >
                {memberEmail}
              </Link>
            </div>
          )}

          {ngo.email && ngo.email !== memberEmail && (
            <div className="flex items-center">
              <Mail className="mr-3 text-gray-500" size={20} />
              <Link
                href={`mailto:${ngo.email}`}
                className="text-blue-600 hover:text-blue-800"
              >
                {ngo.email}
              </Link>
            </div>
          )}

          {/* Websites */}
          {websites.length > 0 && (
            <div>
              <h4 className="text-lg font-semibold text-gray-800 mt-6 mb-3">
                {t("websites")}
              </h4>
              {websites.map((website, index) => {
                if (!website) return null;
                return (
                  <div key={index} className="flex items-center mb-4">
                    <Button
                      icon={getWebsiteIcon(website)}
                      rounded
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(website, "_blank");
                      }}
                    />
                    <Link
                      href={website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ml-3 text-blue-600 hover:text-blue-800"
                    >
                      <p> {website} </p>
                    </Link>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Mission */}
        {ngo.mission && (
          <div>
            <h4 className="text-lg font-semibold text-gray-800 mt-6 mb-3">
              {t("mission")}
            </h4>
            <p className="text-gray-700">{ngo.mission}</p>
          </div>
        )}
      </div>
    </dialog>
  );
}
