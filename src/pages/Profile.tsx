// src/pages/Profile.tsx
import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";

export const Profile = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // بيانات المستخدم
  const [username, setUsername] = useState(localStorage.getItem("username") || "");
  const [email, setEmail] = useState(localStorage.getItem("email") || "");
  const [phone, setPhone] = useState(localStorage.getItem("phone") || "");
  const [profilePic, setProfilePic] = useState<string | null>(localStorage.getItem("profilePic"));
  const [storedPassword, setStoredPassword] = useState(localStorage.getItem("password") || "");

  // كلمات المرور لتغييرها
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // إحصائيات وهمية
  const [rank, setRank] = useState<number>(2);
  const [weeklyPrayers, setWeeklyPrayers] = useState(25);
  const [monthlyPrayers, setMonthlyPrayers] = useState(100);
  const [streak, setStreak] = useState(7);

  // رفع الصورة
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setProfilePic(result);
      localStorage.setItem("profilePic", result);
      window.dispatchEvent(new Event("storage")); // لتحديث الـ Navigation فورًا
    };
    reader.readAsDataURL(file);
  };

  // حفظ التعديلات الأساسية
  const handleSaveChanges = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert("Please enter a valid email address ❌");
      return;
    }

    const phoneRegex = /^\d{10,15}$/;
    if (!phoneRegex.test(phone)) {
      alert("Please enter a valid phone number ❌");
      return;
    }

    localStorage.setItem("username", username);
    localStorage.setItem("email", email);
    localStorage.setItem("phone", phone);
    alert("Profile updated successfully ✅");
  };
  // تغيير كلمة المرور
  const handleSubmitPassword = () => {
    if (oldPassword !== storedPassword) {
      alert("Old password is incorrect ❌");
      return;
    }
    if (!newPassword) {
      alert("Please enter a new password ❌");
      return;
    }
    if (newPassword !== confirmPassword) {
      alert("New password and confirm password do not match ❌");
      return;
    }
    localStorage.setItem("password", newPassword);
    setStoredPassword(newPassword);
    setOldPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setShowChangePassword(false);
    alert("Password changed successfully ✅");
  };

  // تسجيل الخروج
  const handleLogout = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("email");
    localStorage.removeItem("phone");
    localStorage.removeItem("profilePic");
    localStorage.removeItem("password");
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    navigate("/auth");
  };

  

  return (
    <div className="min-h-screen bg-background text-white flex flex-col items-center justify-start p-6">

      {/* Navigation */}
      <nav className="w-full max-w-md flex justify-between items-center mb-6 border-2  shadow-sm rounded-lg p-6">
        <Link to="/" className="text-xl font-bold  text-white px-3 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 ">Home</Link>
        <div className="flex items-center space-x-4">
          <Link
            to="/profile"
            className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition ${
              location.pathname === "/profile"
                ? "bg-emerald-700 hover:bg-emerald-800 text-white"
                : "text-white hover:bg-emerald-600"
            }`}
          >
            {profilePic ? (
              '') : (
              <User className="w-4 h-4" />
            )}
            <span>Profile</span>
          </Link>
          <Button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg"
          >
            Logout
          </Button>
        </div>
      </nav>

      {/* Profile Card */}
      <div className="w-full max-w-md border-2  shadow-2xl rounded-lg p-6">

        <h1 className="text-3xl text-gray-600 font-bold mb-6 text-center">My Profile</h1>

        {/* صورة المستخدم */}
        <div className="w-40 h-40 rounded-full overflow-hidden mb-4 border border-gray-600 mx-auto">
          {profilePic ? (
            <img src={profilePic} alt="Profile" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-600 text-white font-bold text-2xl">
              {username[0]?.toUpperCase() || "?"}
            </div>
          )}
        </div>
        <input type="file" accept="image/*" onChange={handleImageUpload} className="mb-6 w-full" />

        {/* بيانات المستخدم */}
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-2 border rounded bg-gray-800 text-white placeholder-gray-400"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded bg-gray-800 text-white placeholder-gray-400"
          />
          <input
            type="text"
            placeholder="Phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full p-2 border rounded bg-gray-800 text-white placeholder-gray-400"
          />
          <Button onClick={handleSaveChanges} className="w-full bg-primary text-white hover:bg-primary/90">
            Save Changes
          </Button>
        </div>

        {/* زر إظهار خانات تغيير الباسورد */}
        <div className="mt-6">
          <Button
            onClick={() => setShowChangePassword(!showChangePassword)}
            className="w-full bg-blue-500 text-white hover:bg-blue-600"
          >
            Change Password
          </Button>

          {showChangePassword && (
            <div className="mt-4 space-y-2 p-4 border rounded bg-card">
              <input
                type="password"
                placeholder="Old Password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                className="w-full p-2 border rounded bg-gray-800 text-white placeholder-gray-400"
              />
              <input
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full p-2 border rounded bg-gray-800 text-white placeholder-gray-400"
              />
              <input
                type="password"
                placeholder="Confirm New Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full p-2 border rounded bg-gray-800 text-white placeholder-gray-400"
              />
              <Button
                onClick={handleSubmitPassword}
                className="w-full bg-primary text-white hover:bg-primary/90"
              >
                Submit
              </Button>
            </div>
          )}
        </div>

        {/* إحصائيات */}
        <div className="mt-8 grid grid-cols-2 gap-4 text-center">
          <div className="p-4 bg-emerald-600 hover:bg-emerald-700 transition-all duration-300 ease-in-out rounded shadow text-white">
            <p className="text-sm opacity-80">Rank</p>
            <p className="text-2xl font-bold">#{rank}</p>
          </div>
          <div className="p-4 bg-emerald-600 hover:bg-emerald-700 transition-all duration-300 ease-in-out rounded shadow text-white">
            <p className="text-sm opacity-80">Weekly Prayers</p>
            <p className="text-2xl font-bold">{weeklyPrayers}</p>
          </div>
          <div className="p-4 bg-emerald-600 hover:bg-emerald-700 transition-all duration-300 ease-in-out rounded shadow text-white">
            <p className="text-sm opacity-80">Monthly Prayers</p>
            <p className="text-2xl font-bold">{monthlyPrayers}</p>
          </div>
          <div className="p-4 bg-emerald-600 hover:bg-emerald-700 transition-all duration-300 ease-in-out rounded shadow text-white">
            <p className="text-sm opacity-80">Current Streak</p>
            <p className="text-2xl font-bold">{streak} days</p>
          </div>
        </div>

        

      </div>
    </div>
  );
};

export default Profile;
