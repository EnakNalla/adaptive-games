import {type ReactNode} from "react";

interface NamedSectionProps {
  title: string;
  children: ReactNode;
  className?: string;
  smallTitle?: boolean;
  innerClassName?: string;
}

export const NamedSection = ({
  title,
  children,
  className,
  smallTitle,
  innerClassName
}: NamedSectionProps) => {
  return (
    <div className={className}>
      <span
        className={`text-muted px-2 ${
          smallTitle ? "fs-6 list-title-sm" : "fs-4"
        } d-block position-relative z-10 bg-body text-center list-title`}
      >
        {title}
      </span>
      <div className={`border rounded px-2 py-4 ${innerClassName}`}>{children}</div>
    </div>
  );
};
