import { Twitter, Linkedin, Github, Mail, MapPin, Phone } from "lucide-react";
import { Container, Logo } from "../ui/shared";
import { FOOTER_LINKS } from "../../data/content";

const SOCIALS = [
  { label: "Twitter", icon: Twitter, href: "#" },
  { label: "LinkedIn", icon: Linkedin, href: "#" },
  { label: "GitHub", icon: Github, href: "#" },
];

export default function Footer() {
  return (
    <footer className="bg-navy-950 text-slate-400">
      <Container className="py-14">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="[&_span.text-lg]:text-white">
              <Logo dark />
            </div>
            <p className="mt-4 max-w-sm text-sm leading-relaxed">
              Nexora AI builds AI-powered digital solutions that automate workflows, unlock
              insights, and help modern businesses grow faster.
            </p>
            <div className="mt-6 flex gap-3">
              {SOCIALS.map(({ label, icon: Icon, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 text-slate-300 transition-colors hover:bg-brand-grad hover:text-white"
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>

          <nav aria-label="Footer quick links">
            <h3 className="text-sm font-bold uppercase tracking-widest text-white">Quick Links</h3>
            <ul className="mt-4 space-y-2.5">
              {FOOTER_LINKS.map((l) => (
                <li key={l.href}>
                  <a href={l.href} className="text-sm transition-colors hover:text-sky-glow">
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest text-white">Contact</h3>
            <ul className="mt-4 space-y-3 text-sm">
              <li className="flex items-center gap-2.5">
                <Mail className="h-4 w-4 text-violet-soft" aria-hidden="true" />
                <a href="mailto:hello@nexora.ai" className="hover:text-sky-glow">hello@nexora.ai</a>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="h-4 w-4 text-violet-soft" aria-hidden="true" />
                <span>+1 (555) 000-1234</span>
              </li>
              <li className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 h-4 w-4 text-violet-soft" aria-hidden="true" />
                <span>123 Innovation Drive, Suite 400, Sample City</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-6 text-center text-xs">
          © {new Date().getFullYear()} Nexora AI. All rights reserved. Contact details and
          statistics on this page are placeholders.
        </div>
      </Container>
    </footer>
  );
}
