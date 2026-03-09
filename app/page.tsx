import Image from 'next/image';
import { ChevronRight } from 'lucide-react';
export default function Home() {
    return (
        <div className="flex flex-col min-h-screen bg-white font-sans text-[#333]">
            <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-12">
                <div className="animate-in fade-in duration-1000">
                    <h1 className="text-3xl font-light mb-6 tracking-tight">
                        Supply Chain Management
                    </h1>
                    <p className="text-slate-600 mb-8 max-w-2xl leading-relaxed">
                        ระบบจัดการห่วงโซ่อุปทานส่วนกลาง ออกแบบตามมาตรฐาน
                        Mitsubishi Electric พร้อมลูกเล่น Navbar
                        สไลด์ซ่อนอัตโนมัติเมื่อเลื่อนหน้าจอลง (Smart Header)
                    </p>

                    {/* Mockup content ยาวๆ เพื่อให้ทดสอบการเลื่อนหน้าจอได้ชัดเจน */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {Array.from({ length: 12 }).map((_, i) => (
                            <div
                                key={i}
                                className="group p-6 border border-slate-100 rounded-lg shadow-sm bg-white hover:shadow-md transition-all cursor-pointer"
                            >
                                <div className="h-48 bg-slate-50 rounded mb-4 overflow-hidden">
                                    <div className="w-full h-full bg-linear-to-br from-slate-100 to-slate-200 group-hover:scale-105 transition-transform duration-700" />
                                </div>
                                <h3 className="font-bold text-lg mb-2 text-slate-800">
                                    Operational Report #{i + 1}
                                </h3>
                                <p className="text-sm text-slate-500 mb-4">
                                    ข้อมูลวิเคราะห์ประสิทธิภาพการขนส่งและคลังสินค้าประจำภูมิภาคเอเชียตะวันออกเฉียงใต้
                                </p>
                                <div className="flex items-center text-[#E60012] text-[11px] font-bold uppercase tracking-widest gap-2">
                                    View Details{' '}
                                    <ChevronRight className="h-3 w-3" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
}
