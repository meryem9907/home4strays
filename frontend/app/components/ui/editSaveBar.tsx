import { Edit, Save, Trash2, X } from "lucide-react";
import Button from "./button";
import { useTranslations } from "next-intl";
import { useState } from "react";

interface EditSaveBarProps {
  isEditing: boolean;
  onDeleteClick?: () => void;
  onEditClick: () => void;
  onCancelClick: () => void;
  onSaveClick: () => void;
}

export default function EditSaveBar({
  isEditing,
  onDeleteClick,
  onEditClick,
  onCancelClick,
  onSaveClick,
}: EditSaveBarProps) {
  const t = useTranslations("Common");
  const tEditSaveBar = useTranslations("EditSaveBar");
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const confirmDelete = () => {
    setShowConfirmModal(false);
    onDeleteClick?.();
  };

  return (
    <div>
      <div className="flex flex-wrap justify-end gap-4">
        {onDeleteClick && (
          <>
          <div className="hidden md:block">
            <Button
              icon={<Trash2 className="h-4 w-4" />}
              onClick={() => setShowConfirmModal(true)}
              label={t("deleteAcc")}
              color="error"
            />
          </div>
          <div className="md:hidden">
            <Button
              icon={<Trash2 className="h-4 w-4" />}
              onClick={() => setShowConfirmModal(true)}
              color="error"
            />
          </div>
          </>
        )}

        {!isEditing ? (
          <Button
            icon={<Edit className="h-4 w-4" />}
            onClick={onEditClick}
            label={t("edit")}
            color="primary"
          />
        ) : (
          <>
            <Button
              icon={<X className="h-4 w-4" />}
              onClick={onCancelClick}
              label={t("cancel")}
              color="error"
              soft
            />
            <Button
              icon={<Save className="h-4 w-4" />}
              onClick={onSaveClick}
              label={t("save")}
              color="primary"
            />
          </>
        )}
      </div>

      {/* Modal */}
      {showConfirmModal && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">
              {tEditSaveBar("confirmDeleteTitle") || "Sind Sie sich sicher?"}
            </h3>
            <p className="py-4">
              {tEditSaveBar("confirmDeleteMsg") || "Möchten Sie den Account wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden."}
            </p>
            <div className="modal-action">
              <Button 
                label={t("cancel")}
                onClick={() => setShowConfirmModal(false)}
              />
              <Button 
                label={t("deleteAcc")}
                color="error"
                onClick={confirmDelete}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
