import Link from "next/link";

interface StepsProps {
  labels: { label: string, isActive: boolean, href?: string, bold?: boolean }[];
}

export default function Steps({ labels }: StepsProps) {
  return (
    <ul className="steps my-4 md:my-8 w-full">
      {labels.map((step, index) => (
        <li
          key={index}
          className={`step ${step.isActive ? 'step-primary' : ''} ${step.bold ? 'font-semibold' : ''}`}
        >
          {step.href ? (
            <Link href={step.href}>
              {step.label}
            </Link>
          ) : (
            <span>{step.label}</span>
          )}
        </li>
      ))}
    </ul>
  );
}
