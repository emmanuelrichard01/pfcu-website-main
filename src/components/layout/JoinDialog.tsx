
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogTitle,
} from "@/components/ui/dialog";
import { ArrowRight, Users, MessageCircle, HeartHandshake, Zap, Globe, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";

interface JoinDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    departmentName?: string | null;
}

const JoinDialog = ({ open, onOpenChange, departmentName }: JoinDialogProps) => {
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

    // Message Construction
    const baseMessage = "Hello PFCU, ";
    const specificMessage = departmentName
        ? `I am interested in joining the *${departmentName}*. Could you provide more information on how to get started?`
        : "I would like to know more about joining the fellowship.";

    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(baseMessage + specificMessage)}`;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-md p-0 overflow-hidden bg-white dark:bg-zinc-950 border-zinc-100 dark:border-zinc-800 shadow-2xl">
                {/* Visual Header - Cinematic Style */}
                <div className="relative overflow-hidden bg-zinc-900 pt-10 pb-8 px-8 text-center">
                    {/* Background Effects */}
                    <div className="absolute inset-0">
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-pfcu-primary/20 via-zinc-900/0 to-zinc-900/0" />
                        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-[0.05]" />
                    </div>

                    {/* Animated Doodles */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2, duration: 0.8 }}
                        className="absolute top-4 left-6 text-pfcu-primary/20"
                    >
                        <Zap size={24} />
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.4, duration: 0.8 }}
                        className="absolute bottom-4 right-8 text-blue-500/20"
                    >
                        <Globe size={32} />
                    </motion.div>

                    {/* Content */}
                    <div className="relative z-10">
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ type: "spring", stiffness: 200, damping: 15 }}
                            className="w-16 h-16 mx-auto bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl flex items-center justify-center mb-6 shadow-xl"
                        >
                            {departmentName ? (
                                <HeartHandshake className="text-pfcu-primary" size={32} />
                            ) : (
                                <Sparkles className="text-yellow-500" size={32} />
                            )}
                        </motion.div>

                        <DialogTitle className="text-3xl md:text-4xl font-heading font-bold text-white mb-3 tracking-tight">
                            {departmentName ? "Join the Family" : "Welcome Home"}
                        </DialogTitle>

                        <DialogDescription className="text-zinc-400 text-base max-w-xs mx-auto leading-relaxed">
                            {departmentName
                                ? `Take the next step to serve in the ${departmentName}.`
                                : "Becoming part of the family is the best decision you can make."
                            }
                        </DialogDescription>
                    </div>
                </div>

                {/* Body Content */}
                <div className="p-6 grid gap-4 bg-zinc-50/50 dark:bg-zinc-900/30">
                    {departmentName ? (
                        /* SPECIFIC CONTEXT: Show ONLY WhatsApp for Department */
                        <a
                            href={whatsappUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => onOpenChange(false)}
                        >
                            <motion.div
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className="group relative flex items-center gap-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 cursor-pointer shadow-sm hover:shadow-lg hover:border-green-500/30 transition-all duration-300"
                            >
                                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-green-50 text-green-600 group-hover:bg-green-100 transition-colors duration-300">
                                    <MessageCircle className="h-7 w-7" />
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-bold text-lg text-zinc-900 dark:text-zinc-100 mb-0.5">Chat on WhatsApp</h4>
                                    <p className="text-sm text-zinc-500 line-clamp-1">Connect directly to join <span className="font-semibold text-green-600">{departmentName}</span></p>
                                </div>
                                <div className="h-8 w-8 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center group-hover:bg-green-500 group-hover:text-white transition-colors">
                                    <ArrowRight className="h-4 w-4" />
                                </div>
                            </motion.div>
                        </a>
                    ) : (
                        /* GENERAL CONTEXT: Show Both Options */
                        <>
                            {/* Option 1: Join Workforce */}
                            <Link to="/departments" onClick={() => onOpenChange(false)}>
                                <motion.div
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="group relative flex items-center gap-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 cursor-pointer shadow-sm hover:shadow-lg hover:border-pfcu-primary/30 transition-all duration-300"
                                >
                                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-pfcu-primary/5 text-pfcu-primary group-hover:bg-pfcu-primary/10 transition-colors duration-300">
                                        <Users className="h-7 w-7" />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-bold text-lg text-zinc-900 dark:text-zinc-100 mb-0.5">Join a Department</h4>
                                        <p className="text-sm text-zinc-500">Serve in one of our 9 strategic units.</p>
                                    </div>
                                    <div className="h-8 w-8 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center group-hover:bg-pfcu-primary group-hover:text-white transition-colors">
                                        <ArrowRight className="h-4 w-4" />
                                    </div>
                                </motion.div>
                            </Link>

                            {/* Option 2: WhatsApp Connection */}
                            <a
                                href={whatsappUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={() => onOpenChange(false)}
                            >
                                <motion.div
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="group relative flex items-center gap-5 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5 cursor-pointer shadow-sm hover:shadow-lg hover:border-green-500/30 transition-all duration-300"
                                >
                                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-green-50 text-green-600 group-hover:bg-green-100 transition-colors duration-300">
                                        <MessageCircle className="h-7 w-7" />
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-bold text-lg text-zinc-900 dark:text-zinc-100 mb-0.5">Chat with Us</h4>
                                        <p className="text-sm text-zinc-500">Connect via WhatsApp directly.</p>
                                    </div>
                                    <div className="h-8 w-8 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center group-hover:bg-green-500 group-hover:text-white transition-colors">
                                        <ArrowRight className="h-4 w-4" />
                                    </div>
                                </motion.div>
                            </a>
                        </>
                    )}
                </div>

                <div className="bg-zinc-50 dark:bg-zinc-900 p-4 text-center border-t border-zinc-100 dark:border-zinc-800">
                    <p className="text-[10px] text-zinc-400 font-medium tracking-widest uppercase opacity-60">Pentecostal Fellowship of Caritas University</p>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default JoinDialog;
