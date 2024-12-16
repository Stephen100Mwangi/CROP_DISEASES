import React, { FormEvent, useRef, useState } from "react";
import { FaUsers } from "react-icons/fa6";
import { RiLogoutCircleFill } from "react-icons/ri";
import { IoChatbubbleEllipsesSharp } from "react-icons/io5";
import { MdOutlineCompost } from "react-icons/md";
import { MdNotificationsActive } from "react-icons/md";
import emailjs, { EmailJSResponseStatus } from "@emailjs/browser";
import toast, { Toaster } from "react-hot-toast";

interface EmailFormData {
  message_subject: string;
  send_email: string;
  message: string;
}

const Notifications: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState<EmailFormData>({
    message_subject: "",
    send_email: "",
    message: "",
  });
  const form = useRef<HTMLFormElement>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const sendEmail = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Ensure form ref exists
    if (!form.current) {
      toast.error("Form reference is missing");
      return;
    }

    setIsLoading(true);
    const toastId = toast.loading("Sending email...");

    // Type-safe environment variable access
    const serviceId = import.meta.env.VITE_EMAIL_SERVICE_ID;
    const templateId = import.meta.env.VITE_EMAIL_TEMPLATE_ID;
    const publicKey = import.meta.env.VITE_EMAIL_PUBLIC_KEY;

    // Validate environment variables
    if (!serviceId || !templateId || !publicKey) {
      toast.dismiss(toastId);
      toast.error("Email configuration is incomplete");
      setIsLoading(false);
      return;
    }

    emailjs
      .sendForm(serviceId, templateId, form.current, { publicKey })
      .then(
        () => {
          toast.dismiss(toastId);
          toast.success(
            "Email sent successfully! We'll reach out to you soon."
          );

          // Reset form safely
          if (form.current) {
            form.current.reset();
            setFormData({
              message_subject: "",
              send_email: "",
              message: "",
            });
          }
        },
        (error: EmailJSResponseStatus) => {
          toast.dismiss(toastId);
          toast.error("Failed to send email. Please try again.");
          console.error("Email send error:", error);
        }
      )
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <div className="w-full h-screen overflow-clip flex bg-gray max-sm:flex-col max-sm:space-y-0">
      <Toaster position="top-left" />

      <div className="h-screen flex-[1] p-5 flex flex-col space-y-5 border border-r-slate-500 max-sm:w-full max-sm:fit max-sm:pb-0 max-sm:border-none max-sm:bg-crop max-sm:flex-[.5]">
        <div className="logo flex items-center space-x-5 my-5 font-light font-roboto max-sm:my-0">
          <div className="flex bg-gray items-center justify-center size-10 overflow-clip rounded-full">
            <img src="/crop.svg" className="size-12" alt="CropGuard Logo" />
          </div>
          <p className="text-lg">
            Crop<span className="text-gray font-lato font-bold">Guard</span>
          </p>
        </div>

        <div className="bg-slate-500 justify-start flex items-center text-white p-4 px-8 space-x-5 rounded-md w-48 my-5 max-sm:p-3 max-sm:w-32 max-sm:my-0 max-sm:hidden">
          <FaUsers className="text-3xl" />
          <div className="flex flex-col space-y-3 items-center justify-normal">
            <p className="text-xl font-medium">34</p>
            <p className="font-thin">Followers</p>
          </div>
        </div>

        <div className="bg-slate-500 justify-start flex items-center text-white p-4 px-8 space-x-5 rounded-md w-48 my-5 max-sm:p-3 max-sm:w-32 max-sm:my-0 max-sm:hidden">
          <MdOutlineCompost className="text-3xl" />
          <div className="flex flex-col space-y-3 items-center justify-normal">
            <p className="text-xl font-medium">90</p>
            <p className="font-thin">Posts</p>
          </div>
        </div>

        <div className="bg-slate-500 justify-start flex items-center text-white p-4 px-8 space-x-5 rounded-md w-48 my-5 max-sm:p-3 max-sm:w-32 max-sm:my-0 max-sm:hidden">
          <MdNotificationsActive className="text-3xl" />
          <div className="flex flex-col space-y-3 items-center justify-normal">
            <p className="text-xl font-medium">5</p>
            <p className="font-thin">Notifications</p>
          </div>
        </div>

        <div className="bg-slate-500 justify-start flex items-center text-white p-4 px-8 space-x-5 rounded-md w-48 my-5 max-sm:p-3 max-sm:w-32 max-sm:my-0 max-sm:hidden">
          <IoChatbubbleEllipsesSharp className="text-3xl" />
          <div className="flex flex-col space-y-3 items-center justify-normal">
            <p className="text-xl font-medium">12</p>
            <p className="font-thin">Messages</p>
          </div>
        </div>

        <div className="flex absolute bottom-5 space-x-3 hover:text-gray transition-all cursor-pointer p-2 w-56 items-center hover:bg-danger max-sm:hidden">
          <RiLogoutCircleFill className="text-3xl" />
          <p>Logout</p>
        </div>
      </div>

      <div className="relative h-full flex-[5] overflow-scroll overflow-x-hidden grid grid-cols-2 p-5 max-sm:flex items-center justify-center w-full max-sm:grid-cols-1 flex-wrap">
        <form
          ref={form}
          onSubmit={sendEmail}
          className="flex flex-col space-y-8 p-6 shadow-lg justify-center items-center max-sm:w-[90%]"
        >
          <div className="text-orange text-center w-full text-3xl font-bold">
            Contact <span className="text-card">Me</span>
          </div>

          <div className="flex flex-col space-y-2 w-[95%]">
            <label htmlFor="message_subject" className="font-bold text-base">
              Subject
            </label>
            <input
              type="text"
              id="message_subject"
              name="message_subject"
              placeholder="Type your subject here..."
              required
              value={formData.message_subject}
              onChange={handleInputChange}
              className="p-[10px] px-6 outline-none"
            />
          </div>

          <div className="flex flex-col space-y-2 w-[95%]">
            <label htmlFor="send_email" className="font-bold text-base">
              Email
            </label>
            <input
              type="email"
              id="send_email"
              name="send_email"
              placeholder="Type your email here..."
              required
              value={formData.send_email}
              onChange={handleInputChange}
              className="p-[10px] px-6 outline-none w-auto"
            />
          </div>

          <div className="flex flex-col space-y-2 w-[95%]">
            <label htmlFor="message" className="font-bold text-base">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              cols={30}
              rows={5}
              placeholder="Type your message here..."
              required
              value={formData.message}
              onChange={handleInputChange}
              className="p-2 px-6 outline-none"
            />
          </div>

          <div className="w-full flex justify-center items-center">
            <input
              disabled={isLoading}
              type="submit"
              value={isLoading ? "Sending..." : "Send"}
              className="bg-card text-white p-2 px-12 rounded-sm hover:rounded-full"
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default Notifications;
