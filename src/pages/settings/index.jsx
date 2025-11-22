import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Text, Title } from "@/components/ui/typography";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  User,
  Lock,
  Bell,
  Shield,
  Upload,
  Save,
  LogOut,
  Eye,
  EyeOff,
  Camera,
  Mail,
  Phone,
  Plus,
  LogIn,
  Clock,
  Activity,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const SettingsPage = () => {
  const [profileData, setProfileData] = useState({
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    profilePhoto: null,
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [preferences, setPreferences] = useState({
    language: "en",
    timezone: "America/New_York",
    dateFormat: "MM/DD/YYYY",
    emailNotifications: true,
    pushNotifications: true,
    marketingEmails: false,
    twoFactorAuth: false,
  });

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);

  const handleProfileChange = (field, value) => {
    setProfileData({ ...profileData, [field]: value });
  };

  const handlePasswordChange = (field, value) => {
    setPasswordData({ ...passwordData, [field]: value });
  };

  const handlePreferenceChange = (field, value) => {
    setPreferences({ ...preferences, [field]: value });
  };

  const handlePhotoUpload = (file) => {
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
        setProfileData({ ...profileData, profilePhoto: file });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = () => {
    console.log("Saving profile:", profileData);
    alert("Profile updated successfully!");
  };

  const handleSavePassword = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("New passwords do not match!");
      return;
    }
    if (passwordData.newPassword.length < 8) {
      alert("Password must be at least 8 characters long!");
      return;
    }
    console.log("Changing password");
    alert("Password changed successfully!");
    setPasswordData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  const handleLogout = () => {
    console.log("Logging out...");
    alert("You have been logged out successfully!");
    setShowLogoutDialog(false);
  };
  const activityLogs = [
    {
      id: 1,
      title: "Logged in",
      description: "User signed in from Chrome on Windows",
      timestamp: "Nov 21, 2025 • 10:34 AM",
      icon: LogIn,
    },
    {
      id: 2,
      title: "Updated Profile",
      description: "Changed profile picture and display name",
      timestamp: "Nov 21, 2025 • 10:20 AM",
      icon: User,
    },
    {
      id: 3,
      title: "Added a new product",
      description: "Nike Air Zoom added to the store",
      timestamp: "Nov 20, 2025 • 7:12 PM",
      icon: Plus,
    },
    {
      id: 4,
      title: "Changed password",
      description: "User updated security credentials",
      timestamp: "Nov 19, 2025 • 9:45 PM",
      icon: Lock,
    },
    {
      id: 5,
      title: "Logged in",
      description: "User signed in from Chrome on Windows",
      timestamp: "Nov 14, 2025 • 10:34 AM",
      icon: LogIn,
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flbx">
        <div>
          <Title variant="lg">Account Settings</Title>
          <Text className="mt-2 text-gray-600">
            Manage your account information and preferences
          </Text>
        </div>
        <Button
          variant="destructive"
          onClick={() => setShowLogoutDialog(true)}
          className="flex items-center gap-2"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-5">
        <div className="md:col-span-2 col-span-3 space-y-6">
          {/* Profile Information */}
          <div className="bg-white rounded-lg border shadow-sm p-6">
            <div className="flex items-center gap-2 mb-6">
              <User className="w-5 h-5 text-gray-700" />
              <h2 className="text-lg font-semibold">Profile Information</h2>
            </div>

            <div className="space-y-6">
              {/* Profile Photo */}
              <div className="flex items-center gap-6">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-100 border-2 border-gray-200">
                    {photoPreview ? (
                      <img
                        src={photoPreview}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <User className="w-12 h-12 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() =>
                      document.getElementById("photo-upload").click()
                    }
                    className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full hover:bg-primary/90 transition-colors"
                  >
                    <Camera className="w-4 h-4" />
                  </button>
                  <input
                    type="file"
                    id="photo-upload"
                    accept="image/*"
                    onChange={(e) => handlePhotoUpload(e.target.files[0])}
                    className="hidden"
                  />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Profile Photo</h3>
                  <Text className="text-sm text-gray-500 mt-1">
                    JPG, PNG or GIF. Max size 2MB.
                  </Text>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      document.getElementById("photo-upload").click()
                    }
                    className="mt-2 flex items-center gap-2"
                  >
                    <Upload className="w-4 h-4" />
                    Upload Photo
                  </Button>
                </div>
              </div>

              {/* Name Fields */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={profileData.firstName}
                    onChange={(e) =>
                      handleProfileChange("firstName", e.target.value)
                    }
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={profileData.lastName}
                    onChange={(e) =>
                      handleProfileChange("lastName", e.target.value)
                    }
                    className="mt-1.5"
                  />
                </div>
              </div>

              {/* Contact Fields */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative mt-1.5">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      value={profileData.email}
                      onChange={(e) =>
                        handleProfileChange("email", e.target.value)
                      }
                      className="pl-10"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <div className="relative mt-1.5">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="phone"
                      type="tel"
                      value={profileData.phone}
                      onChange={(e) =>
                        handleProfileChange("phone", e.target.value)
                      }
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button
                  onClick={handleSaveProfile}
                  className="flex items-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  Save Profile
                </Button>
              </div>
            </div>
          </div>

          {/* Activity Logs */}
          <div className="bg-white rounded-lg border shadow-sm p-6">
            <div className="flex items-center gap-2 mb-6">
              <Activity className="w-5 h-5 text-gray-700" />
              <h2 className="text-lg font-semibold">Activity Logs</h2>
            </div>

            <div className="max-h-96 overflow-y-auto pr-2 space-y-4">
              {activityLogs?.length > 0 ? (
                activityLogs.map((log) => (
                  <div key={log.id} className="flbx bg-gray-50 p-3 rounded-lg">
                    <div className="flx gap-3">
                      <div className="p-2 bg-primary/10 rounded-full">
                        {log.icon ? (
                          <log.icon className="w-4 h-4 text-primary" />
                        ) : (
                          <Clock className="w-4 h-4 text-primary" />
                        )}
                      </div>

                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {log.title}
                        </p>
                        <Text variant="sm">{log.description}</Text>
                      </div>
                    </div>

                    <p className="text-xs text-gray-400 mt-1">
                      {log.timestamp}
                    </p>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-sm text-gray-500">
                  No activity recorded yet.
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="md:col-span-1 col-span-3 space-y-6">
          {/* Change Password */}
          <div className="bg-white rounded-lg border shadow-sm p-6">
            <div className="flex items-center gap-2 mb-6">
              <Lock className="w-5 h-5 text-gray-700" />
              <h2 className="text-lg font-semibold">Change Password</h2>
            </div>

            <div className="space-y-4 max-w-md">
              <div>
                <Label htmlFor="currentPassword">Current Password</Label>
                <div className="relative mt-1.5">
                  <Input
                    id="currentPassword"
                    type={showCurrentPassword ? "text" : "password"}
                    value={passwordData.currentPassword}
                    onChange={(e) =>
                      handlePasswordChange("currentPassword", e.target.value)
                    }
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showCurrentPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <Label htmlFor="newPassword">New Password</Label>
                <div className="relative mt-1.5">
                  <Input
                    id="newPassword"
                    type={showNewPassword ? "text" : "password"}
                    value={passwordData.newPassword}
                    onChange={(e) =>
                      handlePasswordChange("newPassword", e.target.value)
                    }
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showNewPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                <p className="text-xs mt-1 text-black/60">
                  Must be at least 8 characters long
                </p>
              </div>

              <div>
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <div className="relative mt-1.5">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={passwordData.confirmPassword}
                    onChange={(e) =>
                      handlePasswordChange("confirmPassword", e.target.value)
                    }
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <Button onClick={handleSavePassword}>Change Password</Button>
              </div>
            </div>
          </div>

          {/* Security */}
          <div className="bg-white rounded-lg border shadow-sm p-6">
            <div className="flex items-center gap-2 mb-6">
              <Shield className="w-5 h-5 text-gray-700" />
              <h2 className="text-lg font-semibold">Security</h2>
            </div>

            <div className="space-y-4">
              <div className="flbx p-4 border rounded-lg">
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">
                    Two-Factor Authentication
                  </h3>
                  <Text variant="sm">
                    Add an extra layer of security to your account
                  </Text>
                </div>
                <button
                  onClick={() =>
                    handlePreferenceChange(
                      "twoFactorAuth",
                      !preferences.twoFactorAuth
                    )
                  }
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    preferences.twoFactorAuth ? "bg-primary" : "bg-gray-200"
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      preferences.twoFactorAuth
                        ? "translate-x-6"
                        : "translate-x-1"
                    }`}
                  />
                </button>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium text-gray-900 mb-2">
                  Active Sessions
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <div>
                      <p className="font-medium">Current Device</p>
                      <p className="text-gray-500">
                        Chrome on Windows • Dhaka, BD
                      </p>
                    </div>
                    <span className="text-green-600 text-xs font-medium">
                      Active Now
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="bg-white rounded-lg border border-red-200 shadow-sm p-6">
            <h2 className="text-lg font-semibold text-red-600 mb-4">
              Danger Zone
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg">
                <div>
                  <h3 className="font-medium text-gray-900">Delete Account</h3>
                  <Text variant="sm">
                    Permanently delete your account and all data
                  </Text>
                </div>
                <Button variant="destructive" size="sm">
                  Delete Account
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Logout Confirmation Dialog */}
      <Dialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Logout Confirmation</DialogTitle>
            <DialogDescription>
              Are you sure you want to logout? You'll need to sign in again to
              access your account.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowLogoutDialog(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleLogout} variant="destructive">
              Logout
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SettingsPage;
