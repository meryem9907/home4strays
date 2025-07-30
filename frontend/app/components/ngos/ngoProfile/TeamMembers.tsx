import {ChevronDown, ChevronUp, Clock, Mail, Plus, Trash2, UserRound, Users} from "lucide-react";
import React, {useState} from "react";
import Button from "../../ui/button";
import InputField from "../../ui/validation/inputfield";
import Image from "next/image";
import IconHeading from "../../ui/icon-heading";
import {NGOMember} from "../../../types/ngo";
import {useAuth} from "@/contexts/AuthContext";
import {useTranslations} from "next-intl";
import toast from "react-hot-toast";

interface TeamMembersProps {
  formData: {
    member: NGOMember[];
  };
  isEditing: boolean;
  showAddMember: boolean;
  setShowAddMember: (value: boolean) => void;
  newMemberEmail: string;
  handleNewMemberChange: (value: string) => void;
  removeMember: (index: number) => void;
}

export const TeamMembers = ({
  formData,
  isEditing,
  showAddMember,
  setShowAddMember,
  newMemberEmail,
  handleNewMemberChange,
  removeMember,
}: TeamMembersProps) => {
  const {token} = useAuth();
  const t = useTranslations("Common");
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [isInviting, setIsInviting] = useState(false);

  const toggleOpen = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  // Helper function to get schedule for a specific day
  const getSortedHours = (member: NGOMember) => {
    const dayOrder = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    return member.schedule.sort((a, b) => dayOrder.indexOf(a.weekday) - dayOrder.indexOf(b.weekday));
  };

  // Format time for display (trim seconds from HH:MM:SS to HH:MM)
  const formatTime = (time: string) => {
    if (!time) return time;
    // If time includes seconds (HH:MM:SS), trim to HH:MM
    const parts = time.split(":");
    if (parts.length >= 2) {
      return `${parts[0]}:${parts[1]}`;
    }
    return time;
  };

  const handleSendInvite = async () => {
    if (!newMemberEmail.trim()) {
      toast.error("Please enter an email address");
      return;
    }

    if (!token) {
      toast.error("You must be logged in to send invites");
      return;
    }

    setIsInviting(true);

    try {
      const response = await fetch("/api/ngo/invite", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({email: newMemberEmail}),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Invite sent successfully!");
        setShowAddMember(false);
        handleNewMemberChange("");
      } else {
        toast.error(data.message || "Failed to send invite");
      }
    } catch (error) {
      console.error("Error sending invite:", error);
      toast.error("Failed to send invite. Please try again.");
    } finally {
      setIsInviting(false);
    }
  };

  return (
    <div className="card bg-base-100 shadow-xl border border-neutral flex-grow">
      <div className="card-body p-5 md:p-6">
        {/* Header */}
        <div className="flex justify-between items-center border-b border-base-200 pb-3">
          <IconHeading icon={<Users className="h-5 w-5" />} label="Team Members" noBorder />
          {isEditing && !showAddMember && (
            <Button icon={<Plus className="h-4 w-4" />} label="Mitglied hinzufügen" color="accent" size="sm" onClick={() => setShowAddMember(true)} />
          )}
        </div>

        {/* Add new member form */}
        {isEditing && showAddMember && (
          <div className="p-4 mb-2 bg-base-200/50 rounded-lg">
            <h3 className="font-semibold mb-3">Add New Member</h3>
            <div className="space-y-3">
              <InputField type="email" value={newMemberEmail} onChange={(e) => handleNewMemberChange(e.target.value)} placeholder="Enter email" />
              <div className="flex gap-2 justify-end">
                <Button label="Cancel" color="error" size="sm" soft onClick={() => setShowAddMember(false)} />
                <Button
                  label={isInviting ? "Sending..." : "Send Invite"}
                  color="primary"
                  size="sm"
                  onClick={handleSendInvite}
                  disabled={!newMemberEmail || isInviting}
                />
              </div>
            </div>
          </div>
        )}

        {!token ? (
          <h1 className="text-base-content/70 h-full text-center flex items-center justify-center text-lg font-semibold">
            {t("Not logged in", {defaultMessage: "Not logged in"})}
          </h1>
        ) : (
          <ul className="divide-y divide-base-200">
            {formData.member.map((member, index) => (
              <li key={index} className="py-4">
                <div className="flex gap-4 items-start">
                  {member.image ? (
                    <div className="avatar">
                      <div className="w-12 h-12 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                        <Image src={member.image} alt={member.name} width={48} height={48} className="object-cover" />
                      </div>
                    </div>
                  ) : (
                    <div className="bg-primary/10 flex items-center justify-center text-primary w-12 h-12 rounded-full">
                      <UserRound className="h-6 w-6" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-base-content truncate">{member.name}</div>
                    <div className="text-xs opacity-70 flex items-center">
                      <Mail className="w-3 h-3 mr-1 flex-shrink-0" />
                      <span className="truncate">{member.email}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {isEditing ? (
                      <Button icon={<Trash2 className="h-4 w-4 text-error" />} color="ghost" rounded onClick={() => removeMember(index)} />
                    ) : (
                      <label className="swap swap-rotate bg-secondary/10 text-secondary rounded-lg p-2 tooltip cursor-pointer" data-tip="Schedule">
                        <input type="checkbox" checked={openIndex === index} onChange={() => toggleOpen(index)} />
                        <Clock className="w-5 h-5 mr-1" />
                        <ChevronDown className="ml-6 swap-off w-5 h-5" />
                        <ChevronUp className="ml-6 swap-on w-5 h-5" />
                      </label>
                    )}
                  </div>
                </div>
                <div className="mt-3 md:pl-15">
                  {openIndex === index && !isEditing && (
                    <div className="border border-neutral rounded-lg p-3">
                      {member.schedule && member.schedule.length > 0 ? (
                        <div className="space-y-2">
                          {getSortedHours(member).map((hour, index) => (
                            <div key={index} className="flex justify-between items-center">
                              <span className="font-medium">{hour.weekday}</span>
                              <span>
                                {formatTime(hour.start)} - {formatTime(hour.end)}
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center text-base-content/70">No opening hours available</div>
                      )}
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
        {/* add empty space to height if needed */}
        {formData.member.length < 3 && !showAddMember && <div className="py-4"></div>}
      </div>
    </div>
  );
};
