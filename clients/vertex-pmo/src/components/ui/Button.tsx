import { ButtonHTMLAttributes, AnchorHTMLAttributes } from "react";
import clsx from "clsx";

type Variant = "primary" | "secondary" | "outline" | "ghost";

const variants: Record<Variant, string> = {
  primary:
    "bg-cobalt-500 text-white hover:bg-cobalt-600 hover:scale-[1.02]",
  secondary:
    "bg-orange-700 text-white hover:bg-orange-800 hover:scale-[1.02]",
  outline:
    "border-2 border-cobalt-500 text-cobalt-600 hover:bg-cobalt-50",
  ghost:
    "text-cobalt-600 hover:bg-cobalt-50",
};

interface BaseProps {
  variant?: Variant;
  size?: "sm" | "md" | "lg";
  className?: string;
}

type ButtonProps = BaseProps &
  ButtonHTMLAttributes<HTMLButtonElement> & { href?: never };
type LinkProps = BaseProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & { href: string };

type Props = ButtonProps | LinkProps;

export function Button({
  variant = "primary",
  size = "md",
  className,
  ...props
}: Props) {
  const classes = clsx(
    "inline-flex items-center justify-center rounded-lg font-medium transition-all",
    variants[variant],
    {
      "px-4 py-2 text-sm": size === "sm",
      "px-6 py-3 text-base": size === "md",
      "px-8 py-4 text-lg": size === "lg",
    },
    className
  );

  if ("href" in props && props.href) {
    return <a className={classes} {...(props as LinkProps)} />;
  }

  return <button className={classes} {...(props as ButtonProps)} />;
}
