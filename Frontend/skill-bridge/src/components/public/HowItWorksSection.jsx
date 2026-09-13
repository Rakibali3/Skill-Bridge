import {
  UserPlus,
  BrainCircuit,
  UsersRound,
  GraduationCap,
  ArrowRight,
} from "lucide-react";

const steps = [
  {
    number: "01",
    icon: UserPlus,
    title: "Create Your Profile",
    description:
      "Tell us about yourself, your experience, and the skills you are interested in.",
  },
  {
    number: "02",
    icon: BrainCircuit,
    title: "Add Your Skills",
    description:
      "Choose the skills you can teach and the skills you want to learn.",
  },
  {
    number: "03",
    icon: UsersRound,
    title: "Find Your Match",
    description:
      "Discover people with complementary skills and start a skill exchange.",
  },
  {
    number: "04",
    icon: GraduationCap,
    title: "Learn & Grow",
    description:
      "Complete tasks, collaborate, track progress, and achieve your learning goals.",
  },
];

export default function HowItWorksSection() {
  return (
    <section
      id="how-it-works"
      className="bg-slate-50 px-6 py-20 lg:px-10 lg:py-28"
    >
      <div className="mx-auto max-w-7xl">
        {/* Heading */}
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <span className="inline-block rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-600">
            Simple Process
          </span>

          <h2 className="mt-5 text-3xl font-bold text-slate-900 sm:text-4xl lg:text-5xl">
            How <span className="text-blue-600">SkillBridge</span> works
          </h2>

          <p className="mt-5 text-lg leading-relaxed text-slate-600">
            Start learning and teaching in just four simple steps.
          </p>
        </div>

        {/* Steps */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, index) => {
            const Icon = step.icon;

            return (
              <div key={step.number} className="relative">
                <div className="h-full rounded-2xl bg-white p-7 shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-xl">
                  <div className="flex items-center justify-between">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600">
                      <Icon className="h-7 w-7 text-white" />
                    </div>

                    <span className="text-3xl font-bold text-slate-100">
                      {step.number}
                    </span>
                  </div>

                  <h3 className="mt-7 text-xl font-bold text-slate-900">
                    {step.title}
                  </h3>

                  <p className="mt-3 leading-relaxed text-slate-600">
                    {step.description}
                  </p>
                </div>

                {/* Arrow between cards */}
                {index !== steps.length - 1 && (
                  <div className="absolute -right-5 top-1/2 z-10 hidden -translate-y-1/2 lg:block">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-md">
                      <ArrowRight className="h-5 w-5 text-blue-600" />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <p className="text-lg text-slate-600">
            Your next learning opportunity could be just one connection away.
          </p>

          <a
            href="/signup"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 hover:shadow-lg"
          >
            Get Started Today
            <ArrowRight className="h-5 w-5" />
          </a>
        </div>
      </div>
    </section>
  );
}