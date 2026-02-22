function Mascot({ size = "lg", variant = "circle" }) {
  if (variant === "full") {
    const imgSize = size === "lg" ? "w-64 h-64" : "w-40 h-40";
    return (
      <div className={`${imgSize} mx-auto`}>
        <img
          src="/assets/mascot.png"
          alt="AASHA mascot"
          className="w-full h-full object-contain"
        />
      </div>
    );
  }

  const outer =
    size === "xl" ? "w-72 h-72" : size === "lg" ? "w-52 h-52" : size === "sm" ? "w-24 h-24" : "w-32 h-32";

  const circle =
    size === "xl" ? "w-48 h-48" : size === "lg" ? "w-36 h-36" : size === "sm" ? "w-16 h-16" : "w-20 h-20";

  return (
    <div className={`${outer} relative mx-auto`}>
      <div
        className={`${circle} absolute rounded-full bg-[#C9B99A] left-1/2 top-[55%] -translate-x-1/2 -translate-y-1/2`}
      />
      <img
        src="/assets/mascot.png"
        alt="AASHA mascot"
        className="relative w-full h-full object-contain"
      />
    </div>
  );
}

export default Mascot;
