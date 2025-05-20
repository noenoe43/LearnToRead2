
import React from 'react';
import Layout from '@/components/Layout';
import HeroSection from '@/components/HeroSection';
import FeaturesSection from '@/components/FeaturesSection';
import GuideSection from '@/components/GuideSection';
import TestSection from '@/components/TestSection';
import AboutDyslexiaSection from '@/components/AboutDyslexiaSection';
import InteractiveExercisesSection from '@/components/InteractiveExercisesSection';
import AdaptedLibrarySection from '@/components/AdaptedLibrarySection';
import LearningStrategiesSection from '@/components/LearningStrategiesSection';
import ProgressTrackingSection from '@/components/ProgressTrackingSection';
import CommunitySection from '@/components/CommunitySection';

const Index: React.FC = () => {
  return (
    <Layout>
      <HeroSection />
      <AboutDyslexiaSection />
      <FeaturesSection />
      <GuideSection />
      <InteractiveExercisesSection />
      <TestSection />
      <AdaptedLibrarySection />
      <LearningStrategiesSection />
      <ProgressTrackingSection />
      <CommunitySection />
    </Layout>
  );
};

export default Index;
