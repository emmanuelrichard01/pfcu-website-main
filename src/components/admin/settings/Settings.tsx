
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Save } from "lucide-react";

interface SiteSetting {
    key: string;
    value: string;
    label: string;
}

const Settings = () => {
    const [settings, setSettings] = useState<SiteSetting[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('site_settings' as any)
                .select('*')
                .order('key');

            if (error) throw error;

            let fetchedSettings = (data as unknown as SiteSetting[]) || [];

            // Ensure bank keys exist
            const requiredKeys = [
                { key: 'bank_name', label: 'Bank Name', value: '' },
                { key: 'account_name', label: 'Account Name', value: '' },
                { key: 'account_number', label: 'Account Number', value: '' },
                { key: 'cash_instructions', label: 'Cash Giving Instructions', value: 'You can give offering in cash during our weekly services or drop it in the offering box.' }
            ];

            requiredKeys.forEach(req => {
                if (!fetchedSettings.find(s => s.key === req.key)) {
                    fetchedSettings.push(req);
                }
            });

            // Sort so bank details are grouped or just let UI filter handle it
            setSettings(fetchedSettings);
        } catch (error: any) {
            toast({
                title: "Error loading settings",
                description: error.message,
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    // Format WhatsApp number: remove +, spaces, leading 0, ensure starts with 234
    const formatWhatsAppNumber = (value: string): string => {
        // Remove all non-numeric characters except the leading + for initial parsing
        let cleaned = value.replace(/[^\d+]/g, '');

        // Remove leading +
        if (cleaned.startsWith('+')) {
            cleaned = cleaned.substring(1);
        }

        // If starts with 0, replace with 234 (assuming Nigerian local format)
        if (cleaned.startsWith('0')) {
            cleaned = '234' + cleaned.substring(1);
        }

        // Ensure only digits remain
        cleaned = cleaned.replace(/\D/g, '');

        return cleaned;
    };

    const handleChange = (key: string, newValue: string) => {
        let formattedValue = newValue;

        // Special formatting for WhatsApp number
        if (key === 'whatsapp_number') {
            formattedValue = formatWhatsAppNumber(newValue);
        }

        setSettings(prev =>
            prev.map(item => item.key === key ? { ...item, value: formattedValue } : item)
        );
    };

    const handleSave = async () => {
        try {
            setSaving(true);

            // Update existing settings (only UPDATE, no INSERT - data is seeded via migration)
            const updates = settings.map(setting =>
                supabase
                    .from('site_settings' as any)
                    .update({
                        value: setting.value,
                        label: setting.label,
                        updated_at: new Date().toISOString()
                    })
                    .eq('key', setting.key)
            );

            await Promise.all(updates);

            toast({
                title: "Settings saved",
                description: "Contact details have been updated successfully.",
            });
        } catch (error: any) {
            toast({
                title: "Error saving settings",
                description: error.message,
                variant: "destructive",
            });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-pfcu-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-heading font-bold text-zinc-900 dark:text-white">Site Settings</h1>
                <p className="text-zinc-500">Manage contact information and global site details.</p>
            </div>

            <Card className="border-zinc-200 dark:border-zinc-800">
                <CardHeader>
                    <CardTitle>Contact Information</CardTitle>
                    <CardDescription>Details displayed in the Footer, Contact page, and 'Join' dialogs.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {settings.filter(s => !s.key.startsWith('bank_') && !s.key.startsWith('account_') && s.key !== 'cash_instructions').map((setting) => (
                        <div key={setting.key} className="space-y-2">
                            <Label htmlFor={setting.key}>{setting.label || setting.key}</Label>
                            <Input
                                id={setting.key}
                                value={setting.value}
                                onChange={(e) => handleChange(setting.key, e.target.value)}
                                placeholder={`Enter ${setting.label?.toLowerCase()}`}
                            />
                        </div>
                    ))}
                </CardContent>
            </Card>

            <Card className="border-zinc-200 dark:border-zinc-800">
                <CardHeader>
                    <CardTitle>Bank Account Details</CardTitle>
                    <CardDescription>Official fellowship account details for donations.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {settings.filter(s => s.key === 'bank_name' || s.key.startsWith('account_')).map((setting) => (
                        <div key={setting.key} className="space-y-2">
                            <Label htmlFor={setting.key}>{setting.label}</Label>
                            <Input
                                id={setting.key}
                                value={setting.value}
                                onChange={(e) => handleChange(setting.key, e.target.value)}
                                placeholder={`Enter ${setting.label?.toLowerCase()}`}
                            />
                        </div>
                    ))}
                </CardContent>
            </Card>

            <Card className="border-zinc-200 dark:border-zinc-800">
                <CardHeader>
                    <CardTitle>Cash / In-Person Giving</CardTitle>
                    <CardDescription>Instructions for students giving via cash or offering boxes.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {settings.filter(s => s.key === 'cash_instructions').map((setting) => (
                        <div key={setting.key} className="space-y-2">
                            <Label htmlFor={setting.key}>{setting.label}</Label>
                            <Input
                                id={setting.key}
                                value={setting.value}
                                onChange={(e) => handleChange(setting.key, e.target.value)}
                                placeholder="Enter instructions for cash giving..."
                            />
                        </div>
                    ))}
                </CardContent>
            </Card>

            <div className="pt-4 pb-8">
                <Button onClick={handleSave} disabled={saving} className="bg-pfcu-primary hover:bg-pfcu-primary/90 w-full md:w-auto">
                    {saving ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Saving Changes...
                        </>
                    ) : (
                        <>
                            <Save className="mr-2 h-4 w-4" />
                            Save All Settings
                        </>
                    )}
                </Button>
            </div>
        </div>
    );
};

export default Settings;
