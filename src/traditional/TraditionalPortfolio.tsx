import type { RefObject } from "react";
import { Nav } from "./Nav";
import { Hero } from "./Hero";
import { About } from "./About";
import { Experience } from "./Experience";
import { Projects } from "./Projects";
import { Skills } from "./Skills";
import { Contact } from "./Contact";
import { Footer } from "./Footer";

interface TraditionalPortfolioProps {
  scrollContainerRef: RefObject<HTMLDivElement | null>;
}

export function TraditionalPortfolio({ scrollContainerRef }: TraditionalPortfolioProps) {
  return (
    <div className="min-h-full bg-jos-bg-deep text-jos-text">
      <Nav scrollContainerRef={scrollContainerRef} />
      <main>
        <Hero />
        <About />
        <Experience />
        <Projects />
        <Skills />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
