import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import useAuth from '@/hooks/useAuth';
import { toast } from 'sonner';
import { Edit } from 'lucide-react';

const profileSchema = z.object({
    username: z.string().min(3, 'El nombre de usuario debe tener al menos 3 caracteres').max(20, 'El nombre de usuario no puede tener más de 20 caracteres'),
    profile_color: z.enum(['blue', 'pink', 'yellow', 'green', 'purple', 'orange']),
});

type ProfileFormData = z.infer<typeof profileSchema>;

const ProfileEditDialog: React.FC = () => {
    const { profile, updateProfile, loading } = useAuth();
    const [open, setOpen] = useState(false);

    const colorOptions = [
        { value: 'blue', label: 'Azul', bgClass: 'bg-blue-500', borderClass: 'border-blue-500' },
        { value: 'pink', label: 'Rosa', bgClass: 'bg-pink-500', borderClass: 'border-pink-500' },
        { value: 'yellow', label: 'Amarillo', bgClass: 'bg-yellow-500', borderClass: 'border-yellow-500' },
        { value: 'green', label: 'Verde', bgClass: 'bg-green-500', borderClass: 'border-green-500' },
        { value: 'purple', label: 'Morado', bgClass: 'bg-purple-500', borderClass: 'border-purple-500' },
        { value: 'orange', label: 'Naranja', bgClass: 'bg-orange-500', borderClass: 'border-orange-500' },
    ];

    const form = useForm<ProfileFormData>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            username: profile?.username || '',
            profile_color: (profile?.profile_color as 'blue' | 'pink' | 'yellow' | 'green' | 'purple' | 'orange') || 'blue',
        },
    });

    const onSubmit = async (data: ProfileFormData) => {
        try {
            console.log('Updating profile with data:', data);
            await updateProfile({
                username: data.username,
                profile_color: data.profile_color
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
                profile_color: (profile.profile_color as 'blue' | 'pink' | 'yellow' | 'green' | 'purple' | 'orange') || 'blue',
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
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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

                        <FormField
                            control={form.control}
                            name="profile_color"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Color del perfil</FormLabel>
                                    <FormControl>
                                        <RadioGroup
                                            onValueChange={field.onChange}
                                            value={field.value}
                                            className="grid grid-cols-3 gap-4"
                                        >
                                            {colorOptions.map((color) => (
                                                <div key={color.value} className="flex items-center space-x-2">
                                                    <RadioGroupItem
                                                        value={color.value}
                                                        id={color.value}
                                                        className="sr-only"
                                                    />
                                                    <Label
                                                        htmlFor={color.value}
                                                        className={`
                              flex flex-col items-center justify-center p-3 rounded-lg border-2 cursor-pointer
                              transition-all hover:scale-105
                              ${field.value === color.value
                                                            ? `${color.borderClass} bg-opacity-20`
                                                            : 'border-gray-200 hover:border-gray-300'
                                                        }
                            `}
                                                    >
                                                        <div className={`w-8 h-8 rounded-full ${color.bgClass} mb-1`}></div>
                                                        <span className="text-xs font-medium">{color.label}</span>
                                                    </Label>
                                                </div>
                                            ))}
                                        </RadioGroup>
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