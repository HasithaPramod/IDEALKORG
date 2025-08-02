import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { firebaseStorage } from '@/lib/firebaseStorage';
import { Loader2 } from 'lucide-react';
import { db } from '@/lib/firebase';
import { sanitizeInput, validateEmail, validatePhone, logSecurityEvent, SECURITY_CONFIG } from '@/lib/security';

const joinUsSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().regex(/^(\+94|0)?[0-9]{9}$/, 'Please enter a valid Sri Lankan phone number'),
  district: z.string().min(1, 'Please select your district'),
  address: z.string().min(10, 'Please provide your full address'),
  language: z.string().min(1, 'Please select your preferred language'),
  interests: z.array(z.string()).min(1, 'Please select at least one area of interest'),
  experience: z.string().optional(),
  motivation: z.string().min(20, 'Please tell us why you want to join (minimum 20 characters)'),
});

type JoinUsFormData = z.infer<typeof joinUsSchema>;

const sriLankanDistricts = [
  'Colombo', 'Gampaha', 'Kalutara', 'Kandy', 'Matale', 'Nuwara Eliya',
  'Galle', 'Hambantota', 'Matara', 'Jaffna', 'Kilinochchi', 'Mannar',
  'Mullaitivu', 'Vavuniya', 'Puttalam', 'Kurunegala', 'Anuradhapura',
  'Polonnaruwa', 'Badulla', 'Monaragala', 'Ratnapura', 'Kegalle',
  'Ampara', 'Batticaloa', 'Trincomalee'
];

const interestAreas = [
  'Environmental Conservation',
  'Renewable Energy',
  'Community Gardens',
  'Waste Management',
  'Water Conservation',
  'Climate Change Awareness',
  'Sustainable Agriculture',
  'Education & Outreach',
  'Research & Development',
  'Fundraising & Advocacy'
];

interface JoinUsFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const JoinUsForm = ({ open, onOpenChange }: JoinUsFormProps) => {
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  // Check Firebase connection on component mount
  console.log('Firebase db instance:', db);
  console.log('Firebase storage instance:', firebaseStorage);



  const form = useForm<JoinUsFormData>({
    resolver: zodResolver(joinUsSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      district: '',
      address: '',
      language: '',
      interests: [],
      experience: '',
      motivation: '',
    },
  });

  const onSubmit = async (data: JoinUsFormData) => {
    // Security validation and sanitization
    const sanitizedData = {
      firstName: sanitizeInput(data.firstName || '', SECURITY_CONFIG.MAX_NAME_LENGTH),
      lastName: sanitizeInput(data.lastName || '', SECURITY_CONFIG.MAX_NAME_LENGTH),
      email: sanitizeInput(data.email || '', SECURITY_CONFIG.MAX_EMAIL_LENGTH),
      phone: sanitizeInput(data.phone || '', SECURITY_CONFIG.MAX_PHONE_LENGTH),
      district: sanitizeInput(data.district || '', SECURITY_CONFIG.MAX_LOCATION_LENGTH),
      address: sanitizeInput(data.address || '', SECURITY_CONFIG.MAX_ADDRESS_LENGTH),
      language: sanitizeInput(data.language || '', SECURITY_CONFIG.MAX_CATEGORY_LENGTH),
      experience: sanitizeInput(data.experience || '', SECURITY_CONFIG.MAX_EXPERIENCE_LENGTH),
      motivation: sanitizeInput(data.motivation || '', SECURITY_CONFIG.MAX_MOTIVATION_LENGTH),
    };

    try {
      setIsSubmitting(true);
      
      console.log('=== FORM SUBMISSION START ===');
      console.log('Form data:', data);
      console.log('Selected interests:', selectedInterests);

      // Validate required fields
      if (!sanitizedData.firstName || !sanitizedData.lastName || !sanitizedData.email || 
          !sanitizedData.phone || !sanitizedData.district || !sanitizedData.address || 
          !sanitizedData.language || !sanitizedData.motivation) {
        toast({
          title: 'Validation Error',
          description: 'Please fill in all required fields.',
          variant: 'destructive',
        });
        return;
      }

      // Validate email and phone
      if (!validateEmail(sanitizedData.email)) {
        toast({
          title: 'Validation Error',
          description: 'Please enter a valid email address.',
          variant: 'destructive',
        });
        return;
      }

      if (!validatePhone(sanitizedData.phone)) {
        toast({
          title: 'Validation Error',
          description: 'Please enter a valid Sri Lankan phone number.',
          variant: 'destructive',
        });
        return;
      }
      
      // Ensure interests are properly set
      const interests = selectedInterests.length > 0 ? selectedInterests : data.interests;
      console.log('Final interests:', interests);
      
      // Validate that we have at least one interest
      if (interests.length === 0) {
        console.log('No interests selected, showing error');
        toast({
          title: 'Validation Error',
          description: 'Please select at least one area of interest.',
          variant: 'destructive',
        });
        return;
      }
      
      // Ensure all required fields are present
      const applicationData = {
        firstName: sanitizedData.firstName,
        lastName: sanitizedData.lastName,
        email: sanitizedData.email,
        phone: sanitizedData.phone,
        district: sanitizedData.district,
        address: sanitizedData.address,
        language: sanitizedData.language,
        interests: interests,
        experience: sanitizedData.experience,
        motivation: sanitizedData.motivation,
      };
      
      console.log('Application data to submit:', applicationData);
      console.log('About to call firebaseStorage.addJoinApplication...');
      
      const result = await firebaseStorage.addJoinApplication(applicationData);
      console.log('Firebase submission result:', result);
      console.log('=== FORM SUBMISSION SUCCESS ===');
      
      // Log successful submission
      logSecurityEvent('Join application submitted', { 
        email: sanitizedData.email,
        district: sanitizedData.district,
        interests: interests 
      }, 'low');
      
      toast({
        title: 'Application Submitted Successfully!',
        description: 'Thank you for joining IDEA. We will review your application and contact you soon.',
      });
      
      form.reset();
      setSelectedInterests([]);
      onOpenChange(false);
    } catch (error) {
      console.error('=== FORM SUBMISSION ERROR ===');
      console.error('Error submitting application:', error);
      console.error('Error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : 'No stack trace'
      });
      
      // Log security event for failed submission
      logSecurityEvent('Join application submission failed', { 
        error: error instanceof Error ? error.message : 'Unknown error',
        email: sanitizedData?.email || 'unknown'
      }, 'medium');
      
      toast({
        title: 'Submission Failed',
        description: 'There was an error submitting your application. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
      console.log('=== FORM SUBMISSION END ===');
    }
  };

  const toggleInterest = (interest: string) => {
    setSelectedInterests(prev => {
      const updated = prev.includes(interest)
        ? prev.filter(i => i !== interest)
        : [...prev, interest];
      form.setValue('interests', updated);
      return updated;
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-primary">
            Join IDEA
          </DialogTitle>
          <DialogDescription>
            Help us contribute to sustainable development in Sri Lanka. Fill out this form to become part of our community.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Personal Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your first name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your last name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Contact Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="your.email@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input placeholder="077XXXXXXX or +94XXXXXXXXX" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Location Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="district"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>District</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your district" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {sriLankanDistricts.map((district) => (
                          <SelectItem key={district} value={district}>
                            {district}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="language"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Preferred Language</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select language" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="english">English</SelectItem>
                        <SelectItem value="sinhala">සිංහල</SelectItem>
                        <SelectItem value="tamil">தமிழ்</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Address</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Enter your complete address including city and postal code"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Areas of Interest */}
            <FormField
              control={form.control}
              name="interests"
              render={() => (
                <FormItem>
                  <FormLabel>Areas of Interest (Select all that apply)</FormLabel>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {interestAreas.map((interest) => (
                      <button
                        key={interest}
                        type="button"
                        onClick={() => toggleInterest(interest)}
                        className={`p-2 text-left text-sm rounded-md border transition-colors ${
                          selectedInterests.includes(interest)
                            ? 'bg-primary text-primary-foreground border-primary'
                            : 'bg-background hover:bg-muted border-input'
                        }`}
                      >
                        {interest}
                      </button>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Experience and Motivation */}
            <FormField
              control={form.control}
              name="experience"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Relevant Experience (Optional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Tell us about any relevant experience or skills you have"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="motivation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Why do you want to join us?</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Share your motivation for joining Earth Rise Collective and how you'd like to contribute"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-4 pt-4">
              <Button type="submit" className="flex-1" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  'Submit Application'
                )}
              </Button>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)}
                className="flex-1"
                disabled={isSubmitting}
              >
                Cancel
              </Button>
            </div>
            
            {/* Temporary test button */}
            <div className="pt-2">
              <Button 
                type="button" 
                variant="outline" 
                size="sm"
                onClick={async () => {
                  try {
                    console.log('Testing Firebase connection...');
                    const testData = {
                      firstName: 'Test',
                      lastName: 'User',
                      email: 'test@example.com',
                      phone: '0771234567',
                      district: 'Colombo',
                      address: 'Test Address',
                      language: 'english',
                      interests: ['Environmental Conservation'],
                      experience: 'Test experience',
                      motivation: 'Test motivation'
                    };
                    
                    const result = await firebaseStorage.addJoinApplication(testData);
                    console.log('Test successful:', result);
                    toast({
                      title: 'Test Successful!',
                      description: 'Firebase connection is working.',
                    });
                  } catch (error) {
                    console.error('Test failed:', error);
                    toast({
                      title: 'Test Failed',
                      description: 'Firebase connection failed.',
                      variant: 'destructive',
                    });
                  }
                }}
                className="w-full text-xs"
              >
                Test Firebase Connection
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};