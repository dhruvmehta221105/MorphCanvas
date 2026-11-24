import { useEffect, useMemo, useRef, useState } from "react";
import {
  Activity, ArrowDown, ArrowDownToLine, ArrowLeft, ArrowRight, ArrowUpRight, Bell,
  Check, CheckCircle2, ChevronDown, ChevronRight, Circle, Code2, Copy,
  CreditCard, Download, Eye, FileCode2, FileText, Filter, FolderKanban,
  Grid2X2, HelpCircle, Home, Image, Layers, LayoutDashboard, LayoutTemplate, List,
  LoaderCircle, LockKeyhole, LogOut, Menu, MessageSquare, Minus, Monitor, MoreHorizontal,
  MousePointer2, Move, Pen, Plus, Redo2, Search, Send, Settings, Shapes, Smartphone,
  Sparkles, Tablet, Type, Undo2, Upload, WandSparkles, X, ZoomIn, ZoomOut,
} from "lucide-react";

type Project = {
  id: string;
  name: string;
  category: string;
  modified: string;
  components: number;
  status: "In progress" | "Generated" | "Draft";
  accent: string;
};

type SketchItem = {
  id: number;
  kind: "rect" | "circle" | "text" | "path";
  x: number;
  y: number;
  w?: number;
  h?: number;
  text?: string;
  points?: string;
};

const initialProjects: Project[] = [
  { id: "p1", name: "Modern SaaS Landing Page", category: "Website", modified: "Today", components: 12, status: "Generated", accent: "coral" },
  { id: "p2", name: "E-Commerce Dashboard", category: "Dashboard", modified: "Yesterday", components: 18, status: "In progress", accent: "olive" },
  { id: "p3", name: "Portfolio Website", category: "Portfolio", modified: "Jun 12, 2025", components: 8, status: "Generated", accent: "cream" },
  { id: "p4", name: "Analytics Dashboard", category: "Dashboard", modified: "Jun 10, 2025", components: 24, status: "Draft", accent: "blue" },
  { id: "p5", name: "Travel Booking Flow", category: "Mobile app", modified: "Jun 8, 2025", components: 15, status: "In progress", accent: "pink" },
  { id: "p6", name: "Creator Marketplace", category: "Website", modified: "Jun 4, 2025", components: 11, status: "Generated", accent: "lavender" },
];

const templates = [
  ["SaaS Launchpad", "SaaS Websites", "A confident, conversion-focused home for your next big idea.", "coral"],
  ["Commerce Studio", "E-Commerce", "A considered storefront for independent brands.", "olive"],
  ["Studio Folio", "Portfolios", "A minimal portfolio that lets the work do the talking.", "cream"],
  ["Northstar Analytics", "Dashboards", "A clear command center for the metrics that matter.", "blue"],
  ["Early Access", "Landing Pages", "Build anticipation and grow your launch list.", "pink"],
  ["Pocket Banking", "Mobile App UI", "A calm, modern interface for everyday finance.", "lavender"],
  ["Fieldnotes", "SaaS Websites", "A focused workspace for teams who think in ideas.", "olive"],
  ["Good Habit", "Mobile App UI", "An inviting habit tracker designed for small wins.", "coral"],
];

const componentItems = [
  ["Action button", "Buttons", "Primary · Medium", "button"],
  ["Product card", "Cards", "Bordered · 16px radius", "card"],
  ["Studio navigation", "Navigation Bars", "Responsive · Floating", "nav"],
  ["Email capture", "Forms", "Inline · Validation ready", "form"],
  ["Search field", "Input Fields", "Leading icon · Quiet", "input"],
  ["Editorial hero", "Hero Sections", "Split layout · Image", "hero"],
  ["Simple footer", "Footers", "Four columns · Dark", "footer"],
  ["Plan comparison", "Pricing Cards", "Three tiers · Highlighted", "pricing"],
  ["Metric tile", "Dashboard Widgets", "Trend · Compact", "widget"],
];

const activities = [
  ["Generated 12 components", "Modern SaaS Landing Page", "2 hours ago", "spark"],
  ["Updated Hero Section", "E-Commerce Dashboard", "Yesterday, 4:32 PM", "edit"],
  ["Exported React code", "Portfolio Website", "Yesterday, 11:18 AM", "code"],
  ["Created a new project", "Analytics Dashboard", "Jun 10, 2025", "create"],
  ["Used template", "Creator Marketplace", "Jun 8, 2025", "template"],
];

const navItems = [
  { label: "Overview", path: "/dashboard", icon: Home },
  { label: "My Projects", path: "/projects", icon: FolderKanban },
  { label: "Templates", path: "/templates", icon: LayoutTemplate },
  { label: "Components", path: "/components", icon: Shapes },
  { label: "Activity", path: "/activity", icon: Activity },
];

const categories = ["All", "SaaS Websites", "E-Commerce", "Portfolios", "Dashboards", "Landing Pages", "Mobile App UI"];
const componentCategories = ["All", "Buttons", "Cards", "Navigation Bars", "Forms", "Input Fields", "Hero Sections", "Footers", "Pricing Cards", "Dashboard Widgets"];

function readProjects(): Project[] {
  try {
    const stored = localStorage.getItem("morphcanvas-projects");
    return stored ? JSON.parse(stored) as Project[] : initialProjects;
  } catch {
    return initialProjects;
  }
}

function Brand({ onClick }: { onClick: () => void }) {
  return <button className="brand" onClick={onClick} aria-label="MorphCanvas home"><span className="brand-mark"><span /><span /><span /><span /></span><span>MorphCanvas<span className="brand-ai"> AI</span></span></button>;
}

function Button({ children, variant = "primary", className = "", onClick, type = "button", disabled = false }: {
  children: React.ReactNode; variant?: "primary" | "secondary" | "ghost" | "light"; className?: string; onClick?: () => void; type?: "button" | "submit"; disabled?: boolean;
}) {
  return <button type={type} disabled={disabled} onClick={onClick} className={`button button-${variant} ${className}`}>{children}</button>;
}

function ProjectThumb({ accent, compact = false }: { accent: string; compact?: boolean }) {
  return <div className={`project-thumb thumb-${accent} ${compact ? "thumb-compact" : ""}`}>
    <div className="thumb-top"><span /><span /><span /></div>
    <div className="thumb-content"><div className="thumb-side"><i /><i /><i /><i /></div><div className="thumb-main"><div className="thumb-copy"><b /><b /><b /></div><div className="thumb-visual"><span /><span /></div><div className="thumb-row"><i /><i /><i /></div></div></div>
  </div>;
}

function Landing({ navigate }: { navigate: (path: string) => void }) {
  const [faq, setFaq] = useState<number | null>(0);
  const faqs = [
    ["What is MorphCanvas?", "MorphCanvas is a frontend prototype that demonstrates how rough wireframes could become structured React interfaces. All AI-like steps in this demo are simulated locally."],
    ["How does sketch-to-code work?", "In this prototype, you draw on a canvas and run a simulated analysis. It then displays a sample generated interface and editable example code—no sketch is sent to an AI service."],
    ["Which technologies are supported?", "The demo focuses on React and Tailwind-style utility classes. You can inspect and edit the example React code in the workspace."],
    ["Can I export React code?", "Yes. Open a workspace, switch to Code, and use Copy or Download to export the editable sample component."],
    ["Does it require coding knowledge?", "No. The visual canvas is designed to be approachable, while code editing is optional for people who want more control."],
    ["Is AI generation currently available?", "Not in this prototype. Generation and refinement are simulated with local UI states and predefined responses; there is no connected AI model."],
  ];
  return <div className="landing">
    <header className="marketing-nav"><div className="marketing-inner">
      <Brand onClick={() => navigate("/")} />
      <nav className="marketing-links"><a href="#product">Product</a><a href="#features">Features</a><a href="#how-it-works">How it works</a><a href="#pricing">Pricing</a><a href="#footer">Documentation</a></nav>
      <div className="nav-actions"><button className="text-button" onClick={() => navigate("/login")}>Log in</button><Button onClick={() => navigate("/signup")}>Get started <ArrowRight size={15} /></Button></div>
      <button className="mobile-menu" onClick={() => navigate("/login")} aria-label="Open account"><Menu size={20} /></button>
    </div></header>
    <main>
      <section className="hero-section" id="product">
        <div className="hero-copy"><div className="eyebrow"><span className="eyebrow-dot" />YOUR NEXT IDEA, IN FULL COLOR</div>
          <h1>From rough sketches<br />to <em>real interfaces.</em></h1>
          <p>Turn your ideas into beautiful, functional React interfaces. Sketch your vision, let MorphCanvas understand your design, and watch your website come to life.</p>
          <div className="hero-actions"><Button onClick={() => navigate("/signup")}>Start designing <ArrowUpRight size={16} /></Button><a className="subtle-link" href="#features">Explore features <ArrowDown size={15} /></a></div>
          <div className="hero-proof"><div className="avatar-stack"><span>D</span><span>M</span><span>A</span><span>+</span></div><div><b>Made for people who make</b><small>Design ideas into something real.</small></div></div>
        </div>
        <div className="hero-art">
          <div className="art-glow" />
          <div className="product-window">
            <div className="window-bar"><div className="window-dots"><i /><i /><i /></div><span>Untitled design — MorphCanvas</span><span className="window-live"><i /> Ready</span></div>
            <div className="mini-workspace">
              <div className="mini-toolbar"><span className="mini-tool active"><MousePointer2 size={13} /></span><span className="mini-tool"><Pen size={13} /></span><span className="mini-tool"><Shapes size={13} /></span><span className="mini-tool"><Type size={13} /></span></div>
              <div className="mini-sketch"><div className="sketch-nav"><i /><b /><b /><b /></div><div className="sketch-hero"><div><b /><b /><b /><i /></div><span /></div><div className="sketch-cards"><i /><i /><i /></div><div className="mini-label">ROUGH WIREFRAME</div></div>
              <div className="mini-arrow"><ArrowRight size={16} /></div>
              <div className="mini-preview"><div className="preview-nav"><b>morrow</b><span>Studio&nbsp;&nbsp; Journal&nbsp;&nbsp; About</span><i>Get in touch</i></div><div className="preview-hero"><small>DESIGN FOR WHAT'S NEXT</small><strong>Make room<br />for wonder.</strong><p>A little more intention.<br />A lot more possibility.</p><i>Explore the studio <ArrowRight size={12} /></i></div><div className="preview-bottom"><b>Independent creative studio</b><span>01 — 03</span></div></div>
            </div>
            <div className="generation-chip"><span><Sparkles size={14} /></span><div><b>Layout understood</b><small>8 components detected</small></div><CheckCircle2 size={16} className="success-icon" /></div>
            <div className="code-chip"><div><i /><i /><i /></div><code><span>const</span> page = <span>generateInterface</span>()</code></div>
          </div>
          <span className="art-caption">A little sketch. A whole new starting point.</span>
        </div>
      </section>
      <section className="value-strip"><div className="value-intro">A more natural way to<br />move from <em>thought to shipped.</em></div><div className="value-item"><span>01</span><div><b>Sketch naturally.</b><p>Get your idea down before it gets away.</p></div></div><div className="value-item"><span>02</span><div><b>Generate instantly.</b><p>Turn the rough edges into a real starting point.</p></div></div><div className="value-item"><span>03</span><div><b>Build faster.</b><p>Go from concept to code without the busywork.</p></div></div></section>
      <section className="section how-section" id="how-it-works"><div className="section-heading"><span className="eyebrow">A SIMPLE LITTLE FLOW</span><h2>Good ideas deserve<br />a shorter distance.</h2><p>Four steps from the back of a napkin to a canvas you can build on.</p></div><div className="steps-grid">{[["01","Draw your idea","Start with a rough wireframe on an open canvas. Boxes, arrows, scribbles and all."],["02","We make sense of it","MorphCanvas maps the layout, elements and relationships in your sketch."],["03","Generate a starting point","Get a structured React interface and a first pass at the code."],["04","Preview, refine, repeat","Make it yours in the editor, then take your code with you."]].map((s) => <article className="step-card" key={s[0]}><span>{s[0]}</span><div className="step-line" /><h3>{s[1]}</h3><p>{s[2]}</p><ArrowUpRight size={16} /></article>)}</div></section>
      <section className="section features-section" id="features"><div className="section-heading row-heading"><div><span className="eyebrow">A SMALL TOOLKIT, A LOT OF POSSIBILITY</span><h2>Everything you need<br />to find your flow.</h2></div><p>All the good stuff, without another dozen tabs open.</p></div><div className="feature-grid">{[
        [Pen,"An open canvas","A roomy space to get the first version out of your head."],
        [WandSparkles,"Sketch recognition","A simulated read of the shapes and structure in your drawing."],
        [Layers,"Smart components","See the pieces of your interface as a tidy layer list."],
        [FileCode2,"React generation","A structured React and utility-class starting point."],
        [Monitor,"Live preview","See the idea take shape at desktop, tablet and mobile sizes."],
        [Code2,"An editable code view","Tweak the example directly, then copy or download it."],
        [MessageSquare,"Design refinement","Try local, predefined suggestions to explore a different direction."],
        [Download,"Export when ready","Take your sample component with you, no strings attached."],
      ].map(([Icon, title, body]) => { const FeatureIcon = Icon as typeof Pen; return <article className="feature-card" key={title as string}><span className="feature-icon"><FeatureIcon size={18} /></span><h3>{title as string}</h3><p>{body as string}</p></article>; })}</div></section>
      <section className="showcase-section"><div className="showcase-copy"><span className="eyebrow">FROM FIRST MARK TO FIRST PASS</span><h2>Less staring at a<br />blank screen.</h2><p>Start with a sketch that only makes sense to you. End with a clean, considered interface you can actually work with.</p><Button variant="light" onClick={() => navigate("/signup")}>Try the workspace <ArrowRight size={15} /></Button><small>Frontend-only demo · AI steps are simulated</small></div><div className="showcase-visual"><div className="showcase-window"><div className="showcase-window-head"><span>Homepage concept</span><span>Preview <ChevronDown size={12} /></span></div><div className="showcase-page"><div className="showcase-nav"><b>morrow®</b><span>Our approach&nbsp;&nbsp; Projects&nbsp;&nbsp; Journal</span><button>Say hello ↗</button></div><div className="showcase-content"><span>CREATIVE STUDIO — EST. 2018</span><h3>Ideas with<br />a little more<br /><em>intention.</em></h3><p>We make digital things for a world that needs a little less noise.</p><button>Meet the studio <ArrowRight size={13} /></button></div><div className="showcase-side-note">SCROLL TO EXPLORE&nbsp; ↓</div></div></div><div className="floating-note"><span className="success-badge"><Check size={14} /></span><div><b>First pass, ready</b><small>Generated locally for this demo</small></div></div></div></section>
      <section className="section audience-section"><div className="section-heading"><span className="eyebrow">WHO IT'S FOR</span><h2>For the people who<br />can't help but make.</h2></div><div className="audience-grid">{[["01","Frontend developers","Find the shape before committing to the details."],["02","UI/UX designers","Keep the idea moving from canvas to prototype."],["03","Students & beginners","Learn how a wireframe becomes a real interface."],["04","Startup founders","Make your first product idea easier to share."],["05","Prototyping teams","Get to a useful conversation sooner."]].map(x=><div className="audience-item" key={x[0]}><span>{x[0]}</span><div><b>{x[1]}</b><p>{x[2]}</p></div><ArrowUpRight size={15} /></div>)}</div></section>
      <section className="section pricing-section" id="pricing"><div className="section-heading"><span className="eyebrow">DEMO TIERS, NO BILLING</span><h2>Start small. Make<br />something good.</h2><p>These are prototype examples, not actual plans or payment options.</p></div><div className="pricing-grid">{[
        ["Free","For the curious.","$0",["Limited projects","Basic canvas","Preview generation","Basic code export"],"Start for free"],
        ["Pro","For the idea-rich.","$12",["Unlimited projects","Advanced canvas","More generation credits","Advanced editing"],"Try Pro demo"],
        ["Team","For making together.","$28",["Shared workspaces","Team collaboration","Shared components","Project management"],"Explore Team"],
      ].map((plan, i)=><article className={`price-card ${i===1?"price-featured":""}`} key={String(plan[0])}><span className="price-label">{plan[0]}{i===1&&<i>POPULAR</i>}</span><p>{plan[1]}</p><div className="price-amount">{plan[2]}<small>/ month</small></div><div className="price-rule" />{(plan[3] as string[]).map(line=><div className="price-perk" key={line}><Check size={14} />{line}</div>)}<Button variant={i===1?"primary":"secondary"} className="price-button" onClick={() => navigate("/signup")}>{plan[4] as string} <ArrowRight size={14} /></Button></article>)}</div></section>
      <section className="section faq-section"><div><span className="eyebrow">FAIR QUESTIONS</span><h2>Before you<br />draw anything.</h2><p>This is a working product prototype, not a live AI service.</p></div><div className="faq-list">{faqs.map((item, i)=><div className={`faq-item ${faq===i?"faq-open":""}`} key={item[0]}><button onClick={()=>setFaq(faq===i?null:i)}><span>{item[0]}</span>{faq===i?<Minus size={16}/>:<Plus size={16}/>}</button>{faq===i&&<p>{item[1]}</p>}</div>)}</div></section>
      <section className="bottom-cta"><div><span className="eyebrow">A PROTOTYPE WITH ROOM TO PLAY</span><h2>Ready to make a<br /><em>little something?</em></h2></div><Button variant="light" onClick={() => navigate("/signup")}>Open the canvas <ArrowUpRight size={16} /></Button><span className="cta-scribble">✳</span></section>
    </main>
    <footer className="marketing-footer" id="footer"><div className="footer-main"><div className="footer-brand"><Brand onClick={()=>navigate("/")} /><p>A small sketch can be the beginning<br />of something really good.</p><span className="prototype-note"><i /> Prototype · AI is simulated</span></div><div className="footer-column"><b>Product</b><a href="#features">Features</a><a href="#how-it-works">How it works</a><a href="#pricing">Demo pricing</a><button onClick={()=>navigate("/dashboard")}>Open dashboard</button></div><div className="footer-column"><b>Explore</b><button onClick={()=>navigate("/templates")}>Templates</button><button onClick={()=>navigate("/components")}>Components</button><button onClick={()=>navigate("/projects")}>Projects</button></div><div className="footer-column"><b>Say hello</b><a href="mailto:hello@morphcanvas.demo">Contact</a><a href="#footer">Instagram ↗</a><a href="#footer">LinkedIn ↗</a></div></div><div className="footer-bottom"><span>© 2025 MorphCanvas AI. A university project prototype.</span><span>Made for ideas that refuse to stay in the margins.</span></div></footer>
  </div>;
}

function AuthPage({ page, navigate }: { page: string; navigate: (path: string) => void }) {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const email = String(data.get("email") || "");
    const password = String(data.get("password") || "");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setError("Enter a valid email address."); return; }
    if (page !== "forgot-password" && password.length < 8) { setError("Use at least 8 characters for your password."); return; }
    localStorage.setItem("morphcanvas-user", JSON.stringify({ name: String(data.get("name") || "Dhruv"), email }));
    if (page === "forgot-password") { setError("If this were a live product, reset instructions would be sent. This demo stores nothing."); return; }
    navigate("/dashboard");
  };
  const title = page === "signup" ? "Make room for ideas." : page === "forgot-password" ? "A fresh start." : "Welcome back.";
  return <div className="auth-page"><div className="auth-left"><Brand onClick={()=>navigate("/")} /><div className="auth-quote"><span className="eyebrow">MORPHCANVAS AI</span><h1>{title}</h1><p>Go from a rough little sketch to something you can build on.</p><div className="auth-decoration"><div className="auth-sketch"><div /><div /><div /><span /></div><div className="auth-doodle"><Sparkles size={19}/></div></div><small>Frontend prototype · No real AI or authentication</small></div><button className="auth-back" onClick={()=>navigate("/")}>← Back to home</button></div><div className="auth-right"><div className="auth-form-wrap"><button className="back-link" onClick={()=>navigate("/")}>← <span>Back to website</span></button><span className="auth-welcome">{page === "signup" ? "GET STARTED" : page === "forgot-password" ? "ACCOUNT RECOVERY" : "WELCOME BACK"}</span><h2>{page === "signup" ? "Create your account" : page === "forgot-password" ? "Reset your password" : "Log in to your account"}</h2><p className="auth-subtitle">{page === "signup" ? "Your next idea is closer than you think." : page === "forgot-password" ? "Enter the email you used to sign up." : "Pick up right where your ideas left off."}</p><form onSubmit={submit} className="auth-form">{page==="signup"&&<label>Your name<input name="name" placeholder="Dhruv Mehta" required /></label>}<label>Email address<input name="email" type="email" placeholder="you@example.com" required /></label>{page!=="forgot-password"&&<label>Password<div className="password-field"><input name="password" type={showPassword?"text":"password"} placeholder="At least 8 characters" required minLength={8}/><button type="button" onClick={()=>setShowPassword(!showPassword)} aria-label={showPassword?"Hide password":"Show password"}><Eye size={16}/></button></div></label>}{page==="login"&&<div className="auth-options"><label className="check-label"><input type="checkbox" defaultChecked/> Remember me</label><button type="button" onClick={()=>navigate("/forgot-password")}>Forgot password?</button></div>}{error&&<div className={`form-message ${error.startsWith("If this")?"form-success":""}`}>{error}</div>}<Button type="submit" className="auth-submit">{page==="signup"?"Create account":page==="forgot-password"?"Send reset link":"Log in"} <ArrowRight size={15}/></Button></form><div className="auth-divider"><span>OR CONTINUE WITH</span></div><Button variant="secondary" className="google-button" onClick={()=>setError("Google sign-in is a visual-only demo.")}><span className="google-g">G</span> Continue with Google</Button><p className="auth-switch">{page==="signup"?"Already have an account?":page==="login"?"New to MorphCanvas?":"Remembered your password?"} <button onClick={()=>navigate(page==="signup"?"/login":"/signup")}>{page==="signup"?"Log in":page==="login"?"Create an account":"Back to log in"}</button></p><div className="auth-privacy"><LockKeyhole size={13}/> Demo only. No account or password is sent anywhere.</div></div></div></div>;
}

function Sidebar({ path, navigate, logout }: { path: string; navigate: (path: string) => void; logout: () => void }) {
  return <aside className="sidebar"><Brand onClick={()=>navigate("/dashboard")}/><span className="sidebar-label">WORKSPACE</span><nav className="sidebar-nav">{navItems.map(item=>{const Icon=item.icon;return <button key={item.path} className={path===item.path?"selected":""} onClick={()=>navigate(item.path)}><Icon size={17}/>{item.label}{item.label==="My Projects"&&<span className="nav-count">6</span>}</button>;})}<button className={path.startsWith("/workspace")?"selected":""} onClick={()=>navigate("/workspace/new")}><Plus size={17}/>New Design</button></nav><div className="sidebar-bottom"><button onClick={()=>navigate("/settings")} className={path==="/settings"?"selected":""}><Settings size={17}/>Settings</button><button onClick={()=>navigate("/activity")}><HelpCircle size={17}/>Help & Support</button><div className="profile-block"><span className="profile-avatar">DM</span><div><b>Dhruv Mehta</b><small>Personal workspace</small></div><button title="Log out" onClick={logout}><LogOut size={15}/></button></div></div></aside>;
}

function AppLayout({ path, navigate, logout, children }: { path: string; navigate: (path: string) => void; logout: () => void; children: React.ReactNode }) {
  return <div className="app-shell"><Sidebar path={path} navigate={navigate} logout={logout}/><main className="app-main"><header className="app-topbar"><div className="breadcrumbs"><span>Workspace</span><ChevronRight size={13}/><b>{path==="/dashboard"?"Overview":path.replace("/","").split("/")[0].replace(/^./, c=>c.toUpperCase())}</b></div><div className="topbar-actions"><span className="prototype-pill"><i/> Prototype</span><button className="icon-button" aria-label="Notifications"><Bell size={17}/><i className="notification-dot"/></button><span className="profile-avatar small-avatar">DM</span></div></header><div className="page-content">{children}</div></main></div>;
}

function PageTitle({ eyebrow, title, description, action }: { eyebrow?: string; title: string; description?: string; action?: React.ReactNode }) {
  return <div className="page-title"><div>{eyebrow&&<span className="eyebrow">{eyebrow}</span>}<h1>{title}</h1>{description&&<p>{description}</p>}</div>{action}</div>;
}

function Dashboard({ projects, navigate, createProject, notify }: { projects: Project[]; navigate: (path:string)=>void; createProject: (name?:string)=>Project; notify:(text:string)=>void }) {
  const recent = [...projects].slice(0,4);
  return <><PageTitle eyebrow="TUESDAY, JUNE 17, 2025" title="Welcome back, Dhruv." description="A good idea can start anywhere. Pick up where you left off." action={<Button onClick={()=>navigate("/workspace/new")}><Plus size={16}/> New design</Button>}/><div className="stats-grid">{[[FolderKanban,"12","Total projects","+2 this month"],[Shapes,"28","Designs created","+6 this month"],[Layers,"86","Components generated","+18 this month"],[Activity,"5","Recent activity","Across 3 projects"]].map(([Icon,num,label,sub])=>{const StatIcon=Icon as typeof Home;return <article className="stat-card" key={label as string}><span className="stat-icon"><StatIcon size={17}/></span><div className="stat-copy"><strong>{num as string}</strong><span>{label as string}</span></div><small>{sub as string}</small></article>;})}</div><div className="section-title-row"><div><span className="eyebrow">YOUR RECENT WORK</span><h2>Projects to pick back up</h2></div><button className="text-link" onClick={()=>navigate("/projects")}>All projects <ArrowRight size={14}/></button></div><div className="project-grid dashboard-projects">{recent.map(p=><article className="project-card" key={p.id} onClick={()=>navigate(`/workspace/${p.id}`)}><ProjectThumb accent={p.accent}/><div className="project-card-content"><div className="project-card-heading"><h3>{p.name}</h3><button className="dots-button" onClick={e=>{e.stopPropagation();notify(`${p.name} options`);}}><MoreHorizontal size={17}/></button></div><div className="project-meta"><span>{p.modified}</span><span>{p.components} components</span></div><div className="project-card-footer"><span className={`status status-${p.status.toLowerCase().replace(" ","-")}`}><i/>{p.status}</span><button onClick={e=>{e.stopPropagation();navigate(`/workspace/${p.id}`);}}>Open <ArrowUpRight size={13}/></button></div></div></article>)}</div><div className="dashboard-bottom"><section className="quick-action-panel"><span className="eyebrow">MAKE SOMETHING</span><h3>Every great interface<br/>starts somewhere.</h3><p>Pick a starting point and see where it takes you.</p><div className="quick-actions"><button onClick={()=>navigate("/workspace/new")}><span><Plus size={17}/></span><div><b>Blank canvas</b><small>Start with a fresh sketch</small></div><ArrowRight size={14}/></button><button onClick={()=>navigate("/templates")}><span><LayoutTemplate size={17}/></span><div><b>Browse templates</b><small>Borrow a good starting point</small></div><ArrowRight size={14}/></button><button onClick={()=>{createProject("Imported sketch");notify("Sketch import is ready to explore in your new workspace.");}}><span><Upload size={17}/></span><div><b>Import a sketch</b><small>Bring a file into the canvas</small></div><ArrowRight size={14}/></button></div></section><section className="activity-panel"><div className="section-title-row"><div><span className="eyebrow">RECENTLY</span><h3>Little things in motion</h3></div><button className="dots-button" onClick={()=>navigate("/activity")}><ArrowUpRight size={15}/></button></div>{activities.slice(0,4).map((a,i)=><div className="activity-row" key={a[0]}><span className={`activity-icon activity-${i}`}><Activity size={14}/></span><div><b>{a[0]}</b><small>{a[1]}</small></div><time>{a[2]}</time></div>)}</section></div></>;
}

function ProjectsPage({ projects, setProjects, navigate, notify, createProject }: { projects:Project[]; setProjects:(p:Project[])=>void; navigate:(p:string)=>void; notify:(s:string)=>void; createProject:(n?:string)=>Project }) {
  const [query,setQuery]=useState("");const [filter,setFilter]=useState("All status");const [view,setView]=useState<"grid"|"list">("grid");const [menu,setMenu]=useState<string|null>(null);
  const filtered=useMemo(()=>projects.filter(p=>(p.name.toLowerCase().includes(query.toLowerCase())||p.category.toLowerCase().includes(query.toLowerCase()))&&(filter==="All status"||p.status===filter)),[projects,query,filter]);
  const projectAction=(action:string,p:Project)=>{setMenu(null);if(action==="Rename"){const name=window.prompt("Give your project a new name",p.name);if(name?.trim()){setProjects(projects.map(item=>item.id===p.id?{...item,name:name.trim()}:item));notify("Project renamed.");}}else if(action==="Duplicate"){const copy={...p,id:`p${Date.now()}`,name:`${p.name} copy`,modified:"Just now"};setProjects([copy,...projects]);notify("Project duplicated.");}else if(action==="Delete"&&window.confirm(`Delete “${p.name}”? This cannot be undone.`)){setProjects(projects.filter(item=>item.id!==p.id));notify("Project deleted.");}};
  return <><PageTitle eyebrow="YOUR CREATIVE WORKSPACE" title="My projects" description="All the things you’ve sketched, shaped and brought to life." action={<Button onClick={()=>{const p=createProject();navigate(`/workspace/${p.id}`);}}><Plus size={16}/> New project</Button>}/><div className="toolbar"><div className="search-field"><Search size={16}/><input aria-label="Search projects" placeholder="Search projects..." value={query} onChange={e=>setQuery(e.target.value)}/><kbd>⌘ K</kbd></div><select aria-label="Filter by status" value={filter} onChange={e=>setFilter(e.target.value)}><option>All status</option><option>In progress</option><option>Generated</option><option>Draft</option></select><button className="toolbar-button"><Filter size={15}/> Filters</button><div className="view-switch"><button className={view==="grid"?"active":""} onClick={()=>setView("grid")} aria-label="Grid view"><Grid2X2 size={16}/></button><button className={view==="list"?"active":""} onClick={()=>setView("list")} aria-label="List view"><List size={16}/></button></div></div><div className={view==="grid"?"project-grid project-listing":"project-listing list-view"}>{filtered.map(p=><article className="project-card" key={p.id} onClick={()=>navigate(`/workspace/${p.id}`)}><ProjectThumb accent={p.accent}/><div className="project-card-content"><div className="project-card-heading"><h3>{p.name}</h3><button className="dots-button" onClick={e=>{e.stopPropagation();setMenu(menu===p.id?null:p.id)}}><MoreHorizontal size={17}/></button>{menu===p.id&&<div className="project-menu">{["Rename","Duplicate","Delete"].map(a=><button key={a} onClick={e=>{e.stopPropagation();projectAction(a,p)}}>{a}</button>)}</div>}</div><div className="project-meta"><span>{p.modified}</span><span>{p.components} components</span></div><div className="project-card-footer"><span className={`status status-${p.status.toLowerCase().replace(" ","-")}`}><i/>{p.status}</span><button onClick={e=>{e.stopPropagation();navigate(`/workspace/${p.id}`)}}>Open <ArrowUpRight size={13}/></button></div></div></article>)}</div>{filtered.length===0&&<div className="empty-state"><FolderKanban size={25}/><h3>No projects found</h3><p>Try a different search, or create a fresh project.</p><Button onClick={()=>createProject()}>Create a project <Plus size={15}/></Button></div>}</>;
}

function TemplatesPage({ createProject, navigate, notify }: {createProject:(name?:string)=>Project;navigate:(p:string)=>void;notify:(s:string)=>void}) {
  const [category,setCategory]=useState("All");const [query,setQuery]=useState("");
  const shown=templates.filter(t=>(category==="All"||t[1]===category)&&(t[0].toLowerCase().includes(query.toLowerCase())||t[2].toLowerCase().includes(query.toLowerCase())));
  return <><PageTitle eyebrow="A LITTLE INSPIRATION" title="Template library" description="Good ideas to borrow, bend and make your own." action={<span className="prototype-pill"><i/> Prototype library</span>}/><div className="toolbar template-toolbar"><div className="search-field"><Search size={16}/><input placeholder="Find a starting point..." value={query} onChange={e=>setQuery(e.target.value)}/></div><select value={category} onChange={e=>setCategory(e.target.value)} aria-label="Template category">{categories.map(c=><option key={c}>{c}</option>)}</select></div><div className="category-pills">{categories.map(c=><button className={category===c?"active":""} key={c} onClick={()=>setCategory(c)}>{c}</button>)}</div><div className="template-grid">{shown.map((t,i)=><article className="template-card" key={t[0]}><div className={`template-image thumb-${t[3]}`}><ProjectThumb accent={t[3]} compact/><span className="template-number">0{i+1}</span><button title="Preview template" onClick={()=>notify(`${t[0]} preview selected`)}><Eye size={16}/></button></div><div className="template-info"><div><span>{t[1]}</span><h3>{t[0]}</h3><p>{t[2]}</p></div><button className="use-template" onClick={()=>{const p=createProject(t[0]);notify(`${t[0]} added to your projects.`);navigate(`/workspace/${p.id}`)}}>Use template <ArrowUpRight size={14}/></button></div></article>)}</div>{shown.length===0&&<div className="empty-state"><Search size={25}/><h3>No templates here yet</h3><p>Try another category or search term.</p></div>}</>;
}

function ComponentsPage({notify}:{notify:(s:string)=>void}) {
  const [category,setCategory]=useState("All");const [query,setQuery]=useState("");
  const shown=componentItems.filter(c=>(category==="All"||c[1]===category)&&(c[0].toLowerCase().includes(query.toLowerCase())||c[1].toLowerCase().includes(query.toLowerCase())));
  return <><PageTitle eyebrow="YOUR UI TOOLKIT" title="Component library" description="Reusable bits and pieces for the interface you have in mind." action={<span className="prototype-pill"><Layers size={13}/> {componentItems.length} components</span>}/><div className="toolbar"><div className="search-field"><Search size={16}/><input placeholder="Search components..." value={query} onChange={e=>setQuery(e.target.value)}/></div></div><div className="category-pills component-cats">{componentCategories.map(c=><button key={c} className={category===c?"active":""} onClick={()=>setCategory(c)}>{c}</button>)}</div><div className="component-grid">{shown.map(c=><article className="library-card" key={c[0]}><div className={`library-preview library-${c[3]}`}>{c[3]==="button"?<button className="demo-action">Get started <ArrowRight size={13}/></button>:c[3]==="card"?<div className="demo-card"><span/><b>A thoughtful detail</b><small>Small things add up.</small></div>:c[3]==="nav"?<div className="demo-nav"><b>morrow.</b><span>Menu&nbsp;&nbsp; About</span></div>:c[3]==="form"?<div className="demo-form"><span>Stay in the loop</span><input placeholder="Email address"/><button>Join</button></div>:c[3]==="input"?<div className="demo-input"><Search size={14}/> Search anything...</div>:c[3]==="hero"?<div className="demo-hero"><small>NEW PERSPECTIVES</small><b>Find your<br/>own way.</b></div>:c[3]==="footer"?<div className="demo-footer"><b>morrow®</b><span>About　 Journal　 Contact</span></div>:c[3]==="pricing"?<div className="demo-pricing"><small>STUDIO</small><b>$12 <small>/ month</small></b><span>✓ Everything you need</span></div>:<div className="demo-widget"><small>MONTHLY REVENUE</small><b>$24,680 <i>↗ 12.8%</i></b><span>▁ ▂ ▃ ▂ ▅ ▄ ▇ ▆</span></div>}</div><div className="library-card-bottom"><div><h3>{c[0]}</h3><span>{c[1]} · {c[2]}</span></div><button onClick={()=>notify(`${c[0]} JSX copied to clipboard.`)} title="Copy JSX"><Copy size={15}/></button></div></article>)}</div></>;
}

function ActivityPage(){return <><PageTitle eyebrow="THE LITTLE THINGS ADD UP" title="Activity" description="A running note of what has been happening across your workspace."/><div className="activity-timeline">{activities.map((a,i)=><article className="timeline-item" key={a[0]}><div className="timeline-mark"><span>{i===0?<Sparkles size={15}/>:i===1?<Pen size={15}/>:i===2?<Code2 size={15}/>:i===3?<Plus size={15}/>:<LayoutTemplate size={15}/>}</span></div><div className="timeline-content"><div><b>{a[0]}</b><span> in <strong>{a[1]}</strong></span></div><p>{i===0?"Your sketch became a first-pass interface with a dozen reusable pieces.":i===1?"A few thoughtful adjustments to keep the direction feeling right.":i===2?"A React component export is ready to take wherever you build.":"A new idea has found its way into the workspace."}</p><time>{a[2]}</time></div></article>)}</div><div className="activity-footnote"><Activity size={16}/> Activity is example content in this frontend prototype.</div></>;}

function SettingsPage({notify}:{notify:(s:string)=>void}) {
  const [tab,setTab]=useState("Profile");const [name,setName]=useState(()=>{try{return JSON.parse(localStorage.getItem("morphcanvas-user")||"{}").name||"Dhruv Mehta"}catch{return"Dhruv Mehta"}});const [email,setEmail]=useState(()=>{try{return JSON.parse(localStorage.getItem("morphcanvas-user")||"{}").email||"dhruv@example.com"}catch{return"dhruv@example.com"}});const [theme,setTheme]=useState(localStorage.getItem("morphcanvas-theme")||"Dark");const [device,setDevice]=useState("Desktop");
  const tabs=["Profile","Appearance","Preferences","Workspace","Notifications"];
  return <><PageTitle eyebrow="MAKE IT YOURS" title="Settings" description="A few small preferences to make this space feel like yours."/><div className="settings-layout"><nav className="settings-tabs">{tabs.map(t=><button key={t} className={tab===t?"active":""} onClick={()=>setTab(t)}>{t==="Profile"?<Home size={15}/>:t==="Appearance"?<Eye size={15}/>:t==="Preferences"?<Settings size={15}/>:t==="Workspace"?<FolderKanban size={15}/>:<Bell size={15}/>} {t}</button>)}</nav><section className="settings-card"><div className="settings-section-head"><h2>{tab}</h2><p>{tab==="Profile"?"Manage your name and contact details.":tab==="Appearance"?"Set the feel of your workspace.":tab==="Preferences"?"Choose useful defaults for your work.":tab==="Workspace"?"Details about this personal workspace.":"Choose which updates you would like to see."}</p></div>{tab==="Profile"?<><div className="settings-avatar"><span className="profile-avatar">DM</span><div><b>Your profile photo</b><small>Photos are not available in this prototype.</small></div><button className="toolbar-button" onClick={()=>notify("Photo uploads are not available in the demo.")}>Change photo</button></div><label className="settings-label">Full name<input value={name} onChange={e=>setName(e.target.value)}/></label><label className="settings-label">Email address<input type="email" value={email} onChange={e=>setEmail(e.target.value)}/></label></>:tab==="Appearance"?<div className="choice-cards">{["Dark","Light","System"].map(t=><button className={theme===t?"chosen":""} key={t} onClick={()=>setTheme(t)}><span className={`theme-swatch theme-${t.toLowerCase()}`}/><b>{t}</b>{theme===t&&<Check size={14}/>}</button>)}</div>:tab==="Preferences"?<label className="settings-label">Default preview device<select value={device} onChange={e=>setDevice(e.target.value)}><option>Desktop</option><option>Tablet</option><option>Mobile</option></select></label>:tab==="Workspace"?<><label className="settings-label">Workspace name<input defaultValue="Dhruv's workspace"/></label><div className="workspace-plan"><span className="plan-icon"><CreditCard size={16}/></span><div><b>Prototype workspace</b><small>Local-only demo · No billing configured</small></div><span className="prototype-pill">DEMO</span></div></>:<div className="notification-options">{["Product updates","Project activity","Tips & inspiration"].map((x,i)=><label key={x}><span><b>{x}</b><small>{i===0?"Occasional notes about what’s new.":i===1?"Changes and updates across your projects.":"Thoughtful ideas to keep you moving."}</small></span><input type="checkbox" defaultChecked={i!==2}/></label>)}</div>}<div className="settings-actions"><span>Changes are stored in this browser.</span><Button onClick={()=>{localStorage.setItem("morphcanvas-user",JSON.stringify({name,email}));localStorage.setItem("morphcanvas-theme",theme);notify("Your preferences have been saved.");}}>Save changes <Check size={14}/></Button></div></section></div></>;
}

const defaultSketch:SketchItem[]=[
  {id:1,kind:"rect",x:100,y:48,w:800,h:48},{id:2,kind:"text",x:125,y:79,text:"LOGO"},{id:3,kind:"text",x:640,y:79,text:"About     Work     Contact"},
  {id:4,kind:"rect",x:100,y:124,w:800,h:230},{id:5,kind:"text",x:145,y:190,text:"A headline goes here"},{id:6,kind:"text",x:145,y:220,text:"Add a little supporting copy to explain the idea."},{id:7,kind:"rect",x:145,y:256,w:126,h:42},{id:8,kind:"text",x:163,y:283,text:"GET STARTED"},{id:9,kind:"rect",x:645,y:153,w:210,h:168},
  {id:10,kind:"text",x:100,y:405,text:"A FEW REASONS TO STICK AROUND"},{id:11,kind:"rect",x:100,y:427,w:250,h:112},{id:12,kind:"rect",x:375,y:427,w:250,h:112},{id:13,kind:"rect",x:650,y:427,w:250,h:112},
  {id:14,kind:"text",x:100,y:588,text:"Footer links        Socials        © 2025"},
];

const sampleCode=`export default function GeneratedPage() {
  return (
    <main className="min-h-screen bg-[#f7f5f0] text-[#20211e]">
      <nav className="flex items-center justify-between p-6">
        <a className="font-semibold tracking-tight">morrow®</a>
        <div className="hidden gap-8 text-sm md:flex">
          <a>Our approach</a><a>Projects</a><a>Journal</a>
        </div>
        <button className="rounded-full bg-[#24251f] px-5 py-2.5 text-sm text-white">
          Say hello ↗
        </button>
      </nav>
      <section className="px-8 py-24 md:px-20">
        <p className="text-xs tracking-[0.2em]">CREATIVE STUDIO — EST. 2018</p>
        <h1 className="mt-8 max-w-3xl text-6xl font-medium leading-[0.98] md:text-8xl">
          Ideas with a little more intention.
        </h1>
        <p className="mt-8 max-w-sm text-lg text-neutral-500">
          We make digital things for a world that needs a little less noise.
        </p>
      </section>
    </main>
  );
}`;

function GeneratedPreview({ device }: {device:string}) {
  return <div className={`generated-preview preview-${device.toLowerCase()}`}><div className="generated-nav"><b>morrow®</b><span>Our approach　 Projects　 Journal</span><button>Say hello ↗</button></div><div className="generated-copy"><small>CREATIVE STUDIO — EST. 2018</small><h1>Ideas with<br/>a little more<br/><em>intention.</em></h1><p>We make digital things for a world that needs a little less noise.</p><button>Meet the studio <ArrowRight size={13}/></button></div><div className="generated-footer"><span>Independent creative studio</span><span>SCROLL TO EXPLORE ↓</span></div></div>;
}

function Workspace({ id, projects, navigate, notify }: {id:string;projects:Project[];navigate:(p:string)=>void;notify:(s:string)=>void}) {
  const project=projects.find(p=>p.id===id)||{name:id==="new"?"Untitled design":"Modern SaaS Landing Page"};
  const [activeTool,setActiveTool]=useState("select");const [items,setItems]=useState<SketchItem[]>(()=>defaultSketch.map(x=>({...x})));const [selected,setSelected]=useState<number|null>(null);const [tab,setTab]=useState("Canvas");const [rightTab,setRightTab]=useState("Layers");const [generating,setGenerating]=useState(false);const [generated,setGenerated]=useState(false);const [device,setDevice]=useState("Desktop");const [code,setCode]=useState(sampleCode);const [input,setInput]=useState("");const [messages,setMessages]=useState([{role:"assistant",text:"Hey! I’m your design sidekick. I can offer a few ideas to help your interface feel more considered."}]);const [zoom,setZoom]=useState(100);const [drawing,setDrawing]=useState(false);const [draft,setDraft]=useState<SketchItem|null>(null);const [drag,setDrag]=useState<{id:number;startX:number;startY:number;originX:number;originY:number}|null>(null);const [resizing,setResizing]=useState<{id:number;startX:number;startY:number;width:number;height:number}|null>(null);const [previewRefresh,setPreviewRefresh]=useState(0);const svgRef=useRef<SVGSVGElement>(null);
  const getPoint=(event:React.PointerEvent<SVGElement>)=>{const rect=svgRef.current!.getBoundingClientRect();return{x:((event.clientX-rect.left)/rect.width)*1000,y:((event.clientY-rect.top)/rect.height)*680};};
  const pointerDown=(event:React.PointerEvent<SVGSVGElement>)=>{if(activeTool==="select")return;const p=getPoint(event);setDrawing(true);const kind=activeTool==="pen"||activeTool==="eraser"?"path":activeTool==="text"?"text":activeTool==="circle"?"circle":"rect";setDraft({id:Date.now(),kind,x:p.x,y:p.y,w:kind==="rect"?0:undefined,h:kind==="rect"?0:undefined,text:kind==="text"?"Text":undefined,points:`${p.x},${p.y}`});};
  const pointerMove=(event:React.PointerEvent<SVGElement>)=>{const p=getPoint(event);if(resizing){setItems(prev=>prev.map(item=>item.id===resizing.id?{...item,w:Math.max(20,resizing.width+p.x-resizing.startX),h:Math.max(20,resizing.height+p.y-resizing.startY)}:item));return;}if(drag){setItems(prev=>prev.map(item=>item.id===drag.id?{...item,x:drag.originX+p.x-drag.startX,y:drag.originY+p.y-drag.startY}:item));return;}if(!drawing||!draft)return;setDraft(current=>current?current.kind==="path"?{...current,points:`${current.points} ${p.x},${p.y}`}:{...current,w:p.x-current.x,h:p.y-current.y}:null);};
  const pointerUp=()=>{if(draft){setItems(prev=>[...prev,draft]);setSelected(draft.id);}setDrawing(false);setDraft(null);setDrag(null);setResizing(null);};
  const addItem=(tool:string)=>{setActiveTool(tool);if(tool==="text"||tool==="rect"||tool==="circle"){const kind=tool==="text"?"text":tool as "rect"|"circle";const fresh:SketchItem={id:Date.now(),kind,x:450,y:300,w:kind==="rect"?150:100,h:kind==="rect"?80:100,text:kind==="text"?"Text":undefined};setItems(prev=>[...prev,fresh]);setSelected(fresh.id);setActiveTool("select");}};
  const generate=()=>{if(generating)return;setGenerating(true);setTab("Preview");window.setTimeout(()=>{setGenerating(false);setGenerated(true);notify("Demo generation complete — 8 interface components detected.");},2100);};
  const sendPrompt=(prompt:string)=>{const text=prompt.trim();if(!text)return;setMessages(prev=>[...prev,{role:"user",text},{role:"assistant",text:"Good direction. For this prototype, try giving the hero a little more breathing room, strengthening the headline hierarchy, and keeping one clear primary action."}]);setInput("");};
  const copyCode=async()=>{try{await navigator.clipboard.writeText(code);notify("React code copied to clipboard.");}catch{notify("Clipboard access is unavailable in this browser.");}};
  const downloadCode=()=>{const blob=new Blob([code],{type:"text/plain"});const url=URL.createObjectURL(blob);const anchor=document.createElement("a");anchor.href=url;anchor.download="GeneratedPage.jsx";anchor.click();URL.revokeObjectURL(url);notify("GeneratedPage.jsx downloaded.");};
  const removeSelected=()=>{if(selected!==null){setItems(items.filter(item=>item.id!==selected));setSelected(null);}};
  useEffect(()=>{const onKey=(event:KeyboardEvent)=>{if((event.key==="Delete"||event.key==="Backspace")&&(event.target as HTMLElement).tagName!=="TEXTAREA"){removeSelected();}if((event.ctrlKey||event.metaKey)&&event.key.toLowerCase()==="z"){setItems(defaultSketch.map(x=>({...x})));setSelected(null);}};window.addEventListener("keydown",onKey);return()=>window.removeEventListener("keydown",onKey);},[selected,items]);
  const drawItem=(item:SketchItem)=>{const selectedProps={onPointerDown:(e:React.PointerEvent<SVGElement>)=>{if(activeTool==="select"){e.stopPropagation();setSelected(item.id);const point=getPoint(e);setDrag({id:item.id,startX:point.x,startY:point.y,originX:item.x,originY:item.y});}}};if(item.kind==="text")return <text key={item.id} x={item.x} y={item.y} className="canvas-text" {...selectedProps}>{item.text}</text>;if(item.kind==="path")return <polyline key={item.id} points={item.points} fill="none" stroke="#262821" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...selectedProps}/>;if(item.kind==="circle")return <ellipse key={item.id} cx={item.x} cy={item.y} rx={item.w||50} ry={item.h||50} className="canvas-shape" {...selectedProps}/>;return <rect key={item.id} x={item.x} y={item.y} width={item.w} height={item.h} className="canvas-shape" {...selectedProps}/>;};
  const toolButtons=[[MousePointer2,"select","Select"],[Pen,"pen","Draw"],[Shapes,"rect","Rectangle"],[Circle,"circle","Circle"],[Type,"text","Text"],[ArrowRight,"arrow","Arrow"],[Image,"image","Image"],[X,"eraser","Eraser"]] as const;
  return <div className="workspace-page"><header className="workspace-header"><div className="workspace-brand"><button onClick={()=>navigate("/dashboard")} aria-label="Back to dashboard"><ArrowLeft size={17}/></button><Brand onClick={()=>navigate("/dashboard")}/><span className="workspace-divider"/><span className="workspace-name">{project.name}</span><button className="tiny-edit" onClick={()=>notify("Rename this project from My Projects.")}><MoreHorizontal size={16}/></button></div><div className="workspace-status"><span><i/> All changes saved</span><span className="prototype-pill">DEMO</span></div><div className="workspace-head-actions"><Button variant="secondary" onClick={()=>{setTab("Code");notify("Code is ready to inspect and edit.");}}><Code2 size={15}/> Code</Button><Button onClick={()=>{setTab("Preview");notify("Preview is ready to explore.");}}><ArrowDownToLine size={15}/> Export</Button></div></header>
    <div className="workspace-body"><aside className="canvas-toolbar"><div className="toolbar-section"><span>TOOLS</span>{toolButtons.map(([Icon,tool,label])=><button title={label} aria-label={label} key={tool} className={activeTool===tool?"active":""} onClick={()=>tool==="rect"||tool==="circle"||tool==="text"?addItem(tool):setActiveTool(tool)}><Icon size={17}/></button>)}</div><div className="toolbar-section"><span>HISTORY</span><button title="Undo" onClick={()=>{setItems(defaultSketch.map(x=>({...x})));setSelected(null);}}><Undo2 size={17}/></button><button title="Redo" onClick={()=>notify("Nothing to redo yet.")}><Redo2 size={17}/></button></div><div className="toolbar-section zoom-tools"><span>ZOOM</span><button onClick={()=>setZoom(Math.min(150,zoom+10))} title="Zoom in"><ZoomIn size={17}/></button><small>{zoom}%</small><button onClick={()=>setZoom(Math.max(60,zoom-10))} title="Zoom out"><ZoomOut size={17}/></button></div><div className="toolbar-section tool-bottom"><button title="Clear canvas" onClick={()=>{if(window.confirm("Clear your sketch?")){setItems([]);setSelected(null);}}}><X size={17}/></button><button title="Fit canvas" onClick={()=>setZoom(100)}><Move size={17}/></button></div></aside>
      <main className="work-area"><div className="work-tabs"><div className="work-tab-group"><button className={tab==="Canvas"?"active":""} onClick={()=>setTab("Canvas")}><Pen size={14}/> Canvas</button><button className={tab==="Preview"?"active":""} onClick={()=>setTab("Preview")}><Eye size={14}/> Preview</button><button className={tab==="Code"?"active":""} onClick={()=>setTab("Code")}><Code2 size={14}/> Code</button><button className={tab==="Components"?"active":""} onClick={()=>setTab("Components")}><Layers size={14}/> Components <span className="tab-count">8</span></button></div><div className="work-tools"><span className="saved-state"><i/> Saved</span><Button className="generate-button" disabled={generating} onClick={generate}>{generating?<><LoaderCircle size={15} className="spin"/> Reading sketch…</>:<><Sparkles size={15}/> Generate UI <span className="ai-tag">DEMO</span></>}</Button></div></div>
        <div className="work-canvas-wrap">{generating&&<div className="generation-overlay"><div className="scan-line"/><span className="scan-icon"><Sparkles size={19}/></span><b>Finding the shape of your idea</b><p>Mapping layout, spacing and components…</p><div className="progress-track"><span/></div><small>DEMO · No external AI processing</small></div>}
          {tab==="Canvas"?<div className="canvas-viewport"><div className="canvas-top-label"><span><span className="canvas-live-dot"/> Rough wireframe</span><span>Untitled page <ChevronDown size={12}/></span></div><div className="canvas-scene" style={{transform:`scale(${zoom/100})`}}><svg ref={svgRef} viewBox="0 0 1000 680" className={`drawing-canvas ${activeTool!=="select"?"canvas-drawing":""}`} onPointerDown={pointerDown} onPointerMove={pointerMove} onPointerUp={pointerUp} onPointerLeave={pointerUp}>{items.map(drawItem)}{draft&&drawItem(draft)}{selected!==null&&items.filter(i=>i.id===selected).map(i=><g key={`select-${i.id}`}><rect x={i.x-6} y={i.y-20} width={(i.w||90)+12} height={(i.h||26)+12} className="selection-outline" pointerEvents="none"/><circle cx={i.x+(i.w||90)+6} cy={i.y+(i.h||26)-8} r="5" className="resize-handle" onPointerDown={e=>{e.stopPropagation();setResizing({id:i.id,startX:getPoint(e).x,startY:getPoint(e).y,width:i.w||90,height:i.h||26});}}/></g>)}</svg></div><div className="canvas-legend"><span><i/> Sketch layer</span><span>Draw with a tool · Drag to move · Drag orange handle to resize · Delete to remove</span></div></div>:tab==="Preview"?<div className="live-preview-area" key={previewRefresh}><div className="live-preview-toolbar"><span><span className="canvas-live-dot"/> Live preview <small>{generated?"Generated sample":"Sample interface"}</small></span><div><button onClick={()=>setPreviewRefresh(value=>value+1)} title="Refresh preview"><Undo2 size={14}/></button><button onClick={e=>{const frame=e.currentTarget.closest(".live-preview-area") as HTMLElement|null;if(frame?.requestFullscreen)void frame.requestFullscreen();}} title="Fullscreen preview"><Monitor size={14}/></button></div></div><div className={`live-preview-frame frame-${device.toLowerCase()}`}><GeneratedPreview device={device}/></div><span className="live-preview-caption">This rendered React preview is sample content for the frontend demo.</span></div>:tab==="Code"?<div className="code-view"><div className="code-toolbar"><span><span className="code-dot"/> GeneratedPage.jsx <small>React · JSX</small></span><div><button onClick={()=>setCode(sampleCode)}><Undo2 size={13}/> Reset</button><button onClick={copyCode}><Copy size={13}/> Copy</button><button onClick={downloadCode}><Download size={13}/> Download</button></div></div><textarea spellCheck={false} aria-label="Edit generated React code" value={code} onChange={e=>setCode(e.target.value)}/><div className="code-status"><span>● JSX</span><span>{code.split("\n").length} lines</span><span>Changes stay in this browser session</span></div></div>:<div className="detected-components"><div><span className="eyebrow">DETECTED FROM YOUR SKETCH</span><h2>Eight familiar building blocks.</h2><p>Example component detection for this prototype.</p></div><div className="detected-grid">{[["Navbar","Navigation","Ready"],["Hero Section","Layout","Ready"],["Heading","Typography","Ready"],["CTA Button","Action","Ready"],["Image Placeholder","Media","Needs detail"],["Feature Card × 3","Content","Ready"],["Footer","Navigation","Ready"],["Responsive Layout","Structure","Suggested"]].map(c=><div key={c[0]}><Layers size={15}/><span><b>{c[0]}</b><small>{c[1]}</small></span><em>{c[2]}</em></div>)}</div></div>}
        </div><div className="preview-bottom-bar">{tab==="Canvas"?<><div className="device-switch"><button className="active" onClick={()=>setZoom(Math.max(60,zoom-10))} title="Zoom out"><ZoomOut size={14}/></button><button onClick={()=>setZoom(Math.min(150,zoom+10))} title="Zoom in"><ZoomIn size={14}/></button></div><span>Canvas · {items.length} elements</span><button className="zoom-indicator" onClick={()=>setZoom(100)}>{zoom}% <ChevronDown size={12}/></button></>:tab==="Preview"?<><div className="device-switch">{[[Monitor,"Desktop"],[Tablet,"Tablet"],[Smartphone,"Mobile"]].map(([Icon,d])=>{const DeviceIcon=Icon as typeof Monitor;return <button key={d as string} className={device===d?"active":""} onClick={()=>setDevice(d as string)} title={`${d} preview`}><DeviceIcon size={15}/></button>})}</div><span>{generated?"Sample interface · Demo content":"Sample preview"}</span><button className="zoom-indicator" onClick={()=>setPreviewRefresh(value=>value+1)}><Undo2 size={12}/> Refresh</button></>:<><span>{tab==="Code"?"Editable example component":"Mock component inventory"}</span><button onClick={()=>tab==="Code"?copyCode():notify("Component inventory copied.")}><Copy size={13}/> Copy</button></>}</div></main>
      <aside className="inspector"><div className="inspector-tabs">{["Layers","Components","AI Assistant"].map(t=><button key={t} className={rightTab===t?"active":""} onClick={()=>setRightTab(t)}>{t==="AI Assistant"?<Sparkles size={13}/>:t}</button>)}</div>{rightTab==="Layers"?<div className="inspector-content"><div className="inspector-heading"><div><span className="eyebrow">PAGE CONTENTS</span><h3>Layers <small>8</small></h3></div><button className="dots-button" onClick={()=>notify("Layer options")}>•••</button></div><div className="layer-list">{["Navbar","Hero Section","Heading","Body copy","CTA Button","Image Placeholder","Feature Section","Footer"].map((l,i)=><button key={l} className={selected===i+1?"layer-selected":""} onClick={()=>setSelected(i+1)}><span>{i===0?<LayoutDashboard size={14}/>:i===2?<Type size={14}/>:i===4?<Shapes size={14}/>:<Layers size={14}/>}</span>{l}<Eye size={13} className="layer-eye"/></button>)}</div><div className="properties-box"><span className="eyebrow">CANVAS</span><div><span>Width</span><b>1440 px</b></div><div><span>Background</span><b><i className="color-swatch"/> Warm white</b></div><div><span>Selected</span><b>{selected?"Layer "+selected:"Nothing selected"}</b></div></div></div>:rightTab==="Components"?<div className="inspector-content"><div className="inspector-heading"><div><span className="eyebrow">BUILDING BLOCKS</span><h3>Components <small>8</small></h3></div><button className="dots-button" onClick={()=>notify("Component options")}>•••</button></div>{["Navbar","Hero Section","Heading","CTA Button","Image Placeholder","Feature Card × 3","Footer","Responsive Layout"].map((c,i)=><div className="component-detected-row" key={c}><span className="component-detected-icon"><Shapes size={14}/></span><div><b>{c}</b><small>{["Navigation","Layout","Typography","Button","Media","Card","Navigation","Structure"][i]}</small></div><CheckCircle2 size={14} className="success-icon"/></div>)}<div className="inspector-note">Components are simulated examples based on the sample wireframe.</div></div>:<div className="assistant-panel"><div className="assistant-heading"><span className="assistant-avatar"><Sparkles size={15}/></span><div><b>Canvas companion</b><small><i/> Ready to brainstorm</small></div><span className="prototype-pill">MOCK</span></div><div className="chat-messages">{messages.map((m,i)=><div className={`chat-message ${m.role==="user"?"chat-user":""}`} key={i}>{m.role==="assistant"&&<span className="chat-avatar"><Sparkles size={12}/></span>}<p>{m.text}</p></div>)}</div><div className="suggestion-area"><small>TRY A DIRECTION</small>{["Improve spacing","Modernize layout","Add responsive design","Improve typography"].map(s=><button key={s} onClick={()=>sendPrompt(s)}>{s}<ArrowUpRight size={12}/></button>)}</div><form className="assistant-input" onSubmit={e=>{e.preventDefault();sendPrompt(input)}}><input placeholder="Ask for a refinement..." value={input} onChange={e=>setInput(e.target.value)}/><button type="submit" aria-label="Send message" disabled={!input.trim()}><Send size={14}/></button></form><div className="assistant-disclaimer"><Sparkles size={12}/> Simulated suggestions · No AI service connected</div></div>}</aside>
    </div></div>;
}

function App() {
  const [path,setPath]=useState(window.location.pathname);
  const [projects,setProjects]=useState<Project[]>(readProjects);
  const [toast,setToast]=useState("");
  const [mobileNav,setMobileNav]=useState(false);
  useEffect(()=>{const onPop=()=>setPath(window.location.pathname);window.addEventListener("popstate",onPop);return()=>window.removeEventListener("popstate",onPop);},[]);
  useEffect(()=>{localStorage.setItem("morphcanvas-projects",JSON.stringify(projects));},[projects]);
  useEffect(()=>{if(!toast)return;const timeout=window.setTimeout(()=>setToast(""),3200);return()=>window.clearTimeout(timeout);},[toast]);
  const navigate=(to:string)=>{window.history.pushState({}, "", to);setPath(to);window.scrollTo(0,0);setMobileNav(false);};
  const createProject=(name?:string)=>{const project:Project={id:`p${Date.now()}`,name:name||"Untitled design",category:"Website",modified:"Just now",components:0,status:"Draft",accent:["coral","olive","cream","blue","pink"][projects.length%5]};setProjects(prev=>[project,...prev]);return project;};
  const notify=(message:string)=>setToast(message);
  const logout=()=>{localStorage.removeItem("morphcanvas-user");navigate("/");notify("You have left the demo workspace.");};
  const isWorkspace=path.startsWith("/workspace/");
  const authRoute=["/login","/signup","/forgot-password"].includes(path);
  let page:React.ReactNode;
  if(path==="/"||path==="")page=<Landing navigate={navigate}/>;
  else if(authRoute)page=<AuthPage page={path.slice(1)} navigate={navigate}/>;
  else if(isWorkspace)page=<Workspace id={decodeURIComponent(path.split("/")[2]||"new")} projects={projects} navigate={navigate} notify={notify}/>;
  else {
    let content:React.ReactNode;
    if(path==="/dashboard")content=<Dashboard projects={projects} navigate={navigate} createProject={createProject} notify={notify}/>;
    else if(path==="/projects")content=<ProjectsPage projects={projects} setProjects={setProjects} navigate={navigate} notify={notify} createProject={createProject}/>;
    else if(path==="/templates")content=<TemplatesPage createProject={createProject} navigate={navigate} notify={notify}/>;
    else if(path==="/components")content=<ComponentsPage notify={notify}/>;
    else if(path==="/activity")content=<ActivityPage/>;
    else if(path==="/settings")content=<SettingsPage notify={notify}/>;
    else content=<div className="empty-state"><FileText size={24}/><h3>That page isn’t here yet.</h3><Button onClick={()=>navigate("/dashboard")}>Back to overview <ArrowRight size={14}/></Button></div>;
    page=<AppLayout path={path} navigate={navigate} logout={logout}>{content}</AppLayout>;
  }
  return <>{page}{toast&&<div className="toast"><CheckCircle2 size={17}/>{toast}<button onClick={()=>setToast("")} aria-label="Dismiss notification"><X size={14}/></button></div>}{mobileNav&&<div className="mobile-nav-state"><button onClick={()=>setMobileNav(false)}>Close <X size={16}/></button></div>}</>;
}

export default App;
