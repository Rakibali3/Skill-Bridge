import {
  Search,
  Repeat2,
  ListChecks,
  MessageCircle,
  BarChart3,
  ShieldCheck,
} from "lucide-react";

const features = [
  {
    icon: Search,
    title: "Smart Skill Matching",
    description:
      "Find people whose skills match what you want to learn and what you can teach.",
  },
  {
    icon: Repeat2,
    title: "Skill Exchange",
    description:
      "Learn from others while sharing your knowledge and helping them grow.",
  },
  {
    icon: ListChecks,
    title: "Learning Tasks",
    description:
      "Create structured tasks, track progress, and build practical skills together.",
  },
  {
    icon: MessageCircle,
    title: "Real-Time Collaboration",
    description:
      "Connect with your learning partners and communicate throughout your journey.",
  },
  {
    icon: BarChart3,
    title: "Track Your Progress",
    description:
      "Monitor completed tasks, learning progress, and your overall skill growth.",
  },
  {
    icon: ShieldCheck,
    title: "Safe Community",
    description:
      "Build meaningful learning connections in a trusted and collaborative environment.",
  },
];

export default function FeaturesSection() {
  return (
    <section
      id="features"
      className="bg-white px-6 py-20 lg:px-10 lg:py-28"
    >
      <div className="mx-auto max-w-7xl">
        {/* Heading */}
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <span className="inline-block rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-600">
            Powerful Features
          </span>

          <h2 className="mt-5 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
            Everything you need to{" "}
            <span className="text-blue-600">learn and grow</span>
          </h2>

          <p className="mt-5 text-base leading-relaxed text-slate-600 sm:text-lg">
            SkillBridge brings learning, teaching, collaboration, and progress
            tracking together in one place.
          </p>
        </div>

        {/* Feature Cards */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <div
                key={feature.title}
                className="group rounded-2xl border border-slate-200 bg-white p-7 transition duration-300 hover:-translate-y-2 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-100/50"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 transition duration-300 group-hover:bg-blue-600">
                  <Icon className="h-7 w-7 text-blue-600 transition duration-300 group-hover:text-white" />
                </div>

                <h3 className="mt-6 text-xl font-bold text-slate-900">
                  {feature.title}
                </h3>

                <p className="mt-3 leading-relaxed text-slate-600">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}