"use client";

import { useState } from "react";
import Button from "../../../ui/button";
import { Mail, Search, X } from "lucide-react";
import InputField from "../../../ui/inputfield";
import { useTranslations } from "next-intl";

interface InvitationsProps {
  invitedEmails: string[];
  setInvitedEmails: React.Dispatch<React.SetStateAction<string[]>>;
}

export default function Invitations({
  invitedEmails,
  setInvitedEmails,
}: InvitationsProps) {
  const t = useTranslations("AddNGOMember");

  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredEmails = invitedEmails
    .filter((email) => email.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => a.localeCompare(b));

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold text-primary">
          {t("invitations")}
        </h2>

        {/* Searchbutton */}
        <Button
          icon={<Search size={20} />}
          type="button"
          size="md"
          color="ghost"
          onClick={() => setShowSearch((prev) => !prev)}
        />
      </div>

      <div className="h-48">
        {/* Searchbar */}
        {showSearch && (
          <div className="mb-4">
            <InputField
              icon={<Search size={16} />}
              type="text"
              placeholder={t("search")}
              value={searchQuery}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setSearchQuery(e.target.value)
              }
            />
          </div>
        )}

        {/* List of invitations */}
        <div className="h-full overflow-y-auto pr-1">
          {invitedEmails.length > 0 ? (
            <ul className="space-y-2">
              {filteredEmails.map((invited, index) => (
                <li
                  key={index}
                  className="flex items-center justify-between p-3 rounded-lg bg-neutral"
                >
                  <span className="flex items-center gap-2 overflow-hidden flex-1">
                    <Mail size={16} />
                    <p className="truncate w-full">{invited}</p>
                  </span>
                  <Button
                    type="button"
                    size="sm"
                    icon={<X size={20} />}
                    onClick={() => {
                      setInvitedEmails(
                        invitedEmails.filter(
                          (_, i) => i !== invitedEmails.indexOf(invited)
                        )
                      );
                    }}
                  />
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-400 italic">{t("noInvitations")}</p>
          )}
        </div>
      </div>
    </div>
  );
}
