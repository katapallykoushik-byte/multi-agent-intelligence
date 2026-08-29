"use client";

import React, { useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import { cn } from "@/lib/utils";

export interface ThreeDMarqueeProps {
  images?: string[];
  items?: React.ReactNode[];
  className?: string;
}

export const ThreeDMarquee = ({
  images,
  items,
  className,
}: ThreeDMarqueeProps) => {
  const contentList: (string | React.ReactNode)[] =
    items && items.length > 0 ? items : images || [];

  // Mouse parallax motion values
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 120 };
  const smoothMouseX = useSpring(mouseX, springConfig);
  const smoothMouseY = useSpring(mouseY, springConfig);

  // Subtle parallax shift
  const parallaxX = useTransform(smoothMouseX, [-0.5, 0.5], [-6, 6]);
  const parallaxY = useTransform(smoothMouseY, [-0.5, 0.5], [-4, 4]);

  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    setIsHovered(false);
  };

  // Split into 4 balanced columns
  const chunkSize = Math.ceil(contentList.length / 4);
  const chunks = Array.from({ length: 4 }, (_, colIndex) => {
    const start = colIndex * chunkSize;
    return contentList.slice(start, start + chunkSize);
  });

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      className={cn(
        "relative mx-auto block h-[600px] w-full overflow-hidden max-sm:h-[460px]",
        className
      )}
    >
      <div className="flex size-full items-center justify-center">
        <motion.div
          style={{
            x: parallaxX,
            y: parallaxY,
          }}
          className="size-[1700px] shrink-0 scale-55 sm:scale-70 md:scale-80 lg:scale-95 transition-transform duration-700"
        >
          {/* Spatial 3D Perspective layout */}
          <div
            style={{
              transform: "rotateX(38deg) rotateY(0deg) rotateZ(-24deg)",
            }}
            className="relative top-72 right-[44%] grid size-full origin-top-left grid-cols-4 gap-7 transform-3d select-none"
          >
            {chunks.map((subarray, colIndex) => {
              const isEven = colIndex % 2 === 0;
              const yTarget = isHovered ? 0 : isEven ? 60 : -60;

              return (
                <motion.div
                  animate={{ y: yTarget }}
                  transition={{
                    duration: isEven ? 14 : 18,
                    repeat: isHovered ? 0 : Infinity,
                    repeatType: "reverse",
                    ease: "easeInOut",
                  }}
                  key={colIndex + "marquee"}
                  className="flex flex-col items-start gap-7"
                >
                  <GridLineVertical className="-left-3.5" offset="80px" />
                  {subarray.map((item, itemIndex) => {
                    const key = `col-${colIndex}-item-${itemIndex}`;
                    return (
                      <div className="relative w-full max-w-[340px]" key={key}>
                        <GridLineHorizontal className="-top-3.5" offset="20px" />
                        <div>
                          {typeof item === "string" ? (
                            <img
                              src={item}
                              alt={`Item ${itemIndex + 1}`}
                              className="aspect-[970/700] rounded-xl object-cover ring-1 ring-[var(--border-subtle)]"
                              width={970}
                              height={700}
                            />
                          ) : (
                            item
                          )}
                        </div>
                      </div>
                    );
                  })}
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* Spatial edge depth gradient overlays */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[var(--background)] via-[var(--background)]/80 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[var(--background)] via-[var(--background)]/80 to-transparent" />
    </div>
  );
};

const GridLineHorizontal = ({
  className,
  offset,
}: {
  className?: string;
  offset?: string;
}) => {
  return (
    <div
      style={
        {
          "--background": "#06082D",
          "--color": "rgba(140, 165, 211, 0.08)",
          "--height": "1px",
          "--width": "6px",
          "--fade-stop": "90%",
          "--offset": offset || "200px",
          maskComposite: "exclude",
        } as React.CSSProperties
      }
      className={cn(
        "absolute left-[calc(var(--offset)/2*-1)] h-[var(--height)] w-[calc(100%+var(--offset))]",
        "bg-[linear-gradient(to_right,var(--color),var(--color)_50%,transparent_0,transparent)]",
        "[background-size:var(--width)_var(--height)]",
        "[mask:linear-gradient(to_left,var(--background)_var(--fade-stop),transparent),_linear-gradient(to_right,var(--background)_var(--fade-stop),transparent),_linear-gradient(black,black)]",
        "[mask-composite:exclude]",
        "pointer-events-none z-10",
        className
      )}
    />
  );
};

const GridLineVertical = ({
  className,
  offset,
}: {
  className?: string;
  offset?: string;
}) => {
  return (
    <div
      style={
        {
          "--background": "#06082D",
          "--color": "rgba(140, 165, 211, 0.08)",
          "--height": "6px",
          "--width": "1px",
          "--fade-stop": "90%",
          "--offset": offset || "150px",
          maskComposite: "exclude",
        } as React.CSSProperties
      }
      className={cn(
        "absolute top-[calc(var(--offset)/2*-1)] h-[calc(100%+var(--offset))] w-[var(--width)]",
        "bg-[linear-gradient(to_bottom,var(--color),var(--color)_50%,transparent_0,transparent)]",
        "[background-size:var(--width)_var(--height)]",
        "[mask:linear-gradient(to_top,var(--background)_var(--fade-stop),transparent),_linear-gradient(to_bottom,var(--background)_var(--fade-stop),transparent),_linear-gradient(black,black)]",
        "[mask-composite:exclude]",
        "pointer-events-none z-10",
        className
      )}
    />
  );
};
