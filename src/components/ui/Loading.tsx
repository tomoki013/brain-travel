"use client";

import Lottie from "react-lottie";
import animationData from "@/../public/animations/loading.json";

type LoadingProps = {
  height?: number;
  width?: number;
};

const Loading = ({ height = 400, width = 400 }: LoadingProps) => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  return <Lottie options={defaultOptions} height={height} width={width} />;
};

export default Loading;
