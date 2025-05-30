import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCountryStore } from '@/store/countryStore';
import { useAuthStore } from '@/store/authStore';
import { User as UserType, userService } from '@/services/api/userService';
import { PageTransition, AnimateElement } from '@/components/common/PageTransition';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  User,
  Settings,
  MapPin,
  Calendar,
  Globe,
  Heart,
  BookOpen,
  Bookmark,
  Camera,
  Edit,
  Mail,
  Phone,
  Clock,
  LogOut,
  MapPinned,
  Star,
  AlertCircle
} from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

// Extended user profile with additional travel information
interface ExtendedUserProfile extends UserType {
  phone?: string;
  location?: string;
  bio?: string;
  languages: string[];
  interests: string[];
  favoriteLocations: {
    id: string;
    name: string;
    image: string;
  }[];
  savedGuides: {
    id: string;
    title: string;
    image: string;
    date: string;
  }[];
  travelHistory: {
    id: string;
    destination: string;
    date: string;
    image: string;
  }[];
}

const ProfilePage = () => {
  const { selectedCountry, isCountrySelected } = useCountryStore();
  const { user, isAuthenticated, updateProfile, isLoading, error, logout } = useAuthStore();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'favorites' | 'saved' | 'history' | 'settings'>('overview');
  const [userProfile, setUserProfile] = useState<ExtendedUserProfile | null>(null);
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    bio: '',
    phone: '',
    location: '',
  });

  // Load user data from API and merge with extended profile mock data
  useEffect(() => {
    if (!isAuthenticated || !user) {
      navigate('/auth/login', { state: { from: '/profile' } });
      return;
    }

    // Create extended profile by combining API user data with mock travel data
    const extendedProfile: ExtendedUserProfile = {
      ...user,
      phone: '+1 (555) 123-4567', // Mock data
      location: 'Hanoi, Vietnam', // Mock data
      bio: 'Passionate traveler and photographer who loves exploring new cultures, cuisines, and landscapes.', // Mock data
      languages: ['Vietnamese', 'English', 'Basic French'], // Mock data
      interests: ['Photography', 'Hiking', 'Local Cuisine', 'Cultural Experiences'], // Mock data
      favoriteLocations: [
        {
          id: 'loc1',
          name: 'Ha Long Bay',
          image: 'https://images.unsplash.com/photo-1573270689103-d7a4e42b609a'
        },
        {
          id: 'loc2',
          name: 'Hoi An',
          image: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b'
        },
      ],
      savedGuides: [
        {
          id: 'guide1',
          title: 'Ultimate Guide to Exploring Vietnam\'s Hidden Gems',
          image: 'https://images.unsplash.com/photo-1528127269322-539801943592',
          date: '2025-05-10'
        },
      ],
      travelHistory: [
        {
          id: 'trip1',
          destination: 'Hanoi, Vietnam',
          date: '2024-11-10',
          image: 'https://images.unsplash.com/photo-1572206912757-5a78ff2d4302'
        },
      ]
    };

    setUserProfile(extendedProfile);
    setFormData({
      full_name: user.full_name || '',
      email: user.email || '',
      bio: extendedProfile.bio || '',
      phone: extendedProfile.phone || '',
      location: extendedProfile.location || '',
    });
  }, [user, isAuthenticated, navigate]);

  // Check if country is selected
  useEffect(() => {
    if (!isCountrySelected) {
      navigate('/');
    }
  }, [isCountrySelected, navigate]);

  // Format date function
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  // Toggle edit mode
  const toggleEditMode = () => {
    setIsEditing(!isEditing);

    if (!isEditing && userProfile) {
      setFormData({
        full_name: userProfile.full_name || '',
        email: userProfile.email || '',
        bio: userProfile.bio || '',
        phone: userProfile.phone || '',
        location: userProfile.location || '',
      });
    }
  };

  // Handle form field changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle save changes
  const handleSaveChanges = async () => {
    try {
      await updateProfile({
        full_name: formData.full_name,
        email: formData.email
      });

      // Update local profile with new data, including non-API fields
      if (userProfile) {
        setUserProfile({
          ...userProfile,
          full_name: formData.full_name,
          email: formData.email,
          bio: formData.bio,
          phone: formData.phone,
          location: formData.location
        });
      }

      setIsEditing(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  // Handle logout
  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!selectedCountry || !userProfile) return null;

  return (
    <PageTransition>
      <div className="min-h-screen bg-background">
        {/* Decorative floating elements for background */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="bg-primary/10 animate-float absolute -left-20 top-[10%] h-40 w-40 rounded-full blur-3xl"></div>
          <div
            className="animate-float absolute -right-20 top-[30%] h-60 w-60 rounded-full bg-indigo-600/10 blur-3xl"
            style={{ animationDelay: '2s' }}
          ></div>
        </div>

        {/* Profile Header */}
        <section className="relative pt-16 pb-8 md:pt-24 md:pb-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <AnimateElement animation="fade" delay={0.1}>
              {error && (
                <Alert variant="destructive" className="mb-6">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Lỗi</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                {/* Profile Image */}
                <div className="relative">
                  <div className="h-32 w-32 md:h-40 md:w-40 rounded-full border-4 border-background shadow-lg overflow-hidden">
                    <div className="h-full w-full bg-primary/20 flex items-center justify-center">
                      {userProfile.full_name ? (
                        <span className="text-3xl font-bold text-primary">
                          {userProfile.full_name.charAt(0).toUpperCase()}
                        </span>
                      ) : (
                        <User className="h-12 w-12 text-primary/60" />
                      )}
                    </div>
                  </div>
                  {isEditing && (
                    <Button 
                      size="icon"
                      className="absolute bottom-0 right-0 rounded-full h-10 w-10 bg-primary text-white shadow-md"
                    >
                      <Camera className="h-5 w-5" />
                    </Button>
                  )}
                </div>
                
                {/* Profile Info */}
                <div className="flex-1 text-center md:text-left">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <h1 className="text-3xl font-bold mb-2">
                        {userProfile.full_name || 'No Name'}
                      </h1>
                      <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm text-muted-foreground mb-3">
                        <div className="flex items-center gap-1">
                          <Mail className="h-4 w-4" />
                          <span>{userProfile.email}</span>
                        </div>
                        {userProfile.location && (
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            <span>{userProfile.location}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>Member since {formatDate(userProfile.created_at)}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      {isEditing ? (
                        <>
                          <Button 
                            variant="outline" 
                            onClick={() => setIsEditing(false)}
                            disabled={isLoading}
                          >
                            Cancel
                          </Button>
                          <Button
                            onClick={handleSaveChanges}
                            disabled={isLoading}
                          >
                            {isLoading ? (
                              <>
                                <span className="animate-spin mr-2">○</span>
                                Saving...
                              </>
                            ) : (
                              'Save Changes'
                            )}
                          </Button>
                        </>
                      ) : (
                        <Button 
                          variant="outline" 
                          className="flex items-center gap-2"
                          onClick={toggleEditMode}
                        >
                          <Edit className="h-4 w-4" />
                          Edit Profile
                        </Button>
                      )}
                    </div>
                  </div>
                  
                  {isEditing ? (
                    <div className="space-y-4 max-w-2xl">
                      <div>
                        <label className="text-sm font-medium block mb-1">Full Name</label>
                        <Input
                          name="full_name"
                          value={formData.full_name}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium block mb-1">Bio</label>
                        <textarea 
                          name="bio"
                          className="w-full min-h-[100px] rounded-md border border-input bg-transparent px-3 py-2 text-sm"
                          value={formData.bio}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium block mb-1">Email</label>
                          <Input
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                          />
                        </div>
                        <div>
                          <label className="text-sm font-medium block mb-1">Phone</label>
                          <Input
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                        />
                        </div>
                        <div>
                          <label className="text-sm font-medium block mb-1">Location</label>
                          <Input
                            name="location"
                            value={formData.location}
                            onChange={handleInputChange}
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-muted-foreground max-w-2xl">
                      {userProfile.bio || 'No bio provided'}
                    </p>
                  )}
                  
                  {!isEditing && userProfile.interests && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {userProfile.interests.map((interest, index) => (
                        <Badge key={index} variant="secondary">
                          {interest}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </AnimateElement>
          </div>
        </section>

        {/* Profile Tabs */}
        <section className="bg-muted/30 py-4 sticky top-16 z-10 backdrop-blur-sm">
          {/* Your existing tab navigation code... */}
        </section>

        {/* Tab Content */}
        {/* Your existing tab content... */}

        {/* Logout Button */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Button
            variant="outline"
            className="text-destructive border-destructive hover:bg-destructive/10"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>
    </PageTransition>
  );
};

export default ProfilePage;
