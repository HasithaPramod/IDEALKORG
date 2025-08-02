import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { AdvancedContactPageSEO } from '@/components/AdvancedSEOHead';

const Contact = () => {

  return (
    <>
      <AdvancedContactPageSEO />
      <div className="min-h-screen py-20">
      {/* Hero Section */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Contact IDEA
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Get in touch with IDEA to learn more about our sustainable development initiatives 
            or to explore partnership opportunities in environmental conservation.
          </p>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-16 bg-background">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <Card className="text-center">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <MapPin className="h-5 w-5 text-primary" />
                  Our Location
                </CardTitle>
                <CardDescription>
                  10-1/11, 3rd Lane, Galmaduwawatte Kundasale, Kandy Sri Lanka 20000
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Visit us at our headquarters in Kandy, where we coordinate our sustainable 
                  development initiatives across Sri Lanka.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <Phone className="h-5 w-5 text-primary" />
                  Phone
                </CardTitle>
                <CardDescription>
                  +94 812 423 396
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Call us during office hours for immediate assistance with your inquiries 
                  about our programs and services.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <Mail className="h-5 w-5 text-primary" />
                  Email
                </CardTitle>
                <CardDescription>
                  info@idea.org.lk
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Send us an email and we'll respond as soon as possible with the information you need.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-foreground">
                  <Clock className="h-5 w-5 text-primary" />
                  Office Hours
                </CardTitle>
                <CardDescription>
                  Monday - Friday: 8:00 AM - 5:00 PM
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  We're available during regular business hours. For urgent matters outside 
                  these hours, please send us an email.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Google Maps Location */}
          <div className="max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl text-foreground flex items-center gap-2">
                  <MapPin className="h-6 w-6 text-primary" />
                  Find Us on Google Maps
                </CardTitle>
                <CardDescription>
                  Visit our headquarters in Kandy, Sri Lanka
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative w-full h-96 rounded-lg overflow-hidden shadow-lg">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3957.2810998!2d80.6776645!3d7.2810998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae3670c0c1d7f2f%3A0x0!2zN8KwMTYnNTIuMCJOIDgwwrA0MCc0MC4wIkU!5e0!3m2!1sen!2slk!4v1703123456789"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="IDEA Headquarters Location"
                    className="absolute inset-0"
                  />
                </div>
                <div className="mt-4 text-center">
                  <p className="text-sm text-muted-foreground mb-2">
                    <strong>Address:</strong> Integrated Development Association (IDEA), 3rd Ln, Galmaduwatta road, Kandy, Sri Lanka
                  </p>
                  <Button 
                    variant="outline" 
                    className="mt-2"
                    onClick={() => window.open('https://www.google.com/maps/dir//Integrated+Development+Association+(IDEA),+3rd+Ln,+Galmaduwatta+road/@7.2810998,80.6776645,208m', '_blank')}
                  >
                    <MapPin className="mr-2 h-4 w-4" />
                    Open in Google Maps
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      </div>
    </>
  );
};

export default Contact;