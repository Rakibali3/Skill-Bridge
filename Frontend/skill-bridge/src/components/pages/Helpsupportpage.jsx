import { useMemo, useState } from "react";
import {
    BookOpen,
    CheckCircle2,
    ChevronDown,
    LifeBuoy,
    Loader2,
    Mail,
    Repeat2,
    Route,
    Search,
    Send,
    User,
    Users,
} from "lucide-react";

import DashboardLayout from "../dashboard/DashboardLayout";

// Shown on the page and used for the "Email us" link.
const SUPPORT_EMAIL = "rakibalibvrm13@gmail.com";
const WEB3FORMS_KEY = import.meta.env.VITE_WEB3FORMS_KEY;

const CATEGORIES = [
    { id: "all", label: "All" },
    { id: "getting-started", label: "Getting Started", icon: User },
    { id: "skills", label: "Skills", icon: BookOpen },
    { id: "matches", label: "Matches & Exchanges", icon: Users },
    { id: "learning", label: "Learning Paths", icon: Route },
    { id: "account", label: "Account", icon: Repeat2 },
];

const FAQS = [
    {
        id: 1,
        category: "getting-started",
        question: "What is SkillBridge?",
        answer:
            "SkillBridge is a skill exchange platform. You list the skills you can teach and the skills you want to learn, get matched with other people, and exchange knowledge with them.",
    },
    {
        id: 2,
        category: "getting-started",
        question: "How do I complete my profile?",
        answer:
            "Go to My Profile from the sidebar, add your photo, bio and other details, then save. A complete profile helps you get better matches and more responses.",
    },
    {
        id: 3,
        category: "skills",
        question: "How do I add skills I can teach or want to learn?",
        answer:
            "Open My Skills from the sidebar. Add skills under 'I can teach' and 'I want to learn'. Matches are suggested based on these two lists, so keep them up to date.",
    },
    {
        id: 4,
        category: "skills",
        question: "Can I remove or change a skill later?",
        answer:
            "Yes. Go to My Skills and edit or remove any skill at any time. Existing exchanges are not affected.",
    },
    {
        id: 5,
        category: "matches",
        question: "How does matching work?",
        answer:
            "Find Matches shows people whose teachable skills match what you want to learn, and who want to learn what you can teach. The more skills you add, the more matches you will see.",
    },
    {
        id: 6,
        category: "matches",
        question: "How do I start an exchange?",
        answer:
            "Open a match from Find Matches and send an exchange request. Once the other person accepts, the exchange shows up under My Exchanges and you can chat with them in Messages.",
    },
    {
        id: 7,
        category: "matches",
        question: "Where can I see my requests and past exchanges?",
        answer:
            "My Exchanges lists all your pending, active and completed exchanges. You will also get a notification whenever a request is accepted, declined or updated.",
    },
    {
        id: 8,
        category: "learning",
        question: "How do Learning Paths work?",
        answer:
            "A learning path is a step-by-step roadmap for a skill. Start the path, then start and complete each topic in order. Your progress is tracked and shown as a percentage.",
    },
    {
        id: 9,
        category: "learning",
        question: "Why is a topic marked 'Currently Unavailable'?",
        answer:
            "The topic has been temporarily disabled by an admin. You can continue with the other topics, and it will be available again once it is re-enabled.",
    },
    {
        id: 10,
        category: "account",
        question: "I am not receiving notifications. What should I do?",
        answer:
            "Check the Notifications page first. If it is empty, refresh the page or log in again. If the problem continues, send us a message using the form below.",
    },
];

const TICKET_TYPES = [
    "Question",
    "Report a bug",
    "Report a user",
    "Account issue",
    "Feature suggestion",
    "Other",
];

function FaqItem({ faq, isOpen, onToggle }) {
    return (
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
            <button
                type="button"
                onClick={onToggle}
                aria-expanded={isOpen}
                className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
            >
                <span className="font-semibold text-slate-900">{faq.question}</span>
                <ChevronDown
                    size={19}
                    className={`shrink-0 text-slate-400 transition-transform ${isOpen ? "rotate-180 text-indigo-600" : ""
                        }`}
                />
            </button>

            {isOpen && (
                <p className="px-5 pb-5 text-sm leading-6 text-slate-500">
                    {faq.answer}
                </p>
            )}
        </div>
    );
}

export default function HelpSupportPage() {
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("all");
    const [openId, setOpenId] = useState(null);

    const [form, setForm] = useState({
        name: "",
        email: "",
        type: TICKET_TYPES[0],
        message: "",
    });
    const [isSending, setIsSending] = useState(false);
    const [isSent, setIsSent] = useState(false);
    const [error, setError] = useState("");

    const filteredFaqs = useMemo(() => {
        const query = search.trim().toLowerCase();

        return FAQS.filter((faq) => {
            const matchesCategory = category === "all" || faq.category === category;
            const matchesSearch =
                !query ||
                faq.question.toLowerCase().includes(query) ||
                faq.answer.toLowerCase().includes(query);

            return matchesCategory && matchesSearch;
        });
    }, [search, category]);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");

        if (!WEB3FORMS_KEY) {
            setError("Support form is not set up yet. Please email us directly instead.");
            return;
        }

        setIsSending(true);

        try {
            const response = await fetch("https://api.web3forms.com/submit", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                },
                body: JSON.stringify({
                    access_key: WEB3FORMS_KEY,
                    subject: `[SkillBridge] ${form.type} from ${form.name}`,
                    from_name: "SkillBridge Support",
                    name: form.name,
                    email: form.email,
                    type: form.type,
                    message: form.message,
                }),
            });

            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(result.message || "Request failed");
            }

            setIsSent(true);
            setForm((prev) => ({ ...prev, type: TICKET_TYPES[0], message: "" }));
        } catch (err) {
            console.error("Failed to send support request:", err);
            setError("Something went wrong while sending your message. Please try again.");
        } finally {
            setIsSending(false);
        }
    };

    const inputClass =
        "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-100";

    return (
        <DashboardLayout>
            <div className="min-h-screen bg-slate-50">
                <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
                    {/* ---------------- Hero + search ---------------- */}
                    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                        <div className="flex gap-4">
                            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
                                <LifeBuoy size={27} />
                            </div>

                            <div>
                                <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
                                    Help & Support
                                </h1>
                                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                                    Find answers to common questions, or send us a message if you
                                    need a hand.
                                </p>
                            </div>
                        </div>

                        <div className="relative mt-6">
                            <Search
                                size={18}
                                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                            />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search for help, e.g. exchange, skills, notifications"
                                className={`${inputClass} pl-11`}
                            />
                        </div>
                    </section>

                    {/* ---------------- FAQ ---------------- */}
                    <section className="mt-10">
                        <h2 className="text-xl font-bold text-slate-900">
                            Frequently asked questions
                        </h2>

                        <div className="mt-4 flex flex-wrap gap-2">
                            {CATEGORIES.map((item) => {
                                const active = category === item.id;

                                return (
                                    <button
                                        key={item.id}
                                        type="button"
                                        onClick={() => setCategory(item.id)}
                                        className={`rounded-full border px-4 py-2 text-sm font-medium transition ${active
                                                ? "border-indigo-600 bg-indigo-600 text-white"
                                                : "border-slate-200 bg-white text-slate-600 hover:border-indigo-200 hover:text-indigo-600"
                                            }`}
                                    >
                                        {item.label}
                                    </button>
                                );
                            })}
                        </div>

                        <div className="mt-5 space-y-3">
                            {filteredFaqs.length > 0 ? (
                                filteredFaqs.map((faq) => (
                                    <FaqItem
                                        key={faq.id}
                                        faq={faq}
                                        isOpen={openId === faq.id}
                                        onToggle={() =>
                                            setOpenId((prev) => (prev === faq.id ? null : faq.id))
                                        }
                                    />
                                ))
                            ) : (
                                <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center">
                                    <p className="font-semibold text-slate-700">
                                        No answers found for "{search}"
                                    </p>
                                    <p className="mt-1 text-sm text-slate-500">
                                        Try different words, or send us a message below.
                                    </p>
                                </div>
                            )}
                        </div>
                    </section>

                    {/* ---------------- Contact ---------------- */}
                    <section className="mt-12" id="contact">
                        <h2 className="text-xl font-bold text-slate-900">
                            Still need help?
                        </h2>
                        <p className="mt-1 text-sm text-slate-500">
                            Tell us what is going on and we will get back to you by email.
                        </p>

                        <div className="mt-5 grid gap-6 lg:grid-cols-3">
                            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:col-span-1 lg:self-start">
                                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                                    <Mail size={20} />
                                </div>
                                <h3 className="mt-4 font-semibold text-slate-900">Email us</h3>
                                <a
                                    href={`mailto:${SUPPORT_EMAIL}`}
                                    className="mt-1 block break-all text-sm font-semibold text-indigo-600 hover:underline"
                                >
                                    {SUPPORT_EMAIL}
                                </a>
                                <p className="mt-3 text-sm leading-6 text-slate-500">
                                    Include what you were trying to do and what happened, so we
                                    can help faster.
                                </p>
                            </div>

                            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 lg:col-span-2">
                                {isSent ? (
                                    <div className="flex flex-col items-center py-8 text-center">
                                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                                            <CheckCircle2 size={28} />
                                        </div>
                                        <h3 className="mt-4 text-lg font-semibold text-slate-900">
                                            Message sent
                                        </h3>
                                        <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
                                            Thanks for reaching out. We will reply to your email as
                                            soon as we can.
                                        </p>
                                        <button
                                            type="button"
                                            onClick={() => setIsSent(false)}
                                            className="mt-5 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
                                        >
                                            Send another message
                                        </button>
                                    </div>
                                ) : (
                                    <form onSubmit={handleSubmit} className="space-y-4">
                                        <div className="grid gap-4 sm:grid-cols-2">
                                            <div>
                                                <label
                                                    htmlFor="name"
                                                    className="mb-1.5 block text-sm font-medium text-slate-700"
                                                >
                                                    Your name
                                                </label>
                                                <input
                                                    id="name"
                                                    name="name"
                                                    type="text"
                                                    required
                                                    value={form.name}
                                                    onChange={handleChange}
                                                    className={inputClass}
                                                />
                                            </div>

                                            <div>
                                                <label
                                                    htmlFor="email"
                                                    className="mb-1.5 block text-sm font-medium text-slate-700"
                                                >
                                                    Email
                                                </label>
                                                <input
                                                    id="email"
                                                    name="email"
                                                    type="email"
                                                    required
                                                    value={form.email}
                                                    onChange={handleChange}
                                                    className={inputClass}
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label
                                                htmlFor="type"
                                                className="mb-1.5 block text-sm font-medium text-slate-700"
                                            >
                                                What is this about?
                                            </label>
                                            <select
                                                id="type"
                                                name="type"
                                                value={form.type}
                                                onChange={handleChange}
                                                className={inputClass}
                                            >
                                                {TICKET_TYPES.map((type) => (
                                                    <option key={type} value={type}>
                                                        {type}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div>
                                            <label
                                                htmlFor="message"
                                                className="mb-1.5 block text-sm font-medium text-slate-700"
                                            >
                                                Message
                                            </label>
                                            <textarea
                                                id="message"
                                                name="message"
                                                rows={5}
                                                required
                                                minLength={10}
                                                value={form.message}
                                                onChange={handleChange}
                                                placeholder="Describe your question or problem"
                                                className={`${inputClass} resize-none`}
                                            />
                                        </div>

                                        {error && (
                                            <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
                                                {error}
                                            </p>
                                        )}

                                        <button
                                            type="submit"
                                            disabled={isSending}
                                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
                                        >
                                            {isSending ? (
                                                <Loader2 size={18} className="animate-spin" />
                                            ) : (
                                                <Send size={18} />
                                            )}
                                            Send message
                                        </button>
                                    </form>
                                )}
                            </div>
                        </div>
                    </section>
                </main>
            </div>
        </DashboardLayout>
    );
}