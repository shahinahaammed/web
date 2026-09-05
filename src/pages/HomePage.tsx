import { Utensils, Package, Truck, Star, ChevronRight, Clock, MapPin, Phone } from "lucide-react";
import { T, CATEGORIES, RESTAURANT } from "../data/site";
import { SeaIcon, WaveDivider, Pill, Button, OrderTypeCard, SectionHeading, navLinkStyle } from "../components/ui";
import { money } from "../utils/helpers";
import type { MenuItem, OrderType } from "../types";

interface HomePageProps {
  startOrder: (type?: OrderType) => void;
  goMenu: () => void;
  menuItems: MenuItem[];
}

export default function HomePage({ startOrder, goMenu, menuItems }: HomePageProps) {
  const popular = menuItems.filter((m) => m.popular && m.available).slice(0, 6);
  return (
    <div>
      {/* HERO */}
      <section style={{ position: "relative", background: `linear-gradient(160deg, ${T.inkDeep} 0%, ${T.ink} 60%, #113247 100%)`, paddingTop: 30 }}>
        <div style={{ position: "absolute", inset: 0, opacity: 0.08, backgroundImage: `repeating-linear-gradient(100deg, transparent 0 60px, #fff 60px 61px)` }} />
        <div style={{ maxWidth: 1180, margin: "0 auto", padding: "40px 20px 90px", position: "relative", display: "grid", gridTemplateColumns: "1.1fr .9fr", gap: 40, alignItems: "center" }} className="tw-hero-grid">
          <div>
            <Pill tone="coral">Today's catch, dockside fresh</Pill>
            <h1 style={{ fontFamily: "Fraunces, serif", fontWeight: 600, fontSize: "clamp(38px, 6vw, 62px)", lineHeight: 1.04, color: "#fff", margin: "18px 0 18px" }}>
              {RESTAURANT.name} <span style={{ color: T.tideLight }}>{RESTAURANT.sub}</span>
            </h1>
            <p style={{ fontSize: 17, color: "rgba(255,255,255,.75)", maxWidth: 460, lineHeight: 1.6, marginBottom: 30 }}>{RESTAURANT.tagline}</p>
            <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
              <Button variant="primary" size="lg" onClick={startOrder}>Order Now <ChevronRight size={17} /></Button>
              <Button variant="outlineLight" size="lg" onClick={goMenu}>View Menu</Button>
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <div style={{ position: "relative", width: 300, height: 300 }}>
              <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "radial-gradient(circle, rgba(46,122,118,.35), transparent 70%)" }} />
              <div style={{ position: "absolute", top: "6%", left: "8%" }}><SeaIcon type="lobster" size={90} color={T.brass} strokeWidth={1.3} /></div>
              <div style={{ position: "absolute", bottom: "10%", right: "4%" }}><SeaIcon type="fish" size={110} color="#fff" strokeWidth={1.3} /></div>
              <div style={{ position: "absolute", top: "18%", right: "10%" }}><SeaIcon type="prawn" size={70} color={T.tideLight} strokeWidth={1.3} /></div>
              <div style={{ position: "absolute", bottom: "4%", left: "18%" }}><SeaIcon type="squid" size={60} color="rgba(255,255,255,.6)" strokeWidth={1.3} /></div>
            </div>
          </div>
        </div>
      </section>
      <WaveDivider color={T.sand} bg={T.ink} />

      {/* ORDER TYPE CARDS */}
      <section style={{ background: T.sand, padding: "60px 20px" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto" }}>
          <SectionHeading eyebrow="How would you like to order?" title="Three easy ways to eat with us" />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20, marginTop: 30 }} className="tw-3col">
            <OrderTypeCard icon={<Utensils size={22} color={T.tide} />} title="Dine-In" desc="Reserve your table and order straight to it." onClick={() => startOrder("dine-in")} />
            <OrderTypeCard icon={<Package size={22} color={T.tide} />} title="Takeaway" desc="Order ahead, pick it up hot and ready." onClick={() => startOrder("takeaway")} />
            <OrderTypeCard icon={<Truck size={22} color={T.tide} />} title="Home Delivery" desc="Fresh seafood, delivered to your door." onClick={() => startOrder("delivery")} />
          </div>
        </div>
      </section>

      {/* POPULAR DISHES */}
      <section style={{ background: "#fff", padding: "70px 20px" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto" }}>
          <SectionHeading eyebrow="Guest favourites" title="Popular right now" action={<button onClick={goMenu} style={{ ...navLinkStyle, color: T.tide }}>Full menu →</button>} />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 18, marginTop: 30 }} className="tw-3col">
            {popular.map((item) => (
              <div key={item.id} style={{ border: `1.5px solid ${T.line}`, borderRadius: 14, padding: 20, display: "flex", gap: 14, alignItems: "flex-start" }}>
                <div style={{ width: 52, height: 52, borderRadius: 10, background: T.tideLight, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <SeaIcon type={CATEGORIES.find((c) => c.id === item.category)?.icon} size={26} color={T.tide} />
                </div>
                <div>
                  <div style={{ fontFamily: "Fraunces, serif", fontWeight: 600, fontSize: 16.5, color: T.ink }}>{item.name}</div>
                  <div style={{ fontSize: 13, color: T.ink60, margin: "4px 0 8px", lineHeight: 1.45 }}>{item.desc}</div>
                  <div style={{ fontWeight: 700, color: T.coralDeep, fontSize: 14.5 }}>{money(item.price)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section style={{ background: T.ink, padding: "70px 20px" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 50, alignItems: "center" }} className="tw-2col">
          <div style={{ display: "flex", justifyContent: "center" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, width: "100%", maxWidth: 340 }}>
              {(["fish", "crab", "lobster", "squid"] as const).map((t) => (
                <div key={t} style={{ background: "rgba(255,255,255,.05)", borderRadius: 14, aspectRatio: "1", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <SeaIcon type={t} size={54} color={T.tideLight} strokeWidth={1.3} />
                </div>
              ))}
            </div>
          </div>
          <div>
            <Pill tone="tide">Our story</Pill>
            <h2 style={{ fontFamily: "Fraunces, serif", fontWeight: 600, fontSize: "clamp(26px, 3.4vw, 34px)", color: "#fff", margin: "16px 0" }}>Straight from the harbour to your table</h2>
            <p style={{ color: "rgba(255,255,255,.7)", fontSize: 15.5, lineHeight: 1.7, maxWidth: 460 }}>
              We buy directly from the morning boats, so what lands on your plate was swimming a few hours earlier. No freezers, no shortcuts — just fish, shellfish and rice cooked the way the coast has always cooked them, in a dining room built for long, unhurried meals.
            </p>
          </div>
        </div>
      </section>

      {/* HOURS + LOCATION + MAP */}
      <section style={{ background: T.sand, padding: "70px 20px" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto" }}>
          <SectionHeading eyebrow="Visit us" title="Hours & location" />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1.3fr", gap: 24, marginTop: 30 }} className="tw-2col">
            <div style={{ background: "#fff", borderRadius: 14, border: `1.5px solid ${T.line}`, padding: 26 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}><Clock size={18} color={T.tide} /><span style={{ fontWeight: 700, color: T.ink }}>Opening hours</span></div>
              {RESTAURANT.hours.map((h) => (
                <div key={h.d} style={{ display: "flex", justifyContent: "space-between", padding: "9px 0", borderBottom: `1px solid ${T.line}`, fontSize: 14 }}>
                  <span style={{ color: T.ink60 }}>{h.d}</span><span style={{ color: T.ink, fontWeight: 600 }}>{h.h}</span>
                </div>
              ))}
              <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "22px 0 10px" }}><MapPin size={18} color={T.tide} /><span style={{ fontWeight: 700, color: T.ink }}>Address</span></div>
              <p style={{ fontSize: 14, color: T.ink60, lineHeight: 1.5, marginBottom: 18 }}>{RESTAURANT.address}</p>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <a href={`tel:${RESTAURANT.phone.replace(/\s/g, "")}`} style={{ textDecoration: "none" }}><Button variant="outline" size="sm"><Phone size={14} /> Call</Button></a>
                <a href={`https://wa.me/${RESTAURANT.whatsapp}`} target="_blank" rel="noreferrer" style={{ textDecoration: "none" }}>
                  <Button variant="ghost" size="sm"><SeaIcon type="whatsapp" size={14} color={T.tide} /> WhatsApp</Button>
                </a>
              </div>
            </div>
            <div style={{ borderRadius: 14, overflow: "hidden", border: `1.5px solid ${T.line}`, minHeight: 300 }}>
              <iframe title="map" width="100%" height="100%" style={{ border: 0, minHeight: 300 }} loading="lazy"
                src={`https://www.google.com/maps?q=${encodeURIComponent(RESTAURANT.mapQuery)}&output=embed`} />
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section style={{ background: "#fff", padding: "70px 20px" }}>
        <div style={{ maxWidth: 1180, margin: "0 auto" }}>
          <SectionHeading eyebrow="What guests say" title="Reviews from the dining room" />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 18, marginTop: 30 }} className="tw-3col">
            {[
              { n: "Amina R.", t: "The chilli crab is worth the drive on its own. Booked dine-in and the table was ready exactly on time.", s: 5 },
              { n: "David O.", t: "Ordered delivery on a Friday night — arrived hot, well packed, and the WhatsApp updates were a nice touch.", s: 5 },
              { n: "Priya K.", t: "Takeaway pickup was seamless. The prawn biriyani has become our Sunday routine.", s: 5 },
            ].map((rv) => (
              <div key={rv.n} style={{ border: `1.5px solid ${T.line}`, borderRadius: 14, padding: 22 }}>
                <div style={{ display: "flex", gap: 3, marginBottom: 12 }}>{Array.from({ length: rv.s }).map((_, i) => <Star key={i} size={14} fill={T.brass} color={T.brass} />)}</div>
                <p style={{ fontSize: 14, color: T.ink, lineHeight: 1.6, marginBottom: 14 }}>"{rv.t}"</p>
                <div style={{ fontSize: 13, fontWeight: 700, color: T.ink60 }}>{rv.n}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CLOSING CTA */}
      <section style={{ background: `linear-gradient(120deg, ${T.tide}, #235c59)`, padding: "56px 20px", textAlign: "center" }}>
        <h3 style={{ fontFamily: "Fraunces, serif", color: "#fff", fontSize: "clamp(24px,3vw,32px)", fontWeight: 600, marginBottom: 18 }}>Hungry already?</h3>
        <Button variant="primary" size="lg" onClick={startOrder}>Order Now <ChevronRight size={17} /></Button>
      </section>
    </div>
  );
}
