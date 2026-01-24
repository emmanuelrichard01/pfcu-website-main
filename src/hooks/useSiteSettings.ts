
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface SiteSettings {
    bankName: string;
    accountNumber: string;
    accountName: string;
    cashInstructions: string;
    contactEmail: string;
    contactPhone: string;
    contactAddress: string;
}

const defaultSettings: SiteSettings = {
    bankName: "Opay",
    accountNumber: "8155037840",
    accountName: "Pentecostal Fellowship of Caritas University",
    cashInstructions: "You can give offering in cash during our weekly services or drop it in the offering box located at the entrance.",
    contactEmail: "info@pfcu.org",
    contactPhone: "+234 123 456 7890",
    contactAddress: "Caritas University, Amorji-Nike, Enugu State"
};

export const useSiteSettings = () => {
    const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const { data, error } = await supabase
                    .from('site_settings' as any)
                    .select('*');

                if (error) throw error;

                if (data) {
                    const newSettings: any = { ...defaultSettings };
                    data.forEach((item: any) => {
                        switch (item.key) {
                            case 'bank_name': newSettings.bankName = item.value; break;
                            case 'account_number': newSettings.accountNumber = item.value; break;
                            case 'account_name': newSettings.accountName = item.value; break;
                            case 'cash_instructions': newSettings.cashInstructions = item.value; break;
                            case 'contact_email': newSettings.contactEmail = item.value; break;
                            case 'contact_phone': newSettings.contactPhone = item.value; break;
                            case 'contact_address': newSettings.contactAddress = item.value; break;
                        }
                    });
                    setSettings(newSettings);
                }
            } catch (error) {
                console.error('Error fetching site settings:', error);
                toast.error("Failed to load site settings");
            } finally {
                setLoading(false);
            }
        };

        fetchSettings();
    }, []);

    return { settings, loading };
};
