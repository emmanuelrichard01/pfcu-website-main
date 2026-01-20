import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DepartmentLeader } from "@/hooks/useDepartmentLeaders";
import { Pencil, User, GraduationCap, BookOpen, Loader2 } from "lucide-react";

interface DepartmentLeadersListProps {
    leaders: DepartmentLeader[];
    loading: boolean;
    onUpdate: (id: string, updates: Partial<DepartmentLeader>) => Promise<boolean>;
}

const DepartmentLeadersList = ({ leaders, loading, onUpdate }: DepartmentLeadersListProps) => {
    const [editingLeader, setEditingLeader] = useState<DepartmentLeader | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        hod_name: "",
        hod_course: "",
        hod_level: "",
        hod_image: "",
        assistant_hod_name: "",
        assistant_hod_course: "",
        assistant_hod_level: "",
        assistant_hod_image: ""
    });

    const handleEdit = (leader: DepartmentLeader) => {
        setEditingLeader(leader);
        setFormData({
            hod_name: leader.hod_name || "",
            hod_course: leader.hod_course || "",
            hod_level: leader.hod_level || "",
            hod_image: leader.hod_image || "",
            assistant_hod_name: leader.assistant_hod_name || "",
            assistant_hod_course: leader.assistant_hod_course || "",
            assistant_hod_level: leader.assistant_hod_level || "",
            assistant_hod_image: leader.assistant_hod_image || ""
        });
        setIsDialogOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingLeader) return;

        setIsSubmitting(true);
        const success = await onUpdate(editingLeader.id, formData);
        setIsSubmitting(false);

        if (success) {
            setIsDialogOpen(false);
            setEditingLeader(null);
        }
    };

    const getInitials = (name: string | null) => {
        if (!name) return "?";
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);
    };

    if (loading) {
        return (
            <div className="flex justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-pfcu-primary" />
            </div>
        );
    }

    return (
        <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {leaders.map((leader) => (
                    <div
                        key={leader.id}
                        className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 hover:shadow-md transition-shadow"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 text-sm">
                                {leader.department_name}
                            </h3>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEdit(leader)}
                                className="h-8 w-8 p-0"
                            >
                                <Pencil className="w-4 h-4" />
                            </Button>
                        </div>

                        <div className="space-y-4">
                            {/* HOD */}
                            <div className="flex items-center gap-3">
                                <Avatar className="h-10 w-10 border">
                                    {leader.hod_image ? (
                                        <AvatarImage src={leader.hod_image} alt={leader.hod_name || "HOD"} />
                                    ) : (
                                        <AvatarFallback className="bg-pfcu-primary/10 text-pfcu-primary text-xs">
                                            {getInitials(leader.hod_name)}
                                        </AvatarFallback>
                                    )}
                                </Avatar>
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium text-zinc-900 dark:text-zinc-100 text-sm truncate">
                                        {leader.hod_name || <span className="text-zinc-400 italic">HOD not set</span>}
                                    </p>
                                    <p className="text-xs text-zinc-500 truncate">
                                        {leader.hod_course && leader.hod_level
                                            ? `${leader.hod_course} • ${leader.hod_level}`
                                            : "Head of Department"
                                        }
                                    </p>
                                </div>
                            </div>

                            {/* Assistant HOD */}
                            <div className="flex items-center gap-3">
                                <Avatar className="h-10 w-10 border">
                                    {leader.assistant_hod_image ? (
                                        <AvatarImage src={leader.assistant_hod_image} alt={leader.assistant_hod_name || "Asst. HOD"} />
                                    ) : (
                                        <AvatarFallback className="bg-zinc-100 dark:bg-zinc-800 text-zinc-500 text-xs">
                                            {getInitials(leader.assistant_hod_name)}
                                        </AvatarFallback>
                                    )}
                                </Avatar>
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium text-zinc-900 dark:text-zinc-100 text-sm truncate">
                                        {leader.assistant_hod_name || <span className="text-zinc-400 italic">Asst. HOD not set</span>}
                                    </p>
                                    <p className="text-xs text-zinc-500 truncate">
                                        {leader.assistant_hod_course && leader.assistant_hod_level
                                            ? `${leader.assistant_hod_course} • ${leader.assistant_hod_level}`
                                            : "Assistant Head of Department"
                                        }
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Edit Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <GraduationCap className="w-5 h-5" />
                            Edit Department Leaders
                        </DialogTitle>
                        <DialogDescription>
                            {editingLeader?.department_name}
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* HOD Section */}
                        <div className="space-y-4">
                            <h4 className="font-semibold text-sm text-zinc-700 dark:text-zinc-300 flex items-center gap-2">
                                <User className="w-4 h-4" />
                                Head of Department (HOD)
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="hod_name">Full Name</Label>
                                    <Input
                                        id="hod_name"
                                        value={formData.hod_name}
                                        onChange={(e) => setFormData({ ...formData, hod_name: e.target.value })}
                                        placeholder="e.g., John Doe"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="hod_course">Course</Label>
                                    <Input
                                        id="hod_course"
                                        value={formData.hod_course}
                                        onChange={(e) => setFormData({ ...formData, hod_course: e.target.value })}
                                        placeholder="e.g., Computer Science"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="hod_level">Level</Label>
                                    <Input
                                        id="hod_level"
                                        value={formData.hod_level}
                                        onChange={(e) => setFormData({ ...formData, hod_level: e.target.value })}
                                        placeholder="e.g., 400 Level"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="hod_image">Profile Image URL</Label>
                                    <Input
                                        id="hod_image"
                                        value={formData.hod_image}
                                        onChange={(e) => setFormData({ ...formData, hod_image: e.target.value })}
                                        placeholder="https://..."
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Assistant HOD Section */}
                        <div className="space-y-4">
                            <h4 className="font-semibold text-sm text-zinc-700 dark:text-zinc-300 flex items-center gap-2">
                                <BookOpen className="w-4 h-4" />
                                Assistant Head of Department
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="assistant_hod_name">Full Name</Label>
                                    <Input
                                        id="assistant_hod_name"
                                        value={formData.assistant_hod_name}
                                        onChange={(e) => setFormData({ ...formData, assistant_hod_name: e.target.value })}
                                        placeholder="e.g., Jane Smith"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="assistant_hod_course">Course</Label>
                                    <Input
                                        id="assistant_hod_course"
                                        value={formData.assistant_hod_course}
                                        onChange={(e) => setFormData({ ...formData, assistant_hod_course: e.target.value })}
                                        placeholder="e.g., Computer Science"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="assistant_hod_level">Level</Label>
                                    <Input
                                        id="assistant_hod_level"
                                        value={formData.assistant_hod_level}
                                        onChange={(e) => setFormData({ ...formData, assistant_hod_level: e.target.value })}
                                        placeholder="e.g., 300 Level"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="assistant_hod_image">Profile Image URL</Label>
                                    <Input
                                        id="assistant_hod_image"
                                        value={formData.assistant_hod_image}
                                        onChange={(e) => setFormData({ ...formData, assistant_hod_image: e.target.value })}
                                        placeholder="https://..."
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 pt-4 border-t">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsDialogOpen(false)}
                                disabled={isSubmitting}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                className="bg-pfcu-primary hover:bg-pfcu-primary/90"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    "Save Changes"
                                )}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
};

export default DepartmentLeadersList;
