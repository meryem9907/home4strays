"use client";

import { useState, useEffect } from "react";
import { BackendNGO } from "@/app/types/ngo";
import Button from "@/app/components/ui/button";
import Modal from "@/app/components/ngo-verification/modal";
import { CircleCheck, CircleX, Search, Loader2, RefreshCw } from "lucide-react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import toast from "react-hot-toast";
import AdminProtection from "@/app/components/auth/AdminProtection";

function NGOVerificationContent() {
  const [ngos, setNgos] = useState<BackendNGO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processingNgo, setProcessingNgo] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const t = useTranslations("NGO-Validation");

  const fetchUnverifiedNGOs = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await fetch(`/api/pending-verifications`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.status === 204 || response.status === 404) {
        setNgos([]);
        return;
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setNgos(data || []);
    } catch (err) {
      console.error("Error fetching unverified NGOs:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch NGOs");
      toast.error("Failed to load NGO verification requests");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyNgo = async (name: string, country: string) => {
    try {
      setProcessingNgo(`${name}-${country}`);

      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await fetch(`/api/verify-ngo`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, country }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      toast.success(result.status || "NGO verified successfully!");

      await fetchUnverifiedNGOs();
    } catch (err) {
      console.error("Error verifying NGO:", err);
      toast.error(err instanceof Error ? err.message : "Failed to verify NGO");
    } finally {
      setProcessingNgo(null);
    }
  };

  const handleRejectNgo = async (name: string, country: string) => {
    try {
      setProcessingNgo(`${name}-${country}`);

      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await fetch(`/api/reject-ngo`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, country }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      toast.success(result.status || "NGO rejected successfully!");

      await fetchUnverifiedNGOs();
    } catch (err) {
      console.error("Error rejecting NGO:", err);
      toast.error(err instanceof Error ? err.message : "Failed to reject NGO");
    } finally {
      setProcessingNgo(null);
    }
  };

  useEffect(() => {
    fetchUnverifiedNGOs();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto max-w-3xl mt-8">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="animate-spin mr-2" size={24} />
          <span>Loading verification requests...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto max-w-3xl mt-8">
        <div className="alert alert-error">
          <span>Error: {error}</span>
          <button className="btn btn-sm" onClick={fetchUnverifiedNGOs}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (ngos.length === 0) {
    return (
      <div className="container mx-auto max-w-3xl mt-8">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-4">No Pending Verifications</h2>
          <p className="text-gray-600 mb-4">
            There are currently no NGOs waiting for verification.
          </p>
          <Button
            color="primary"
            icon={<RefreshCw size={20} />}
            label="Refresh"
            onClick={fetchUnverifiedNGOs}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-3xl mt-8">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-3xl font-bold">NGO Verification</h1>
        <Button
          color="ghost"
          size="sm"
          onClick={fetchUnverifiedNGOs}
          disabled={loading}
          icon={
            loading ? <Loader2 className="animate-spin" size={16} /> : "Refresh"
          }
        />
        {/* <button
          className="btn btn-ghost btn-sm"
          onClick={fetchUnverifiedNGOs}
          disabled={loading}
        >
          {loading ? <Loader2 className="animate-spin" size={16} /> : "Refresh"}
        </button> */}
      </div>

      <div>
        <table className="table table-pin-rows md:table-lg">
          <thead>
            <tr>
              <th>{t("ngo")}</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {ngos.map((ngo) => {
              const isProcessing =
                processingNgo === `${ngo.name}-${ngo.country}`;

              return (
                <tr key={ngo.id}>
                  <td>
                    <div className="flex items-center space-x-3">
                      <div className="avatar">
                        <div
                          className="mask mask-squircle w-12 h-12 cursor-pointer"
                          onClick={() =>
                            setSelectedImage(ngo.logoPictureLink || null)
                          }
                        >
                          {ngo.logoPictureLink ? (
                            <Image
                              width={200}
                              height={200}
                              src={ngo.logoPictureLink}
                              alt={`${ngo.name} logo`}
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                              <span className="text-gray-500 text-xs">
                                No Logo
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div>
                        <div className="font-bold">{ngo.name}</div>
                        <div className="text-sm opacity-50">{ngo.country}</div>
                      </div>
                    </div>
                  </td>

                  <td className="px-2 text-right">
                    <div className="tooltip" data-tip={t("accept")}>
                      <Button
                        icon={
                          isProcessing ? (
                            <Loader2 className="animate-spin text-success" />
                          ) : (
                            <CircleCheck className="text-success" />
                          )
                        }
                        color="ghost"
                        disabled={isProcessing}
                        onClick={() => handleVerifyNgo(ngo.name, ngo.country)}
                      />
                    </div>
                    <div className="tooltip" data-tip={t("deny")}>
                      <Button
                        icon={
                          isProcessing ? (
                            <Loader2 className="animate-spin text-error" />
                          ) : (
                            <CircleX className="text-error" />
                          )
                        }
                        color="ghost"
                        disabled={isProcessing}
                        onClick={() => handleRejectNgo(ngo.name, ngo.country)}
                      />
                    </div>
                    <div className="tooltip" data-tip={t("details")}>
                      <Button
                        icon={<Search className="text-warning" />}
                        color="ghost"
                        disabled={isProcessing}
                        onClick={() => {
                          const modal = document.getElementById(
                            `ngo-verification-modal-${ngo.id}`
                          ) as HTMLDialogElement;
                          if (modal) {
                            modal.showModal();
                          }
                        }}
                      />
                    </div>
                    <Modal id={`ngo-verification-modal-${ngo.id}`} ngo={ngo} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 cursor-pointer"
          onClick={() => setSelectedImage(null)}
        >
          <Image
            height={200}
            width={200}
            src={selectedImage}
            alt="Selected NGO Logo"
            className="max-w-full max-h-full rounded-lg shadow-lg"
          />
        </div>
      )}
    </div>
  );
}

export default function NGOVerification() {
  return (
    <AdminProtection fallback="message">
      <NGOVerificationContent />
    </AdminProtection>
  );
}
