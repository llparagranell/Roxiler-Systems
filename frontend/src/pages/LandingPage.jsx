import { Link } from 'react-router-dom';

const roleCards = [
  {
    id: 'admin',
    title: 'System Administrator',
    badge: 'Enterprise',
    description: 'Centralized control for platform management. Oversee stores, users, and global metrics with ease.',
    features: [
      'Advanced store & user provisioning',
      'Real-time global analytics dashboard',
      'Granular data filtering & search',
      'Full administrative audit trails',
    ],
    actions: [
      { label: 'Login to Console', link: '/login', variant: 'primary' },
    ],
  },
  {
    id: 'user',
    title: 'Normal User',
    badge: 'Customer',
    description: 'Share your experience and help others find the best establishments in your city.',
    features: [
      'Seamless multi-platform signup',
      'Location-aware store discovery',
      'Interactive 5-star rating system',
      'Personal profile & security management',
    ],
    actions: [
      { label: 'Sign In', link: '/login', variant: 'primary' },
      { label: 'Join Community', link: '/register', variant: 'secondary' },
    ],
  },
  {
    id: 'owner',
    title: 'Store Owner',
    badge: 'Business',
    description: 'Grow your business with data-driven feedback and performance monitoring tools.',
    features: [
      'Dedicated business owner portal',
      'Secure credential management',
      'Aggregated performance scoring',
      'Detailed customer sentiment analysis',
    ],
    actions: [
      { label: 'Business Login', link: '/login', variant: 'primary' },
    ],
  },
];

export default function LandingPage() {
  return (
    <section className="space-y-32 py-16">
      <div className="relative overflow-hidden rounded-[4rem] border border-white/5 bg-brand-surface px-8 py-20 lg:px-24 shadow-2xl animate-fade-up">
        <div className="absolute -left-20 -top-20 h-96 w-96 rounded-full bg-brand-main/20 blur-[130px]" />
        <div className="absolute -right-20 -bottom-20 h-96 w-96 rounded-full bg-brand-accent/20 blur-[130px]" />

        <div className="relative z-10 flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
          <div className="flex-[1.2] space-y-10 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 rounded-full border border-brand-main/20 bg-brand-main/10 px-4 py-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-main opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-main"></span>
              </span>
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-main">Now Powered by Advanced Analytics</span>
            </div>

            <h1 className="text-6xl lg:text-8xl font-black tracking-tight text-white leading-[0.95] lg:leading-[1]">
              The Next Gen <br />
              <span className="bg-gradient-to-r from-brand-main via-indigo-400 to-brand-accent bg-clip-text text-transparent italic">
                Feedback OS
              </span>
            </h1>

            <p className="max-w-xl text-lg lg:text-2xl leading-relaxed text-brand-text/50 font-medium">
              A premium, role-architected ecosystem designed to bridge the gap between quality stores and loyal customers.
            </p>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6">
              <Link to="/login" className="btn-lg bg-brand-main text-white hover:bg-brand-mainHover min-w-[180px] py-6 text-base group">
                Launch Platform
                <svg className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
              </Link>
              <Link to="/register" className="btn-lg border border-white/10 bg-white/5 text-white hover:bg-white/10 min-w-[180px] py-6 text-base">
                Create Identity
              </Link>
            </div>
          </div>

          <div className="flex-1 relative group">
            <div className="absolute -inset-4 bg-gradient-to-tr from-brand-main/20 to-brand-accent/20 rounded-[3rem] blur-2xl opacity-50 transition-opacity group-hover:opacity-100" />
            <div className="relative rounded-[2.5rem] border border-white/10 bg-brand-surface2 overflow-hidden shadow-2xl transform lg:rotate-3 transition-transform group-hover:rotate-0 duration-700">
              <img
                src="/brain/1daa6ee9-1c00-45d3-b294-ca7376f58c56/hero_platform_mockup_1776322639981.png"
                alt="Platform Preview"
                className="w-full h-auto object-cover opacity-90 transition-opacity group-hover:opacity-100"
              />
              <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-brand-surface2 to-transparent" />
            </div>
          </div>
        </div>
      </div>


      <div className="grid gap-10 lg:grid-cols-3">
        {roleCards.map((role) => (
          <div
            key={role.id}
            className="group relative rounded-[3rem] border border-white/5 bg-brand-surface p-10 shadow-xl transition-all duration-500 hover:-translate-y-4 hover:border-brand-main/40 animate-fade-up overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-brand-main/10 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
            <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-brand-main/5 blur-3xl opacity-0 transition-opacity group-hover:opacity-100" />

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-8">
                <span className="rounded-lg bg-brand-main/10 border border-brand-main/20 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-brand-main">
                  {role.badge}
                </span>
              </div>

              <h2 className="text-3xl font-bold text-white group-hover:text-brand-main transition-colors">{role.title}</h2>
              <p className="mt-4 text-brand-text/50 leading-relaxed font-medium">{role.description}</p>

              <div className="my-8 h-px bg-white/5" />

              <ul className="space-y-4 mb-12">
                {role.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-4 text-sm font-semibold text-brand-text/70">
                    <div className="mt-1 flex h-5 w-5 items-center justify-center rounded-full bg-brand-main/10 text-brand-main">
                      <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                    </div>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <div className="flex flex-col gap-3">
                {role.actions.map((action) => (
                  <Link
                    key={action.link}
                    to={action.link}
                    className={
                      action.variant === 'secondary'
                        ? 'inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-8 py-4 text-sm font-bold text-white transition hover:bg-white/10'
                        : 'inline-flex items-center justify-center rounded-2xl bg-brand-main px-8 py-4 text-sm font-bold text-white transition hover:bg-brand-mainHover shadow-lg shadow-indigo-500/10'
                    }
                  >
                    {action.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="relative overflow-hidden rounded-[4rem] border border-white/5 bg-brand-surface p-12 lg:p-24 shadow-2xl animate-fade-up">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-brand-main/5 to-transparent pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start gap-20">
          <div className="flex-1 space-y-8">
            <h3 className="text-5xl lg:text-6xl font-black text-white leading-tight">Engineered for Excellence.</h3>
            <p className="text-xl text-brand-text/50 leading-relaxed max-w-lg">
              We've decomposed the complex feedback loop into three architectural milestones. Pure efficiency, zero friction.
            </p>
            <div className="pt-8">
              <Link to="/register" className="text-brand-main font-bold flex items-center gap-2 hover:gap-4 transition-all uppercase tracking-widest text-xs">
                Learn about our architecture
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
              </Link>
            </div>
          </div>

          <div className="flex-1 grid gap-8">
            {[
              { id: '01', title: 'Admin Orchestration', text: 'Admins provision infrastructure and oversee the entire entity graph with real-time telemetry.' },
              { id: '02', title: 'User Engagement', text: 'High-fidelity rating systems designed for maximum precision and verified customer sentiment.' },
              { id: '03', title: 'Owner Intelligence', text: 'Aggregated analytics and performance scoring translated into actionable business growth.' },
            ].map((step) => (
              <div key={step.id} className="group relative pl-16 py-2">
                <div className="absolute left-0 top-0 text-5xl font-black text-brand-main/20 group-hover:text-brand-main/40 transition-colors">
                  {step.id}
                </div>
                <div>
                  <h4 className="text-xl font-bold text-white mb-3">{step.title}</h4>
                  <p className="text-brand-text/40 leading-relaxed font-medium">{step.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>


    </section>
  );
}
