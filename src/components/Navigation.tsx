import { Button } from "@/components/ui/button";
import { Moon, User, BarChart3, Trophy, Home, Menu, X } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ThemeToggle } from "@/components/theme-toggle";
import { useState, useEffect } from "react";

export const Navigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const [profilePic, setProfilePic] = useState<string | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const isLoggedIn = !!localStorage.getItem("access");

  const navItems = isLoggedIn
    ? [
        { path: "/", label: "Home", icon: Home },
        { path: "/dashboard", label: "Dashboard", icon: User },
        { path: "/statistics", label: "Statistics", icon: BarChart3 },
        { path: "/leaderboard", label: "Leaderboard", icon: Trophy },
      ]
    : [{ path: "/", label: "Home", icon: Home }];

  useEffect(() => {
    setUsername(localStorage.getItem("username"));
    setProfilePic(localStorage.getItem("profilePic"));

    // تحديث الصورة تلقائيًا عند تغييرها في الصفحة
    const handleStorageChange = () => {
      setProfilePic(localStorage.getItem("profilePic"));
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    localStorage.removeItem("profilePic");
    setUsername(null);
    setProfilePic(null);
    navigate("/auth");
  };

  return (
    <nav className="bg-card/80 backdrop-blur-sm border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
            <Moon className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            PrayerTracker
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          {navItems.map(({ path, label, icon: Icon }) => (
            <Link
              key={path}
              to={path}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-smooth ${
                location.pathname === path
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{label}</span>
            </Link>
          ))}
        </div>

        {/* Profile / Sign In & Mobile Menu */}
        <div className="flex items-center space-x-2">
          <ThemeToggle />

          {!username ? (
            <Button
              variant="outline"
              size="sm"
              className="hidden md:inline-flex"
              asChild
            >
              <Link to="/auth">Sign In</Link>
            </Button>
          ) : (
            <div className="relative hidden md:inline-flex">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center"
              >
                {profilePic ? (
                  <img
                    src={profilePic}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="font-bold text-gray-700">
                    {username[0].toUpperCase()}
                  </span>
                )}
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white/70 dark:bg-gray-900/70 backdrop-blur-md border border-gray-200 dark:border-gray-700 rounded-2xl shadow-lg z-50 overflow-hidden">
                  {/* زر إغلاق */}
                  <div className="flex justify-end p-2">
                    <button
                      onClick={() => setDropdownOpen(false)}
                      className="text-gray-600 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-400 font-bold text-md transition-colors"
                    >
                      ×
                    </button>
                  </div>

                  {/* الأزرار */}
                  <button
                    onClick={() => {
                      navigate("/profile");
                      setDropdownOpen(false);
                    }}
                    className="block w-full text-left px-5 py-3 hover:bg-white/30 dark:hover:bg-gray-800/50 text-gray-800 dark:text-gray-100 font-medium transition-colors"
                  >
                    Profile
                  </button>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-5 py-3 hover:bg-white/30 dark:hover:bg-gray-800/50 text-gray-800 dark:text-gray-100 font-medium transition-colors"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-card/95 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-4 space-y-2">
            {navItems.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-smooth ${
                  location.pathname === path
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <Icon className="w-4 h-4" />
                <span>{label}</span>
              </Link>
            ))}

            {!username ? (
              <Button
                variant="outline"
                size="sm"
                className="w-full mt-4  "
                asChild
              >
                <Link to="/auth">Sign In</Link>
              </Button>
            ) : (
              <Button
                variant="outline"
                size="sm"
                className="w-full mt-4"
                onClick={() => navigate("/profile")}
              >
                Profile
              </Button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
