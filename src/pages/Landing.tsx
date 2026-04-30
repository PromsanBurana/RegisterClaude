import { useRef, useState } from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Courses from '../components/Courses';
import ExampleWork from '../components/ExampleWork';
import WhyJoin from '../components/WhyJoin';
import RegistrationForm, {
  type RegistrationData,
} from '../components/RegistrationForm';
import FAQ from '../components/FAQ';
import Footer from '../components/Footer';
import SuccessModal from '../components/SuccessModal';

export default function Landing() {
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
  const [submittedData, setSubmittedData] = useState<RegistrationData | null>(
    null,
  );
  const [showSuccess, setShowSuccess] = useState(false);
  const formRef = useRef<HTMLElement>(null);

  const handleSelectCourse = (courseId: string) => {
    setSelectedCourseId(courseId);
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  };

  const handleSubmitSuccess = (data: RegistrationData) => {
    setSubmittedData(data);
    setShowSuccess(true);
  };

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <Navbar />
      <main>
        <Hero />
        <Courses onSelect={handleSelectCourse} />
        <ExampleWork />
        <WhyJoin />
        <RegistrationForm
          ref={formRef}
          selectedCourseId={selectedCourseId}
          onSuccess={handleSubmitSuccess}
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
