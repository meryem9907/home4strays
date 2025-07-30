"use client";

import {useState} from "react";
import InputField from "@/app/components/ui/inputfield";
import {Mail} from "lucide-react";
import Button from "@/app/components/ui/button";
import Invitations from "@/app/components/signup/ngo-verification/add-member/invitations";
import {useTranslations} from "next-intl";
import {useAuth} from "@/contexts/AuthContext";
import toast from "react-hot-toast";

export default function AddNgoMember() {
  const t = useTranslations("AddNGOMember");
  const {token} = useAuth();

  const [email, setEmail] = useState("");
  const [invitedEmails, setInvitedEmails] = useState<string[]>([]);
  const [isInviting, setIsInviting] = useState(false);

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim() && !invitedEmails.includes(email.trim())) {
      setInvitedEmails([...invitedEmails, email.trim()]);
      setEmail("");
    }
  };

  const sendInvites = async () => {
    if (!token || invitedEmails.length === 0) {
      toast.error("No emails to invite or not authenticated");
      return;
    }

    setIsInviting(true);
    let successCount = 0;
    let errorCount = 0;

    for (const emailToInvite of invitedEmails) {
      try {
        const response = await fetch("/api/ngo/invite", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({email: emailToInvite}),
        });

        if (response.ok) {
          successCount++;
        } else {
          errorCount++;
          console.error(`Failed to invite ${emailToInvite}:`, response.status);
        }
      } catch (error) {
        errorCount++;
        console.error(`Error inviting ${emailToInvite}:`, error);
      }
    }

    setIsInviting(false);

    if (successCount > 0) {
      toast.success(`Successfully sent ${successCount} invitation(s)`);
    }
    if (errorCount > 0) {
      toast.error(`Failed to send ${errorCount} invitation(s)`);
    }

    if (successCount === invitedEmails.length) {
      setInvitedEmails([]);
    }
  };

  return (
    <div>
      {/* <Steps 
        labels={[
          { label: t("createAcc"), isActive: true, href: "/signup" },
          { label: t("NGOProfile"), isActive: true, href: "/signup/ngo-profile" },
          { label: t("wait"), isActive: true },
          { label: t("addMembers"),  isActive: true, bold: true, href: "/signup/ngo-profile/add-ngo-member" }
        ]}
      /> */}
      <div className="card-body">
        <form className="space-y-4" noValidate onSubmit={handleInvite}>
          <div className="flex flex-col md:flex-row items-stretch gap-2">
            <div className="flex-1">
              <InputField
                icon={<Mail size={16} />}
                type="email"
                placeholder={t("email")}
                value={email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
              />
            </div>

            <Button label={t("invite")} color="primary" type="submit" />
          </div>
        </form>

        <Invitations invitedEmails={invitedEmails} setInvitedEmails={setInvitedEmails} />

        <div className="mt-8">
          <Button label={t("inviteMembers")} color="secondary" fullwidth onClick={sendInvites} disabled={invitedEmails.length === 0 || isInviting} />
        </div>
      </div>
    </div>
  );
}
