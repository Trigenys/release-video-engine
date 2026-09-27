import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ElementType,
  type ReactNode
} from "react";

type MotionOrigin = "up" | "left" | "right" | "scale";

interface MotionRevealProps {
  as?: ElementType;
  children: ReactNode;
  className?: string;
  delayMs?: number;
  origin?: MotionOrigin;
}

export function MotionReveal({
  as: Tag = "div",
  children,
  className = "",
  delayMs = 0,
  origin = "up"
}: MotionRevealProps) {
  const elementRef = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reduced || typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setVisible(true);
        observer.disconnect();
      },
      {
        threshold: 0.14,
        rootMargin: "0px 0px -8% 0px"
      }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const style = {
    "--motion-delay": `${Math.max(0, delayMs)}ms`
  } as CSSProperties;

  return (
    <Tag
      ref={(node: HTMLElement | null) => {
        elementRef.current = node;
      }}
      className={[
        "motion-reveal",
        `motion-from-${origin}`,
        visible ? "is-visible" : "",
        className
      ]
        .filter(Boolean)
        .join(" ")}
      style={style}
    >
      {children}
    </Tag>
  );
}
