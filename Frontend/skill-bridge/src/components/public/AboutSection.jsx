import {
  HeartHandshake,
  Users,
  Target,
  Lightbulb,
  CheckCircle2,
} from "lucide-react";

export default function AboutSection() {
  const points = [
    "Learn directly from people with real skills",
    "Share your knowledge and help others grow",
    "Build meaningful professional connections",
    "Track your learning journey and progress",
  ];

  return (
    <section
      id="about"
      className="overflow-hidden bg-slate-900 px-6 py-20 lg:px-10 lg:py-28"
    >
      <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-2">
        {/* Left Content */}
        <div>
          <span className="inline-block rounded-full bg-blue-500/20 px-4 py-2 text-sm font-semibold text-blue-300">
            About SkillBridge
          </span>

          <h2 className="mt-6 text-4xl font-bold leading-tight text-white sm:text-5xl">
            Learning is better when{" "}
            <span className="text-blue-400">people grow together.</span>
          </h2>

          <p className="mt-6 text-lg leading-relaxed text-slate-300">
            SkillBridge was created to make learning more collaborative.
            Instead of learning alone, you can connect with people who have the
            skills you want to learn while sharing the skills you already know.
          </p>

          <div className="mt-8 space-y-4">
            {points.map((point) => (
              <div key={point} className="flex items-start gap-3">
                <CheckCircle2 className="mt-0.5 h-6 w-6 shrink-0 text-blue-400" />

                <p className="text-slate-200">{point}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right Cards */}
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition hover:-translate-y-1 hover:bg-white/10">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500">
              <HeartHandshake className="h-6 w-6 text-white" />
            </div>

            <h3 className="mt-5 text-xl font-bold text-white">
              Our Mission
            </h3>

            <p className="mt-3 leading-relaxed text-slate-400">
              Make knowledge sharing easier and connect learners with people who
              can help them grow.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition hover:-translate-y-1 hover:bg-white/10">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500">
              <Users className="h-6 w-6 text-white" />
            </div>

            <h3 className="mt-5 text-xl font-bold text-white">Community</h3>

            <p className="mt-3 leading-relaxed text-slate-400">
              Build connections with people who are learning, teaching, and
              growing just like you.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition hover:-translate-y-1 hover:bg-white/10">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500">
              <Target className="h-6 w-6 text-white" />
            </div>

            <h3 className="mt-5 text-xl font-bold text-white">Growth</h3>

            <p className="mt-3 leading-relaxed text-slate-400">
              Turn your learning goals into practical progress through tasks,
              collaboration, and real projects.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition hover:-translate-y-1 hover:bg-white/10">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-500">
              <Lightbulb className="h-6 w-6 text-white" />
            </div>

            <h3 className="mt-5 text-xl font-bold text-white">Knowledge</h3>

            <p className="mt-3 leading-relaxed text-slate-400">
              Everyone knows something valuable. SkillBridge helps turn that
              knowledge into opportunities for others.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}