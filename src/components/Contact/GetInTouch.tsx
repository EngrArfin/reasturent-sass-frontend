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
  Sparkles,
  MapPin,
  Clock,
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
    await new Promise((resolve) => setTimeout(resolve, 1200));
    setIsSubmitting(false);
    setIsSuccess(true);
    reset();
  };

  const contactDetails = [
    {
      icon: MapPin,
      title: "Our Headquarters",
      desc: "Mirpur-10, Dhaka-1260, Bangladesh",
    },
    {
      icon: Phone,
      title: "Direct Phone Support",
      desc: "(+880) 1923-434574",
    },
    {
      icon: Mail,
      title: "Email Inquiries",
      desc: "support@restosync.io",
    },
    {
      icon: Clock,
      title: "Working Hours",
      desc: "24/7 Priority Support & Live Chat",
    },
  ];

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-[#07090D] via-[#0B0F17] to-[#07090D] text-white py-16 md:py-24 border-b border-white/10">
      {/* Background ambient lighting */}
      <div className="absolute top-20 left-10 w-96 h-96 bg-orange-500/10 blur-[130px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-500/10 blur-[130px] rounded-full pointer-events-none" />

      <CommonWrapper className="relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 xl:gap-16 items-start">
          {/* Left Column: Title and details */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-4">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest bg-orange-500/10 border border-orange-500/25 text-orange-400">
                <Sparkles className="size-3.5" />
                Let's Connect
              </span>
              <h2 className="text-3xl md:text-5xl font-extrabold text-white leading-tight tracking-tight">
                Get in Touch with Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-500">Specialists</span>
              </h2>
              <p className="text-base text-slate-400 leading-relaxed">
                Have questions about our restaurant POS, kitchen display system, multi-outlet management, or tailored subscription plans? We're here to assist you 24/7.
              </p>
            </div>

            {/* Contact details cards */}
            <div className="space-y-4 pt-2">
              {contactDetails.map((detail, idx) => {
                const IconComponent = detail.icon;
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.08, duration: 0.4 }}
                    className="flex items-center gap-4 p-4 rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-md hover:border-orange-500/30 hover:bg-white/[0.06] transition-all duration-300 group shadow-md shadow-black/20"
                  >
                    <div className="shrink-0 flex items-center justify-center size-12 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400 group-hover:bg-orange-500/20 group-hover:scale-105 transition-all duration-300">
                      <IconComponent className="size-5" />
                    </div>
                    <div className="space-y-0.5">
                      <h4 className="font-semibold text-slate-400 text-xs uppercase tracking-wider">
                        {detail.title}
                      </h4>
                      <p className="text-sm md:text-base font-bold text-white">
                        {detail.desc}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Interactive form card */}
          <div className="lg:col-span-7">
            <div className="relative bg-white/[0.03] backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl p-6 sm:p-8 md:p-10 overflow-hidden">
              {/* Soft decorative background glow */}
              <div className="absolute top-0 right-0 -mt-12 -mr-12 size-40 bg-orange-500/15 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 -mb-12 -ml-12 size-40 bg-blue-500/15 rounded-full blur-3xl pointer-events-none" />

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
                      <h3 className="text-xl md:text-2xl font-bold text-white mb-1">
                        Send Us a Message
                      </h3>
                      <p className="text-sm text-slate-400">
                        Fill in your details and our team will get back to you within 2 hours.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      {/* Name input */}
                      <div className="space-y-1.5">
                        <label className="text-sm font-medium text-slate-300 flex items-center gap-1.5">
                          <User className="size-4 text-orange-400" /> Full Name *
                        </label>
                        <input
                          {...register("name")}
                          type="text"
                          placeholder="Chef Gordon"
                          className={`w-full px-4 py-3 rounded-xl border bg-black/40 text-white placeholder-slate-500 text-sm focus:outline-none transition-all duration-300 ${
                            errors.name
                              ? "border-red-500/60 focus:ring-2 focus:ring-red-500/20"
                              : "border-white/10 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
                          }`}
                        />
                        {errors.name && (
                          <p className="text-xs text-red-400 font-medium mt-0.5">{errors.name.message}</p>
                        )}
                      </div>

                      {/* Email input */}
                      <div className="space-y-1.5">
                        <label className="text-sm font-medium text-slate-300 flex items-center gap-1.5">
                          <Mail className="size-4 text-orange-400" /> Email Address *
                        </label>
                        <input
                          {...register("email")}
                          type="email"
                          placeholder="gordon@restaurant.com"
                          className={`w-full px-4 py-3 rounded-xl border bg-black/40 text-white placeholder-slate-500 text-sm focus:outline-none transition-all duration-300 ${
                            errors.email
                              ? "border-red-500/60 focus:ring-2 focus:ring-red-500/20"
                              : "border-white/10 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
                          }`}
                        />
                        {errors.email && (
                          <p className="text-xs text-red-400 font-medium mt-0.5">{errors.email.message}</p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      {/* Phone input */}
                      <div className="space-y-1.5">
                        <label className="text-sm font-medium text-slate-300 flex items-center gap-1.5">
                          <Phone className="size-4 text-orange-400" /> Phone Number *
                        </label>
                        <input
                          {...register("phone")}
                          type="tel"
                          placeholder="+880 1900-000000"
                          className={`w-full px-4 py-3 rounded-xl border bg-black/40 text-white placeholder-slate-500 text-sm focus:outline-none transition-all duration-300 ${
                            errors.phone
                              ? "border-red-500/60 focus:ring-2 focus:ring-red-500/20"
                              : "border-white/10 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
                          }`}
                        />
                        {errors.phone && (
                          <p className="text-xs text-red-400 font-medium mt-0.5">{errors.phone.message}</p>
                        )}
                      </div>

                      {/* Subject inquiry selection */}
                      <div className="space-y-1.5">
                        <label className="text-sm font-medium text-slate-300 flex items-center gap-1.5">
                          <Tag className="size-4 text-orange-400" /> Inquiry Subject *
                        </label>
                        <select
                          {...register("subject")}
                          className={`w-full px-4 py-3 rounded-xl border bg-[#0B0F17] text-white placeholder-slate-500 text-sm focus:outline-none transition-all duration-300 cursor-pointer ${
                            errors.subject
                              ? "border-red-500/60 focus:ring-2 focus:ring-red-500/20"
                              : "border-white/10 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
                          }`}
                        >
                          <option value="" className="bg-[#0B0F17] text-slate-400">Select a topic</option>
                          <option value="General Inquiry" className="bg-[#0B0F17] text-white">General Inquiry</option>
                          <option value="Product Demo" className="bg-[#0B0F17] text-white">Request a Live Demo</option>
                          <option value="Sales / Pricing" className="bg-[#0B0F17] text-white">Sales & Subscription Pricing</option>
                          <option value="Technical Support" className="bg-[#0B0F17] text-white">Technical Support</option>
                          <option value="Partnership" className="bg-[#0B0F17] text-white">Partnership Opportunities</option>
                        </select>
                        {errors.subject && (
                          <p className="text-xs text-red-400 font-medium mt-0.5">{errors.subject.message}</p>
                        )}
                      </div>
                    </div>

                    {/* Message textarea */}
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-slate-300 flex items-center gap-1.5">
                        <MessageSquare className="size-4 text-orange-400" /> Your Message *
                      </label>
                      <textarea
                        {...register("message")}
                        rows={4}
                        placeholder="Tell us about your restaurant branches, current POS setup, or any specific requirements..."
                        className={`w-full px-4 py-3 rounded-xl border bg-black/40 text-white placeholder-slate-500 text-sm focus:outline-none transition-all duration-300 resize-none ${
                          errors.message
                            ? "border-red-500/60 focus:ring-2 focus:ring-red-500/20"
                            : "border-white/10 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
                        }`}
                      />
                      {errors.message && (
                        <p className="text-xs text-red-400 font-medium mt-0.5">{errors.message.message}</p>
                      )}
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3.5 px-6 rounded-xl font-bold text-white bg-gradient-to-r from-orange-500 to-[#F54900] shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 hover:scale-[1.01] transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>Sending Message...</span>
                        </>
                      ) : (
                        <>
                          <span>Submit Inquiry</span>
                          <Send className="size-4" />
                        </>
                      )}
                    </button>
                  </motion.form>
                ) : (
                  <motion.div
                    key="success-state"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="p-8 text-center space-y-6 relative z-10 my-8"
                  >
                    <div className="mx-auto size-16 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                      <CheckCircle2 className="size-8" />
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-2xl font-bold text-white">
                        Thank you, {submittedName}!
                      </h3>
                      <p className="text-slate-400 text-sm max-w-md mx-auto">
                        Your message has been received successfully. One of our restaurant solutions experts will contact you shortly.
                      </p>
                    </div>

                    <button
                      onClick={() => setIsSuccess(false)}
                      className="px-6 py-2.5 rounded-xl border border-white/15 bg-white/[0.05] text-sm font-semibold text-white hover:bg-white/[0.1] transition-all cursor-pointer"
                    >
                      Send Another Message
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
