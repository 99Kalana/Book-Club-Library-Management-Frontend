
import React, { useState, useEffect } from "react";
import { MdPerson, MdEmail, MdPhone, MdLocationOn, MdVisibility, MdVisibilityOff } from "react-icons/md";
import type { Reader, ReaderFormData } from "../../types/Reader";

interface ReaderFormProps {
    reader?: Reader | null;
    onSubmit: (readerData: ReaderFormData) => void;
}

interface FormErrors {
    name?: string;
    email?: string;
    phone?: string;
    address?: string;
}

const ReaderForm: React.FC<ReaderFormProps> = ({ reader, onSubmit }) => {
    const [formData, setFormData] = useState<ReaderFormData>({
        name: "",
        email: "",
        phone: "",
        address: "",
    });
    const [errors, setErrors] = useState<FormErrors>({});
    const [showFormPreview, setShowFormPreview] = useState(false);
    const [focusedField, setFocusedField] = useState<string | null>(null);

    // Populate form data when a reader object is provided (for editing)
    useEffect(() => {
        if (reader) {
            setFormData({
                name: reader.name,
                email: reader.email,
                phone: reader.phone || "",
                address: reader.address || "",
            });
        } else {
            setFormData({
                name: "",
                email: "",
                phone: "",
                address: "",
            });
        }
        setErrors({});
    }, [reader]);

    // Client-side form validation
    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = "Reader name is required";
        } else if (formData.name.trim().length < 2) {
            newErrors.name = "Reader name must be at least 2 characters";
        } else if (formData.name.trim().length > 50) {
            newErrors.name = "Reader name must be less than 50 characters";
        }

        if (!formData.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
            newErrors.email = "Please enter a valid email address";
        }

        if (formData.phone && formData.phone.trim()) {
            if (!/^\+?\d{10,15}$/.test(formData.phone.trim().replace(/[\s\-\(\)]/g, ''))) {
                newErrors.phone = "Please enter a valid phone number (10-15 digits)";
            }
        }

        if (formData.address && formData.address.trim().length > 200) {
            newErrors.address = "Address must be less than 200 characters";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle form submission
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validateForm()) {
            onSubmit(formData);
        }
    };

    // Handle input changes and clear errors
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        if (errors[name as keyof FormErrors]) {
            setErrors((prev) => ({
                ...prev,
                [name]: undefined,
            }));
        }
    };

    const handleFocus = (fieldName: string) => {
        setFocusedField(fieldName);
    };

    const handleBlur = () => {
        setFocusedField(null);
    };

    const getFieldIcon = (fieldName: string) => {
        const iconClass = `w-5 h-5 transition-colors duration-200 ${
            focusedField === fieldName
                ? 'text-indigo-500'
                : errors[fieldName as keyof FormErrors]
                    ? 'text-red-500'
                    : 'text-gray-400'
        }`;

        switch (fieldName) {
            case 'name': return <MdPerson className={iconClass} />;
            case 'email': return <MdEmail className={iconClass} />;
            case 'phone': return <MdPhone className={iconClass} />;
            case 'address': return <MdLocationOn className={iconClass} />;
            default: return null;
        }
    };

    const getInputClasses = (fieldName: string) => {
        const baseClasses = "w-full pl-12 pr-4 py-3 border-0 rounded-xl focus:outline-none focus:ring-2 transition-all duration-200 placeholder-gray-500 text-gray-900 font-medium backdrop-blur-sm";

        if (errors[fieldName as keyof FormErrors]) {
            return `${baseClasses} bg-red-50/50 focus:ring-red-500/50 shadow-inner`;
        }

        if (focusedField === fieldName) {
            return `${baseClasses} bg-indigo-50/50 focus:ring-indigo-500/50 shadow-inner`;
        }

        return `${baseClasses} bg-white/50 focus:ring-indigo-500/50 shadow-inner hover:bg-white/70`;
    };

    return (
        <div className="max-w-2xl mx-auto">
            {/* Form Header */}
            <div className="mb-8 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <MdPerson className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {reader ? 'Update Reader Information' : 'Add New Reader'}
                </h2>
                <p className="text-gray-600">
                    {reader ? 'Modify the reader details below' : 'Fill in the information to create a new reader account'}
                </p>
            </div>

            {/* Form Preview Toggle */}
            <div className="mb-6 flex justify-center">
                <button
                    type="button"
                    onClick={() => setShowFormPreview(!showFormPreview)}
                    className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors duration-200"
                >
                    {showFormPreview ? <MdVisibilityOff className="w-4 h-4" /> : <MdVisibility className="w-4 h-4" />}
                    <span>{showFormPreview ? 'Hide Preview' : 'Show Preview'}</span>
                </button>
            </div>

            {/* Form Preview Card */}
            {showFormPreview && (
                <div className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-indigo-200 shadow-inner">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <MdVisibility className="w-5 h-5 mr-2 text-indigo-500" />
                        Preview
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                                {formData.name.charAt(0).toUpperCase() || '?'}
                            </div>
                            <div>
                                <p className="font-medium text-gray-900">{formData.name || 'No name provided'}</p>
                                <p className="text-sm text-gray-500">Reader Name</p>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <p className="text-sm text-gray-600">📧 {formData.email || 'No email provided'}</p>
                            <p className="text-sm text-gray-600">📞 {formData.phone || 'No phone provided'}</p>
                            <p className="text-sm text-gray-600">📍 {formData.address || 'No address provided'}</p>
                        </div>
                    </div>
                </div>
            )}

            <form onSubmit={handleSubmit} className='space-y-6'>
                {/* Name Field */}
                <div className="space-y-2">
                    <label htmlFor='name' className='block text-sm font-semibold text-gray-700'>
                        Reader Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            {getFieldIcon('name')}
                        </div>
                        <input
                            type='text'
                            id='name'
                            name='name'
                            value={formData.name}
                            onChange={handleChange}
                            onFocus={() => handleFocus('name')}
                            onBlur={handleBlur}
                            className={getInputClasses('name')}
                            placeholder='Enter full name'
                            maxLength={50}
                        />
                        <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                            <span className="text-xs text-gray-400">{formData.name.length}/50</span>
                        </div>
                    </div>
                    {errors.name && (
                        <div className="flex items-center space-x-2 text-red-600 text-sm">
                            <span>⚠</span>
                            <span>{errors.name}</span>
                        </div>
                    )}
                </div>

                {/* Email Field */}
                <div className="space-y-2">
                    <label htmlFor='email' className='block text-sm font-semibold text-gray-700'>
                        Email Address <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            {getFieldIcon('email')}
                        </div>
                        <input
                            type='email'
                            id='email'
                            name='email'
                            value={formData.email}
                            onChange={handleChange}
                            onFocus={() => handleFocus('email')}
                            onBlur={handleBlur}
                            className={getInputClasses('email')}
                            placeholder='Enter email address'
                        />
                    </div>
                    {errors.email && (
                        <div className="flex items-center space-x-2 text-red-600 text-sm">
                            <span>⚠</span>
                            <span>{errors.email}</span>
                        </div>
                    )}
                </div>

                {/* Phone Field */}
                <div className="space-y-2">
                    <label htmlFor='phone' className='block text-sm font-semibold text-gray-700'>
                        Phone Number <span className="text-gray-400 text-xs">(Optional)</span>
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            {getFieldIcon('phone')}
                        </div>
                        <input
                            type='tel'
                            id='phone'
                            name='phone'
                            value={formData.phone}
                            onChange={handleChange}
                            onFocus={() => handleFocus('phone')}
                            onBlur={handleBlur}
                            className={getInputClasses('phone')}
                            placeholder='+1 (555) 123-4567'
                        />
                    </div>
                    {errors.phone && (
                        <div className="flex items-center space-x-2 text-red-600 text-sm">
                            <span>⚠</span>
                            <span>{errors.phone}</span>
                        </div>
                    )}
                    <p className="text-xs text-gray-500">Include country code for international numbers</p>
                </div>

                {/* Address Field */}
                <div className="space-y-2">
                    <label htmlFor='address' className='block text-sm font-semibold text-gray-700'>
                        Address <span className="text-gray-400 text-xs">(Optional)</span>
                    </label>
                    <div className="relative">
                        <div className="absolute top-3 left-0 pl-4 flex items-start pointer-events-none">
                            {getFieldIcon('address')}
                        </div>
                        <textarea
                            id='address'
                            name='address'
                            value={formData.address}
                            onChange={handleChange}
                            onFocus={() => handleFocus('address')}
                            onBlur={handleBlur}
                            rows={3}
                            maxLength={200}
                            className={`w-full pl-12 pr-4 py-3 border-0 rounded-xl focus:outline-none focus:ring-2 transition-all duration-200 placeholder-gray-500 text-gray-900 font-medium backdrop-blur-sm resize-none ${
                                errors.address
                                    ? 'bg-red-50/50 focus:ring-red-500/50 shadow-inner'
                                    : focusedField === 'address'
                                        ? 'bg-indigo-50/50 focus:ring-indigo-500/50 shadow-inner'
                                        : 'bg-white/50 focus:ring-indigo-500/50 shadow-inner hover:bg-white/70'
                            }`}
                            placeholder='Enter full address...'
                        />
                        <div className="absolute bottom-2 right-2">
                            <span className="text-xs text-gray-400">{formData.address.length}/200</span>
                        </div>
                    </div>
                    {errors.address && (
                        <div className="flex items-center space-x-2 text-red-600 text-sm">
                            <span>⚠</span>
                            <span>{errors.address}</span>
                        </div>
                    )}
                </div>

                {/* Form Actions */}
                <div className="pt-6 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-600">
                            <span className="text-red-500">*</span> Required fields
                        </div>
                        <div className="flex space-x-3">
                            <button
                                type="button"
                                onClick={() => {
                                    setFormData({ name: "", email: "", phone: "", address: "" });
                                    setErrors({});
                                }}
                                className="px-6 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                            >
                                Reset
                            </button>
                            <button
                                type='submit'
                                className='px-6 py-2 text-sm font-medium text-white bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg hover:from-indigo-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
                            >
                                {reader ? 'Update Reader' : 'Create Reader'}
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default ReaderForm;