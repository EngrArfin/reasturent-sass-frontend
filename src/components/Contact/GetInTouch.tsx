import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Mail,
  Phone,
  Tag,
  MessageSquare,
  Send,
  CheckCircle2,
  Clock,
  Sparkles,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";
import CommonWrapper from "@/common/CommonWrapper";

// Zod Validation Schema
const contactFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  phone: z.string().min(10, { message: "Phone number must be at least 10 digits" }),
  subject: z.string().min(1, { message: "Please select a subject of inquiry" }),
  message: z.string().min(10, { message: "Message must be at least 10 characters long" }),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

const GetInTouch = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [submittedName, setSubmittedName] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    },
  });

  const onSubmit = async (data: ContactFormValues) => {
    setIsSubmitting(true);
    setSubmittedName(data.name);
    // Simulate API request delay
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    setIsSuccess(true);
    reset();
  };

  const supportBenefits = [
    {
      icon: Clock,
      title: "Fast Response Time",
      desc: "Our dedicated support team typically replies to all inquiries within 2 hours.",
    },
    {
      icon: Sparkles,
      title: "Interactive Live Demo",
      desc: "Schedule a personalized product tour tailored to your restaurant's unique flow.",
    },
    {
      icon: ShieldCheck,
      title: "Secure & Private",
      desc: "Your data is fully encrypted and stored securely following global standards.",
    },
  ];

  return (
    <div className="bg-radial from-[#fdfbf7] to-[#ffffff] border-b border-gray-100">
      <CommonWrapper className="!py-16 md:!py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 xl:gap-16 items-start">

          {/* Left Column: Title and details */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-orange-100 text-primary-orange">
                <Sparkles className="size-3.5" />
                Get In Touch
              </span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-heading-blue leading-tight tracking-tight">
                Let's Talk About Your Restaurant's Success
              </h2>
              <p className="text-base text-paragraph-gray leading-relaxed">
                Have questions about our POS, inventory management, or subscription plans? Fill out the form and our SaaS experts will reach out to guide you.
              </p>
            </div>

            {/* Support benefits cards */}
            <div className="space-y-5 pt-4">
              {supportBenefits.map((benefit, idx) => {
                const IconComponent = benefit.icon;
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1, duration: 0.4 }}
                    className="flex gap-4 p-4 rounded-xl border border-gray-100 bg-white/70 backdrop-blur-xs shadow-xs hover:shadow-md hover:border-primary-orange/20 transition-all duration-300 group"
                  >
                    <div className="flex-shrink-0 flex items-center justify-center size-12 rounded-lg bg-orange-50 text-primary-orange group-hover:bg-primary-orange group-hover:text-white transition-all duration-300">
                      <IconComponent className="size-6" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-bold text-gray-800 text-sm md:text-base">
                        {benefit.title}
                      </h4>
                      <p className="text-xs md:text-sm text-paragraph-gray">
                        {benefit.desc}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>

          </div>

          {/* Right Column: Interactive form card */}
          <div className="lg:col-span-7">
            <div className="relative bg-white rounded-2xl border border-gray-100 shadow-xl p-6 sm:p-8 md:p-10 overflow-hidden">
              {/* Soft decorative background glow */}
              <div className="absolute top-0 right-0 -mt-12 -mr-12 size-40 bg-orange-100/30 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 -mb-12 -ml-12 size-40 bg-blue-50/40 rounded-full blur-3xl pointer-events-none" />

              <AnimatePresence mode="wait">
                {!isSuccess ? (
                  <motion.form
                    key="contact-form"
                    onSubmit={handleSubmit(onSubmit)}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6 relative z-10"
                  >
                    <div>
                      <h3 className="text-xl md:text-2xl font-bold text-gray-800 mb-1">
                        Send Us a Message
                      </h3>
                      <p className="text-sm text-paragraph-gray">
                        Fields marked with * are required.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      {/* Name input */}
                      <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-gray-700 flex items-center gap-1.5">
                          <User className="size-4 text-paragraph-gray" /> Full Name *
                        </label>
                        <div className="relative">
                          <input
                            {...register("name")}
                            type="text"
                            placeholder="John Doe"
                            className={`w-full px-4 py-2.5 rounded-lg border bg-white text-gray-800 placeholder-gray-400 text-sm focus:outline-none transition-all duration-300 ${errors.name
                                ? "border-red-400 focus:ring-2 focus:ring-red-100"
                                : "border-gray-200 focus:border-primary-orange focus:ring-2 focus:ring-orange-100"
                              }`}
                          />
                        </div>
                        {errors.name && (
                          <p className="text-xs text-red-500 font-medium mt-0.5">{errors.name.message}</p>
                        )}
                      </div>

                      {/* Email input */}
                      <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-gray-700 flex items-center gap-1.5">
                          <Mail className="size-4 text-paragraph-gray" /> Email Address *
                        </label>
                        <div className="relative">
                          <input
                            {...register("email")}
                            type="email"
                            placeholder="john@example.com"
                            className={`w-full px-4 py-2.5 rounded-lg border bg-white text-gray-800 placeholder-gray-400 text-sm focus:outline-none transition-all duration-300 ${errors.email
                                ? "border-red-400 focus:ring-2 focus:ring-red-100"
                                : "border-gray-200 focus:border-primary-orange focus:ring-2 focus:ring-orange-100"
                              }`}
                          />
                        </div>
                        {errors.email && (
                          <p className="text-xs text-red-500 font-medium mt-0.5">{errors.email.message}</p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      {/* Phone input */}
                      <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-gray-700 flex items-center gap-1.5">
                          <Phone className="size-4 text-paragraph-gray" /> Phone Number *
                        </label>
                        <div className="relative">
                          <input
                            {...register("phone")}
                            type="tel"
                            placeholder="+1 (555) 000-0000"
                            className={`w-full px-4 py-2.5 rounded-lg border bg-white text-gray-800 placeholder-gray-400 text-sm focus:outline-none transition-all duration-300 ${errors.phone
                                ? "border-red-400 focus:ring-2 focus:ring-red-100"
                                : "border-gray-200 focus:border-primary-orange focus:ring-2 focus:ring-orange-100"
                              }`}
                          />
                        </div>
                        {errors.phone && (
                          <p className="text-xs text-red-500 font-medium mt-0.5">{errors.phone.message}</p>
                        )}
                      </div>

                      {/* Subject inquiry selection */}
                      <div className="space-y-1.5">
                        <label className="text-sm font-semibold text-gray-700 flex items-center gap-1.5">
                          <Tag className="size-4 text-paragraph-gray" /> Inquiry Subject *
                        </label>
                        <div className="relative">
                          <select
                            {...register("subject")}
                            className={`w-full px-4 py-2.5 rounded-lg border bg-white text-gray-800 placeholder-gray-400 text-sm focus:outline-none transition-all duration-300 appearance-none cursor-pointer ${errors.subject
                                ? "border-red-400 focus:ring-2 focus:ring-red-100"
                                : "border-gray-200 focus:border-primary-orange focus:ring-2 focus:ring-orange-100"
                              }`}
                          >
                            <option value="">Select a topic</option>
                            <option value="General Inquiry">General Inquiry</option>
                            <option value="Product Demo">Request a Live Demo</option>
                            <option value="Sales / Pricing">Sales & Subscription Pricing</option>
                            <option value="Technical Support">Technical Support</option>
                            <option value="Partnership">Partnership Opportunities</option>
                          </select>
                          {/* Custom Dropdown Arrow */}
                          <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-gray-500">
                            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                            </svg>
                          </div>
                        </div>
                        {errors.subject && (
                          <p className="text-xs text-red-500 font-medium mt-0.5">{errors.subject.message}</p>
                        )}
                      </div>
                    </div>

                    {/* Message body input */}
                    <div className="space-y-1.5">
                      <label className="text-sm font-semibold text-gray-700 flex items-center gap-1.5">
                        <MessageSquare className="size-4 text-paragraph-gray" /> Your Message *
                      </label>
                      <div className="relative">
                        <textarea
                          {...register("message")}
                          rows={4}
                          placeholder="Tell us about your restaurant setup and how we can help you..."
                          className={`w-full px-4 py-2.5 rounded-lg border bg-white text-gray-800 placeholder-gray-400 text-sm focus:outline-none transition-all duration-300 resize-none ${errors.message
                              ? "border-red-400 focus:ring-2 focus:ring-red-100"
                              : "border-gray-200 focus:border-primary-orange focus:ring-2 focus:ring-orange-100"
                            }`}
                        />
                      </div>
                      {errors.message && (
                        <p className="text-xs text-red-500 font-medium mt-0.5">{errors.message.message}</p>
                      )}
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-primary-orange hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed group"
                    >
                      {isSubmitting ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Processing Request...
                        </>
                      ) : (
                        <>
                          Send Message
                          <Send className="size-4 group-hover:translate-x-1 transition-transform duration-300" />
                        </>
                      )}
                    </button>
                  </motion.form>
                ) : (
                  // Success State Card Design
                  <motion.div
                    key="success-card"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="text-center py-10 px-4 space-y-6 relative z-10 flex flex-col items-center"
                  >
                    <div className="flex items-center justify-center size-20 rounded-full bg-green-50 text-green-500 shadow-inner">
                      <CheckCircle2 className="size-12 animate-bounce" />
                    </div>
                    <div className="space-y-2 max-w-md">
                      <h3 className="text-2xl font-extrabold text-gray-800">
                        Thank You, {submittedName}!
                      </h3>
                      <p className="text-sm md:text-base text-paragraph-gray">
                        Your message has been received successfully. One of our restaurant solutions consultants will contact you shortly.
                      </p>
                    </div>

                    <button
                      onClick={() => setIsSuccess(false)}
                      className="mt-4 px-6 py-2.5 border border-gray-200 hover:border-primary-orange text-gray-700 hover:text-primary-orange rounded-lg text-sm font-semibold flex items-center gap-2 cursor-pointer transition-all duration-300 group"
                    >
                      Send Another Message
                      <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform duration-300" />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

        </div>
      </CommonWrapper>
    </div>
  );
};

export default GetInTouch;
