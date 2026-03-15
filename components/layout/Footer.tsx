'use client';

import { useLocale } from '@/components/providers/LocaleProvider';

export function Footer() {
    const { messages } = useLocale();
    const currentYear = new Date().getFullYear();
    return (
        <footer className="w-full bg-[#f8f8f8] border-t border-slate-200">
            <div className="max-w-7xl mx-auto px-4 py-16">
                <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-12">
                    <div className="flex flex-col gap-6">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-[#333] flex items-center justify-center text-white text-xs font-bold">
                                M
                            </div>
                            <span className="font-bold text-sm tracking-tighter">
                                MITSUBISHI ELECTRIC
                            </span>
                        </div>
                        <p className="text-xs text-slate-500 max-w-xs leading-relaxed">
                            {messages.footer.description}
                        </p>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-12 gap-y-8">
                        <div className="flex flex-col gap-4">
                            <h4 className="text-[11px] font-bold uppercase tracking-widest text-slate-900">
                                {messages.footer.products}
                            </h4>
                            <ul className="flex flex-col gap-2 text-xs text-slate-500">
                                {messages.footer.productLinks.map((label) => (
                                    <li key={label}>
                                        <a
                                            href="#"
                                            className="hover:text-brand"
                                        >
                                            {label}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="flex flex-col gap-4">
                            <h4 className="text-[11px] font-bold uppercase tracking-widest text-slate-900">
                                {messages.footer.about}
                            </h4>
                            <ul className="flex flex-col gap-2 text-xs text-slate-500">
                                {messages.footer.aboutLinks.map((label) => (
                                    <li key={label}>
                                        <a
                                            href="#"
                                            className="hover:text-brand"
                                        >
                                            {label}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="flex flex-col gap-4">
                            <h4 className="text-[11px] font-bold uppercase tracking-widest text-slate-900">
                                {messages.footer.support}
                            </h4>
                            <ul className="flex flex-col gap-2 text-xs text-slate-500">
                                {messages.footer.supportLinks.map((label) => (
                                    <li key={label}>
                                        <a
                                            href="#"
                                            className="hover:text-brand"
                                        >
                                            {label}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="h-px bg-slate-200 w-full mb-8" />

                <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] text-slate-400 font-medium uppercase tracking-widest">
                    <p>
                        © {currentYear} {messages.footer.copyright}
                    </p>
                    <div className="flex gap-6">
                        <a href="#" className="hover:text-brand">
                            {messages.footer.privacyPolicy}
                        </a>
                        <a href="#" className="hover:text-brand">
                            {messages.footer.termsOfUse}
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
