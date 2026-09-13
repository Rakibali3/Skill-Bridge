import React from 'react';
import {
    Play,
    ArrowRight,
    Users,
    Repeat,
    UserCheck,
    Star
} from 'lucide-react';

export default function HeroSection() {
    return (
        <section id='home' className="relative overflow-hidden bg-slate-50/50 px-4 py-10 sm:px-6 sm:py-14 md:px-8 lg:px-10 lg:py-20 xl:py-24">

            <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 sm:gap-12 lg:grid-cols-12 lg:gap-12 xl:gap-16">

                {/* Left Content */}
                <div className="order-1 space-y-6 sm:space-y-8 lg:col-span-7">

                    {/* Tagline */}
                    <div className="inline-flex flex-wrap items-center justify-center gap-1 rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-600 sm:px-4">
                        <span>Learn</span>
                        <span>•</span>
                        <span>Teach</span>
                        <span>•</span>
                        <span>Grow Together</span>
                    </div>

                    {/* Heading */}
                    <h1 className="text-4xl font-extrabold leading-[1.1] tracking-tight text-slate-900 sm:text-5xl md:text-6xl lg:text-6xl xl:text-7xl">
                        Connect. Learn.
                        <br />
                        <span>Share. Grow.</span>
                    </h1>

                    {/* Subtitle */}
                    <p className="max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg md:text-xl">
                        SkillBridge is a community-driven platform where you can
                        teach what you know, learn what you don't, and grow
                        together with a global community.
                    </p>

                    {/* Buttons */}
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">

                        <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3.5 font-medium text-white shadow-md shadow-indigo-500/20 transition-all hover:bg-indigo-700 hover:shadow-lg sm:w-auto cursor-pointer">
                            <span>Get Started</span>
                            <ArrowRight className="h-4 w-4" />
                        </button>

                        <button className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3.5 font-medium text-slate-700 shadow-sm transition-all hover:bg-slate-50 sm:w-auto cursor-pointer">
                            <Play className="h-4 w-4 fill-indigo-600 text-indigo-600" />
                            <span>Watch Video</span>
                        </button>

                    </div>

                    {/* Social Proof */}
                    <div className="flex flex-col gap-3 pt-2 xs:flex-row xs:items-center sm:gap-4 sm:pt-4">

                        <div className="flex -space-x-3">
                            <img
                                className="h-9 w-9 rounded-full object-cover ring-2 ring-white sm:h-10 sm:w-10"
                                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
                                alt="Community member"
                            />

                            <img
                                className="h-9 w-9 rounded-full object-cover ring-2 ring-white sm:h-10 sm:w-10"
                                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80"
                                alt="Community member"
                            />

                            <img
                                className="h-9 w-9 rounded-full object-cover ring-2 ring-white sm:h-10 sm:w-10"
                                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80"
                                alt="Community member"
                            />

                            <img
                                className="h-9 w-9 rounded-full object-cover ring-2 ring-white sm:h-10 sm:w-10"
                                src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80"
                                alt="Community member"
                            />
                        </div>

                        <p className="text-sm font-medium leading-relaxed text-slate-600">
                            Join{' '}
                            <span className="font-bold text-slate-900">
                                10,000+
                            </span>{' '}
                            learners and changemakers building a better future together.
                        </p>

                    </div>
                </div>

                {/* Right Image */}
                <div className="order-2 relative flex items-center justify-center lg:col-span-5">

                    {/* Background Glow */}
                    <div className="absolute -right-10 -top-10 -z-10 h-48 w-48 rounded-full bg-blue-200/40 blur-3xl sm:h-64 sm:w-64 lg:h-72 lg:w-72" />

                    <div className="absolute -bottom-10 -left-10 -z-10 h-48 w-48 rounded-full bg-indigo-200/40 blur-3xl sm:h-64 sm:w-64 lg:h-72 lg:w-72" />

                    {/* Hero Image */}
                    <div className="relative w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-none">
                        <img
                            src="/images/01_hero_girl_laptop.png"
                            alt="SkillBridge community member using laptop"
                            className="mx-auto h-auto w-full object-contain"
                        />
                    </div>

                </div>
            </div>

            {/* Metrics Section */}
            <div className="mx-auto mt-12 grid max-w-6xl grid-cols-1 divide-y divide-slate-100 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:mt-16 sm:grid-cols-2 sm:divide-x-0 sm:divide-y lg:grid-cols-4 lg:divide-x lg:divide-y-0 lg:p-6">

                {/* Metric 1 */}
                <div className="flex items-center gap-4 px-3 py-4 sm:px-5 lg:px-6">
                    <div className="rounded-xl bg-indigo-50 p-3 text-indigo-600">
                        <Users className="h-5 w-5 sm:h-6 sm:w-6" />
                    </div>

                    <div>
                        <h4 className="text-xl font-bold text-slate-900 sm:text-2xl">
                            10K+
                        </h4>

                        <p className="text-xs font-medium text-slate-500">
                            Active Learners
                        </p>
                    </div>
                </div>

                {/* Metric 2 */}
                <div className="flex items-center gap-4 px-3 py-4 sm:px-5 lg:px-6">
                    <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
                        <Repeat className="h-5 w-5 sm:h-6 sm:w-6" />
                    </div>

                    <div>
                        <h4 className="text-xl font-bold text-slate-900 sm:text-2xl">
                            5K+
                        </h4>

                        <p className="text-xs font-medium text-slate-500">
                            Skill Exchanges
                        </p>
                    </div>
                </div>

                {/* Metric 3 */}
                <div className="flex items-center gap-4 px-3 py-4 sm:px-5 lg:px-6">
                    <div className="rounded-xl bg-sky-50 p-3 text-sky-600">
                        <UserCheck className="h-5 w-5 sm:h-6 sm:w-6" />
                    </div>

                    <div>
                        <h4 className="text-xl font-bold text-slate-900 sm:text-2xl">
                            500+
                        </h4>

                        <p className="text-xs font-medium text-slate-500">
                            Communities
                        </p>
                    </div>
                </div>

                {/* Metric 4 */}
                <div className="flex items-center gap-4 px-3 py-4 sm:px-5 lg:px-6">
                    <div className="rounded-xl bg-yellow-50 p-3 text-yellow-600">
                        <Star className="h-5 w-5 sm:h-6 sm:w-6" />
                    </div>

                    <div>
                        <h4 className="text-xl font-bold text-slate-900 sm:text-2xl">
                            4.9/5
                        </h4>

                        <p className="text-xs font-medium text-slate-500">
                            Community Rating
                        </p>
                    </div>
                </div>

            </div>
        </section>
    );
}