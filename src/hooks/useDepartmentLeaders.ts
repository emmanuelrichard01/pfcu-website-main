import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

export interface DepartmentLeader {
    id: string;
    department_name: string;
    hod_name: string | null;
    hod_course: string | null;
    hod_level: string | null;
    hod_image: string | null;
    assistant_hod_name: string | null;
    assistant_hod_course: string | null;
    assistant_hod_level: string | null;
    assistant_hod_image: string | null;
    created_at: string;
    updated_at: string;
}

export const useDepartmentLeaders = () => {
    const [departmentLeaders, setDepartmentLeaders] = useState<DepartmentLeader[]>([]);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    const fetchDepartmentLeaders = useCallback(async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('department_leaders' as any)
                .select('*')
                .order('department_name', { ascending: true });

            if (error) throw error;

            setDepartmentLeaders((data as unknown as DepartmentLeader[]) || []);
        } catch (error) {
            console.error("Error fetching department leaders:", error);
            toast({
                title: "Error",
                description: "Failed to load department leaders.",
                variant: "destructive"
            });
        } finally {
            setLoading(false);
        }
    }, [toast]);

    useEffect(() => {
        fetchDepartmentLeaders();
    }, [fetchDepartmentLeaders]);

    const updateDepartmentLeader = async (
        id: string,
        updates: Partial<Omit<DepartmentLeader, 'id' | 'created_at' | 'updated_at'>>
    ): Promise<boolean> => {
        try {
            const { error } = await supabase
                .from('department_leaders' as any)
                .update(updates)
                .eq('id', id);

            if (error) throw error;

            toast({
                title: "Success",
                description: "Department leader updated successfully."
            });

            await fetchDepartmentLeaders();
            return true;
        } catch (error) {
            console.error("Error updating department leader:", error);
            toast({
                title: "Error",
                description: "Failed to update department leader.",
                variant: "destructive"
            });
            return false;
        }
    };

    const getDepartmentLeader = (departmentName: string): DepartmentLeader | undefined => {
        return departmentLeaders.find(
            (leader) => leader.department_name.toLowerCase() === departmentName.toLowerCase()
        );
    };

    return {
        departmentLeaders,
        loading,
        updateDepartmentLeader,
        getDepartmentLeader,
        refetch: fetchDepartmentLeaders
    };
};
