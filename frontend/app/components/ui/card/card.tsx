import { useRouter } from "next/navigation";
import Badge from "../badge";
import Button from "../button";
import { Heart } from "lucide-react";
import { ReactNode } from "react";
import { DaisyUIColor } from "../../../types/daisyui";
import Description from "./card-description";
import CardImage from "./card-image";
import { getWebsiteIcon } from "./functions";
import Progress from "../progress";
import { useBookmarks } from "../../../../contexts/BookmarkContext";
import { useAccessControl } from "../../../../contexts/AccessControlContext";

/**
 * Props for the Card component.
 *
 * @interface CardProps
 * @property {string} href - Navigation URL when card is clicked
 * @property {string[]} [image] - Array of image URLs to display (first image shown as primary)
 * @property {string} title - Card title/heading text
 * @property {string} [description] - Optional description text to display
 * @property {string} [type] - Type classification (e.g., species for animals)
 * @property {ReactNode} [petIcon] - Optional icon to display next to type
 * @property {Array} [tags] - Array of tag objects with icon and label
 * @property {Object} [badge] - Badge configuration with icon, label, and styling
 * @property {string[]} [websites] - Array of website URLs to display as clickable buttons
 * @property {number} [progress] - Progress percentage (0-100) to display progress bar
 * @property {string} [petId] - Pet ID for bookmark functionality (animals only)
 */
interface CardProps {
  href: string;
  image?: string[];
  title: string;
  description?: string;
  type?: string;
  petIcon?: ReactNode;
  tags?: { icon: React.ReactNode; label: string }[];
  badge?: {
    icon: React.ReactNode;
    label: string;
    color?: DaisyUIColor;
    soft?: boolean;
  };
  websites?: string[];
  progress?: number;
  petId?: string;
}

/**
 * Versatile Card component for displaying various types of content cards.
 *
 * This is a flexible, reusable card component that can display different types
 * of content including animals, NGOs, caretakers, and more. It provides consistent
 * styling and interactive features across the application.
 *
 * Features:
 * - Clickable navigation to detailed views
 * - Image carousel support for multiple images
 * - Flexible tag and badge system
 * - Bookmark functionality for animals (with access control)
 * - External website links with appropriate icons
 * - Progress bar display for completion status
 * - Responsive design with hover effects
 * - Integration with access control for feature gating
 *
 * @param {CardProps} props - Component props
 * @returns {JSX.Element} Rendered card component
 *
 * @example
 * ```tsx
 * // Basic animal card
 * <Card
 *   href="/animals/123"
 *   image={["/images/animal1.jpg", "/images/animal2.jpg"]}
 *   title="Buddy"
 *   description="Friendly golden retriever looking for a home"
 *   type="Dog"
 *   petIcon={<Dog size={16} />}
 *   petId="123"
 *   tags={[
 *     { icon: <Calendar />, label: "3 Years" },
 *     { icon: <Weight />, label: "25 Kg" }
 *   ]}
 *   badge={{
 *     icon: <HandHelping />,
 *     label: "Animal Rescue NGO",
 *     color: "accent"
 *   }}
 * />
 * ```
 *
 * @example
 * ```tsx
 * // NGO organization card
 * <Card
 *   href="/ngos/456"
 *   image={["/images/ngo-logo.jpg"]}
 *   title="Local Animal Rescue"
 *   description="Dedicated to finding homes for rescued animals"
 *   websites={["https://example.org", "https://facebook.com/rescue"]}
 *   progress={85}
 *   badge={{
 *     icon: <CheckCircle />,
 *     label: "Verified",
 *     color: "success"
 *   }}
 * />
 * ```
 *
 * @example
 * ```tsx
 * // Simple content card without interactive features
 * <Card
 *   href="/caretakers/789"
 *   title="John Doe"
 *   description="Experienced animal caretaker"
 *   tags={[
 *     { icon: <MapPin />, label: "New York" },
 *     { icon: <Star />, label: "5 Years Experience" }
 *   ]}
 * />
 * ```
 */
export default function Card({
  href,
  image = [],
  title,
  description,
  type,
  petIcon,
  tags = [],
  badge,
  websites = [],
  progress,
  petId,
}: CardProps) {
  const router = useRouter();
  const { isBookmarked, toggleBookmark, isLoading } = useBookmarks();
  const { permissions } = useAccessControl();

  /**
   * Handles card click navigation.
   * Navigates to the href URL when the card is clicked.
   */
  const handleCardClick = () => {
    router.push(href);
  };

  /**
   * Handles bookmark toggle for animals.
   * Prevents event bubbling to avoid triggering card navigation.
   *
   * @param {React.MouseEvent} e - Click event
   */
  const handleBookmarkClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (petId) {
      await toggleBookmark(petId);
    }
  };

  const bookmarked = petId ? isBookmarked(petId) : false;

  return (
    <div
      className="card bg-base-100 shadow-sm rounded-2xl max-w-110
      cursor-pointer hover:shadow-lg transition-shadow h-full
      border border-neutral"
      onClick={handleCardClick}
    >
      <CardImage images={image} title={title} />

      <div className="card-body p-4 flex flex-col gap-3">
        <span>
          {petIcon && type && (
            <span className="flex items-center text-gray-500 gap-2">
              {petIcon}
              {type}
            </span>
          )}

          <span className="flex items-center justify-between">
            <h2 className="card-title text-2xl font-bold pb-2">{title}</h2>
            {petId && permissions.canBookmarkAnimals && (
              <Button
                icon={bookmarked ? <Heart fill="currentColor" /> : <Heart />}
                color={bookmarked ? "error" : "neutral"}
                size="md"
                onClick={handleBookmarkClick}
                disabled={isLoading}
                rounded
              />
            )}
          </span>
          {description && <Description description={description} />}
        </span>

        {tags.length > 0 && (
          <div className="flex flex-wrap items-start gap-2 mt-3">
            {tags.map((tag, index) => (
              <Badge key={index} icon={tag.icon} label={tag.label} />
            ))}
          </div>
        )}

        <div className="flex justify-between">
          {badge && (
            <Badge
              color={badge.color || "accent"}
              icon={badge.icon}
              label={badge.label}
              soft={badge.soft}
            />
          )}

          {websites.length > 0 && (
            <div className="flex flex-wrap justify-end gap-2 mt-3">
              {websites
                .filter(
                  (website) =>
                    website &&
                    typeof website === "string" &&
                    website.trim() !== ""
                )
                .map((website, index) => (
                  <Button
                    key={index}
                    icon={getWebsiteIcon(website)}
                    rounded
                    size="md"
                    onClick={(e) => {
                      e.stopPropagation();
                      window.open(website, "_blank");
                    }}
                  />
                ))}
            </div>
          )}
        </div>
        {progress && <Progress progress={progress} />}
      </div>
    </div>
  );
}
