import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Leaf, Users, Target, Award, Eye, Compass, Heart, User, Mail, Phone, MapPin, Building, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import teamPhoto from '@/assets/team-photo.jpg';
import { AdvancedAboutPageSEO } from '@/components/AdvancedSEOHead';

const About = () => {
  return (
    <>
      <AdvancedAboutPageSEO />
      <div className="min-h-screen py-20">
      {/* Hero Section */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            About IDEA
          </h1>
          <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
            Integrated Development Association (IDEA) - Contributing to sustainable development 
            in Sri Lanka since 1990
          </p>
        </div>
      </section>

      {/* Quick Navigation */}
      <section className="py-8 bg-gradient-to-r from-primary/5 to-secondary/5 border-b border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-2">Explore Our Organization</h2>
            <p className="text-muted-foreground">Learn more about our work and impact</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link to="#vision-mission" className="group">
              <div className="bg-background border border-border rounded-lg p-4 text-center hover:shadow-lg transition-all duration-300 group-hover:border-primary/50">
                <Eye className="h-8 w-8 mx-auto mb-2 text-primary group-hover:scale-110 transition-transform duration-300" />
                <h3 className="font-semibold text-sm group-hover:text-primary transition-colors">Vision & Mission</h3>
              </div>
            </Link>
            
            <Link to="/projects" className="group">
              <div className="bg-background border border-border rounded-lg p-4 text-center hover:shadow-lg transition-all duration-300 group-hover:border-primary/50">
                <Award className="h-8 w-8 mx-auto mb-2 text-primary group-hover:scale-110 transition-transform duration-300" />
                <h3 className="font-semibold text-sm group-hover:text-primary transition-colors">Our Projects</h3>
              </div>
            </Link>
            
            <Link to="/news" className="group">
              <div className="bg-background border border-border rounded-lg p-4 text-center hover:shadow-lg transition-all duration-300 group-hover:border-primary/50">
                <Users className="h-8 w-8 mx-auto mb-2 text-primary group-hover:scale-110 transition-transform duration-300" />
                <h3 className="font-semibold text-sm group-hover:text-primary transition-colors">News & Events</h3>
              </div>
            </Link>
            
            <Link to="/contact" className="group">
              <div className="bg-background border border-border rounded-lg p-4 text-center hover:shadow-lg transition-all duration-300 group-hover:border-primary/50">
                <Mail className="h-8 w-8 mx-auto mb-2 text-primary group-hover:scale-110 transition-transform duration-300" />
                <h3 className="font-semibold text-sm group-hover:text-primary transition-colors">Contact Us</h3>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Vision, Mission & Approach */}
      <section id="vision-mission" className="py-16 bg-background">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
            {/* Vision */}
            <Card className="hover:shadow-lg transition-shadow duration-300 border-l-4 border-l-primary">
              <CardHeader>
                <Eye className="h-12 w-12 text-primary mb-4" />
                <CardTitle className="text-2xl">Our Vision</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  A society where every household has access to affordable, sustainable, and integrated
                  development options—empowering people to live with dignity, harmony, and care for the
                  environment.
                </p>
              </CardContent>
            </Card>

            {/* Mission */}
            <Card className="hover:shadow-lg transition-shadow duration-300 border-l-4 border-l-primary">
              <CardHeader>
                <Compass className="h-12 w-12 text-primary mb-4" />
                <CardTitle className="text-2xl">Our Mission</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  IDEA strives to promote harmony between people and the environment by enabling all
                  segments of society to access and develop technologies, knowledge, and methods that give
                  them greater control over their lives. We focus on the household as the foundation of
                  sustainability, and support development that is decentralized, inclusive, and
                  sustainable—rooted in the Universal Truth that nothing exists alone.
                </p>
              </CardContent>
            </Card>

            {/* Approach */}
            <Card className="hover:shadow-lg transition-shadow duration-300 border-l-4 border-l-primary">
              <CardHeader>
                <Heart className="h-12 w-12 text-primary mb-4" />
                <CardTitle className="text-2xl">Our Approach</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  At IDEA, we begin not with technologies or targets, but with people—their lived realities, daily struggles,
                  and quiet strengths. Our approach is rooted in the Universal Truth that nothing exists alone.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Development must be integrated, not divided by sectors.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  We focus on the household as the unit of transformation, the village as the space of collaboration, and
                  the community as the voice of sustainability.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Organization Overview */}
      <section className="py-16 bg-background">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-6">How We Work</h2>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                IDEA is a registered non-profit, non-governmental organization based in Kandy 
                which was established in March 1990 with the aim of playing an active role in 
                contributing towards sustainable development efforts in the field of natural 
                resource development, management, and conservation.
              </p>
              <p className="text-lg text-muted-foreground leading-relaxed">
                A multi-disciplinary Board consisting of six non-related members manages it 
                voluntarily. The main strength of IDEA lies on the Board of Management which 
                comprises members who are professionally qualified, experienced, and well-known 
                in development circles.
              </p>
            </div>
            <div className="relative">
              <img 
                src={teamPhoto} 
                alt="IDEA Team" 
                className="rounded-lg shadow-lg w-full h-64 object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Principal Areas of Interest */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Principal Areas of Interest
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              IDEA focuses on addressing critical environmental, energy, and biodiversity issues 
              that are of community and national importance.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <Leaf className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Environment & Biodiversity</CardTitle>
                <CardDescription>
                  Addressing environmental and biodiversity issues of specific communities 
                  and national importance.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <Target className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Renewable Energy Technologies</CardTitle>
                <CardDescription>
                  Development and promotion of renewable energy technologies for 
                  sustainable community development.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <Users className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Social Welfare Programs</CardTitle>
                <CardDescription>
                  Conducting programs on social welfare and upliftment of lives 
                  of rural population across Sri Lanka.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <Award className="h-12 w-12 text-primary mb-4" />
                <CardTitle>Community Engagement</CardTitle>
                <CardDescription>
                  Influencing NGOs to include environment and household energy issues 
                  within their community-based activities.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Experience & Impact */}
      <section className="py-16 bg-background">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-foreground mb-6">
            Three Decades of Impact
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            IDEA has over the years won the confidence of a large number of grassroots level 
            Community Based Organizations (CBOs) seeking technical assistance in rural energy 
            technologies and environment oriented programmes. We take initiatives to demonstrate 
            the importance of household energy and the environment in sustainable development.
          </p>
        </div>
      </section>

      {/* Leadership Team */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Our Leadership Team
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Meet the dedicated professionals who guide IDEA's mission and vision for sustainable development.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Team Member 1 */}
            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="flex items-center gap-3 mb-3">
                  <User className="h-8 w-8 text-primary" />
                  <CardTitle className="text-lg">W.M. Leelasena</CardTitle>
                </div>
                <CardDescription className="flex items-center gap-2">
                  <Building className="h-4 w-4" />
                  Former Director IRDP
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">+94 11 2801924 / +94 777485105</p>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">winasamestrileelasena@gmail.com</p>
                </div>
              </CardContent>
            </Card>

            {/* Team Member 2 */}
            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="flex items-center gap-3 mb-3">
                  <User className="h-8 w-8 text-primary" />
                  <CardTitle className="text-lg">R.M. Amarasekara</CardTitle>
                </div>
                <CardDescription className="flex items-center gap-2">
                  <Building className="h-4 w-4" />
                  Retired Electrical Engineer
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">+94 71 8265871 / +94 77 2365871</p>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">amere40@gmail.com</p>
                </div>
              </CardContent>
            </Card>

            {/* Team Member 3 */}
            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="flex items-center gap-3 mb-3">
                  <User className="h-8 w-8 text-primary" />
                  <CardTitle className="text-lg">Namiz Mohamed Musafer</CardTitle>
                </div>
                <CardDescription className="flex items-center gap-2">
                  <Building className="h-4 w-4" />
                  Mechanical Engineer & Energy Expert
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">+94 71 2748407</p>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">namizm@gmail.com</p>
                </div>
              </CardContent>
            </Card>

            {/* Team Member 4 */}
            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="flex items-center gap-3 mb-3">
                  <User className="h-8 w-8 text-primary" />
                  <CardTitle className="text-lg">L.G. Lamasena</CardTitle>
                </div>
                <CardDescription className="flex items-center gap-2">
                  <Building className="h-4 w-4" />
                  Rural Energy Practitioner
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">+94 77 9644916</p>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">lglamasena5@gmail.com</p>
                </div>
              </CardContent>
            </Card>

            {/* Team Member 5 */}
            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="flex items-center gap-3 mb-3">
                  <User className="h-8 w-8 text-primary" />
                  <CardTitle className="text-lg">R.M. Channa Daminda Amarasekara</CardTitle>
                </div>
                <CardDescription className="flex items-center gap-2">
                  <Building className="h-4 w-4" />
                  Head / Senior General Manager, Emerging Enterprise, Dialog Axiata PLC
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">+94 77 7335444</p>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">channa.amara@gmail.com</p>
                </div>
              </CardContent>
            </Card>

            {/* Team Member 6 */}
            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <div className="flex items-center gap-3 mb-3">
                  <User className="h-8 w-8 text-primary" />
                  <CardTitle className="text-lg">H.A. Chandima Kumudini Ariyarathna</CardTitle>
                </div>
                <CardDescription className="flex items-center gap-2">
                  <Building className="h-4 w-4" />
                  Senior Lecturer, Department of Botany, University of Peradeniya
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">+94 718298401 / +94 812386891</p>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">ckariyarathna@yahoo.com</p>
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

export default About;