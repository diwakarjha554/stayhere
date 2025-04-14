'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Plus, X } from 'lucide-react';
import { useAuth } from '@/context/auth-context';
import { propertyService } from '@/lib/firestore-service';

const Property = () => {
  const router = useRouter();
  const { toast } = useToast();
  const { user, loading: authLoading } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [amenities, setAmenities] = useState<string[]>([]);
  const [newAmenity, setNewAmenity] = useState('');
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    price: '',
    bedrooms: '',
    bathrooms: '',
    guests: '',
    location_description: '',
  });

  // House rules
  const [houseRules, setHouseRules] = useState<string[]>([
    'Check-in: 3:00 PM - 8:00 PM',
    'Checkout: 11:00 AM',
    'No smoking',
    'No pets',
  ]);
  const [newRule, setNewRule] = useState('');
  useEffect(() => {
    // Check if user is authenticated
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddImage = () => {
    // In a real app, this would upload to Firebase Storage
    // For now, just add a placeholder
    setImages((prev) => [
      ...prev,
      `/placeholder.svg?height=300&width=400&text=Image ${prev.length + 1}`,
    ]);
  };

  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };
  const handleAddAmenity = () => {
    if (newAmenity && !amenities.includes(newAmenity)) {
      setAmenities((prev) => [...prev, newAmenity]);
      setNewAmenity('');
    }
  };

  const handleRemoveAmenity = (amenity: string) => {
    setAmenities((prev) => prev.filter((a) => a !== amenity));
  };

  const handleAddRule = () => {
    if (newRule && !houseRules.includes(newRule)) {
      setHouseRules((prev) => [...prev, newRule]);
      setNewRule('');
    }
  };
  const handleRemoveRule = (rule: string) => {
    setHouseRules((prev) => prev.filter((r) => r !== rule));
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!formData.title || !formData.location || !formData.price) {
      toast({
        title: 'Error',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      });
      return;
    }

    if (images.length === 0) {
      toast({
        title: 'Error',
        description: 'Please add at least one image.',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Create property in Firestore
      const propertyData = {
        title: formData.title,
        description: formData.description,
        location: formData.location,
        price: Number.parseFloat(formData.price),
        bedrooms: Number.parseInt(formData.bedrooms) || 1,
        bathrooms: Number.parseInt(formData.bathrooms) || 1,
        guests: Number.parseInt(formData.guests) || 1,
        images,
        amenities,
        status: 'active' as const,
        isFeatured: false,
        rating: 0,
        reviews: 0,
        location_description: formData.location_description,
        house_rules: houseRules,
        host: {
          name: user?.displayName || 'Host',
          image: user?.photoURL || '/placeholder.svg?height=100&width=100',
          joined: new Date().getFullYear().toString(),
          response_rate: 99,
        },
      };

      await propertyService.createProperty(propertyData);

      toast({
        title: 'Success!',
        description: 'Property has been created successfully.',
      });

      // Redirect to admin dashboard
      router.push('/admin');
    } catch (error) {
      console.error('Error creating property:', error);
      toast({
        title: 'Error',
        description: 'Failed to create property. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow bg-gray-50">
        <div className="mx-auto px-4 md:px-6 py-8">
          <h1 className="text-3xl font-bold mb-8">Add New Property</h1>

          <form onSubmit={handleSubmit} className="space-y-8">
            <Card className="rounded">
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>
                  Enter the basic details about your property
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Property Title *</Label>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="e.g. Luxury Beach Villa"
                    required
                    className="rounded"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Describe your property..."
                    rows={5}
                    className="rounded"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location *</Label>
                  <Input
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="e.g. Malibu, California"
                    required
                    className="rounded"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location_description">
                    Location Description
                  </Label>
                  <Textarea
                    id="location_description"
                    name="location_description"
                    value={formData.location_description}
                    onChange={handleChange}
                    placeholder="Describe the location and surroundings..."
                    rows={3}
                    className="rounded"
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="rounded">
              <CardHeader>
                <CardTitle>Property Details</CardTitle>
                <CardDescription>
                  Provide specific details about your property
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price">Price per Night ($) *</Label>
                    <Input
                      id="price"
                      name="price"
                      type="number"
                      min="0"
                      step="0.01"
                      value={formData.price}
                      onChange={handleChange}
                      placeholder="e.g. 199.99"
                      required
                      className="rounded"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bedrooms">Bedrooms</Label>
                    <Input
                      id="bedrooms"
                      name="bedrooms"
                      type="number"
                      min="0"
                      value={formData.bedrooms}
                      onChange={handleChange}
                      placeholder="e.g. 3"
                      className="rounded"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bathrooms">Bathrooms</Label>
                    <Input
                      id="bathrooms"
                      name="bathrooms"
                      type="number"
                      min="0"
                      step="0.5"
                      value={formData.bathrooms}
                      onChange={handleChange}
                      placeholder="e.g. 2"
                      className="rounded"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="guests">Max Guests</Label>
                    <Input
                      id="guests"
                      name="guests"
                      type="number"
                      min="1"
                      value={formData.guests}
                      onChange={handleChange}
                      placeholder="e.g. 6"
                      className="rounded"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded">
              <CardHeader>
                <CardTitle>Images</CardTitle>
                <CardDescription>
                  Add photos of your property (minimum 1 image)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
                  {images.map((image, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={image || '/placeholder.svg'}
                        alt={`Property image ${index + 1}`}
                        className="w-full h-40 object-cover rounded-md"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer rounded bg-red-500"
                        onClick={() => handleRemoveImage(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    className="h-40 flex flex-col items-center justify-center border-dashed cursor-pointer"
                    onClick={handleAddImage}
                  >
                    <Plus className="h-6 w-6 mb-2" />
                    <span>Add Image</span>
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded">
              <CardHeader>
                <CardTitle>Amenities</CardTitle>
                <CardDescription>
                  Add amenities that your property offers
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2 mb-4">
                  <Input
                    value={newAmenity}
                    onChange={(e) => setNewAmenity(e.target.value)}
                    placeholder="e.g. WiFi, Pool, Kitchen"
                    className="rounded"
                  />
                  <Button
                    type="button"
                    onClick={handleAddAmenity}
                    disabled={!newAmenity}
                    className="rounded cursor-pointer bg-[#0937AB] hover:bg-[#0937AB]/90"
                  >
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {amenities.map((amenity) => (
                    <div
                      key={amenity}
                      className="flex items-center bg-gray-100 rounded-full px-3 py-1"
                    >
                      <span className="text-sm">{amenity}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-5 w-5 ml-1"
                        onClick={() => handleRemoveAmenity(amenity)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="rounded">
              <CardHeader>
                <CardTitle>House Rules</CardTitle>
                <CardDescription>
                  Add rules for guests staying at your property
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2 mb-4">
                  <Input
                    value={newRule}
                    onChange={(e) => setNewRule(e.target.value)}
                    placeholder="e.g. No smoking, Check-out by 11 AM"
                    className="rounded"
                  />
                  <Button
                    type="button"
                    onClick={handleAddRule}
                    disabled={!newRule}
                    className="rounded cursor-pointer bg-[#0937AB] hover:bg-[#0937AB]/90"
                  >
                    Add
                  </Button>
                </div>
                <div className="space-y-2">
                  {houseRules.map((rule) => (
                    <div
                      key={rule}
                      className="flex items-center justify-between bg-gray-50 rounded-md px-3 py-2"
                    >
                      <span>{rule}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 cursor-pointer"
                        onClick={() => handleRemoveRule(rule)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                className="rounded cursor-pointer "
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className=" cursor-pointer rounded bg-[#0937AB] hover:bg-[#0937AB]/90"
              >
                {isSubmitting ? 'Creating...' : 'Create Property'}
              </Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default Property;
