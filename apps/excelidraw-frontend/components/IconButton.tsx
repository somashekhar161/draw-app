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
      className="disabled:bg-white hover:scale-105 active:scale-95 transition-transform p-2 disabled:text-black rounded-full font-semibold  disabled:[&>svg]:text-black text-white bg-black border  border-white disabled:border-none"
      disabled={activated}
    >
      {icon}
    </button>
  );
};

export default IconButton;
