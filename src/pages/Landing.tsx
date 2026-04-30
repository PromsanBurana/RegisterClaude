import { useRef, useState } from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Chapter01Problem from '../components/landing/Chapter01Problem';
import Chapter02Shift from '../components/landing/Chapter02Shift';
import ScrollStory from '../components/landing/ScrollStory';
import Courses from '../components/Courses';
import ExampleWork from '../components/ExampleWork';
import RegistrationForm, {
  type RegistrationData,
} from '../components/RegistrationForm';
import FAQ from '../components/FAQ';
import Footer from '../components/Footer';
import SuccessModal from '../components/SuccessModal';
import { useBatchAvailability } from '../hooks/useBatchAvailability';

export default function Landing() {
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [submittedData, setSubmittedData] = useState<RegistrationData | null>(
    null,
  );
  const [showSuccess, setShowSuccess] = useState(false);
  const formRef = useRef<HTMLElement>(null);

  const availability = useBatchAvailability();

  const handleSelectCourse = (courseId: string) => {
    setSelectedCourseId(courseId);
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  };

  const handleSubmitSuccess = (data: RegistrationData) => {
    setSubmittedData(data);
    setShowSuccess(true);
    // Refresh seat counts so the next user sees the new total
    void availability.refresh();
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <Navbar />
      <main>
        <Hero />
        <Chapter01Problem />
        <Chapter02Shift />
        <ScrollStory />
        <Courses
          onSelect={handleSelectCourse}
          availability={availability}
        />
        <ExampleWork />
        <RegistrationForm
          ref={formRef}
          selectedCourseId={selectedCourseId}
          onSuccess={handleSubmitSuccess}
          availability={availability}
        />
        <FAQ />
      </main>
      <Footer />
      <SuccessModal
        open={showSuccess}
        data={submittedData}
        onClose={() => setShowSuccess(false)}
      />
    </div>
  );
}
