'use client';
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  // Hide navbar on login page
  if (pathname === '/') return null;

  const handleLogout = () => {
    localStorage.removeItem('ignite_user');
    router.push('/');
  };

  return (
    <nav className="fixed top-0 w-full z-50 border-b border-brand-border bg-brand-bg/80 backdrop-blur-md">
      <div className="max-w-4xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/dashboard" className="font-outfit text-2xl font-semibold tracking-tight flex items-center">
          Ign<span className="text-brand-purple">ite</span>
        </Link>
        <div className="flex items-center gap-6 text-sm font-medium text-brand-muted">
          <Link href="/dashboard" className={`hover:text-brand-accent transition-colors ${pathname === '/dashboard' ? 'text-brand-text' : ''}`}>Dashboard</Link>
          
          <div className="w-px h-4 bg-brand-border mx-2" />
          
          <button onClick={handleLogout} className="flex items-center gap-2 hover:text-red-400 transition-colors" title="Log out">
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </nav>
  );
}
