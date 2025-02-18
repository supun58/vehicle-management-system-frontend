import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ChevronLeft, ChevronRight } from "lucide-react";
import axios from "axios";
import Alert from "../components/Alert";

// Validation patterns
const PATTERNS = {
  email: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
  phone: /^(?:\+94|0)[0-9]{9}$/,
  vehicleNumber: /^[A-Z]{2,3}[-\s]?\d{4}$/i,
};

// Helper function to format date to YYYY-MM-DD
const formatDate = (date) => {
  return date.toISOString().split("T")[0];
};

// Get after tomorrow's date
const aftertomorrow = new Date();
aftertomorrow.setDate(aftertomorrow.getDate() + 2);
aftertomorrow.setHours(0, 0, 0, 0);

// Get tomorrow's date
const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);
tomorrow.setHours(0, 0, 0, 0);

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_FILE_TYPES = ["application/pdf", "image/jpeg", "image/png"];

const visitorSchema = z
  .object({
    visitor_name: z
      .string()
      .min(1, "This field is required")
      .min(2, "Name must be at least 2 characters")
      .regex(/^[a-zA-Z\s]*$/, "Name should only contain letters and spaces"),
    visitor_email: z
      .string()
      .min(1, "Email is required")
      .email("Invalid email"),
    phone: z
      .string()
      .min(1, "Phone number is required")
      .regex(PATTERNS.phone, "Please enter a valid phone number"),
    nic: z
      .string()
      .min(1, "NIC number is required")
      .regex(/^[0-9]{9}[vVxX]$|^[0-9]{12}$/, "Please enter a valid NIC number"),
    supporting_documents: z
      .instanceof(FileList)
      .optional()
      .refine(
        (files) => !files?.length || files?.[0]?.size <= MAX_FILE_SIZE,
        "File size should be less than 5MB"
      )
      .refine(
        (files) =>
          !files?.length || ACCEPTED_FILE_TYPES.includes(files?.[0]?.type),
        "Only .pdf, .jpg, and .png files are accepted"
      ),
    is_regular_comer: z.boolean().default(false),
    purpose: z
      .string()
      .min(1, "Purpose of visit is required")
      .min(10, "Please provide a detailed purpose of visit"),
    meeting_person: z
      .string()
      .min(1, "Person/Department to meet is required")
      .min(3, "Please provide a valid person or department name"),
    visit_date: z
      .string()
      .min(1, "Visit date is required")
      .refine(
        (date) => {
          const selectedDate = new Date(date);
          selectedDate.setHours(0, 0, 0, 0);
          return selectedDate >= tomorrow;
        },
        { message: "Visit date must be from tomorrow onwards" }
      ),
    entry_time: z.string().min(1, "Entry time is required"),
    exit_time: z.string().min(1, "Exit time is required"),
    vehicle_number: z
      .string()
      .regex(
        PATTERNS.vehicleNumber,
        "Invalid vehicle number format (e.g., XX-1234)"
      )
      .optional()
      .or(z.literal("")),
    vehicle_type: z
      .enum(["Car", "Bike", "Van", "Bus"])
      .optional()
      .or(z.literal("")),
    consent: z.boolean(),
  })
  .refine(
    (data) => {
      if (!data.visit_date || !data.entry_time || !data.exit_time) return true;

      const entryDateTime = new Date(`${data.visit_date}T${data.entry_time}`);
      const exitDateTime = new Date(`${data.visit_date}T${data.exit_time}`);

      return exitDateTime > entryDateTime;
    },
    {
      message: "Exit time must be after entry time",
      path: ["exit_time"],
    }
  )
  .refine((data) => data.consent === true, {
    message: "You must agree to the security policies",
    path: ["consent"],
  });

const FormInput = ({
  label,
  error,
  register,
  name,
  type = "text",
  ...props
}) => {
  // Set min date for date inputs
  const getMinDate = () => {
    if (type === "date") {
      return formatDate(aftertomorrow);
    }
    return undefined;
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <input
        type={type}
        {...register(name)}
        {...props}
        min={getMinDate()}
        className={`mt-1 block w-full rounded-md shadow-sm focus:ring focus:ring-opacity-50 ${
          error
            ? "border-red-500 focus:border-red-500 focus:ring-red-200"
            : "border-gray-300 focus:border-[#de9e28] focus:ring-[#de9e28]"
        }`}
      />
      {error && <p className="mt-1 text-sm text-red-600">{error.message}</p>}
    </div>
  );
};

const StepIndicator = ({ currentStep }) => (
  <div className="flex justify-center mt-4">
    <div className="flex items-center">
      {[1, 2].map((num) => (
        <React.Fragment key={num}>
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center ${
              currentStep >= num ? "bg-[#de9e28]" : "bg-gray-300"
            } text-white font-bold`}
          >
            {num}
          </div>
          {num < 2 && (
            <div
              className={`w-12 h-1 ${
                currentStep > num ? "bg-[#de9e28]" : "bg-gray-300"
              }`}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  </div>
);

const VisitorForm = () => {
  // const [alertVisible, setAlertVisible] = useState(false);
  // const [alertTitle, setAlertTitle] = useState('');
  // const [alertMessage, setAlertMessage] = useState('');

  const [, setIsSubmitting] = useState(false);
  const [alert, setAlert] = useState({
    visible: false,
    title: "",
    message: "",
  });

  const [step, setStep] = useState(1);
  const {
    register,
    handleSubmit,
    trigger,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    mode: "onChange",
    resolver: zodResolver(visitorSchema),
    defaultValues: {
      is_regular_comer: false,
      consent: false,
      vehicle_number: "",
      vehicle_type: "",
      visit_date: formatDate(aftertomorrow),
    },
  });
  const selectedFile = watch("supporting_documents");

  // Watch all form fields for validation
  const formValues = watch();

  const getStepFields = (currentStep) => {
    switch (currentStep) {
      case 1:
        return [
          "visitor_name",
          "visitor_email",
          "phone",
          "nic",
          "purpose",
          "supporting_documents",
          "meeting_person",
        ];
      case 2:
        return [
          "visit_date",
          "entry_time",
          "exit_time",
          "vehicle_number",
          "vehicle_type",
          "consent",
        ];
      default:
        return [];
    }
  };

  const isStepValid = () => {
    const fields = getStepFields(step);
    const hasErrors = fields.some((field) => errors[field]);
    const requiredFields = fields.filter(
      (field) =>
        !["vehicle_number", "vehicle_type", "supporting_documents"].includes(
          field
        )
    );

    const allRequiredFieldsFilled = requiredFields.every((field) => {
      const value = formValues[field];
      return value !== undefined && value !== "";
    });

    return !hasErrors && allRequiredFieldsFilled && !isSubmitting;
  };

  const nextStep = async () => {
    const fields = getStepFields(step);
    const isValid = await trigger(fields);
    if (isValid) {
      setStep(step + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const prevStep = () => {
    setStep(step - 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const onSubmit = async (data) => {
    try {
      // Trigger validation
      const isValid = await trigger();
      if (!isValid) {
        console.warn("Form validation failed");
        return;
      }

      setIsSubmitting(true); // Set the submitting state before making the API call

      // Create FormData object for file upload
      const formData = new FormData();

      // Append all text fields to FormData
      Object.keys(data).forEach((key) => {
        if (key !== "supporting_documents") {
          formData.append(key, data[key]);
        }
      });

      // Append file if selected
      if (selectedFile && selectedFile.length > 0) {
        formData.append("supporting_documents", selectedFile[0]);
      }

      // Make the POST request with FormData
      const response = await axios.post(
        "http://localhost:5000/api/auth/visitor",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data", // Important for file uploads
          },
        }
      );

      // Log the response to check what the backend returns
      console.log("Response:", response);

      // Show success alert
      setAlert({
        visible: true,
        title: "Success",
        message: response.data.message || "Form submitted successfully!",
      });

      // Reset form and go back to the first step
      reset({
        is_regular_comer: false,
        consent: false,
        vehicle_number: "",
        vehicle_type: "",
        visit_date: formatDate(aftertomorrow), // Ensure `aftertomorrow` is defined
      });
      setStep(1);
    } catch (error) {
      // Log the entire error object for debugging
      console.error("Error during form submission:", error);

      // Handle error response
      const errorMessage =
        error.response?.data?.error ||
        error.message ||
        "Failed to submit gate pass request. Please try again.";
      setAlert({ visible: true, title: "Error", message: errorMessage });
    } finally {
      setIsSubmitting(false); // Always reset submitting state in finally block
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-4 px-4 sm:px-6 lg:px-8 mt-14">
      {alert.visible && (
        <Alert
          title={alert.title}
          message={alert.message}
          setAlertVisible={(visible) =>
            setAlert((prev) => ({ ...prev, visible }))
          }
        />
      )}
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        <div className="bg-[#800000] p-2">
          <h2 className="text-xl font-bold text-white text-center">
            Visitor Gate Pass Request
          </h2>
          <StepIndicator currentStep={step} />
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-4 space-y-2">
          {step === 1 && (
            <div className="space-y-2">
              <FormInput
                label="Full Name"
                name="visitor_name"
                register={register}
                error={errors.visitor_name}
              />
              <FormInput
                label="Email"
                name="visitor_email"
                type="email"
                register={register}
                error={errors.visitor_email}
              />
              <FormInput
                label="Phone Number"
                name="phone"
                register={register}
                error={errors.phone}
              />
              <FormInput
                label="NIC Number"
                name="nic"
                register={register}
                error={errors.nic}
              />
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Purpose of Visit
                </label>
                <textarea
                  {...register("purpose")}
                  className={`mt-1 block w-full rounded-md shadow-sm focus:ring focus:ring-opacity-50 ${
                    errors.purpose
                      ? "border-red-500 focus:border-red-500 focus:ring-red-200"
                      : "border-gray-300 focus:border-[#de9e28] focus:ring-[#de9e28]"
                  }`}
                  rows={3}
                />
                {errors.purpose && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.purpose.message}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Supporting Document (Optional)
                </label>
                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  {...register("supporting_documents")}
                  className={`mt-1 block w-full text-sm text-gray-500
                    file:mr-4 file:py-1 file:px-3
                    file:rounded-md file:border-0
                    file:text-sm file:font-semibold
                    file:bg-[#800000] file:text-white
                    hover:file:bg-[#600000]
                    ${errors.supporting_documents ? "text-red-500" : ""}`}
                />
                {errors.supporting_documents && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.supporting_documents.message}
                  </p>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  Accepted formats: PDF, JPG, PNG (max 5MB)
                </p>
              </div>
              <FormInput
                label="Person/Department to Meet"
                name="meeting_person"
                register={register}
                error={errors.meeting_person}
              />
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  {...register("is_regular_comer")}
                  className="rounded border-gray-300 text-[#800000] focus:ring-[#800000]"
                />
                <label className="text-sm text-gray-700">
                  I visit regularly
                </label>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-3">
              <FormInput
                label="Visit Date"
                name="visit_date"
                type="date"
                register={register}
                error={errors.visit_date}
              />
              <FormInput
                label="Entry Time"
                name="entry_time"
                type="time"
                register={register}
                error={errors.entry_time}
              />
              <FormInput
                label="Exit Time"
                name="exit_time"
                type="time"
                register={register}
                error={errors.exit_time}
              />
              <FormInput
                label="Vehicle Number (Optional)"
                name="vehicle_number"
                register={register}
                error={errors.vehicle_number}
              />
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Vehicle Type
                </label>
                <select
                  {...register("vehicle_type")}
                  className={`mt-1 block w-full rounded-md shadow-sm focus:ring focus:ring-opacity-50 ${
                    errors.vehicle_type
                      ? "border-red-500 focus:border-red-500 focus:ring-red-200"
                      : "border-gray-300 focus:border-[#de9e28] focus:ring-[#de9e28]"
                  }`}
                >
                  <option value="">Select Vehicle Type</option>
                  {["Car", "Bike", "Van", "Bus"].map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
                {errors.vehicle_type && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.vehicle_type.message}
                  </p>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  {...register("consent")}
                  className="rounded border-gray-300 text-[#800000] focus:ring-[#800000]"
                />
                <label className="text-sm text-gray-700">
                  I agree to the university security policies
                </label>
              </div>
              {errors.consent && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.consent.message}
                </p>
              )}
            </div>
          )}

          <div className="flex justify-between mt-4">
            {step > 1 && (
              <button
                type="button"
                onClick={prevStep}
                disabled={isSubmitting}
                className="flex items-center px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Previous
              </button>
            )}
            {step < 2 ? (
              <button
                type="button"
                onClick={nextStep}
                disabled={!isStepValid()}
                className={`flex items-center px-3 py-1 text-white rounded ml-auto transition-all duration-200 ${
                  isStepValid()
                    ? "bg-[#800000] hover:bg-[#600000]"
                    : "bg-gray-400 cursor-not-allowed"
                }`}
              >
                Next
                <ChevronRight className="w-4 h-4 ml-2" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={!isStepValid()}
                className={`flex items-center px-3 py-1 text-white rounded ml-auto transition-all duration-200 ${
                  isStepValid()
                    ? "bg-[#800000] hover:bg-[#600000]"
                    : "bg-gray-400 cursor-not-allowed"
                }`}
              >
                {isSubmitting ? "Submitting..." : "Submit"}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default VisitorForm;
