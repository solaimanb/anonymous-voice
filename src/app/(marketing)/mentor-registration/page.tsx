import TitleHeader from "@/components/common/TitleHeader";
import ListenerFAQ from "@/components/pages/mentor-reg/ListenerFAQ";
import ListenerSection from "@/components/pages/mentor-reg/ListenerSection";
import MentorRegistrationForm from "@/components/pages/mentor-reg/MentorRegistrationForm";

const MentorRegistration = () => {
  return (
    <div className="container mx-auto px-4 py-8 md:px-6 lg:px-8">
      <TitleHeader title="Become a Listener and Make a Change" />
      <ListenerSection />
      <ListenerFAQ />
      <MentorRegistrationForm />
    </div>
  );
};

export default MentorRegistration;
