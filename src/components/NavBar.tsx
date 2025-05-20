
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Menu, Book, TestTube, Info, User, Heart, MessageCircle, LogOut } from 'lucide-react';
import useAuth from '@/hooks/useAuth';
import { toast } from 'sonner';

const NavBar: React.FC = () => {
  const location = useLocation();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/auth');
      toast.success('Sesión cerrada correctamente');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      toast.error('Error al cerrar sesión');
    }
  };

  return (
    <nav className="bg-blue-900 shadow-md py-4">
      <div className="kid-container flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <span className="logo-text text-gradient">
            <span className="text-red-500">Learn</span>
            <span className="text-white">to</span>
            <span className="text-blue-400">Read</span>
          </span>
        </Link>

        <div className="flex items-center gap-2">
          {user && (
            <div className="hidden md:flex items-center mr-2">
              <span className="font-comic text-white text-sm mr-4">{user.email}</span>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-white hover:text-red-300"
                onClick={handleSignOut}
              >
                <LogOut size={16} className="mr-1" />
                Cerrar sesión
              </Button>
            </div>
          )}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="text-white">
                <Menu size={24} />
                <span className="sr-only">Menú</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 bg-white font-comic">
              <DropdownMenuItem asChild>
                <Link to="/" className={isActive('/') ? "text-red-500 font-bold" : ""}>
                  Inicio
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/profile" className={isActive('/profile') ? "text-red-500 font-bold" : ""}>
                  <span className="flex items-center gap-2">
                    <User size={16} />
                    Mi perfil
                  </span>
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem asChild>
                <Link to="/exercises" className={isActive('/exercises') ? "text-red-500 font-bold" : ""}>
                  <span className="flex items-center gap-2">
                    Ejercicios
                  </span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/library" className={isActive('/library') ? "text-red-500 font-bold" : ""}>
                  <span className="flex items-center gap-2">
                    <Book size={16} />
                    Biblioteca
                  </span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/test" className={isActive('/test') ? "text-red-500 font-bold" : ""}>
                  <span className="flex items-center gap-2">
                    <TestTube size={16} />
                    Test
                  </span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/about" className={isActive('/about') ? "text-red-500 font-bold" : ""}>
                  <span className="flex items-center gap-2">
                    <Info size={16} />
                    Nosotros
                  </span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/donation" className={isActive('/donation') ? "text-red-500 font-bold" : ""}>
                  <span className="flex items-center gap-2">
                    <Heart size={16} />
                    Donar
                  </span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/reviews" className={isActive('/reviews') ? "text-red-500 font-bold" : ""}>
                  <span className="flex items-center gap-2">
                    <MessageCircle size={16} />
                    Valoraciones
                  </span>
                </Link>
              </DropdownMenuItem>
              
              {!user && (
                <DropdownMenuItem asChild>
                  <Link to="/auth" className={isActive('/auth') ? "text-red-500 font-bold" : ""}>
                    <span className="flex items-center gap-2">
                      <User size={16} />
                      Entrar / Registro
                    </span>
                  </Link>
                </DropdownMenuItem>
              )}
              
              {user && (
                <DropdownMenuItem onClick={handleSignOut} className="md:hidden">
                  <span className="flex items-center gap-2 text-red-500">
                    <LogOut size={16} />
                    Cerrar sesión
                  </span>
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
