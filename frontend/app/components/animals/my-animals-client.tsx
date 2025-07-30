"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useAccessControl } from "@/contexts/AccessControlContext";
import { Link } from "@/i18n/routing";
import AnimalCard from "./animal-card";
import { Animal } from "@/app/types/animal";

interface MyAnimalsClientProps {
  locale: string;
}

export default function MyAnimalsClient({ locale }: MyAnimalsClientProps) {
  const [animals, setAnimals] = useState<Animal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { token } = useAuth();
  const { permissions } = useAccessControl();

  useEffect(() => {
    const fetchMyAnimals = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await fetch(`/api/pets/my-pets?lang=${locale}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch animals");
        }

        const data = await response.json();
        setAnimals(data.data || []);
      } catch (err) {
        console.error("Error fetching my animals:", err);
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchMyAnimals();
  }, [token, locale]);

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p>You need to be logged in to view your animals.</p>
        </div>
      </div>
    );
  }

  if (!permissions.canAccessAddAnimals) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p>Only NGO members and admins can view this page.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4 text-error">Error</h1>
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200 p-4">
      <div className="container mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">My Animals</h1>
          <p className="text-lg opacity-70">
            Animals uploaded by your NGO ({animals.length} total)
          </p>
        </div>

        {animals.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🐾</div>
            <h2 className="text-2xl font-bold mb-4">No Animals Yet</h2>
            <p className="text-lg opacity-70 mb-6">
              Your NGO hasn&apos;t uploaded any animals yet.
            </p>
            <Link href="/add-animal" className="btn btn-primary">
              Add Your First Animal
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {animals.map((animal) => (
              <AnimalCard key={animal.id} animal={animal} locale={locale} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
