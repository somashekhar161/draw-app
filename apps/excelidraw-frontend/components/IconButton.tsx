import React from "react";

const IconButton = ({
  icon,
  onClick,
  activated = false,
}: {
  icon: React.ReactNode;
  onClick: () => void;
  activated?: boolean;
}) => {
  return (
    <button
      onClick={onClick}
      className="bg-white hover:scale-105 active:scale-95 transition-transform p-2 text-black rounded-full font-semibold  disabled:[&>svg]:text-white disabled:text-white disabled:bg-black disabled:border disabled:border-white"
      disabled={activated}
    >
      {icon}
    </button>
  );
};

export default IconButton;
