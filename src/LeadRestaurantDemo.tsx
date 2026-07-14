import {
  ArrowRight,
  Facebook,
  Mail,
  MapPin,
  Phone,
  Star,
  Utensils,
} from 'lucide-react';
import type { CSSProperties } from 'react';
import type { LeadRestaurantDemoConfig } from './data/demos';

const phoneHref = (phone: string) => `tel:${phone.replace(/\D/g, '')}`;
const emailHref = (email: string) => `mailto:${email}`;

type HeroVariant = 'seafood' | 'truck' | 'taqueria';

interface LeadRestaurantDemoProps {
  demo: LeadRestaurantDemoConfig;
}

function getVariant(slug: string): HeroVariant {
  if (slug.includes('corey')) return 'seafood';
  if (slug.includes('lidia')) return 'truck';
  return 'taqueria';
}

function HeroMedia({ demo, variant }: { demo: LeadRestaurantDemoConfig; variant: HeroVariant }) {
  const [first, second, third, fourth] = demo.galleryImages;

  if (variant === 'seafood') {
    return (
      <div className="grid gap-3 lg:grid-cols-5">
        <div className="overflow-hidden rounded-2xl border border-black/10 bg-white shadow-lg lg:col-span-3">
          <img src={demo.heroImage} alt={`${demo.name} seafood plate`} className="h-[380px] w-full object-cover md:h-[500px]" />
        </div>
        <div className="grid gap-3 lg:col-span-2">
          <div className="overflow-hidden rounded-2xl border border-black/10 bg-white shadow-sm">
            <img src={demo.menuImage ?? demo.featureImage} alt={`${demo.name} menu board`} className="h-44 w-full object-cover md:h-[242px]" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <img src={first} alt={`${demo.name} fried seafood`} className="h-40 w-full rounded-2xl object-cover shadow-sm md:h-[245px]" />
            <div className="rounded-2xl bg-[var(--accent-soft)] p-5 text-[var(--accent-dark)]">
              <Star className="mb-8 h-7 w-7 fill-[var(--accent)] text-[var(--accent)]" />
              <p className="text-sm font-black uppercase tracking-[0.14em]">{demo.cuisine}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'truck') {
    return (
      <div className="grid gap-3 md:grid-cols-5">
        <div className="overflow-hidden rounded-2xl border border-black/10 bg-white shadow-lg md:col-span-3">
          <img src={demo.heroImage} alt={`${demo.name} tacos`} className="h-[360px] w-full object-cover md:h-[500px]" />
        </div>
        <div className="grid gap-3 md:col-span-2">
          <div className="overflow-hidden rounded-2xl border border-black/10 bg-white shadow-sm">
            <img src={demo.featureImage} alt={`${demo.name} menu`} className="h-44 w-full object-cover md:h-56" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <img src={second} alt={`${demo.name} plate`} className="h-36 w-full rounded-2xl object-cover shadow-sm md:h-[260px]" />
            <img src={third} alt={`${demo.name} combo`} className="h-36 w-full rounded-2xl object-cover shadow-sm md:h-[260px]" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-3 md:grid-cols-6">
      <div className="overflow-hidden rounded-2xl border border-black/10 bg-white shadow-lg md:col-span-4">
        <img src={demo.heroImage} alt={`${demo.name} fajita tacos`} className="h-[350px] w-full object-cover md:h-[500px]" />
      </div>
      <div className="grid gap-3 md:col-span-2">
        <div className="rounded-2xl bg-[var(--accent-dark)] p-5 text-white">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-white/70">Wichita pickup</p>
          <p className="mt-6 text-2xl font-black leading-tight">{demo.menuHighlights[0].name}</p>
        </div>
        <img src={fourth ?? first} alt={`${demo.name} plate`} className="h-40 w-full rounded-2xl object-cover shadow-sm md:h-[250px]" />
      </div>
    </div>
  );
}

export default function LeadRestaurantDemo({ demo }: LeadRestaurantDemoProps) {
  const primaryHref = demo.phone ? phoneHref(demo.phone) : emailHref(demo.email);
  const primaryLabel = demo.phone ? 'Call Now' : 'Email Now';
  const variant = getVariant(demo.slug);

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
      <header className="sticky top-0 z-40 border-b border-black/10 bg-[#fbfaf7]/92 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 md:px-8">
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

      <section className="mx-auto grid max-w-7xl gap-7 px-4 py-6 md:px-8 lg:grid-cols-[0.86fr_1.14fr] lg:gap-10 lg:py-8">
        <div className="flex flex-col justify-start gap-6 lg:pt-5">
          <div className="inline-flex w-fit items-center gap-2 rounded-full bg-[var(--accent-soft)] px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-[var(--accent-dark)]">
            <Star className="h-4 w-4 fill-[var(--accent)] text-[var(--accent)]" />
            Private demo preview
          </div>

          <div className="space-y-4">
            <h1 className="max-w-3xl text-4xl font-black leading-[1.02] tracking-tight md:text-5xl xl:text-6xl">
              {demo.heroTitle}
            </h1>
            <p className="max-w-xl text-base font-semibold leading-relaxed text-zinc-700 md:text-lg">
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

          <div className="grid max-w-2xl grid-cols-3 gap-3 border-t border-black/10 pt-5">
            <div>
              <span className="block text-lg font-black text-[var(--accent-dark)] md:text-xl">{demo.rating}</span>
              <span className="text-xs font-bold text-zinc-500">Social proof</span>
            </div>
            <div>
              <span className="block text-lg font-black text-[var(--accent-dark)] md:text-xl">{demo.city.split(',')[0]}</span>
              <span className="text-xs font-bold text-zinc-500">Local service</span>
            </div>
            <div>
              <span className="block text-lg font-black text-[var(--accent-dark)] md:text-xl">Photos</span>
              <span className="text-xs font-bold text-zinc-500">Real assets</span>
            </div>
          </div>

          <div className="rounded-2xl border border-black/10 bg-white p-4 shadow-sm">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-[var(--accent)]">{demo.cuisine}</p>
            <p className="mt-2 text-sm font-semibold leading-relaxed text-zinc-600">{demo.description}</p>
          </div>
        </div>

        <HeroMedia demo={demo} variant={variant} />
      </section>

      <section id="menu" className="border-y border-black/10 bg-white px-4 py-12 md:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
          <div className="space-y-5">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-[var(--accent)]">Menu preview</p>
            <h2 className="text-3xl font-black tracking-tight md:text-5xl">Put the best dishes above the fold.</h2>
            <p className="max-w-xl text-base font-semibold leading-relaxed text-zinc-600">
              The menu section gives customers a quick reason to call, message, or save the page.
            </p>
            {demo.menuImage && (
              <div className="overflow-hidden rounded-2xl border border-black/10 bg-zinc-50">
                <img src={demo.menuImage} alt={`${demo.name} menu board`} className="h-64 w-full object-cover" />
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

      <section id="gallery" className="mx-auto max-w-7xl px-4 py-14 md:px-8">
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
