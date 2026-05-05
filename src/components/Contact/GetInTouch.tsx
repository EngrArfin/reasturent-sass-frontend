"use client";

import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import CommonWrapper from "@/common/CommonWrapper";
import { toast } from "sonner";
import { TContactFormData } from "@/redux/types/contact";
import { useCreateContactMutation } from "@/redux/features/auth/contactApi";

export default function GetInTouch() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TContactFormData>();

  const [createContact, { isLoading }] = useCreateContactMutation();

  const onSubmit = async (data: TContactFormData) => {
    try {
      const res = await createContact(data).unwrap();
      if (res.success) {
        toast.success("Message sent successfully");
        reset();
      }
    } catch (error) {
      toast.error("Failed to send message");
    }
  };

  return (
    <section className="bg-[#FAFAFA]">
      <CommonWrapper className="rounded-[12px]">
        <div className="text-center md:px-24 pt-8">
          <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-6">
            Get in Touch
          </h2>
          <p className="text-[#85888E] text-lg font-normal mt-6">
            We'd love to hear from you! Whether you have questions, need a
            quote, or want to book a delivery, we're here to help. Get in touch
            with us today!
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="p-6 space-y-4 bg-white mt-10 rounded-[12px]"
        >
          {/* Name */}
          <div className="grid gap-1 space-y-2">
            <Label htmlFor="name">
              Your Name <span className="text-red-500">*</span>
            </Label>
            <Input
              placeholder="Your Name"
              {...register("name", { required: true })}
              className="border-blue-100"
            />
            {errors.name && (
              <p className="text-sm text-red-500">Name is required</p>
            )}
          </div>

          {/* Email */}
          <div className="grid gap-1 space-y-2">
            <Label htmlFor="email">
              Your Email <span className="text-red-500">*</span>
            </Label>
            <Input
              placeholder="Your Email"
              type="email"
              {...register("email", { required: true })}
              className="border-blue-100"
            />
            {errors.email && (
              <p className="text-sm text-red-500">Email is required</p>
            )}
          </div>

          {/* Contact */}
          <div className="grid gap-1 space-y-2">
            <Label htmlFor="number">
              Contact number <span className="text-red-500">*</span>
            </Label>
            <Input
              placeholder="Input Number"
              {...register("number", { required: true })}
              className="border-blue-100"
            />
            {errors.number && (
              <p className="text-sm text-red-500">Contact number is required</p>
            )}
          </div>

          {/* Message */}
          <div className="grid gap-1 space-y-2">
            <Label htmlFor="message">
              Message <span className="text-red-500">*</span>
            </Label>
            <Textarea
              placeholder="Tell us your problem"
              rows={5}
              cols={20}
              {...register("message", { required: true })}
              className="border-blue-100"
            />
            {errors.message && (
              <p className="text-sm text-red-500">Message is required</p>
            )}
          </div>

          {/* Submit */}
          <div className="text-center pt-2 space-y-2">
            <Button
              type="submit"
              className="bg-orange-500 hover:bg-orange-600 text-white"
              disabled={isLoading}
            >
              {isLoading ? "Sending..." : "Send message"}
            </Button>
          </div>
        </form>
      </CommonWrapper>
    </section>
  );
}

// "use client";

// import { useForm } from "react-hook-form";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Textarea } from "@/components/ui/textarea";
// import { Button } from "@/components/ui/button";
// import CommonWrapper from "@/common/CommonWrapper";

// type FormData = {
//   name: string;
//   subject: string;
//   contact: string;
//   message: string;
// };

// export default function GetInTouch() {
//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//   } = useForm<FormData>();

//   const onSubmit = (data: FormData) => {
//     console.log("Submitted data:", data);
//     // You can send to an API here
//   };

//   return (
//     <section className="bg-[#FAFAFA]">
//       <CommonWrapper className="rounded-[12px]">
//         <div className="text-center md:px-24 pt-8">
//           <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-6">
//             Get in Touch
//           </h2>
//           <p className="text-[#85888E] text-lg font-normal mt-6">
//             We'd love to hear from you! Whether you have questions, need a
//             quote, or want to book a delivery, we're here to help. Get in touch
//             with us today!
//           </p>
//         </div>

//         <form
//           onSubmit={handleSubmit(onSubmit)}
//           className="p-6 space-y-4 bg-white mt-10 rounded-[12px]"
//         >
//           {/* Name */}
//           <div className="grid gap-1 space-y-2">
//             <Label htmlFor="name">
//               Your Name <span className="text-red-500">*</span>
//             </Label>
//             <Input
//               placeholder="Your Name"
//               {...register("name", { required: true })}
//               className="border-blue-100"
//             />
//             {errors.name && (
//               <p className="text-sm text-red-500">Name is required</p>
//             )}
//           </div>

//           {/* Subject */}
//           <div className="grid gap-1 space-y-2">
//             <Label htmlFor="subject">
//               Your Subject <span className="text-red-500">*</span>
//             </Label>
//             <Input
//               placeholder="Subject here"
//               {...register("subject", { required: true })}
//               className="border-blue-100"
//             />
//             {errors.subject && (
//               <p className="text-sm text-red-500">Subject is required</p>
//             )}
//           </div>

//           {/* Contact */}
//           <div className="grid gap-1 space-y-2">
//             <Label htmlFor="contact">
//               Contact number <span className="text-red-500">*</span>
//             </Label>
//             <Input
//               placeholder="Input Number"
//               {...register("contact", { required: true })}
//               className="border-blue-100"
//             />
//             {errors.contact && (
//               <p className="text-sm text-red-500">Contact number is required</p>
//             )}
//           </div>

//           {/* Message */}
//           <div className="grid gap-1 space-y-2">
//             <Label htmlFor="message">
//               Message <span className="text-red-500">*</span>
//             </Label>
//             <Textarea
//               placeholder="Tell us your problem"
//               rows={5}
//               cols={20}
//               {...register("message", { required: true })}
//               className="border-blue-100"
//             />
//             {errors.message && (
//               <p className="text-sm text-red-500">Message is required</p>
//             )}
//           </div>

//           {/* Submit */}
//           <div className="text-center pt-2 space-y-2">
//             <Button
//               type="submit"
//               className="bg-orange-500 hover:bg-orange-600 text-white"
//             >
//               Send message
//             </Button>
//           </div>
//         </form>
//       </CommonWrapper>
//     </section>
//   );
// }
