"use client";

import { Lottie } from "lottie-react";

type LottiePlayerProps = {
  path: string;
  loop?: boolean;
  autoplay?: boolean;
  className?: string;
};

export default function LottiePlayer({
  path,
  loop = true,
  autoplay = true,
  className,
}: LottiePlayerProps) {
  return (
    <Lottie src={path} loop={loop} autoplay={autoplay} className={className} />
  );
}
