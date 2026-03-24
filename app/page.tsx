import { Hero } from "@/components/landing/Hero";
import EVFABanner from "@/components/landing/EVFABanner";
import { WhoWeServe } from "@/components/landing/WhoWeServe";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { InternationalTransfers } from "@/components/landing/InternationalTransfers";
import { CountriesGrid } from "@/components/landing/CountriesGrid";
import { WhyEVFA } from "@/components/landing/WhyEVFA";
import { FAQAccordion } from "@/components/landing/FAQAccordion";

export default function Home() {
  return (
    <div className="bg-[color:var(--background)]">
      <EVFABanner />
      <Hero />
      <WhoWeServe />
      <HowItWorks />
      <InternationalTransfers />
      <CountriesGrid />
      <WhyEVFA />
      <FAQAccordion />
    </div>
  );
}

