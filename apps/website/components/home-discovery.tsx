"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  Alert, AudioPlayer, Avatar, AvatarGroup, Badge, Button, Calendar, Card,
  CardContent, Checkbox, Command, DatePicker, Dialog, DialogContent,
  DialogDescription, DialogHeader, DialogTitle, DialogTrigger, Image, Input, Link,
  NotificationCenter, PasswordInput, PimoluProvider, Progress, Rating,
  SegmentedControl, Stat, Switch, Tabs, TabsContent, TabsList, TabsTrigger,
  type PimoluNotification,
} from "@pimolu/react";
import { HomeReveal } from "./home-reveal";

const people = ["Maya Chen", "Alex Morgan", "Noah Dubois"];
const sampleDay = new Date(2026, 9, 22);
const dateLabel = (date: Date) => date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
function ProductIllustration() {
  return <Image src="/images/pimolu-studio.webp" alt="Pimolu Studio headphones with an italic p emblem" aspectRatio="3 / 2" fit="cover" loading="lazy" />;
}

function TeamAvatars() {
  return <AvatarGroup size="sm">{people.map((name) => <Avatar key={name} name={name} />)}</AvatarGroup>;
}

function ComponentLinks({ names }: { names: string[] }) {
  return <nav className="discovery-links" aria-label="Components in this example">
    {names.map((name) => <Link key={name} href={`/components/${name}`} variant="muted">{name.replaceAll("-", " ")} <span aria-hidden="true">↗</span></Link>)}
  </nav>;
}

/** Additive strip beneath the existing hero; the original artwork stays intact. */
export function HomeDiscoveryStrip() {
  const strip = useRef<HTMLElement>(null);
  useEffect(() => { strip.current?.setAttribute("data-home-discovery-ready", "true"); }, []);
  const [joined, setJoined] = useState(false);
  const [date, setDate] = useState<Date | null>(sampleDay);
  const [visible, setVisible] = useState(true);
  return <section ref={strip} className="home-container discovery-strip" aria-label="A few things you can build">
    <div className="discovery-strip-item">
      <div className="discovery-row"><TeamAvatars /><Badge variant="success">Together</Badge></div>
      <div className="discovery-row"><span className="text-sm text-muted">Room for your next idea.</span><Button size="sm" appearance={joined ? "outline" : "solid"} onClick={() => setJoined(!joined)} aria-pressed={joined}>{joined ? "Joined" : "Join the team"}</Button></div>
    </div>
    <div className="discovery-strip-item">
      <DatePicker label="Your next launch" value={date} onChange={setDate} fullWidth />
      <p className="discovery-small" role="status">{date ? `Pencil it in for ${dateLabel(date)}.` : "A good idea starts with a date."}</p>
    </div>
    <div className="discovery-strip-item">
      {visible ? <Alert variant="success" title="Ready when you are." description="Your changes are saved." onDismiss={() => setVisible(false)} dismissLabel="Dismiss saved notification" /> : <div className="discovery-stack"><p className="text-sm text-muted">A little feedback goes a long way.</p><Button size="sm" appearance="outline" onClick={() => setVisible(true)}>Show notification</Button></div>}
    </div>
  </section>;
}

function Specimen({ id, title, caption, components, children }: { id: string; title: string; caption: string; components: string[]; children: ReactNode }) {
  return <article className="discovery-specimen" aria-labelledby={`specimen-${id}`}>
    <div className="discovery-specimen-heading"><h3 id={`specimen-${id}`}>{title}</h3><p>{caption}</p></div>
    <div className="discovery-specimen-preview">{children}</div>
    <ComponentLinks names={components} />
  </article>;
}

function SignInSample() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  return <form className="discovery-stack discovery-signin" onSubmit={(event) => {
    event.preventDefault();
    setMessage(`Preview complete for ${email}. No account was created.`);
  }}>
    <div><span className="discovery-monogram" aria-hidden="true">p</span><h4 className="discovery-title">Welcome back.</h4><p className="discovery-small">A familiar place for your next idea.</p></div>
    <Input label="Email address" type="email" autoComplete="off" placeholder="you@example.com" value={email} onChange={(event) => { setEmail(event.target.value); setMessage(""); }} required fullWidth />
    <PasswordInput label="Password" placeholder="Your demo password" autoComplete="off" required minLength={6} fullWidth />
    <Checkbox label="Remember this device" defaultChecked />
    <Button type="submit" fullWidth>Try signing in</Button>
    <p className="discovery-small" role="status">{message || "Local preview. Use fictional credentials."}</p>
  </form>;
}

function ProductSample() {
  const [size, setSize] = useState("M");
  const [rating, setRating] = useState(4);
  const [bag, setBag] = useState(0);
  return <div className="discovery-stack">
    <div className="discovery-product-art"><ProductIllustration /><Badge appearance="soft">Made to listen</Badge></div>
    <div className="discovery-row"><h4 className="discovery-title">Pimolu Studio</h4><span className="discovery-price">$129</span></div>
    <Rating label="Your product rating" value={rating} onValueChange={setRating} size="sm" />
    <SegmentedControl aria-label="Headphone fit" options={[{ value:"S", label:"S" }, { value:"M", label:"M" }, { value:"L", label:"L" }]} value={size} onValueChange={setSize} fullWidth />
    <Button fullWidth onClick={() => setBag((n) => n + 1)}>Add to bag</Button>
    <p role="status" className="discovery-small">{bag ? `${bag} ${bag === 1 ? "pair" : "pairs"} added · latest size ${size}.` : "Choose your fit. Find your rhythm."}</p>
  </div>;
}

function CalendarSample() {
  const [selected, setSelected] = useState<Date | null>(sampleDay);
  return <div className="discovery-stack">
    <div className="discovery-row"><Badge appearance="soft">Studio session</Badge><Avatar name="Maya Chen" size="sm" /></div>
    <div className="discovery-calendar"><Calendar selected={selected} onSelect={setSelected} defaultMonth={sampleDay} weekStartsOn={1} locale="en-US" aria-label="Choose a studio day" /></div>
    <p className="discovery-small" role="status">{selected ? `Your studio day: ${dateLabel(selected)}.` : "Make some space for good work."}</p>
  </div>;
}

function CommandSample() {
  const [selection, setSelection] = useState("");
  const [open, setOpen] = useState(false);
  return <div className="discovery-stack">
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger><Button appearance="outline" fullWidth>Search actions <span aria-hidden="true">↗</span></Button></DialogTrigger>
      <DialogContent size="sm"><DialogHeader><DialogTitle>Quick actions</DialogTitle><DialogDescription>Search this sample workspace. Actions stay in the preview.</DialogDescription></DialogHeader>
      <Command aria-label="Explore sample commands" placeholder="What would you like to do?" items={[
      { id:"project", label:"Create a project", description:"Start something new", group:"Workspace", icon:<span aria-hidden="true">＋</span> },
      { id:"team", label:"Invite your team", description:"Better with company", group:"Workspace", icon:<span aria-hidden="true">↗</span> },
      { id:"settings", label:"Open preferences", description:"Make yourself at home", group:"Personal", icon:<span aria-hidden="true">◎</span> },
    ]} onSelect={(item) => { setSelection(item.label); setOpen(false); }} />
      </DialogContent>
    </Dialog>
    <ul className="discovery-command-list" aria-label="Available sample actions"><li><span aria-hidden="true">＋</span>Create a project</li><li><span aria-hidden="true">↗</span>Invite your team</li><li><span aria-hidden="true">◎</span>Open preferences</li></ul>
    <p className="discovery-small" role="status">{selection ? `Selected: ${selection}.` : "Open search, use the arrow keys, then press Enter."}</p>
  </div>;
}

function NotificationsSample() {
  const [notifications, setNotifications] = useState<PimoluNotification[]>([
    { id:"review", title:"A fresh pair of eyes", description:"Maya left feedback on your project.", time:"Just now" },
    { id:"export", title:"All packed up", description:"Your design export is ready.", time:"5 min ago" },
  ]);
  const [email, setEmail] = useState(true);
  const unread = notifications.filter((item) => !item.read).length;
  return <div className="discovery-stack">
    <div className="discovery-row"><div><h4 className="discovery-title">You’re in the loop.</h4><p className="discovery-small">Open the bell to try it.</p></div><NotificationCenter notifications={notifications} triggerLabel="Open sample notifications" title="Your updates" showTabs onRead={(id) => setNotifications((items) => items.map((item) => item.id === id ? { ...item, read:true } : item))} onReadAll={() => setNotifications((items) => items.map((item) => ({ ...item, read:true })))} onDismiss={(id) => setNotifications((items) => items.filter((item) => item.id !== id))} /></div>
    <Card><CardContent><div className="discovery-stack"><div className="discovery-row"><TeamAvatars /><Badge variant={unread ? "primary" : "success"}>{unread} unread</Badge></div><p className="text-sm">Good work is a conversation. Keep the important moments close.</p><Progress label="Design handoff" value={75} showValue /></div></CardContent></Card>
    <Switch label="Email updates" description="Choose how you stay in touch." checked={email} onCheckedChange={setEmail} />
    <p className="discovery-small" role="status">Email updates are {email ? "on" : "off"} for this preview.</p>
  </div>;
}

function AudioSample() {
  const [track, setTrack] = useState("action-game");
  return <div className="discovery-stack">
    <div className="discovery-audio-art" aria-hidden="true"><span>p</span><div>{[24,44,64,36,78,52,90,60,34,72,46,24].map((height, index) => <i key={index} style={{ height:`${height}%` }} />)}</div><span>PIMOLU / PLAY</span></div>
    <AudioPlayer key={track} src={`/sounds/${track}.mp3`} title={track === "action-game" ? "Action game" : "Pixel art game"} subtitle="Pimolu / Play | local soundtrack" preload="none" showVolume={false} />
    <SegmentedControl aria-label="Choose a soundtrack" options={[{ value:"action-game", label:"Action" }, { value:"pixel-art-game", label:"Pixel" }]} value={track} onValueChange={setTrack} fullWidth />
    <p className="discovery-small">Two local soundtracks. Press play and find your rhythm.</p>
  </div>;
}

export function HomeComponentGallery() {
  return <section id="component-stories" className="home-section home-container discovery-section" aria-labelledby="stories-title"><HomeReveal>
    <div className="home-section-heading"><div><p className="home-eyebrow mb-3">Small details. Real possibilities.</p><h2 id="stories-title" className="home-section-title">A little of everything.<br />A lot you can build.</h2></div><p className="home-section-description">Try a few everyday moments. Every control here is a real Pimolu component, ready to become part of your product.</p></div>
    <div className="discovery-gallery">
      <Specimen id="signin" title="A warm welcome" caption="Forms that feel familiar." components={["input","password-input","checkbox","button"]}><SignInSample /></Specimen>
      <Specimen id="product" title="Worth a closer look" caption="Give your next product room to shine." components={["image","rating","segmented-control"]}><ProductSample /></Specimen>
      <Specimen id="calendar" title="Make a little time" caption="Good plans start with a clear date." components={["calendar","avatar","badge"]}><CalendarSample /></Specimen>
      <Specimen id="command" title="One thought away" caption="A shortcut from intention to action." components={["command"]}><CommandSample /></Specimen>
      <Specimen id="notifications" title="The right kind of update" caption="Useful feedback, at the right moment." components={["notification-center","switch","progress"]}><NotificationsSample /></Specimen>
      <Specimen id="audio" title="Press play" caption="A different way to tell your story." components={["audio-player"]}><AudioSample /></Specimen>
    </div>
    <div className="discovery-catalog-cta"><p className="text-muted">Find the pieces for your next idea.</p><Link href="/components">Explore all components <span aria-hidden="true">↗</span></Link></div>
  </HomeReveal></section>;
}

function BusinessWorld() {
  const [approved, setApproved] = useState(false);
  return <div className="discovery-world-layout"><div className="discovery-world-copy"><p className="home-eyebrow">01 / Enterprise & SaaS</p><h3>Clarity for the work ahead.</h3><p>Bring people, progress and decisions into one considered workspace.</p><ComponentLinks names={["stat","progress","avatar","button"]} /></div><Card><CardContent><div className="discovery-stack"><div className="discovery-row"><span className="discovery-title">Studio / Overview</span><Badge variant="success">On track</Badge></div><Stat label="Quarterly revenue" value="$48,290" delta="12.8%" trend="up" description="Sample workspace data" /><Progress label="Launch readiness" value={approved ? 100 : 80} showValue /><div className="discovery-row"><TeamAvatars /><Button size="sm" onClick={() => setApproved(!approved)}>{approved ? "Reopen review" : "Approve launch"}</Button></div><p role="status" className="discovery-small">{approved ? "Launch approved. Your team is ready." : "One final review before the next chapter."}</p></div></CardContent></Card></div>;
}

function CommerceWorld() {
  const [bag, setBag] = useState(0);
  const [gift, setGift] = useState(false);
  return <div className="discovery-world-layout"><div className="discovery-world-copy"><p className="home-eyebrow">02 / E-commerce</p><h3>A good find.<br />A better experience.</h3><p>From the first impression to the finishing touches, give every detail a purpose.</p><ComponentLinks names={["image","rating","switch","button"]} /></div><Card><CardContent><div className="discovery-commerce"><ProductIllustration /><div className="discovery-stack"><Badge appearance="soft">The Studio collection</Badge><h4 className="discovery-title">A little more space for sound.</h4><Rating value={5} readOnly label="Product review score" size="sm" /><span className="discovery-price">${gift ? 134 : 129}</span><Switch label="Add gift wrapping" description="A thoughtful finish. +$5" checked={gift} onCheckedChange={setGift} /><Button onClick={() => setBag((n) => n + 1)}>Add a little joy</Button><p role="status" className="discovery-small">{bag ? `${bag} ${bag === 1 ? "item" : "items"} in your sample bag.` : "A local shopping preview."}</p></div></div></CardContent></Card></div>;
}

function GamingWorld() {
  const [claimed, setClaimed] = useState(false);
  return <div className="discovery-world-layout"><div className="discovery-world-copy"><p className="home-eyebrow">03 / Gaming</p><h3>Your next chapter<br />starts here.</h3><p>A focused dark interface for worlds that deserve a little atmosphere.</p><ComponentLinks names={["card","progress","badge","button"]} /></div><PimoluProvider theme="dark" className="discovery-game"><div className="discovery-stack"><div className="discovery-row"><Badge appearance="soft">SEASON 08</Badge><span className="discovery-small">Explorer / Level 24</span></div><div className="discovery-game-art" aria-hidden="true"><span>08</span><i /></div><h4 className="discovery-title">Into the quiet unknown.</h4><Progress label="Season progress" value={claimed ? 75 : 62} showValue /><Button fullWidth disabled={claimed} onClick={() => setClaimed(true)}>{claimed ? "Reward claimed" : "Claim season reward"}</Button><p role="status" className="discovery-small">{claimed ? "+1,200 XP. Your next adventure is closer." : "A small reward for a big journey."}</p></div></PimoluProvider></div>;
}

function CreativeWorld() {
  const [project, setProject] = useState("Form");
  return <div className="discovery-world-layout"><div className="discovery-world-copy"><p className="home-eyebrow">04 / Creative</p><h3>Leave a little room<br />for expression.</h3><p>Quiet controls, expressive composition. Let your work take the foreground.</p><ComponentLinks names={["segmented-control","badge","card"]} /></div><Card><CardContent><div className="discovery-stack"><div className="discovery-row"><span className="discovery-serif">Forma®</span><Badge appearance="soft">Independent studio</Badge></div><div className={`discovery-creative-art discovery-creative-art--${project.toLowerCase()}`} aria-hidden="true"><span className="discovery-emblem" /><i /></div><h4 className="discovery-serif">{project === "Form" ? "Finding the form." : "A study in color."}</h4><SegmentedControl aria-label="Explore studio projects" options={[{ value:"Form", label:"Form study" }, { value:"Color", label:"Color study" }]} value={project} onValueChange={setProject} fullWidth /><p role="status" className="discovery-small">Selected work / {project} study, 2026.</p></div></CardContent></Card></div>;
}

export function HomeProductWorlds() {
  return <section id="product-worlds" className="home-section home-container discovery-section" aria-labelledby="worlds-title"><HomeReveal>
    <div className="home-section-heading"><div><p className="home-eyebrow mb-3">One foundation. Different destinations.</p><h2 id="worlds-title" className="home-section-title">Your world.<br />Built with Pimolu.</h2></div><p className="home-section-description">The same components can belong in very different places. Explore four ways to put them together.</p></div>
    <Tabs defaultValue="business" className="discovery-worlds"><TabsList aria-label="Explore product worlds"><TabsTrigger value="business">Enterprise / SaaS</TabsTrigger><TabsTrigger value="commerce">E-commerce</TabsTrigger><TabsTrigger value="gaming">Gaming</TabsTrigger><TabsTrigger value="creative">Creative</TabsTrigger></TabsList><TabsContent value="business"><BusinessWorld /></TabsContent><TabsContent value="commerce"><CommerceWorld /></TabsContent><TabsContent value="gaming"><GamingWorld /></TabsContent><TabsContent value="creative"><CreativeWorld /></TabsContent></Tabs>
  </HomeReveal></section>;
}
