"use client";

import CreateNGOProfile from "@/app/components/signup/ngo-verification/ngo-profile/ngo-profile";
import WaitForVerification from "@/app/components/signup/ngo-verification/wait";
import SignUpView from "@/app/components/signup/create-account/view";
import Box from "@/app/components/ui/box";
import Steps from "@/app/components/ui/steps";
import {useState, useMemo, useEffect} from "react";
import {useTranslations} from "next-intl";
import {useAuth} from "@/contexts/AuthContext";
import AddInfo from "@/app/components/signup/caretaker-profil/add-personal-info/view";
import AddNgoMemberInfo from "@/app/components/signup/ngo-member-profile/add-info";
import {useRouter, useSearchParams} from "next/navigation";

export default function SignUp() {
  const tSteps = useTranslations("Steps");
  const {token} = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [selectedTab, setSelectedTab] = useState<"shelter" | "ngo" | "ngoMember">("shelter");
  const [activeStepKey, setActiveStepKey] = useState("signup");
  const [isLoadingStatus, setIsLoadingStatus] = useState(true);
  const [inviteToken, setInviteToken] = useState<string | null>(null);

  useEffect(() => {
    const invite = searchParams.get("invite");
    if (invite) {
      setInviteToken(invite);
      setSelectedTab("ngoMember");
    }
  }, [searchParams]);

  useEffect(() => {
    const checkNgoStatus = async () => {
      if (token) {
        try {
          const response = await fetch(`/api/ngo-status`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (response.ok) {
            const ngoStatus = await response.json();
            if (ngoStatus.needsNgoProfile) {
              setSelectedTab("ngo");
              setActiveStepKey("add-info");
              return true; // Profile completion needed
            } else if (ngoStatus.isNgoUser && ngoStatus.hasNgoMembership) {
              setSelectedTab("ngo");
              setActiveStepKey("wait");
              return true; // Profile completion needed
            }
          } else if (response.status === 404) {
            console.log("User not associated with an NGO or status endpoint not found.");
          } else {
            console.error("Error fetching NGO status:", response.status);
          }
        } catch (error) {
          console.error("Failed to fetch NGO status:", error);
        }
      }
      return false; // No profile completion needed
    };

    const checkCaretakerStatus = async () => {
      if (token) {
        try {
          const response = await fetch(`/api/caretaker-status`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (response.ok) {
            const caretakerStatus = await response.json();
            if (caretakerStatus.needsCaretakerProfile) {
              setSelectedTab("shelter");
              setActiveStepKey("add-info");
              return true; // Profile completion needed
            }
          } else if (response.status === 404) {
            console.log("User not associated with caretaker or status endpoint not found.");
          } else {
            console.error("Error fetching caretaker status:", response.status);
          }
        } catch (error) {
          console.error("Failed to fetch caretaker status:", error);
        }
      }
      return false; // No profile completion needed
    };

    const checkAllStatuses = async () => {
      const needsNgoProfile = await checkNgoStatus();
      const needsCaretakerProfile = await checkCaretakerStatus();

      // If user doesn't need to complete any profile, redirect to home
      if (token && !needsNgoProfile && !needsCaretakerProfile) {
        router.push("/");
        return;
      }

      setIsLoadingStatus(false);
    };

    checkAllStatuses();
  }, [token, router]);

  const stepConfigs = useMemo(
    () => ({
      ngo: [
        {label: tSteps("createAcc"), key: "signup"},
        {label: tSteps("addInformation"), key: "add-info"},
        {label: tSteps("NGOProfile"), key: "ngo-profile"},
        {label: tSteps("wait"), key: "wait"},
      ],
      shelter: [
        {label: tSteps("createAcc"), key: "signup"},
        {label: tSteps("addInformation"), key: "add-info"},
        // { label: tSteps("findAnimals"), key: "find-animals" },
      ],
      ngoMember: [
        {label: tSteps("createAcc"), key: "signup"},
        {label: tSteps("addInformation"), key: "add-ngo-profile-info"},
      ],
    }),
    [tSteps]
  );

  const currentSteps = stepConfigs[selectedTab];
  const activeIndex = currentSteps.findIndex((step) => step.key === activeStepKey);

  const goToNextStep = () => {
    if (activeIndex < currentSteps.length - 1) {
      setActiveStepKey(currentSteps[activeIndex + 1].key);
    } else {
    }
  };

  if (isLoadingStatus) {
    return (
      <Box>
        <div className="h-full flex items-center justify-center">
          <p>{tSteps("loadingStatus", {default: "Loading status..."})}</p>
        </div>
      </Box>
    );
  }

  return (
    <Box>
      <div className="h-full space-y-6">
        <Steps
          labels={currentSteps.map((step, index) => ({
            label: step.label,
            isActive: index <= activeIndex,
            bold: index === activeIndex,
          }))}
        />

        {/* Inhalt je nach aktivem Step */}
        {activeStepKey === "signup" && (
          <SignUpView
            selectedTab={selectedTab}
            onChange={(tab) => {
              setSelectedTab(tab);
              setActiveStepKey("signup");
            }}
            onNext={goToNextStep}
            inviteToken={inviteToken}
          />
        )}

        {selectedTab === "shelter" && activeStepKey === "add-info" && <AddInfo />}

        {selectedTab === "ngo" && activeStepKey === "add-info" && <AddNgoMemberInfo inviteToken={null} onNext={goToNextStep} />}

        {selectedTab === "ngo" && activeStepKey === "ngo-profile" && <CreateNGOProfile onNext={goToNextStep} />}

        {selectedTab === "ngo" && activeStepKey === "wait" && <WaitForVerification />}

        {selectedTab === "ngoMember" && activeStepKey === "add-ngo-profile-info" && <AddNgoMemberInfo inviteToken={inviteToken} />}
      </div>
    </Box>
  );
}
