import {
  Users,
  ArrowUpRight,
  Code2,
  Database,
  Palette,
  Brain,
} from "lucide-react";

const communities = [
  {
    icon: Code2,
    title: "Frontend Developers",
    members: "2.4K members",
    description:
      "Learn React, JavaScript, CSS, and modern frontend development.",
    tags: ["React", "JavaScript", "CSS"],
  },
  {
    icon: Database,
    title: "Backend Builders",
    members: "1.8K members",
    description:
      "Explore Java, Spring Boot, APIs, databases, and backend systems.",
    tags: ["Java", "Spring Boot", "SQL"],
  },
  {
    icon: Palette,
    title: "UI/UX Creators",
    members: "1.2K members",
    description:
      "Connect with designers and learn how to create better digital experiences.",
    tags: ["Figma", "UI Design", "UX"],
  },
  {
    icon: Brain,
    title: "AI & Future Tech",
    members: "3.1K members",
    description:
      "Discuss artificial intelligence, machine learning, and emerging technology.",
    tags: ["AI", "Python", "ML"],
  },
];

export default function CommunitiesSection() {
  return (
    <section
      id="communities"
      className="bg-white px-6 py-20 lg:px-10 lg:py-28"
    >
      <div className="mx-auto max-w-7xl">
        {/* Top Section */}
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div className="max-w-2xl">
            <span className="inline-block rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-600">
              Learn Together
            </span>

            <h2 className="mt-5 text-3xl font-bold text-slate-900 sm:text-4xl lg:text-5xl">
              Join communities that help you{" "}
              <span className="text-blue-600">grow faster</span>
            </h2>

            <p className="mt-5 text-lg leading-relaxed text-slate-600">
              Connect with people who share your interests, exchange knowledge,
              participate in discussions, and grow together.
            </p>
          </div>

          <a
            href="/signup"
            className="inline-flex w-fit items-center gap-2 font-semibold text-blue-600 transition hover:text-blue-800"
          >
            Explore Communities
            <ArrowUpRight className="h-5 w-5" />
          </a>
        </div>

        {/* Community Cards */}
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {communities.map((community) => {
            const Icon = community.icon;

            return (
              <div
                key={community.title}
                className="group rounded-2xl border border-slate-200 bg-slate-50 p-6 transition duration-300 hover:-translate-y-2 hover:bg-white hover:shadow-xl"
              >
                <div className="flex items-center justify-between">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600">
                    <Icon className="h-7 w-7 text-white" />
                  </div>

                  <ArrowUpRight className="h-5 w-5 text-slate-400 transition group-hover:text-blue-600" />
                </div>

                <h3 className="mt-6 text-xl font-bold text-slate-900">
                  {community.title}
                </h3>

                <div className="mt-2 flex items-center gap-2 text-sm text-slate-500">
                  <Users className="h-4 w-4" />
                  {community.members}
                </div>

                <p className="mt-4 text-sm leading-relaxed text-slate-600">
                  {community.description}
                </p>

                <div className="mt-5 flex flex-wrap gap-2">
                  {community.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-white px-3 py-1 text-xs font-medium text-slate-600"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}