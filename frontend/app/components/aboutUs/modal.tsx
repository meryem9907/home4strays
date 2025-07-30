"use client"
import { ReactNode } from "react";
import Button from "../ui/button";
import { useTranslations } from "next-intl";

interface ModalProps {
isOpen: boolean;
  onClose: () => void;
  title?: ReactNode;
	text: ReactNode;
};
export default function Modal({
		isOpen, 
		onClose, 
		title, 
		text,
}: ModalProps) {
	const t = useTranslations("aboutUs");
	return (
		<div className={`modal ${isOpen  ? 'modal-open' : ''}`}>
			<div className="modal-box w-11/12 max-w-4xl">
				<h3 className="font-bold text-xl sm:text-2xl">{title}</h3>
				<p className="py-4 text-base sm:text-lg">{text}</p>
				<div className="modal-action flex justify-center">
					<Button label={t("Close", {defaultMessage: "Close"})} color="primary" wide onClick={onClose} />
				</div>
				
			</div>
			<label className="modal-backdrop" onClick={onClose}></label>
		</div>
	);
}