
import React, { useState, useEffect } from "react";
import { MdBook, MdPerson, MdNumbers, MdCategory, MdCalendarToday, MdPublic, MdVisibility, MdVisibilityOff } from "react-icons/md";
import type { Book, BookFormData } from "../../types/Book";

interface BookFormProps {
    book?: Book | null;
    onSubmit: (bookData: BookFormData) => void;
}

interface FormErrors {
    title?: string;
    author?: string;
    isbn?: string;
    genre?: string;
    publicationYear?: string;
    publisher?: string;
    totalCopies?: string;
}

const BookForm: React.FC<BookFormProps> = ({ book, onSubmit }) => {
    const [formData, setFormData] = useState<BookFormData>({
        title: "",
        author: "",
        isbn: "",
        genre: "",
        publicationYear: 0,
        publisher: "",
        totalCopies: 0,
    });
    const [errors, setErrors] = useState<FormErrors>({});
    const [showFormPreview, setShowFormPreview] = useState(false);
    const [focusedField, setFocusedField] = useState<string | null>(null);

    useEffect(() => {
        if (book) {
            setFormData({
                title: book.title,
                author: book.author,
                isbn: book.isbn,
                genre: book.genre || "",
                publicationYear: book.publicationYear || 0,
                publisher: book.publisher || "",
                totalCopies: book.totalCopies,
            });
        } else {
            setFormData({
                title: "",
                author: "",
                isbn: "",
                genre: "",
                publicationYear: 0,
                publisher: "",
                totalCopies: 0,
            });
        }
        setErrors({});
    }, [book]);

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};

        if (!formData.title.trim()) {
            newErrors.title = "Book title is required";
        } else if (formData.title.trim().length < 2) {
            newErrors.title = "Book title must be at least 2 characters";
        } else if (formData.title.trim().length > 100) {
            newErrors.title = "Book title must be less than 100 characters";
        }

        if (!formData.author.trim()) {
            newErrors.author = "Author name is required";
        } else if (formData.author.trim().length < 2) {
            newErrors.author = "Author name must be at least 2 characters";
        } else if (formData.author.trim().length > 100) {
            newErrors.author = "Author name must be less than 100 characters";
        }

        if (!formData.isbn.trim()) {
            newErrors.isbn = "ISBN is required";
        } else if (!/^(?=(?:\D*\d){10}(?:(?:\D*\d){3})?$)[\d-]+$/.test(formData.isbn.trim())) {
            newErrors.isbn = "Please enter a valid ISBN (10 or 13 digits)";
        }

        if (!formData.genre.trim()) {
            newErrors.genre = "Genre is required";
        } else if (formData.genre.trim().length > 50) {
            newErrors.genre = "Genre must be less than 50 characters";
        }

        if (formData.publicationYear <= 0 || formData.publicationYear > new Date().getFullYear()) {
            newErrors.publicationYear = "Please enter a valid publication year";
        }

        if (!formData.publisher.trim()) {
            newErrors.publisher = "Publisher is required";
        } else if (formData.publisher.trim().length > 100) {
            newErrors.publisher = "Publisher must be less than 100 characters";
        }

        if (formData.totalCopies <= 0) {
            newErrors.totalCopies = "Total copies must be at least 1";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validateForm()) {
            onSubmit(formData);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === "publicationYear" || name === "totalCopies" ? parseInt(value) || 0 : value,
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
            case 'title': return <MdBook className={iconClass} />;
            case 'author': return <MdPerson className={iconClass} />;
            case 'isbn': return <MdNumbers className={iconClass} />;
            case 'genre': return <MdCategory className={iconClass} />;
            case 'publicationYear': return <MdCalendarToday className={iconClass} />;
            case 'publisher': return <MdPublic className={iconClass} />;
            case 'totalCopies': return <span className={iconClass}>📖</span>;
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
                    <MdBook className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {book ? 'Update Book Information' : 'Add New Book'}
                </h2>
                <p className="text-gray-600">
                    {book ? 'Modify the book details below' : 'Fill in the information to add a new book to the library'}
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
                            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-semibold">
                                {formData.title.charAt(0).toUpperCase() || '?'}
                            </div>
                            <div>
                                <p className="font-medium text-gray-900">{formData.title || 'No title provided'}</p>
                                <p className="text-sm text-gray-500">Book Title</p>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <p className="text-sm text-gray-600">✍️ {formData.author || 'No author provided'}</p>
                            <p className="text-sm text-gray-600">ISBN: {formData.isbn || 'N/A'}</p>
                            <p className="text-sm text-gray-600">📚 {formData.genre || 'N/A'}</p>
                            <p className="text-sm text-gray-600">🗓️ {formData.publicationYear || 'N/A'}</p>
                            <p className="text-sm text-gray-600">🏢 {formData.publisher || 'N/A'}</p>
                            <p className="text-sm text-gray-600">Available: {formData.totalCopies !== undefined ? formData.totalCopies : 'N/A'} / Total: {formData.totalCopies || 'N/A'}</p>
                        </div>
                    </div>
                </div>
            )}

            <form onSubmit={handleSubmit} className='space-y-6'>
                {/* Title Field */}
                <div className="space-y-2">
                    <label htmlFor='title' className='block text-sm font-semibold text-gray-700'>
                        Book Title <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            {getFieldIcon('title')}
                        </div>
                        <input
                            type='text'
                            id='title'
                            name='title'
                            value={formData.title}
                            onChange={handleChange}
                            onFocus={() => handleFocus('title')}
                            onBlur={handleBlur}
                            className={getInputClasses('title')}
                            placeholder='Enter book title'
                            maxLength={100}
                        />
                        <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                            <span className="text-xs text-gray-400">{formData.title.length}/100</span>
                        </div>
                    </div>
                    {errors.title && (
                        <div className="flex items-center space-x-2 text-red-600 text-sm">
                            <span>⚠</span>
                            <span>{errors.title}</span>
                        </div>
                    )}
                </div>

                {/* Author Field */}
                <div className="space-y-2">
                    <label htmlFor='author' className='block text-sm font-semibold text-gray-700'>
                        Author <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            {getFieldIcon('author')}
                        </div>
                        <input
                            type='text'
                            id='author'
                            name='author'
                            value={formData.author}
                            onChange={handleChange}
                            onFocus={() => handleFocus('author')}
                            onBlur={handleBlur}
                            className={getInputClasses('author')}
                            placeholder='Enter author name'
                            maxLength={100}
                        />
                        <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                            <span className="text-xs text-gray-400">{formData.author.length}/100</span>
                        </div>
                    </div>
                    {errors.author && (
                        <div className="flex items-center space-x-2 text-red-600 text-sm">
                            <span>⚠</span>
                            <span>{errors.author}</span>
                        </div>
                    )}
                </div>

                {/* ISBN Field */}
                <div className="space-y-2">
                    <label htmlFor='isbn' className='block text-sm font-semibold text-gray-700'>
                        ISBN <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            {getFieldIcon('isbn')}
                        </div>
                        <input
                            type='text'
                            id='isbn'
                            name='isbn'
                            value={formData.isbn}
                            onChange={handleChange}
                            onFocus={() => handleFocus('isbn')}
                            onBlur={handleBlur}
                            className={getInputClasses('isbn')}
                            placeholder='e.g., 978-0321765723'
                        />
                    </div>
                    {errors.isbn && (
                        <div className="flex items-center space-x-2 text-red-600 text-sm">
                            <span>⚠</span>
                            <span>{errors.isbn}</span>
                        </div>
                    )}
                </div>

                {/* Genre Field */}
                <div className="space-y-2">
                    <label htmlFor='genre' className='block text-sm font-semibold text-gray-700'>
                        Genre <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            {getFieldIcon('genre')}
                        </div>
                        <input
                            type='text'
                            id='genre'
                            name='genre'
                            value={formData.genre}
                            onChange={handleChange}
                            onFocus={() => handleFocus('genre')}
                            onBlur={handleBlur}
                            className={getInputClasses('genre')}
                            placeholder='e.g., Fiction, Science, History'
                            maxLength={50}
                        />
                        <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                            <span className="text-xs text-gray-400">{formData.genre.length}/50</span>
                        </div>
                    </div>
                    {errors.genre && (
                        <div className="flex items-center space-x-2 text-red-600 text-sm">
                            <span>⚠</span>
                            <span>{errors.genre}</span>
                        </div>
                    )}
                </div>

                {/* Publication Year Field */}
                <div className="space-y-2">
                    <label htmlFor='publicationYear' className='block text-sm font-semibold text-gray-700'>
                        Publication Year <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            {getFieldIcon('publicationYear')}
                        </div>
                        <input
                            type='number'
                            id='publicationYear'
                            name='publicationYear'
                            value={formData.publicationYear === 0 ? "" : formData.publicationYear}
                            onChange={handleChange}
                            onFocus={() => handleFocus('publicationYear')}
                            onBlur={handleBlur}
                            className={getInputClasses('publicationYear')}
                            placeholder='e.g., 2023'
                            min="1000" // Set a reasonable minimum year
                            max={new Date().getFullYear().toString()} // Max current year
                        />
                    </div>
                    {errors.publicationYear && (
                        <div className="flex items-center space-x-2 text-red-600 text-sm">
                            <span>⚠</span>
                            <span>{errors.publicationYear}</span>
                        </div>
                    )}
                </div>

                {/* Publisher Field */}
                <div className="space-y-2">
                    <label htmlFor='publisher' className='block text-sm font-semibold text-gray-700'>
                        Publisher <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            {getFieldIcon('publisher')}
                        </div>
                        <input
                            type='text'
                            id='publisher'
                            name='publisher'
                            value={formData.publisher}
                            onChange={handleChange}
                            onFocus={() => handleFocus('publisher')}
                            onBlur={handleBlur}
                            className={getInputClasses('publisher')}
                            placeholder='Enter publisher name'
                            maxLength={100}
                        />
                        <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                            <span className="text-xs text-gray-400">{formData.publisher.length}/100</span>
                        </div>
                    </div>
                    {errors.publisher && (
                        <div className="flex items-center space-x-2 text-red-600 text-sm">
                            <span>⚠</span>
                            <span>{errors.publisher}</span>
                        </div>
                    )}
                </div>

                {/* Total Copies Field */}
                <div className="space-y-2">
                    <label htmlFor='totalCopies' className='block text-sm font-semibold text-gray-700'>
                        Total Copies <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            {getFieldIcon('totalCopies')}
                        </div>
                        <input
                            type='number'
                            id='totalCopies'
                            name='totalCopies'
                            value={formData.totalCopies === 0 ? "" : formData.totalCopies}
                            onChange={handleChange}
                            onFocus={() => handleFocus('totalCopies')}
                            onBlur={handleBlur}
                            className={getInputClasses('totalCopies')}
                            placeholder='e.g., 5'
                            min="1" // Minimum 1 copy
                        />
                    </div>
                    {errors.totalCopies && (
                        <div className="flex items-center space-x-2 text-red-600 text-sm">
                            <span>⚠</span>
                            <span>{errors.totalCopies}</span>
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
                                    setFormData({
                                        title: "",
                                        author: "",
                                        isbn: "",
                                        genre: "",
                                        publicationYear: 0,
                                        publisher: "",
                                        totalCopies: 0,
                                    });
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
                                {book ? 'Update Book' : 'Create Book'}
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default BookForm;
