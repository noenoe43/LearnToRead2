
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import useAuth from '@/hooks/useAuth';
import { toast } from 'sonner';
import { Edit } from 'lucide-react';

const profileSchema = z.object({
    username: z.string().min(3, 'El nombre de usuario debe tener al menos 3 caracteres').max(20, 'El nombre de usuario no puede tener más de 20 caracteres'),
});

type ProfileFormData = z.infer<typeof profileSchema>;

const ProfileEditDialog: React.FC = () => {
    const { profile, updateProfile, loading } = useAuth();
    const [open, setOpen] = useState(false);

    const form = useForm<ProfileFormData>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            username: profile?.username || '',
        },
    });

    const onSubmit = async (data: ProfileFormData) => {
        try {
            await updateProfile({
                username: data.username
            });
            setOpen(false);
            toast.success('¡Perfil actualizado correctamente!');
        } catch (error: any) {
            toast.error('Error al actualizar el perfil');
            console.error('Error updating profile:', error);
        }
    };

    // Reset form when profile changes or dialog opens
    React.useEffect(() => {
        if (open && profile) {
            form.reset({
                username: profile.username || '',
            });
        }
    }, [open, profile, form]);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                    <Edit className="h-4 w-4" />
                    Editar perfil
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Editar mi perfil</DialogTitle>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="username"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nombre de usuario</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="Ingresa tu nombre de usuario"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="flex justify-end gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setOpen(false)}
                            >
                                Cancelar
                            </Button>
                            <Button
                                type="submit"
                                disabled={loading}
                                className="bg-primary"
                            >
                                {loading ? 'Guardando...' : 'Guardar cambios'}
                            </Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};

export default ProfileEditDialog;