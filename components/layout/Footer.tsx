export function Footer() {
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
                            มุ่งมั่นสร้างสรรค์สังคมที่ดีขึ้นผ่านเทคโนโลยีที่ล้ำสมัย
                            ตามวิสัยทัศน์ "Changes for the Better"
                        </p>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-12 gap-y-8">
                        <div className="flex flex-col gap-4">
                            <h4 className="text-[11px] font-bold uppercase tracking-widest text-slate-900">
                                Products
                            </h4>
                            <ul className="flex flex-col gap-2 text-xs text-slate-500">
                                <li>
                                    <a
                                        href="#"
                                        className="hover:text-brand"
                                    >
                                        Air Conditioning
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className="hover:text-brand"
                                    >
                                        Automotive
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className="hover:text-brand"
                                    >
                                        Factory Automation
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <div className="flex flex-col gap-4">
                            <h4 className="text-[11px] font-bold uppercase tracking-widest text-slate-900">
                                About
                            </h4>
                            <ul className="flex flex-col gap-2 text-xs text-slate-500">
                                <li>
                                    <a
                                        href="#"
                                        className="hover:text-brand"
                                    >
                                        Our History
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className="hover:text-brand"
                                    >
                                        Sustainability
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <div className="flex flex-col gap-4">
                            <h4 className="text-[11px] font-bold uppercase tracking-widest text-slate-900">
                                Support
                            </h4>
                            <ul className="flex flex-col gap-2 text-xs text-slate-500">
                                <li>
                                    <a
                                        href="#"
                                        className="hover:text-brand"
                                    >
                                        Contact Us
                                    </a>
                                </li>
                                <li>
                                    <a
                                        href="#"
                                        className="hover:text-brand"
                                    >
                                        Legal Notice
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div className="h-px bg-slate-200 w-full mb-8" />

                <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] text-slate-400 font-medium uppercase tracking-widest">
                    <p>
                        © {currentYear} Mitsubishi Electric SCM (Thailand) Co.,
                        Ltd.
                    </p>
                    <div className="flex gap-6">
                        <a href="#" className="hover:text-brand">
                            Privacy Policy
                        </a>
                        <a href="#" className="hover:text-brand">
                            Terms of Use
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
