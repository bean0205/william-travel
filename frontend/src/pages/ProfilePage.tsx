import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCountryStore } from '@/store/countryStore';
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
} from 'lucide-react';

// Types for user profile
interface UserProfile {
  id: string;
  name: string;
  avatar: string;
  email: string;
  phone?: string;
  location?: string;
  memberSince: string;
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
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'favorites' | 'saved' | 'history' | 'settings'>('overview');

  // Mock user profile data
  const userProfile: UserProfile = {
    id: '1',
    name: 'Alex Johnson',
    avatar: 'https://randomuser.me/api/portraits/men/44.jpg',
    email: 'alex.johnson@example.com',
    phone: '+1 (555) 123-4567',
    location: 'Seattle, USA',
    memberSince: '2023-06-15',
    bio: 'Passionate traveler and photographer who loves exploring new cultures, cuisines, and landscapes. Always seeking authentic local experiences and off-the-beaten-path destinations.',
    languages: ['English', 'Spanish', 'Basic French'],
    interests: ['Photography', 'Hiking', 'Local Cuisine', 'Cultural Experiences', 'Wildlife'],
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
      {
        id: 'loc3',
        name: 'Sapa',
        image: 'https://images.unsplash.com/photo-1569456644915-ed246ef67095'
      }
    ],
    savedGuides: [
      {
        id: 'guide1',
        title: 'Ultimate Guide to Exploring Vietnam\'s Hidden Gems',
        image: 'https://images.unsplash.com/photo-1528127269322-539801943592',
        date: '2025-05-10'
      },
      {
        id: 'guide2',
        title: 'Street Food Tour: Hanoi\'s Best Culinary Experiences',
        image: 'https://images.unsplash.com/photo-1590492290883-08debf249d6f',
        date: '2025-05-02'
      }
    ],
    travelHistory: [
      {
        id: 'trip1',
        destination: 'Hanoi, Vietnam',
        date: '2024-11-10',
        image: 'https://images.unsplash.com/photo-1572206912757-5a78ff2d4302'
      },
      {
        id: 'trip2',
        destination: 'Hue, Vietnam',
        date: '2024-11-14',
        image: 'https://images.unsplash.com/photo-1583417319307-04574730b2e5'
      },
      {
        id: 'trip3',
        destination: 'Ho Chi Minh City, Vietnam',
        date: '2024-11-20',
        image: 'https://images.unsplash.com/photo-1583417319304-1f89e6581cd3'
      }
    ]
  };

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
  };

  // Handle save changes
  const handleSaveChanges = () => {
    // Would handle saving changes to the profile here
    setIsEditing(false);
  };

  // Handle logout
  const handleLogout = () => {
    // Would handle logout logic here
    navigate('/');
  };

  if (!selectedCountry) return null;

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
              <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                {/* Profile Image */}
                <div className="relative">
                  <div className="h-32 w-32 md:h-40 md:w-40 rounded-full border-4 border-background shadow-lg overflow-hidden">
                    <img
                      src={userProfile.avatar}
                      alt={userProfile.name}
                      className="h-full w-full object-cover"
                    />
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
                        {userProfile.name}
                      </h1>
                      <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm text-muted-foreground mb-3">
                        {userProfile.location && (
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            <span>{userProfile.location}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>Member since {formatDate(userProfile.memberSince)}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      {isEditing ? (
                        <>
                          <Button 
                            variant="outline" 
                            onClick={() => setIsEditing(false)}
                          >
                            Cancel
                          </Button>
                          <Button onClick={handleSaveChanges}>
                            Save Changes
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
                        <label className="text-sm font-medium block mb-1">Bio</label>
                        <textarea 
                          className="w-full min-h-[100px] rounded-md border border-input bg-transparent px-3 py-2 text-sm"
                          defaultValue={userProfile.bio}
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium block mb-1">Email</label>
                          <Input defaultValue={userProfile.email} />
                        </div>
                        <div>
                          <label className="text-sm font-medium block mb-1">Phone</label>
                          <Input defaultValue={userProfile.phone} />
                        </div>
                        <div>
                          <label className="text-sm font-medium block mb-1">Location</label>
                          <Input defaultValue={userProfile.location} />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-muted-foreground max-w-2xl">
                      {userProfile.bio}
                    </p>
                  )}
                  
                  {!isEditing && (
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
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex overflow-x-auto hide-scrollbar gap-2">
              <Button 
                variant={activeTab === 'overview' ? "secondary" : "ghost"}
                className="flex items-center gap-2"
                onClick={() => setActiveTab('overview')}
              >
                <User className="h-4 w-4" />
                Overview
              </Button>
              <Button 
                variant={activeTab === 'favorites' ? "secondary" : "ghost"}
                className="flex items-center gap-2"
                onClick={() => setActiveTab('favorites')}
              >
                <Heart className="h-4 w-4" />
                Favorite Locations
              </Button>
              <Button 
                variant={activeTab === 'saved' ? "secondary" : "ghost"}
                className="flex items-center gap-2"
                onClick={() => setActiveTab('saved')}
              >
                <Bookmark className="h-4 w-4" />
                Saved Guides
              </Button>
              <Button 
                variant={activeTab === 'history' ? "secondary" : "ghost"}
                className="flex items-center gap-2"
                onClick={() => setActiveTab('history')}
              >
                <Clock className="h-4 w-4" />
                Travel History
              </Button>
              <Button 
                variant={activeTab === 'settings' ? "secondary" : "ghost"}
                className="flex items-center gap-2"
                onClick={() => setActiveTab('settings')}
              >
                <Settings className="h-4 w-4" />
                Settings
              </Button>
            </div>
          </div>
        </section>

        {/* Profile Content */}
        <section className="py-8">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <AnimateElement animation="fade" delay={0.2}>
              {/* Overview Tab */}
              {activeTab === 'overview' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Personal Info Card */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <User className="h-5 w-5 text-primary" />
                        Personal Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-start gap-3">
                          <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                          <div>
                            <p className="text-sm font-medium">Email</p>
                            <p className="text-sm text-muted-foreground">{userProfile.email}</p>
                          </div>
                        </div>
                        {userProfile.phone && (
                          <div className="flex items-start gap-3">
                            <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                            <div>
                              <p className="text-sm font-medium">Phone</p>
                              <p className="text-sm text-muted-foreground">{userProfile.phone}</p>
                            </div>
                          </div>
                        )}
                        {userProfile.location && (
                          <div className="flex items-start gap-3">
                            <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                            <div>
                              <p className="text-sm font-medium">Location</p>
                              <p className="text-sm text-muted-foreground">{userProfile.location}</p>
                            </div>
                          </div>
                        )}
                        <div className="flex items-start gap-3">
                          <Globe className="h-5 w-5 text-muted-foreground mt-0.5" />
                          <div>
                            <p className="text-sm font-medium">Languages</p>
                            <p className="text-sm text-muted-foreground">{userProfile.languages.join(', ')}</p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  {/* Favorite Locations Preview */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Heart className="h-5 w-5 text-primary" />
                        Favorite Locations
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {userProfile.favoriteLocations.slice(0, 2).map(location => (
                          <div key={location.id} className="flex gap-3">
                            <img 
                              src={location.image}
                              alt={location.name}
                              className="h-16 w-16 rounded-md object-cover"
                            />
                            <div>
                              <p className="font-medium">{location.name}</p>
                              <Button variant="link" className="h-auto p-0 text-sm">
                                View Details
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button 
                        variant="ghost" 
                        className="w-full"
                        onClick={() => setActiveTab('favorites')}
                      >
                        View All Favorites
                      </Button>
                    </CardFooter>
                  </Card>
                  
                  {/* Saved Guides Preview */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Bookmark className="h-5 w-5 text-primary" />
                        Saved Guides
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {userProfile.savedGuides.slice(0, 2).map(guide => (
                          <div key={guide.id} className="flex gap-3">
                            <img 
                              src={guide.image}
                              alt={guide.title}
                              className="h-16 w-16 rounded-md object-cover"
                            />
                            <div>
                              <p className="font-medium line-clamp-2">{guide.title}</p>
                              <p className="text-xs text-muted-foreground">
                                Saved on {formatDate(guide.date)}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button 
                        variant="ghost" 
                        className="w-full"
                        onClick={() => setActiveTab('saved')}
                      >
                        View All Saved Guides
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
              )}

              {/* Favorite Locations Tab */}
              {activeTab === 'favorites' && (
                <div>
                  <h2 className="text-2xl font-bold mb-6">Favorite Locations</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {userProfile.favoriteLocations.map(location => (
                      <Card key={location.id} className="overflow-hidden">
                        <div className="aspect-video relative">
                          <img 
                            src={location.image}
                            alt={location.name}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-2 right-2">
                            <Button 
                              size="icon" 
                              className="h-8 w-8 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30"
                            >
                              <Heart className="h-4 w-4 fill-red-500 text-red-500" />
                            </Button>
                          </div>
                        </div>
                        <CardContent className="p-4">
                          <h3 className="font-bold text-lg">{location.name}</h3>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                            <MapPinned className="h-4 w-4" />
                            <span>Vietnam</span>
                          </div>
                          <div className="mt-4">
                            <Button className="w-full">View Details</Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* Saved Guides Tab */}
              {activeTab === 'saved' && (
                <div>
                  <h2 className="text-2xl font-bold mb-6">Saved Guides</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {userProfile.savedGuides.map(guide => (
                      <Card key={guide.id} className="overflow-hidden">
                        <div className="aspect-video relative">
                          <img 
                            src={guide.image}
                            alt={guide.title}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-2 right-2">
                            <Button 
                              size="icon" 
                              className="h-8 w-8 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30"
                            >
                              <Bookmark className="h-4 w-4 fill-primary text-primary" />
                            </Button>
                          </div>
                        </div>
                        <CardContent className="p-4">
                          <h3 className="font-bold text-lg line-clamp-2">{guide.title}</h3>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                            <Calendar className="h-4 w-4" />
                            <span>Saved on {formatDate(guide.date)}</span>
                          </div>
                          <div className="mt-4">
                            <Button className="w-full">Read Guide</Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* Travel History Tab */}
              {activeTab === 'history' && (
                <div>
                  <h2 className="text-2xl font-bold mb-6">Travel History</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {userProfile.travelHistory.map(trip => (
                      <Card key={trip.id} className="overflow-hidden">
                        <div className="aspect-video relative">
                          <img 
                            src={trip.image}
                            alt={trip.destination}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent pt-8 pb-3 px-4">
                            <h3 className="font-bold text-lg text-white">{trip.destination}</h3>
                            <div className="flex items-center gap-1 text-sm text-white/80">
                              <Calendar className="h-3 w-3" />
                              <span>{formatDate(trip.date)}</span>
                            </div>
                          </div>
                        </div>
                        <CardContent className="p-4">
                          <div className="flex justify-between items-center">
                            <Button variant="outline" size="sm">
                              View Photos
                            </Button>
                            <div className="flex items-center gap-1 text-amber-500">
                              <Star className="h-4 w-4 fill-amber-500" />
                              <span className="font-medium">4.8</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* Settings Tab */}
              {activeTab === 'settings' && (
                <div className="max-w-2xl mx-auto">
                  <h2 className="text-2xl font-bold mb-6">Account Settings</h2>
                  <Card className="mb-6">
                    <CardHeader>
                      <CardTitle>Profile Settings</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium block mb-1">Display Name</label>
                          <Input defaultValue={userProfile.name} />
                        </div>
                        <div>
                          <label className="text-sm font-medium block mb-1">Email</label>
                          <Input defaultValue={userProfile.email} />
                        </div>
                        <div>
                          <label className="text-sm font-medium block mb-1">Phone</label>
                          <Input defaultValue={userProfile.phone} />
                        </div>
                        <div>
                          <label className="text-sm font-medium block mb-1">Location</label>
                          <Input defaultValue={userProfile.location} />
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium block mb-1">Bio</label>
                        <textarea 
                          className="w-full min-h-[100px] rounded-md border border-input bg-transparent px-3 py-2 text-sm"
                          defaultValue={userProfile.bio}
                        />
                      </div>
                      <div className="pt-2">
                        <Button>Save Changes</Button>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="mb-6">
                    <CardHeader>
                      <CardTitle>Privacy Settings</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Make Profile Public</p>
                            <p className="text-sm text-muted-foreground">Allow other users to see your profile information</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" value="" className="sr-only peer" defaultChecked />
                            <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                          </label>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Share Travel History</p>
                            <p className="text-sm text-muted-foreground">Allow friends to see your travel history</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" value="" className="sr-only peer" defaultChecked />
                            <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                          </label>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Email Notifications</p>
                            <p className="text-sm text-muted-foreground">Receive emails about travel updates and recommendations</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" value="" className="sr-only peer" />
                            <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                          </label>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-red-500">Danger Zone</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Log Out</p>
                            <p className="text-sm text-muted-foreground">Sign out of your account</p>
                          </div>
                          <Button variant="outline" className="border-red-200 text-red-500" onClick={handleLogout}>
                            <LogOut className="h-4 w-4 mr-2" />
                            Log Out
                          </Button>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium">Delete Account</p>
                            <p className="text-sm text-muted-foreground">Permanently delete your account and all data</p>
                          </div>
                          <Button variant="destructive">
                            Delete Account
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </AnimateElement>
          </div>
        </section>
      </div>
    </PageTransition>
  );
};

export default ProfilePage;
