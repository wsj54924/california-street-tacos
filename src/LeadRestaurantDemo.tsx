import {
  ArrowRight,
  Facebook,
  Mail,
  MapPin,
  Phone,
  Sparkles,
  Star,
  Utensils,
} from 'lucide-react';
import type { CSSProperties } from 'react';
import type { LeadRestaurantDemoConfig } from './data/demos';

const phoneHref = (phone: string) => `tel:${phone.replace(/\D/g, '')}`;
const emailHref = (email: string) => `mailto:${email}`;

interface LeadRestaurantDemoProps {
  demo: LeadRestaurantDemoConfig;
}

export default function LeadRestaurantDemo({ demo }: LeadRestaurantDemoProps) {
  const primaryHref = demo.phone ? phoneHref(demo.phone) : emailHref(demo.email);
  const primaryLabel = demo.phone ? 'Call Now' : 'Email Now';

  return (
    <main
      className="min-h-[100dvh] bg-[#fbfaf7] text-[#161616] font-sans"
      style={
        {
          '--accent': demo.accent,
          '--accent-dark': demo.darkAccent,
          '--accent-soft': demo.softAccent,
        } as CSSProperties
      }
    >
      <header className="sticky top-0 z-40 border-b border-black/10 bg-[#fbfaf7]/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 md:px-8">
          <a href="#" className="flex min-w-0 items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--accent-soft)] text-[var(--accent-dark)]">
              <Utensils className="h-5 w-5" />
            </span>
            <span className="min-w-0">
              <span className="block truncate text-lg font-black tracking-tight md:text-xl">{demo.name}</span>
              <span className="block truncate text-xs font-bold uppercase tracking-[0.12em] text-zinc-500">{demo.city}</span>
            </span>
          </a>

          <nav className="hidden items-center gap-6 text-sm font-bold text-zinc-700 md:flex">
            <a href="#menu" className="hover:text-[var(--accent-dark)]">Menu</a>
            <a href="#gallery" className="hover:text-[var(--accent-dark)]">Photos</a>
            <a href="#contact" className="hover:text-[var(--accent-dark)]">Contact</a>
          </nav>

          <a
            href={primaryHref}
            className="inline-flex shrink-0 items-center gap-2 rounded-full bg-[var(--accent)] px-4 py-2.5 text-sm font-black text-white shadow-sm transition hover:brightness-95 active:scale-[0.98]"
          >
            {demo.phone ? <Phone className="h-4 w-4" /> : <Mail className="h-4 w-4" />}
            <span className="hidden sm:inline">{primaryLabel}</span>
          </a>
        </div>
      </header>

      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-10 md:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:py-16">
        <div className="space-y-7">
          <div className="inline-flex items-center gap-2 rounded-full bg-[var(--accent-soft)] px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-[var(--accent-dark)]">
            <Sparkles className="h-4 w-4" />
            Private demo preview
          </div>

          <div className="space-y-5">
            <h1 className="max-w-3xl text-4xl font-black leading-[1.02] tracking-tight md:text-6xl">
              {demo.heroTitle}
            </h1>
            <p className="max-w-2xl text-lg font-semibold leading-relaxed text-zinc-700">
              {demo.tagline}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <a
              href={primaryHref}
              className="inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-6 py-3.5 text-sm font-black text-white shadow-sm transition hover:brightness-95 active:scale-[0.98]"
            >
              {primaryLabel}
              <ArrowRight className="h-4 w-4" />
            </a>
            <a
              href="#menu"
              className="inline-flex items-center gap-2 rounded-full border-2 border-[var(--accent)] px-6 py-3.5 text-sm font-black text-[var(--accent-dark)] transition hover:bg-[var(--accent-soft)] active:scale-[0.98]"
            >
              View Food
            </a>
          </div>

          <div className="grid max-w-2xl grid-cols-3 gap-3 border-t border-black/10 pt-6">
            <div>
              <span className="block text-xl font-black text-[var(--accent-dark)]">{demo.rating}</span>
              <span className="text-xs font-bold text-zinc-500">Social proof</span>
            </div>
            <div>
              <span className="block text-xl font-black text-[var(--accent-dark)]">{demo.city.split(',')[0]}</span>
              <span className="text-xs font-bold text-zinc-500">Local service</span>
            </div>
            <div>
              <span className="block text-xl font-black text-[var(--accent-dark)]">Photos</span>
              <span className="text-xs font-bold text-zinc-500">Real menu assets</span>
            </div>
          </div>
        </div>

        <div className="grid min-h-[520px] grid-cols-6 grid-rows-6 gap-3">
          <div className="col-span-6 row-span-4 overflow-hidden rounded-2xl shadow-xl md:col-span-4 md:row-span-4">
            <img src={demo.heroImage} alt={`${demo.name} signature food`} className="h-full w-full object-cover" />
          </div>
          <div className="col-span-3 row-span-2 overflow-hidden rounded-2xl shadow-lg md:col-span-2 md:col-start-5">
            <img src={demo.featureImage} alt={`${demo.name} featured plate`} className="h-full w-full object-cover" />
          </div>
          <div className="col-span-3 row-span-2 overflow-hidden rounded-2xl bg-[var(--accent-soft)] p-4 md:col-span-2 md:col-start-5">
            <div className="flex h-full flex-col justify-between">
              <Star className="h-7 w-7 fill-[var(--accent)] text-[var(--accent)]" />
              <div>
                <p className="text-sm font-black uppercase tracking-[0.16em] text-[var(--accent-dark)]">{demo.cuisine}</p>
                <p className="mt-2 text-sm font-semibold leading-relaxed text-zinc-700">{demo.description}</p>
              </div>
            </div>
          </div>
          <div className="col-span-6 row-span-2 overflow-hidden rounded-2xl shadow-lg md:col-span-4">
            <img src={demo.galleryImages[0]} alt={`${demo.name} food spread`} className="h-full w-full object-cover" />
          </div>
        </div>
      </section>

      <section id="menu" className="border-y border-black/10 bg-white px-4 py-16 md:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
          <div className="space-y-5">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[var(--accent)]">Menu preview</p>
            <h2 className="text-3xl font-black tracking-tight md:text-5xl">Make the best dishes impossible to miss.</h2>
            <p className="max-w-xl text-base font-semibold leading-relaxed text-zinc-600">
              This section gives customers a fast reason to call, message, or save the page before they scroll away.
            </p>
            {demo.menuImage && (
              <div className="overflow-hidden rounded-2xl border border-black/10 bg-zinc-50">
                <img src={demo.menuImage} alt={`${demo.name} menu board`} className="h-72 w-full object-cover" />
              </div>
            )}
          </div>

          <div className="grid gap-4">
            {demo.menuHighlights.map((item, index) => (
              <article key={item.name} className="grid gap-3 rounded-2xl border border-black/10 bg-[#fbfaf7] p-5 md:grid-cols-[auto_1fr]">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--accent-soft)] text-sm font-black text-[var(--accent-dark)]">
                  {index + 1}
                </span>
                <div>
                  <h3 className="text-xl font-black tracking-tight">{item.name}</h3>
                  <p className="mt-2 text-sm font-semibold leading-relaxed text-zinc-600">{item.description}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="gallery" className="mx-auto max-w-7xl px-4 py-16 md:px-8">
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[var(--accent)]">Photo gallery</p>
            <h2 className="mt-2 text-3xl font-black tracking-tight md:text-5xl">Real food, ready for a real website.</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {demo.badges.map((badge) => (
              <span key={badge} className="rounded-full bg-[var(--accent-soft)] px-3 py-1.5 text-xs font-black uppercase tracking-[0.12em] text-[var(--accent-dark)]">
                {badge}
              </span>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-6">
          {demo.galleryImages.map((image, index) => (
            <div
              key={image}
              className={`overflow-hidden rounded-2xl bg-zinc-100 ${index === 0 || index === 3 ? 'col-span-2 row-span-2 aspect-[4/5]' : 'aspect-square'}`}
            >
              <img src={image} alt={`${demo.name} gallery item ${index + 1}`} className="h-full w-full object-cover transition duration-500 hover:scale-[1.04]" />
            </div>
          ))}
        </div>
      </section>

      <section id="contact" className="bg-[var(--accent-dark)] px-4 py-14 text-white md:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-[1fr_auto] md:items-center">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.18em] text-white/70">Contact ready</p>
            <h2 className="mt-2 text-3xl font-black tracking-tight md:text-5xl">{demo.name}</h2>
            <div className="mt-5 flex flex-wrap gap-4 text-sm font-bold text-white/85">
              <span className="inline-flex items-center gap-2"><MapPin className="h-4 w-4" />{demo.city}</span>
              {demo.phone && <span className="inline-flex items-center gap-2"><Phone className="h-4 w-4" />{demo.phone}</span>}
              <span className="inline-flex items-center gap-2"><Mail className="h-4 w-4" />{demo.email}</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <a href={primaryHref} className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-black text-[var(--accent-dark)] transition hover:bg-white/90 active:scale-[0.98]">
              {primaryLabel}
              <ArrowRight className="h-4 w-4" />
            </a>
            <a href={demo.facebook} className="inline-flex items-center gap-2 rounded-full border border-white/30 px-5 py-3 text-sm font-black text-white transition hover:bg-white/10 active:scale-[0.98]">
              <Facebook className="h-4 w-4" />
              Facebook
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
