import {useState} from "react";
import {Phone, Mail, MapPin, Clock, X, ChevronDown, ChevronUp, Pencil, Globe} from "lucide-react";
import {NGO, NGOHours} from "@/app/types/ngo";
import toast from "react-hot-toast";
import IconHeading from "../../ui/icon-heading";
import InputField from "../../ui/validation/inputfield";
import Button from "../../ui/button";
import {getWebsiteIcon} from "../../ui/card/functions";
import Badge from "../../ui/badge";
import {EditHoursModal} from "./EditOpeningHours";
import Link from "next/link";

interface ContactInfoProps {
  formData: NGO;
  isEditing: boolean;
  handleChange: (field: keyof NGO, value: string | number | boolean | NGOHours[]) => void;
  updateWebsites: (websites: string[]) => void;
  updateHours?: (hours: NGOHours[]) => void;
}

export const ContactInfo = ({formData, isEditing, handleChange, updateWebsites, updateHours}: ContactInfoProps) => {
  const [newWebsite, setNewWebsite] = useState("");
  const [websiteError, setWebsiteError] = useState("");
  const [showHours, setShowHours] = useState(false);

  const [showHoursModal, setShowHoursModal] = useState(false);
  const [hours, setHours] = useState<NGOHours[]>(formData.ngoHours || []);

  // Function to add a new website
  const handleAddWebsite = () => {
    // Basic URL validation
    if (!newWebsite) {
      setWebsiteError("Please enter a URL");
      toast.error("Please enter a URL");
      return;
    }

    const url = newWebsite;

    // Check if valid URL format
    try {
      new URL(url);

      // Check if website already exists
      if (formData.websites.includes(url)) {
        setWebsiteError("This website is already added");
        toast.error("This website is already added");
        return;
      }

      // Update websites array
      const updatedWebsites = [...formData.websites, url];
      updateWebsites(updatedWebsites);

      // Reset form
      setNewWebsite("");
      setWebsiteError("");
    } catch {
      setWebsiteError("Please enter a valid URL");
      toast.error("Please enter a valid URL");
    }
  };

  const handleRemoveWebsite = (websiteToRemove: string) => {
    const updatedWebsites = formData.websites.filter((website) => website !== websiteToRemove);
    updateWebsites(updatedWebsites);
  };

  const getSortedHours = () => {
    const dayOrder = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    return [...formData.ngoHours].sort((a, b) => dayOrder.indexOf(a.weekday) - dayOrder.indexOf(b.weekday));
  };

  const formatTime = (time: string) => {
    if (!time) return time;
    return time.split(":").slice(0, 2).join(":");
  };

  return (
    <div className="card bg-base-100 shadow-xl border border-neutral">
      <div className="card-body p-5 md:p-6">
        <IconHeading icon={<Phone className="h-5 w-5" />} label="Contact Information" color="primary" />

        <div className="py-4 space-y-4">
          <div className="flex items-center gap-3">
            <div className="bg-base-200 p-2 rounded-lg text-primary">
              <Mail className="h-5 w-5" />
            </div>
            <div className="flex-1">
              {isEditing ? (
                <InputField
                  placeholder="Email"
                  type="email"
                  value={formData.email || ""}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange("email", e.target.value)}
                />
              ) : (
                <div>
                  <div className="font-medium text-sm opacity-70">Email</div>
                  <div className="font-medium">{formData.email}</div>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-base-200 p-2 rounded-lg text-primary">
              <MapPin className="h-5 w-5" />
            </div>
            <div className="flex-1">
              {isEditing ? (
                <InputField
                  placeholder="Country"
                  type="text"
                  value={formData.country}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange("country", e.target.value)}
                />
              ) : (
                <div>
                  <div className="font-medium text-sm opacity-70">Country</div>
                  <div className="font-medium">{formData.country}</div>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-base-200 p-2 rounded-lg text-primary">
              <Phone className="h-5 w-5" />
            </div>
            <div className="flex-1">
              {isEditing ? (
                <InputField
                  placeholder="Phone"
                  type="tel"
                  value={formData.phone || ""}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange("phone", e.target.value)}
                />
              ) : (
                <div>
                  <div className="font-medium text-sm opacity-70">Phone</div>
                  <div className="font-medium">{formData.phone}</div>
                </div>
              )}
            </div>
          </div>

          {/* <div className="flex items-center gap-3">
            <div className="bg-base-200 p-2 rounded-lg text-primary">
              <Clock className="h-5 w-5" />
            </div>
            <div className="flex-1">
              {isEditing ? (
                <InputField 
                  placeholder="Status"
                  type="text" 
                  value={formData.status}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleChange('status', e.target.value)}
                />
              ) : (
                <div>
                  <div className="font-medium text-sm opacity-70">Status</div>
                  <div className="font-medium">{formData.status}</div>
                </div>
              )}
            </div>
          </div> */}

          {/* Opening Hours Section */}
          <div className="mt-2">
            <button className="btn flex items-center justify-between w-full p-3 border border-neutral" onClick={() => setShowHours(!showHours)}>
              <div className="flex items-center gap-4">
                <Clock className="h-5 w-5 text-primary" />
                <span className="font-medium">{formData.status}</span>
              </div>
              {showHours ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
            </button>

            {showHours && (
              <div className="mt-2 p-3 bg-base-100 border border-base-200 rounded-lg">
                {formData.ngoHours && formData.ngoHours.length > 0 ? (
                  <div className="space-y-2">
                    {getSortedHours().map((hour, index) => (
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

                {isEditing && updateHours && (
                  <div className="mt-3 text-center">
                    <Button icon={<Pencil size={16} />} label="Edit Hours" size="sm" color="accent" onClick={() => setShowHoursModal(true)} />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <EditHoursModal
          isOpen={showHoursModal}
          onClose={() => setShowHoursModal(false)}
          value={hours}
          onSave={(updatedHours) => {
            setHours(updatedHours);
            handleChange("ngoHours", updatedHours);
          }}
        />

        <div className="mt-2">
          {!isEditing ? (
            <Link className="btn btn-primary w-full" href={`mailto:${formData.email}`}>
              <Mail className="h-4 w-4 mr-2" />
              Send Message
            </Link>
          ) : (
            <></>
          )}

          {isEditing ? (
            <div>
              <IconHeading icon={<Globe />} label="Websites" color="primary" />
              <div className="md:flex flex-wrap justify-center gap-3 mt-4">
                {formData.websites.length > 0 && (
                  <div className="md:flex flex-wrap gap-2 mt-3">
                    {formData.websites.map((website, index) => (
                      <div key={index}>
                        {/* Buttons for Desktop */}
                        <div className="tooltip tooltip-accent hidden md:flex flex-col" data-tip={website}>
                          <Button
                            icon={getWebsiteIcon(website)}
                            rounded
                            color="neutral"
                            deleteHover
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveWebsite(website);
                            }}
                          />
                        </div>

                        {/* Badges for smaller devices */}
                        <div className="md:hidden max-w-full pb-3">
                          <Badge
                            icon={<X size={16} className="text-error" />}
                            label={website}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveWebsite(website);
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="p-4 mt-6 bg-base-200/50 rounded-lg">
                <h3 className="font-semibold mb-3">Add Website</h3>
                <div className="space-y-3">
                  <InputField
                    type="text"
                    placeholder="Enter URL"
                    value={newWebsite}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      setNewWebsite(e.target.value);
                      setWebsiteError("");
                    }}
                    error={websiteError}
                  />

                  <div className="flex gap-2 justify-end">
                    <Button
                      label="Cancel"
                      color="error"
                      size="sm"
                      soft
                      onClick={() => {
                        setNewWebsite("");
                        setWebsiteError("");
                      }}
                    />
                    <Button label="Add Website" color="primary" size="sm" onClick={handleAddWebsite} />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex justify-center gap-3 mt-4">
              {formData.websites.length > 0 && (
                <div className="flex flex-wrap justify-end gap-2 mt-3">
                  {formData.websites.map((website, index) => (
                    <Button
                      key={index}
                      icon={getWebsiteIcon(website)}
                      rounded
                      onClick={(e) => {
                        e.stopPropagation();
                        window.open(website, "_blank");
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
