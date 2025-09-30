// src/app/page.tsx
import Navigation from '@/components/layout/Navigation';
import HeroSection from '@/components/features/HeroSection';
import AboutSection from '@/components/features/AboutSection';
import ServicesSection from '@/components/features/ServicesSection';
import VehiclesSection from '@/components/features/VehiclesSection';
import ContactSection from '@/components/features/ContactSection';
import Footer from '@/components/layout/Footer';

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navigation />
      <HeroSection />
      <VehiclesSection />
      <ServicesSection />
      <AboutSection />
      <ContactSection />
      <Footer />
    </main>
  );
}