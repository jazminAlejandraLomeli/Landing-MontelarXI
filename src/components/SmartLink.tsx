import type { ReactNode } from "react";
import { Link } from "react-router";

interface SmartLinkProps {
  href: string;
  className?: string;
  onClick?: () => void;
  children: ReactNode;
  "aria-label"?: string;
}

// Los href del JSON pueden ser páginas internas ("/recetas", "/#productos"), anclas de la
// misma página ("#productos") o enlaces externos. Las internas navegan sin recargar.
export default function SmartLink({ href, children, ...props }: SmartLinkProps) {
  if (href.startsWith("/")) {
    return (
      <Link to={href} {...props}>
        {children}
      </Link>
    );
  }
  const external = /^https?:\/\//.test(href);
  return (
    <a href={href} {...(external ? { target: "_blank", rel: "noreferrer" } : {})} {...props}>
      {children}
    </a>
  );
}
