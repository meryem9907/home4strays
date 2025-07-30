"use client";

import {useState, useEffect} from "react";
import {Cat, Edit, Save, X} from "lucide-react";
import Button from "@/app/components/ui/button";
import Carousel from "@/app/components/ngos/ngoProfile/Carousel";
import {Header} from "@/app/components/ngos/ngoProfile/Header";
import {TeamMembers} from "@/app/components/ngos/ngoProfile/TeamMembers";
import {ContactInfo} from "@/app/components/ngos/ngoProfile/ContactInfo";
import {Mission} from "@/app/components/ngos/ngoProfile/Mission";
import {NGO, NGOHours, NGOMember} from "@/app/types/ngo";
import {Animal} from "@/app/types/animal";
import IconHeading from "@/app/components/ui/icon-heading";
// import EditSaveBar from "@/app/components/ui/editSaveBar";

// Utility function to decode JWT token and get user ID
const getUserIdFromToken = (token: string): string | null => {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.id || null;
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};

interface BackendNGOHours {
  ngoId: string;
  startTime: string;
  endTime: string;
  weekday: string;
}

interface BackendNGO {
  id: string;
  name: string;
  email?: string;
  country: string;
  verificationDocumentPath?: string;
  verificationDocumentLink?: string;
  verified?: boolean;
  logoPicturePath?: string;
  logoPictureLink?: string;
  phoneNumber?: string;
  memberCount?: number;
  website?: string[];
  mission?: string;
}

interface BackendNGOMemberHours {
  startTime: string;
  endTime: string;
  weekday: string;
}

interface BackendNGOMember {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  profilePictureLink?: string;
  phoneNumber?: string;
  userIsAdmin: boolean | number | string;
  isNgoUser: boolean;
  ngoId: string;
  userId: string;
  memberIsAdmin?: boolean | number | string;
}

interface BackendNGOMemberWithHours {
  ngoMember: BackendNGOMember;
  ngoMemberHours: BackendNGOMemberHours[];
}

interface BackendResponse {
  ngo: BackendNGO;
  hours: BackendNGOHours[];
}

interface BackendPet {
  id?: string;
  name?: string;
  gender?: string;
  birthdate?: string;
  castration?: boolean;
  weight?: number;
  breed?: string;
  petspecies?: string;
  profilePictureLink?: string;
  profilePicturePath?: string;
  lastCheckUp?: string;
  eatingBehaviour?: string;
  careTaker?: string;
  ngoMember?: string;
  ngoName?: string;
  streetName?: string;
  cityName?: string;
  zip?: string;
  country?: string;
  houseNumber?: string;
  localityTypeRequirement?: string;
  kidsAllowed?: boolean;
  zipRequirement?: string;
  experienceRequirement?: string;
  minimumSpaceRequirement?: number;
  description?: string;
  images?: string[];
  breedInformation?: string;
}

interface NGOProfileProps {
  params: Promise<{id: string; locale: string}>;
}

export default function NGOProfile({params}: NGOProfileProps) {
  const [ngoData, setNgoData] = useState<NGO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [formData, setFormData] = useState<NGO | null>(null);
  const [newMemberData, setNewMemberData] = useState<NGOMember>({name: "", email: "", image: null, schedule: []});
  const [showAddMember, setShowAddMember] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isCurrentUserAdmin, setIsCurrentUserAdmin] = useState<boolean>(false);
  const [recentAnimals, setRecentAnimals] = useState<Animal[]>([]);
  const [animalsLoading, setAnimalsLoading] = useState<boolean>(false);
  const [locale, setLocale] = useState<string>("");

  const transformPetToAnimal = (pet: BackendPet): Animal => {
    const profilePictureLink = pet.profilePictureLink?.trim();
    const hasValidProfilePicture = profilePictureLink && profilePictureLink.length > 0;

    const petImages: string[] = [];
    if (hasValidProfilePicture) {
      petImages.push(profilePictureLink);
    }

    if (pet.images && Array.isArray(pet.images) && pet.images.length > 0) {
      pet.images.forEach((img: string) => {
        if (img && img.trim() && !petImages.includes(img.trim())) {
          petImages.push(img.trim());
        }
      });
    }

    if (petImages.length === 0) {
      petImages.push("/logo.png");
    }

    const calculateAge = (birthdate: string | undefined): number => {
      if (!birthdate) return 0;
      const birth = new Date(birthdate);
      const today = new Date();
      let age = today.getFullYear() - birth.getFullYear();
      const monthDiff = today.getMonth() - birth.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        age--;
      }
      return Math.max(0, age);
    };

    return {
      id: pet.id || "",
      name: pet.name || "Unknown",
      breed: {
        name: pet.breed || "Unknown",
        species: pet.petspecies || "Unknown",
        info: pet.breedInformation || "",
      },
      age: calculateAge(pet.birthdate),
      weight: pet.weight || 0,
      castration: pet.castration || false,
      gender: (pet.gender as "Male" | "Female" | "Diverse") || "Diverse",
      eatingBehaviour: pet.eatingBehaviour ? [pet.eatingBehaviour] : [],
      behaviour: [],
      fears: [],
      lastCheckup: pet.lastCheckUp || "",
      image: petImages,
      description: pet.description || pet.eatingBehaviour || "No description available",
      ngo: {
        id: ngoData?.id || "",
        name: ngoData?.name || "",
        country: ngoData?.country || "",
      },
      location: {
        street: pet.streetName || "",
        housenr: pet.houseNumber || "",
        city: pet.cityName || "",
        zipCode: pet.zip || "",
        country: pet.country || "",
      },
      requiredLocation: "urban" as const,
      ZIPRequirement: pet.zipRequirement || "",
      kidsAllowed: pet.kidsAllowed || false,
      requiredExperience: (pet.experienceRequirement as ">10 years" | ">5 years" | ">2 years" | ">1 year" | "No experience") || "No experience",
      requiredMinimumSpace: pet.minimumSpaceRequirement || 0,
      allergies: [],
      diseases: [],
      vaccination: [],
    };
  };

  const fetchRecentAnimals = async (ngoName: string) => {
    if (!ngoName) return;

    setAnimalsLoading(true);
    try {
      const params = new URLSearchParams();
      params.append("limit", "6");
      params.append("offset", "0");
      params.append("ngoName", ngoName);

      const response = await fetch(`/api/pets?${params.toString()}`);

      if (!response.ok) {
        throw new Error(`Failed to fetch animals: ${response.status}`);
      }

      const data = await response.json();

      if (data.data && Array.isArray(data.data)) {
        const transformedAnimals = data.data.map(transformPetToAnimal);
        setRecentAnimals(transformedAnimals);
      } else {
        setRecentAnimals([]);
      }
    } catch (err) {
      console.error("Error fetching recent animals:", err);
      setRecentAnimals([]);
    } finally {
      setAnimalsLoading(false);
    }
  };

  useEffect(() => {
    const fetchNGOData = async () => {
      try {
        const {id, locale: currentLocale} = await params;
        setLocale(currentLocale);

        const response = await fetch(`/api/ngo/${id}`);

        if (!response.ok) {
          throw new Error(`Failed to fetch NGO data: ${response.status}`);
        }

        const data: BackendResponse = await response.json();

        // Fetch members data (with authentication)
        let members: NGOMember[] = [];
        try {
          const token = localStorage.getItem("authToken");
          const headers: HeadersInit = {
            "Content-Type": "application/json",
          };

          if (token) {
            headers.Authorization = `Bearer ${token}`;
          } else {
            setIsCurrentUserAdmin(false);
          }

          const membersResponse = await fetch(`/api/ngo/${id}/members`, {
            method: "GET",
            headers,
          });

          if (membersResponse.ok) {
            const membersData: BackendNGOMemberWithHours[] = await membersResponse.json();
            members = membersData.map((memberWithHours) => ({
              name: `${memberWithHours.ngoMember.firstName} ${memberWithHours.ngoMember.lastName}`,
              email: memberWithHours.ngoMember.email,
              image:
                memberWithHours.ngoMember.profilePictureLink?.trim() && memberWithHours.ngoMember.profilePictureLink.trim() !== ""
                  ? memberWithHours.ngoMember.profilePictureLink
                  : null,
              schedule:
                memberWithHours.ngoMemberHours?.map((hour) => ({
                  start: hour.startTime,
                  end: hour.endTime,
                  weekday: hour.weekday,
                })) || [],
            }));

            // Check if current user is admin of this NGO
            if (token) {
              const currentUserId = getUserIdFromToken(token);
              if (currentUserId) {
                const currentUserMember = membersData.find((memberWithHours) => memberWithHours.ngoMember.userId === currentUserId);

                // Handle both boolean and numeric (1/0) values for NGO-specific admin
                const ngoAdminValue = currentUserMember?.ngoMember.memberIsAdmin;
                const isAdmin =
                  ngoAdminValue === true || ngoAdminValue === 1 || ngoAdminValue === "1" || (typeof ngoAdminValue === "boolean" && ngoAdminValue);

                setIsCurrentUserAdmin(isAdmin);
              }
            }
          } else if (membersResponse.status === 401) {
            console.warn("User not authenticated for member data");
            setIsCurrentUserAdmin(false);
          }
        } catch (memberError) {
          console.warn("Failed to fetch members, using empty array:", memberError);
          setIsCurrentUserAdmin(false);
        }

        // Transform backend data to frontend format
        const transformedData: NGO = {
          id: data.ngo.id,
          name: data.ngo.name,
          email: data.ngo.email,
          country: data.ngo.country,
          verificationDoc: data.ngo.verificationDocumentLink,
          verified: data.ngo.verified || false,
          logo: data.ngo.logoPictureLink?.trim() && data.ngo.logoPictureLink.trim() !== "" ? data.ngo.logoPictureLink : "/logo.png",
          phone: data.ngo.phoneNumber,
          membercount: data.ngo.memberCount || 0,
          websites: data.ngo.website || [],
          mission: data.ngo.mission,
          member: members,
          ngoHours: Array.isArray(data.hours)
            ? data.hours.map((hour) => ({
                start: hour.startTime,
                end: hour.endTime,
                weekday: hour.weekday,
              }))
            : [],
          status: "Opened" as const, // TODO: Add status logic
          animals: [], // TODO: Add animals
        };

        setNgoData(transformedData);
        setFormData(transformedData);

        if (transformedData.name) {
          await fetchRecentAnimals(transformedData.name);
        }
      } catch (err) {
        console.error("Error fetching NGO data:", err);
        setError(err instanceof Error ? err.message : "Failed to load NGO data");
        setIsCurrentUserAdmin(false); // Reset admin status on error
      } finally {
        setLoading(false);
      }
    };

    fetchNGOData();
  }, [params]);

  const updateWebsites = (websites: string[]) => {
    if (formData) {
      setFormData((prevData) => ({
        ...prevData!,
        websites: websites,
      }));
    }
  };

  const updateHours = (updatedHours: NGOHours[]) => {
    handleChange("ngoHours", updatedHours);
  };

  const handleChange = (field: keyof NGO | "ngoHours", value: string | number | boolean | NGOHours[]): void => {
    if (formData) {
      setFormData((prev) => ({
        ...prev!,
        [field]: value,
      }));
    }
  };

  const handleNewMemberChange = (field: keyof NGOMember, value: string): void => {
    setNewMemberData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const removeMember = (index: number): void => {
    if (formData) {
      setFormData((prev) => ({
        ...prev!,
        member: prev!.member.filter((_, i) => i !== index),
      }));
    }
  };

  const saveChanges = async (): Promise<void> => {
    if (!formData) return;

    setSaving(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const {id} = await params;
      const token = localStorage.getItem("authToken");

      if (!token) {
        setError("You must be logged in to edit NGO data");
        return;
      }

      if (!isCurrentUserAdmin) {
        setError("You must be an admin of this NGO to edit its profile");
        return;
      }

      // Transform frontend data to backend format
      const backendData = {
        ngo: {
          name: formData.name,
          country: formData.country,
          email: formData.email || null,
          phoneNumber: formData.phone || null,
          memberCount: formData.membercount || null,
          website: formData.websites || [],
          mission: formData.mission || null,
          ngoHours: formData.ngoHours.map((hour) => ({
            startTime: hour.start,
            endTime: hour.end,
            weekday: hour.weekday,
          })),
        },
      };

      const response = await fetch(`/api/ngo/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(backendData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({error: "Unknown error"}));
        throw new Error(errorData.error || `Failed to update NGO: ${response.status}`);
      }

      setNgoData({...formData});
      setIsEditing(false);
      setSuccessMessage("NGO profile updated successfully!");

      setTimeout(() => setSuccessMessage(null), 3000);

      if (formData.name) {
        await fetchRecentAnimals(formData.name);
      }
    } catch (err) {
      console.error("Error saving NGO data:", err);
      setError(err instanceof Error ? err.message : "Failed to save NGO data");
    } finally {
      setSaving(false);
    }
  };

  const cancelEditing = (): void => {
    if (ngoData) {
      setFormData({...ngoData});
      setIsEditing(false);
      setShowAddMember(false);
      setError(null);
      setSuccessMessage(null);
    }
  };

  if (loading) {
    return (
      <div className="bg-base-100 px-4 sm:px-6 md:px-12 py-4 w-full">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded-full bg-primary animate-pulse"></div>
              <div className="w-4 h-4 rounded-full bg-primary animate-pulse delay-75"></div>
              <div className="w-4 h-4 rounded-full bg-primary animate-pulse delay-150"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-base-100 px-4 sm:px-6 md:px-12 py-4 w-full">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="text-center">
              <h2 className="text-2xl font-semibold mb-2">Error Loading NGO</h2>
              <p className="text-base-content/70">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!ngoData || !formData) {
    return (
      <div className="bg-base-100 px-4 sm:px-6 md:px-12 py-4 w-full">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="text-center">
              <h2 className="text-2xl font-semibold mb-2">NGO Not Found</h2>
              <p className="text-base-content/70">The requested NGO could not be found.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-base-100 px-4 sm:px-6 md:px-12 py-4 w-full">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 flex justify-between items-center">
          <div className="flex-1">
            {successMessage && (
              <div className="alert alert-success">
                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{successMessage}</span>
              </div>
            )}
            {error && isEditing && (
              <div className="alert alert-error">
                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>{error}</span>
              </div>
            )}
          </div>

          <div className="flex justify-end">
            {!isEditing ? (
              isCurrentUserAdmin && (
                <Button
                  icon={<Edit className="h-4 w-4" />}
                  onClick={() => {
                    setIsEditing(true);
                    setError(null);
                    setSuccessMessage(null);
                  }}
                  label="Bearbeiten"
                  color="primary"
                />
              )
            ) : (
              <div className="flex gap-3">
                <Button icon={<X className="h-4 w-4" />} onClick={cancelEditing} label="Abbrechen" color="error" soft disabled={saving} />
                <Button
                  icon={<Save className="h-4 w-4" />}
                  onClick={saveChanges}
                  label={saving ? "Speichern..." : "Speichern"}
                  color="primary"
                  disabled={saving}
                />
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
          <div className="lg:col-span-7 flex flex-col gap-6">
            <Header formData={formData} isEditing={isEditing} handleChange={handleChange} />

            <TeamMembers
              formData={formData}
              isEditing={isEditing}
              showAddMember={showAddMember}
              setShowAddMember={setShowAddMember}
              newMemberEmail={newMemberData.email}
              handleNewMemberChange={(value: string) => handleNewMemberChange("email", value)}
              removeMember={removeMember}
            />
          </div>

          <div className="lg:col-span-5 flex flex-col gap-6">
            <ContactInfo
              formData={formData}
              isEditing={isEditing}
              handleChange={handleChange}
              updateWebsites={updateWebsites}
              updateHours={updateHours}
            />

            <Mission formData={formData} isEditing={isEditing} handleChange={handleChange} />
          </div>
        </div>

        {!isEditing && (
          <div className="card bg-base-100 shadow-xl border border-neutral">
            <div className="card-body p-5 md:p-6">
              <IconHeading icon={<Cat className="h-5 w-5" />} label="Recently Uploaded Animals" />
              <Carousel animals={recentAnimals} locale={locale} loading={animalsLoading} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
