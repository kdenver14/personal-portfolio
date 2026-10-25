import { FEATURED } from "@/content/featured";
import { Contact } from "@/components/contact";
import { ContributionGraph } from "@/components/contribution-graph";
import { DotField } from "@/components/dot-field";
import { Experience } from "@/components/experience";
import { Intro } from "@/components/intro";
import { MoreProjects } from "@/components/more-projects";
import { NavBar } from "@/components/nav-bar";
import { ParticlesToggle } from "@/components/particles-toggle";
import { ProjectDetail } from "@/components/project-detail";
import { ProjectDialog } from "@/components/project-dialog";
import { ProjectRow } from "@/components/project-row";
import { Section } from "@/components/section";
import { SiteFooter } from "@/components/site-footer";
import { Stack } from "@/components/stack";
import { TechMarquee } from "@/components/tech-marquee";

export default function Home() {
  return (
    <>
      <DotField />
      <NavBar />
      <ParticlesToggle />
      <div className="page">
      <main>
        <Intro />
        <Section id="projects" title="Projects">
          <ul className="project-list">
            {FEATURED.map((project) => <ProjectRow key={project.id} project={project} />)}
          </ul>
          {FEATURED.map((project) => (
            <ProjectDialog key={project.id} id={project.id}>
              <ProjectDetail project={project} />
            </ProjectDialog>
          ))}
        </Section>
        <Section id="experience" title="Experience">
          <Experience />
        </Section>
        <Section id="technologies" title="Technologies">
          <TechMarquee />
          <Stack />
        </Section>
        <Section id="activity" title="Activity">
          <ContributionGraph />
        </Section>
        <Section id="more-projects" title="More projects">
          <MoreProjects />
        </Section>
        <Section id="contact" title="Contact">
          <Contact />
        </Section>
      </main>
      <SiteFooter />
      </div>
    </>
  );
}
