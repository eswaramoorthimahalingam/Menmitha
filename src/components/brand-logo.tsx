import logoImg from "@/assets/menmitha-logo-removebg.png";

type BrandLogoProps = {
  light?: boolean;
};

export function BrandLogo({ light = false }: BrandLogoProps) {
  return (
    <img
      src={logoImg}
      alt="Menmitha Food Products"
      className={
        light
          ? "h-20 w-auto rounded-xl bg-white/95 object-contain p-2 shadow-card"
          : "h-16 w-auto object-contain sm:h-[4.75rem]"
      }
    />
  );
}
