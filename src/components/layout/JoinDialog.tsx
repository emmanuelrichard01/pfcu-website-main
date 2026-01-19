
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { ArrowRight, Users, MessageCircle, HeartHandshake } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface JoinDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

const JoinDialog = ({ open, onOpenChange }: JoinDialogProps) => {
    const [whatsappNumber, setWhatsappNumber] = useState("2341234567890");

    useEffect(() => {
        const fetchWhatsApp = async () => {
            const { data } = await supabase
                .from('site_settings' as any)
                .select('value')
                .eq('key', 'whatsapp_number')
                .single();

            if (data) {
                setWhatsappNumber((data as any).value);
            }
        };
        fetchWhatsApp();
    }, []);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md p-0 overflow-hidden bg-white dark:bg-zinc-950 border-zinc-100 dark:border-zinc-800 shadow-2xl">
                {/* Visual Header */}
                <div className="bg-gradient-to-br from-pfcu-primary to-purple-800 p-8 text-center text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-10">
                        <HeartHandshake size={120} />
                    </div>
                    <div className="relative z-10">
                        <DialogTitle className="text-3xl font-display font-bold mb-2">Welcome Home</DialogTitle>
                        <DialogDescription className="text-white/80 text-base">
                            Becoming part of the family is the best decision you can make.
                        </DialogDescription>
                    </div>
                </div>

                <div className="p-6 grid gap-4">
                    {/* Option 1: Join Workforce */}
                    <Link to="/departments" onClick={() => onOpenChange(false)}>
                        <div className="group relative flex items-center gap-5 rounded-2xl border-2 border-zinc-100 dark:border-zinc-800 p-5 hover:border-pfcu-primary/30 hover:bg-pfcu-primary/5 transition-all duration-300 cursor-pointer">
                            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-pfcu-light dark:bg-pfcu-primary/20 text-pfcu-primary group-hover:scale-110 transition-transform duration-300">
                                <Users className="h-7 w-7" />
                            </div>
                            <div className="flex-1">
                                <h4 className="font-bold text-lg text-zinc-900 dark:text-zinc-100 mb-0.5">Join a Department</h4>
                                <p className="text-sm text-zinc-500 font-light">Serve in one of our 9 strategic units.</p>
                            </div>
                            <div className="h-8 w-8 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center group-hover:bg-pfcu-primary group-hover:text-white transition-colors">
                                <ArrowRight className="h-4 w-4" />
                            </div>
                        </div>
                    </Link>

                    {/* Option 2: WhatsApp Connection */}
                    <a
                        href={`https://wa.me/${whatsappNumber}?text=Hello%20PFCU,%20I%20would%20like%20to%20know%20more%20about%20joining%20the%20fellowship.`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => onOpenChange(false)}
                    >
                        <div className="group relative flex items-center gap-5 rounded-2xl border-2 border-zinc-100 dark:border-zinc-800 p-5 hover:border-green-500/30 hover:bg-green-50 dark:hover:bg-green-900/10 transition-all duration-300 cursor-pointer">
                            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-green-100 text-green-600 group-hover:scale-110 transition-transform duration-300">
                                <MessageCircle className="h-7 w-7" />
                            </div>
                            <div className="flex-1">
                                <h4 className="font-bold text-lg text-zinc-900 dark:text-zinc-100 mb-0.5">Chat with Us</h4>
                                <p className="text-sm text-zinc-500 font-light">Connect via WhatsApp directly.</p>
                            </div>
                            <div className="h-8 w-8 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center group-hover:bg-green-500 group-hover:text-white transition-colors">
                                <ArrowRight className="h-4 w-4" />
                            </div>
                        </div>
                    </a>
                </div>

                <div className="bg-zinc-50/50 dark:bg-zinc-900/50 p-4 text-center">
                    <p className="text-xs text-zinc-400 font-medium tracking-wide uppercase">Pentecostal Fellowship of Caritas University</p>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default JoinDialog;
