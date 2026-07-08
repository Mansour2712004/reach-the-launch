import ContactForm from '../components/ContactForm'

export default function ContactUs() {
  return (
    <div className="max-w-xl mx-auto px-4 sm:px-6 py-14">
      <h1 className="text-2xl md:text-3xl font-display font-bold mb-2">Contact Us</h1>
      <p className="text-mist text-sm mb-8">
        Leave your details and our team will help you find the right launch for you.
      </p>
      <ContactForm />
    </div>
  )
}
